from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Carrito, CarritoItem, Pedido
from products.models import Producto, Ingrediente
from decimal import Decimal
from .models import Carrito, Pedido

class AgregarCarritoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        producto_id = request.data.get('producto_id')
        ingredientes_ids = request.data.get('ingredientes', [])
        cantidad = int(request.data.get('cantidad', 1))

        producto = Producto.objects.get(pk=producto_id)
        carrito, _ = Carrito.objects.get_or_create(usuario=user)
        item = CarritoItem.objects.create(carrito=carrito, producto=producto, cantidad=cantidad)
        for ing_id in ingredientes_ids:
            item.ingredientes.add(Ingrediente.objects.get(pk=ing_id))
        # calcular precio
        precio = producto.precio_base
        for ing in item.ingredientes.all():
            precio += ing.costo_extra
        item.precio_total = precio * cantidad
        item.save()
        return Response({'ok': True, 'item_id': item.id})
    

from .models import Carrito, Pedido

class CrearPedidoAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        direccion = request.data.get('direccion')
        telefono = request.data.get('telefono')

        carrito = Carrito.objects.filter(usuario=user).first()
        if not carrito or not carrito.items.exists():
            return Response({'error': 'Carrito vacío'}, status=400)

        total = sum([it.precio_total for it in carrito.items.all()])
        pedido = Pedido.objects.create(
            usuario=user,
            total=total,
            direccion=direccion,
            telefono=telefono,
            estado='ENVIADO'   # directo como definiste
        )

        for it in carrito.items.all():
            pedido.items.add(it)

        pedido.save()
        carrito.items.all().delete()  # limpiar carrito

        # crear notificación
        from notifications.models import Notificacion
        Notificacion.objects.create(
            usuario=user,
            mensaje=f"Tu pedido #{pedido.id} ha sido enviado."
        )

        return Response({'ok': True, 'pedido_id': pedido.id})

class CarritoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
        items = [
            {
                "producto": item.producto.nombre if item.producto else None,
                "combo": item.combo.nombre if item.combo else None,
                "cantidad": item.cantidad,
                "ingredientes": [ing.nombre for ing in item.ingredientes.all()],
                "precio_total": float(item.precio_total)
            }
            for item in carrito.items.all()
        ]
        return Response({"items": items})

