import json
import os
import stripe
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = request.data or {}
            items = data.get("items", [])

            line_items = []
            for item in items:
                line_items.append({
                    "price_data": {
                        "currency": "cop",
                        "product_data": {"name": item.get("name") or item.get("title") or "Producto"},
                        "unit_amount": int(item.get("unit_amount") or int(float(item.get("unit_price", 0)) * 100)),
                    },
                    "quantity": int(item.get("quantity", 1)),
                })

            # Log temporal de totales recibidos
            try:
                total_cents = sum(li["price_data"]["unit_amount"] * li["quantity"] for li in line_items)
                print(f"[Stripe] Items recibidos: {items}")
                print(f"[Stripe] Total en centavos: {total_cents}")
            except Exception as _:
                pass

            if not line_items:
                # Item de prueba si no llegaron items
                line_items = [{
                    "price_data": {
                        "currency": "cop",
                        "product_data": {"name": "Producto de prueba"},
                        "unit_amount": 1000,  # $10.00 COP (centavos)
                    },
                    "quantity": 1,
                }]

            metadata = {}
            combo_id = data.get('combo_personalizado_id')
            combo_obj = None
            if combo_id:
                # Validar que el combo pertenezca al usuario y actualizar stripe_session_id posteriormente
                from products.models import ComboPersonalizado
                try:
                    combo_obj = ComboPersonalizado.objects.get(id=combo_id, usuario=request.user)
                    metadata['combo_personalizado_id'] = str(combo_obj.id)
                except ComboPersonalizado.DoesNotExist:
                    return Response({"error": "combo_personalizado_id inválido"}, status=400)

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=line_items,
                mode="payment",
                success_url=f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/failure",
                metadata=metadata or None,
            )

            if combo_obj is not None:
                # Guardar stripe_session_id en el combo (pendiente de pago)
                combo_obj.stripe_session_id = checkout_session.id
                combo_obj.save(update_fields=["stripe_session_id"])

            return Response({"id": checkout_session.id, "url": checkout_session.url})
        except Exception as e:
            return Response({"error": str(e)}, status=400)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    event = None
    try:
        if endpoint_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        else:
            event = json.loads(payload)
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event.get("type") == "checkout.session.completed":
        session = event["data"]["object"]
        print("Pago completado para session:", session.get("id"))
        combo_id = session.get("metadata", {}).get("combo_personalizado_id")
        if combo_id:
            from products.models import ComboPersonalizado
            from django.utils import timezone
            try:
                combo_obj = ComboPersonalizado.objects.get(id=combo_id)
                if not combo_obj.is_paid:
                    combo_obj.is_paid = True
                    combo_obj.paid_at = timezone.now()
                    # Aumentar contador propio (veces_comprado se usa para compras de otros; aquí sólo confirmamos creación pagada)
                    combo_obj.save(update_fields=["is_paid", "paid_at"])
                    print(f"ComboPersonalizado {combo_id} marcado como pagado.")
            except ComboPersonalizado.DoesNotExist:
                print(f"ComboPersonalizado {combo_id} no encontrado para marcar pago.")

    return HttpResponse(status=200)


def retrieve_session(request):
    session_id = request.GET.get("session_id")
    if not session_id:
        return JsonResponse({"error": "session_id requerido"}, status=400)
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return JsonResponse(session)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


class ConfirmSessionView(APIView):
    """Confirma el estado de una sesión de Stripe y marca el combo como pagado si aplica.

    Seguridad:
    - Requiere autenticación JWT.
    - Verifica que el combo de metadata pertenezca al usuario autenticado.
    - Verifica que el combo tenga el mismo stripe_session_id que la sesión consultada.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")
        if not session_id:
            return Response({"error": "session_id requerido"}, status=400)

        try:
            session = stripe.checkout.Session.retrieve(session_id)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        # Intentar marcar combo como pagado si la sesión está pagada y hay metadata
        payment_status = session.get("payment_status") or session.get("status")
        metadata = session.get("metadata") or {}
        combo_id = metadata.get("combo_personalizado_id")

        if payment_status in ("paid", "complete") and combo_id:
            try:
                from products.models import ComboPersonalizado
                from django.utils import timezone
                combo = ComboPersonalizado.objects.get(id=combo_id, usuario=request.user)
                # Validar que corresponda a la misma sesión
                if combo.stripe_session_id == session.get("id") and not combo.is_paid:
                    combo.is_paid = True
                    combo.paid_at = timezone.now()
                    combo.save(update_fields=["is_paid", "paid_at"])
            except ComboPersonalizado.DoesNotExist:
                # No romper; sólo retornar la sesión
                pass

        return Response(session)
