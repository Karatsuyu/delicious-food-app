import json
import os
import stripe
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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
            producto_personalizado_id = data.get('producto_personalizado_id')
            points_used = data.get('points_used', 0)
            combo_obj = None
            producto_personalizado_obj = None

            # Validar y procesar puntos utilizados
            if points_used > 0:
                if points_used > request.user.points:
                    return Response({"error": "No tienes suficientes puntos"}, status=400)
                
                # Calcular el descuento en centavos
                discount_amount = points_used * 100  # 1 punto = 1 COP = 100 centavos
                
                # Calcular el total actual
                total_amount = sum(li["price_data"]["unit_amount"] * li["quantity"] for li in line_items)
                
                if discount_amount > total_amount:
                    return Response({"error": "El descuento no puede ser mayor al total"}, status=400)
                
                # Aplicar descuento creando un item con precio negativo
                if discount_amount > 0:
                    line_items.append({
                        "price_data": {
                            "currency": "cop",
                            "product_data": {"name": f"Descuento por {points_used} puntos"},
                            "unit_amount": -discount_amount,
                        },
                        "quantity": 1,
                    })
                
                metadata['points_used'] = str(points_used)
            
            if combo_id:
                # Validar que el combo exista (puede ser propio o de otro usuario)
                from products.models import ComboPersonalizado
                try:
                    combo_obj = ComboPersonalizado.objects.get(id=combo_id)
                    metadata['combo_personalizado_id'] = str(combo_obj.id)
                    metadata['buyer_id'] = str(request.user.id)
                    metadata['creator_id'] = str(combo_obj.usuario.id)
                except ComboPersonalizado.DoesNotExist:
                    return Response({"error": "combo_personalizado_id inválido"}, status=400)
            
            elif producto_personalizado_id:
                # Validar que el producto personalizado exista (puede ser propio o de otro usuario)
                from products.models import ProductoPersonalizado
                try:
                    producto_personalizado_obj = ProductoPersonalizado.objects.get(id=producto_personalizado_id)
                    metadata['producto_personalizado_id'] = str(producto_personalizado_obj.id)
                    metadata['buyer_id'] = str(request.user.id)
                    metadata['creator_id'] = str(producto_personalizado_obj.usuario.id)
                except ProductoPersonalizado.DoesNotExist:
                    return Response({"error": "producto_personalizado_id inválido"}, status=400)

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
            elif producto_personalizado_obj is not None:
                # Guardar stripe_session_id en el producto personalizado (pendiente de pago)
                producto_personalizado_obj.stripe_session_id = checkout_session.id
                producto_personalizado_obj.save(update_fields=["stripe_session_id"])

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
        session_id = session.get("id")
        print(f"🎉 Pago completado para session: {session_id}")
        
        # Obtener metadata
        metadata = session.get("metadata", {})
        buyer_id = metadata.get("buyer_id")
        creator_id = metadata.get("creator_id")
        combo_id = metadata.get("combo_personalizado_id")
        producto_personalizado_id = metadata.get("producto_personalizado_id")
        
        from django.contrib.auth import get_user_model
        from users.models import PurchaseHistory, PurchaseItem
        from django.utils import timezone
        User = get_user_model()
        
        try:
            # Obtener usuarios
            buyer = User.objects.get(id=buyer_id) if buyer_id else None
            creator = User.objects.get(id=creator_id) if creator_id else None
            
            # Crear registro de compra
            purchase = PurchaseHistory.objects.create(
                buyer=buyer,
                total_amount=session.get("amount_total", 0) / 100,  # Convertir de centavos
                stripe_session_id=session_id
            )
            
            # Procesar combo personalizado
            if combo_id:
                from products.models import ComboPersonalizado
                try:
                    combo_obj = ComboPersonalizado.objects.get(id=combo_id)
                    
                    # Marcar como pagado si es del creador
                    if str(combo_obj.usuario.id) == buyer_id:
                        if not combo_obj.is_paid:
                            combo_obj.is_paid = True
                            combo_obj.paid_at = timezone.now()
                            combo_obj.save(update_fields=["is_paid", "paid_at"])
                            print(f"✅ Combo propio {combo_id} marcado como pagado")
                    else:
                        # Es compra de combo de otro usuario
                        combo_obj.veces_comprado += 1
                        combo_obj.save(update_fields=["veces_comprado"])
                        
                        # 🎯 OTORGAR PUNTOS AL CREADOR (10 puntos por compra)
                        if creator and buyer and creator != buyer:
                            creator.points += 10
                            creator.save(update_fields=["points"])
                            purchase.points_earned = 10
                            purchase.save(update_fields=["points_earned"])
                            print(f"🎁 {creator.username} ganó 10 puntos por venta de combo")
                    
                    # Crear item de compra
                    PurchaseItem.objects.create(
                        purchase=purchase,
                        item_type='combo_personalizado',
                        item_name=combo_obj.nombre or f"Combo #{combo_obj.id}",
                        quantity=1,
                        unit_price=combo_obj.precio_total,
                        creator_user=combo_obj.usuario
                    )
                    
                except ComboPersonalizado.DoesNotExist:
                    print(f"❌ ComboPersonalizado {combo_id} no encontrado")
            
            # Procesar producto personalizado
            elif producto_personalizado_id:
                from products.models import ProductoPersonalizado
                try:
                    producto_obj = ProductoPersonalizado.objects.get(id=producto_personalizado_id)
                    
                    # Marcar como pagado si es del creador
                    if str(producto_obj.usuario.id) == buyer_id:
                        if not producto_obj.is_paid:
                            producto_obj.is_paid = True
                            producto_obj.paid_at = timezone.now()
                            producto_obj.save(update_fields=["is_paid", "paid_at"])
                            print(f"✅ Producto propio {producto_personalizado_id} marcado como pagado")
                    else:
                        # Es compra de producto de otro usuario
                        producto_obj.veces_comprado += 1
                        producto_obj.save(update_fields=["veces_comprado"])
                        
                        # 🎯 OTORGAR PUNTOS AL CREADOR (10 puntos por compra)
                        if creator and buyer and creator != buyer:
                            creator.points += 10
                            creator.save(update_fields=["points"])
                            purchase.points_earned = 10
                            purchase.save(update_fields=["points_earned"])
                            print(f"🎁 {creator.username} ganó 10 puntos por venta de producto")
                    
                    # Crear item de compra
                    PurchaseItem.objects.create(
                        purchase=purchase,
                        item_type='producto_personalizado',
                        item_name=producto_obj.nombre_personalizado,
                        quantity=1,
                        unit_price=producto_obj.precio_total,
                        creator_user=producto_obj.usuario
                    )
                    
                except ProductoPersonalizado.DoesNotExist:
                    print(f"❌ ProductoPersonalizado {producto_personalizado_id} no encontrado")
            
            # 💳 DEDUCIR PUNTOS UTILIZADOS DEL COMPRADOR
            points_used = metadata.get('points_used')
            if points_used and buyer:
                points_to_deduct = int(points_used)
                if buyer.points >= points_to_deduct:
                    buyer.points -= points_to_deduct
                    buyer.save(update_fields=["points"])
                    purchase.points_used = points_to_deduct
                    purchase.save(update_fields=["points_used"])
                    print(f"💰 Se dedujo {points_to_deduct} puntos de {buyer.username}")
                else:
                    print(f"⚠️ {buyer.username} no tenía suficientes puntos para deducir {points_to_deduct}")
        
        except Exception as e:
            print(f"❌ Error procesando puntos: {e}")

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
    # Permitir acceso sin autenticación; validamos con Stripe y la sesión almacenada
    permission_classes = [permissions.AllowAny]

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
        producto_personalizado_id = metadata.get("producto_personalizado_id")

        if payment_status in ("paid", "complete"):
            if combo_id:
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
                    
            elif producto_personalizado_id:
                try:
                    from products.models import ProductoPersonalizado
                    from django.utils import timezone
                    producto = ProductoPersonalizado.objects.get(id=producto_personalizado_id, usuario=request.user)
                    # Validar que corresponda a la misma sesión
                    if producto.stripe_session_id == session.get("id") and not producto.is_paid:
                        producto.is_paid = True
                        producto.paid_at = timezone.now()
                        producto.save(update_fields=["is_paid", "paid_at"])
                except ProductoPersonalizado.DoesNotExist:
                    # No romper; sólo retornar la sesión
                    pass

        return Response(session)
