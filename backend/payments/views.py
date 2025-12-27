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
            productos_personalizados = data.get('productos_personalizados', [])
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
            
            elif productos_personalizados:
                # Múltiples productos personalizados - validar y agregar a metadata
                from products.models import ProductoPersonalizado
                import json
                
                valid_productos = []
                for producto_data in productos_personalizados:
                    producto_id = producto_data.get('producto_personalizado_id')
                    if producto_id:
                        try:
                            producto_obj = ProductoPersonalizado.objects.get(id=producto_id)
                            valid_productos.append({
                                'id': str(producto_obj.id),
                                'creator_id': str(producto_obj.usuario.id),
                                'creator_username': producto_obj.usuario.username,
                                'nombre': producto_data.get('nombre', producto_obj.nombre_personalizado),
                                'precio': str(producto_data.get('precio', producto_obj.precio_total)),
                                'cantidad': producto_data.get('cantidad', 1)
                            })
                        except ProductoPersonalizado.DoesNotExist:
                            return Response({"error": f"producto_personalizado_id {producto_id} inválido"}, status=400)
                
                if valid_productos:
                    metadata['productos_personalizados'] = json.dumps(valid_productos)
                    metadata['buyer_id'] = str(request.user.id)
                    print(f"[Checkout] Múltiples productos personalizados: {len(valid_productos)}")

            success_url = f"{settings.FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}"
            cancel_url = f"{settings.FRONTEND_URL}/failure"
            
            print(f"[Stripe] FRONTEND_URL: {settings.FRONTEND_URL}")
            print(f"[Stripe] Success URL: {success_url}")
            print(f"[Stripe] Cancel URL: {cancel_url}")
            
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=line_items,
                mode="payment",
                success_url=success_url,
                cancel_url=cancel_url,
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
                    
                    # Obtener información del producto base
                    if producto_obj.producto_base:
                        # Es un producto de la base de datos
                        original_name = producto_obj.producto_base.nombre
                        original_image = producto_obj.producto_base.imagen.url if producto_obj.producto_base.imagen else None
                        original_id = str(producto_obj.producto_base.id)
                    elif producto_obj.local_product_id:
                        # Es un producto local hardcodeado
                        original_name = producto_obj.local_product_name or 'Producto local'
                        original_image = producto_obj.local_product_image
                        original_id = producto_obj.local_product_id
                    else:
                        # Fallback
                        original_name = 'Producto personalizado'
                        original_image = None
                        original_id = 'unknown'

                    # Crear item de compra
                    PurchaseItem.objects.create(
                        purchase=purchase,
                        item_type='producto_personalizado',
                        item_name=producto_obj.nombre_personalizado,
                        quantity=1,
                        unit_price=producto_obj.precio_total,
                        creator_user=producto_obj.usuario,
                        # Información del producto base
                        original_product_name=original_name,
                        original_product_image=original_image,
                        original_product_id=original_id
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
        productos_personalizados_json = metadata.get("productos_personalizados")
        
        print(f"[ConfirmSession] Session ID: {session_id}")
        print(f"[ConfirmSession] Payment Status: {payment_status}")
        print(f"[ConfirmSession] Metadata: {metadata}")
        print(f"[ConfirmSession] Combo ID: {combo_id}")
        print(f"[ConfirmSession] Producto ID: {producto_personalizado_id}")
        print(f"[ConfirmSession] Productos múltiples: {productos_personalizados_json}")

        if payment_status in ("paid", "complete"):
            # Crear historial de compra si no existe ya
            from users.models import PurchaseHistory, PurchaseItem
            from django.contrib.auth import get_user_model
            from django.utils import timezone
            User = get_user_model()

            buyer_id = metadata.get("buyer_id")
            creator_id = metadata.get("creator_id")
            
            try:
                buyer = User.objects.get(id=buyer_id) if buyer_id else request.user
                creator = User.objects.get(id=creator_id) if creator_id else None
                
                # Verificar si ya existe este historial de compra
                existing_purchase = PurchaseHistory.objects.filter(
                    stripe_session_id=session_id,
                    buyer=buyer
                ).first()
                
                if not existing_purchase:
                    print(f"[ConfirmSession] Creando historial de compra para session {session_id}")
                    
                    # Crear registro de compra
                    purchase = PurchaseHistory.objects.create(
                        buyer=buyer,
                        total_amount=session.get("amount_total", 0) / 100,  # Convertir de centavos
                        stripe_session_id=session_id
                    )
                    
                    # Procesar múltiples productos personalizados
                    if productos_personalizados_json:
                        import json
                        try:
                            productos_personalizados = json.loads(productos_personalizados_json)
                            print(f"[ConfirmSession] Procesando {len(productos_personalizados)} productos personalizados")
                            
                            for producto_data in productos_personalizados:
                                producto_id = producto_data.get('id')
                                creator_id = producto_data.get('creator_id')
                                creator_username = producto_data.get('creator_username')
                                nombre = producto_data.get('nombre')
                                precio = float(producto_data.get('precio', 0))
                                cantidad = int(producto_data.get('cantidad', 1))
                                
                                try:
                                    from products.models import ProductoPersonalizado
                                    producto = ProductoPersonalizado.objects.get(id=producto_id)
                                    creator_user = User.objects.get(id=creator_id)
                                    
                                    # Verificar si es compra de producto de otro usuario
                                    print(f"🔍 DEBUG PUNTOS - Creador: {creator_username} (ID: {creator_user.id}), Comprador: {buyer.username} (ID: {buyer.id})")
                                    
                                    if str(creator_user.id) != str(buyer.id):
                                        # Es compra de otro usuario - otorgar puntos y incrementar ventas
                                        producto.veces_comprado += cantidad
                                        producto.save(update_fields=["veces_comprado"])
                                        
                                        # Otorgar puntos al creador (10 puntos por cada producto)
                                        points_earned = 10 * cantidad
                                        creator_user.points += points_earned
                                        creator_user.save(update_fields=["points"])
                                        purchase.points_earned = (purchase.points_earned or 0) + points_earned
                                        print(f"🎁 {creator_username} ganó {points_earned} puntos por venta de producto personalizado")
                                    else:
                                        # Es compra propia - NO otorgar puntos
                                        print(f"🚫 {buyer.username} compró su propio producto - NO se otorgan puntos")
                                    
                                    # Obtener información del producto base
                                    original_name = getattr(producto, 'local_product_name', None) or (producto.producto_base.nombre if producto.producto_base else None)
                                    original_id = getattr(producto, 'local_product_id', None) or (str(producto.producto_base.id) if producto.producto_base else None)
                                    original_image = getattr(producto, 'local_product_image', None)
                                    
                                    # Crear item de compra
                                    for _ in range(cantidad):
                                        PurchaseItem.objects.create(
                                            purchase=purchase,
                                            item_type='producto_personalizado',
                                            item_name=nombre,
                                            quantity=1,
                                            unit_price=precio / cantidad,  # Precio unitario
                                            creator_user=creator_user,
                                            original_product_name=original_name,
                                            original_product_image=original_image,
                                            original_product_id=original_id
                                        )
                                    
                                    print(f"✅ Procesado producto personalizado: {nombre} x{cantidad}")
                                    
                                except (ProductoPersonalizado.DoesNotExist, User.DoesNotExist) as e:
                                    print(f"❌ Error procesando producto {producto_id}: {e}")
                            
                            # Actualizar puntos ganados totales en la compra
                            purchase.save(update_fields=["points_earned"])
                                    
                        except json.JSONDecodeError as e:
                            print(f"❌ Error decodificando productos_personalizados JSON: {e}")
                    
                    # Si no hay metadatos específicos, son productos normales del carrito
                    elif not combo_id and not producto_personalizado_id:
                        print(f"[ConfirmSession] Procesando productos normales del carrito")
                        try:
                            # Obtener line items de Stripe
                            line_items = stripe.checkout.Session.list_line_items(session_id, limit=10)
                            
                            for line_item in line_items.data:
                                # Crear item de compra para producto normal
                                product_name = line_item.description
                                quantity = line_item.quantity
                                unit_price = line_item.amount_total / 100 / quantity  # Precio unitario
                                
                                # Intentar mapear el nombre del producto a su ID para obtener la imagen
                                product_id = None
                                product_image = None
                                
                                # Mapeo básico de nombres a IDs (puedes expandir esto)
                                name_to_id_map = {
                                    'Hamburguesa Clásica': 'hamburguesa1',
                                    'Hamburguesa con Queso': 'hamburguesa2', 
                                    'Hamburguesa Deluxe': 'hamburguesa3',
                                    'BBQ Crispy': 'hamburguesa4',
                                    'Clásico Bacon': 'hamburguesa5',
                                    'Madurita Burger': 'hamburguesa6',
                                    'BBQ Crunch Burger': 'hamburguesa7',
                                    'Double Smash': 'hamburguesa8',
                                    'Pizza Hawaiana': 'pizza1',
                                    'Pizza de Queso': 'pizza2',
                                    'Pizza de Pepperoni': 'pizza3',
                                    'Pizza Aromática de Pepperoni': 'pizza4',
                                    'Pizza de Pollo y Champiñones': 'pizza5',
                                    'Pepperoni Lovers': 'pizza6',
                                    'Pizza Campesina': 'pizza7',
                                    'Alitas Simples': 'pollo1',
                                    'Alitas Crocantes': 'pollo2',
                                    'Alitas BBQ': 'pollo3',
                                    'Alitas Teriyaki': 'pollo4',
                                    'Alitas Ajo Parmesano': 'pollo5',
                                    'Alitas Barbacoa': 'pollo6',
                                    # Puedes agregar más productos aquí
                                }
                                
                                if product_name in name_to_id_map:
                                    product_id = name_to_id_map[product_name]
                                    # No guardamos la imagen aquí porque el frontend la resolverá
                                
                                PurchaseItem.objects.create(
                                    purchase=purchase,
                                    item_type='product',
                                    item_name=product_name,
                                    quantity=quantity,
                                    unit_price=unit_price,
                                    # Información del producto original
                                    original_product_name=product_name,
                                    original_product_id=product_id,
                                    original_product_image=None  # El frontend resolverá la imagen
                                )
                                
                                print(f"✅ Item creado: {product_name} x{quantity} - ${unit_price}")
                                
                        except Exception as e:
                            print(f"❌ Error procesando line items: {e}")
                    
                    elif combo_id:
                        try:
                            from products.models import ComboPersonalizado
                            combo = ComboPersonalizado.objects.get(id=combo_id)
                            
                            # Marcar como pagado si es del creador
                            if str(combo.usuario.id) == str(buyer.id):
                                if not combo.is_paid:
                                    combo.is_paid = True
                                    combo.paid_at = timezone.now()
                                    combo.save(update_fields=["is_paid", "paid_at"])
                                    print(f"✅ Combo propio {combo_id} marcado como pagado")
                            else:
                                # Es compra de combo de otro usuario
                                combo.veces_comprado += 1
                                combo.save(update_fields=["veces_comprado"])
                                
                                # Otorgar puntos al creador
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
                                item_name=combo.nombre or f"Combo #{combo.id}",
                                quantity=1,
                                unit_price=combo.precio_total,
                                creator_user=combo.usuario
                            )
                            
                        except ComboPersonalizado.DoesNotExist:
                            print(f"❌ ComboPersonalizado {combo_id} no encontrado")
                        
                    elif producto_personalizado_id:
                        try:
                            from products.models import ProductoPersonalizado
                            producto = ProductoPersonalizado.objects.get(id=producto_personalizado_id)
                            
                            # Marcar como pagado si es del creador
                            if str(producto.usuario.id) == str(buyer.id):
                                if not producto.is_paid:
                                    producto.is_paid = True
                                    producto.paid_at = timezone.now()
                                    producto.save(update_fields=["is_paid", "paid_at"])
                                    print(f"✅ Producto propio {producto_personalizado_id} marcado como pagado")
                            else:
                                # Es compra de producto de otro usuario
                                producto.veces_comprado += 1
                                producto.save(update_fields=["veces_comprado"])
                                
                                # Otorgar puntos al creador
                                if creator and buyer and creator != buyer:
                                    creator.points += 10
                                    creator.save(update_fields=["points"])
                                    purchase.points_earned = 10
                                    purchase.save(update_fields=["points_earned"])
                                    print(f"🎁 {creator.username} ganó 10 puntos por venta de producto")
                            
                            # Obtener información del producto base
                            if producto.producto_base:
                                # Es un producto de la base de datos
                                original_name = producto.producto_base.nombre
                                original_image = producto.producto_base.imagen.url if producto.producto_base.imagen else None
                                original_id = str(producto.producto_base.id)
                            elif producto.local_product_id:
                                # Es un producto local hardcodeado
                                original_name = producto.local_product_name or 'Producto local'
                                original_image = producto.local_product_image
                                original_id = producto.local_product_id
                            else:
                                # Fallback
                                original_name = 'Producto personalizado'
                                original_image = None
                                original_id = 'unknown'

                            # Crear item de compra
                            PurchaseItem.objects.create(
                                purchase=purchase,
                                item_type='producto_personalizado',
                                item_name=producto.nombre_personalizado,
                                quantity=1,
                                unit_price=producto.precio_total,
                                creator_user=producto.usuario,
                                # Información del producto base
                                original_product_name=original_name,
                                original_product_image=original_image,
                                original_product_id=original_id
                            )
                            
                        except ProductoPersonalizado.DoesNotExist:
                            print(f"❌ ProductoPersonalizado {producto_personalizado_id} no encontrado")
                    
                    # Deducir puntos utilizados del comprador
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
                else:
                    print(f"[ConfirmSession] Historial de compra ya existe para session {session_id}")
                    
            except Exception as e:
                print(f"❌ Error creando historial en ConfirmSession: {e}")
            
            # Lógica original para marcar como pagado (solo para productos propios)
            if combo_id and str(metadata.get("buyer_id")) == str(metadata.get("creator_id")):
                try:
                    from products.models import ComboPersonalizado
                    combo = ComboPersonalizado.objects.get(id=combo_id, usuario=request.user)
                    if combo.stripe_session_id == session.get("id") and not combo.is_paid:
                        combo.is_paid = True
                        combo.paid_at = timezone.now()
                        combo.save(update_fields=["is_paid", "paid_at"])
                except ComboPersonalizado.DoesNotExist:
                    pass
                    
            elif producto_personalizado_id and str(metadata.get("buyer_id")) == str(metadata.get("creator_id")):
                try:
                    from products.models import ProductoPersonalizado
                    producto = ProductoPersonalizado.objects.get(id=producto_personalizado_id, usuario=request.user)
                    if producto.stripe_session_id == session.get("id") and not producto.is_paid:
                        producto.is_paid = True
                        producto.paid_at = timezone.now()
                        producto.save(update_fields=["is_paid", "paid_at"])
                except ProductoPersonalizado.DoesNotExist:
                    pass

        return Response(session)
