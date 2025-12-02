from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Carrito, CarritoItem, Pedido, PedidoItem, Estado
from .serializers import (
    PedidoSerializer, 
    PedidoCreateSerializer, 
    CarritoSerializer, 
    EstadoSerializer
)
from products.models import Producto, Ingrediente, ComboPersonalizado, ComboPersonalizadoProducto
from decimal import Decimal

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


class AddCustomComboToCartAPIView(APIView):
    """Agregar un combo personalizado (on-the-fly) como un solo ítem al carrito.
    Body esperado:
      {
        "nombre": "Mi combo",
        "productos": [{"producto": <id>, "cantidad": 1}, ...]
      }
    Calcula precio con precios actuales de Producto y crea un ComboPersonalizado temporal ligado al usuario.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        nombre = (request.data.get('nombre') or '').strip() or None
        productos_data = request.data.get('productos', [])
        if not productos_data or not isinstance(productos_data, list):
            return Response({'error': 'Debes seleccionar al menos un producto'}, status=400)

        # Crear combo personalizado efímero (no publicado)
        combo = ComboPersonalizado.objects.create(usuario=user, nombre=nombre or 'Mi combo', precio_total=0, publicado=False)

        total = 0
        for pd in productos_data:
            try:
                prod_id = int(pd.get('producto'))
                cantidad = int(pd.get('cantidad', 1))
            except Exception:
                continue
            if cantidad <= 0:
                continue
            try:
                prod = Producto.objects.get(id=prod_id)
            except Producto.DoesNotExist:
                continue
            ComboPersonalizadoProducto.objects.create(combo=combo, producto=prod, cantidad=cantidad)
            total += prod.precio * cantidad

        combo.precio_total = total
        combo.save()

        # Agregar al carrito como un único item apuntando al combo_personalizado
        carrito, _ = Carrito.objects.get_or_create(usuario=user)
        item = CarritoItem.objects.create(
            carrito=carrito,
            combo_personalizado=combo,
            cantidad=1,
            precio_total=total
        )
        return Response({
            'ok': True,
            'carrito_item_id': item.id,
            'combo_id': combo.id,
            'total': float(total)
        })
    

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
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)

class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(usuario=self.request.user).order_by('-creado')

    def get_serializer_class(self):
        if self.action == 'create':
            return PedidoCreateSerializer
        return PedidoSerializer

    def create(self, request, *args, **kwargs):
        """Crear pedido desde el carrito"""
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Verificar que el carrito no esté vacío
        carrito = Carrito.objects.filter(usuario=user).first()
        if not carrito or not carrito.items.exists():
            return Response({'error': 'El carrito está vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener o crear estado "enviado"
        estado_enviado, _ = Estado.objects.get_or_create(descripcion='Enviado')
        
        # Calcular total
        total = sum(item.precio_total for item in carrito.items.all())
        
        # Crear pedido
        pedido = Pedido.objects.create(
            usuario=user,
            estado=estado_enviado,
            total=total,
            **serializer.validated_data
        )
        
        # Crear PedidoItems desde CarritoItems y otorgar puntos si es combo personalizado publicado
        from products.models import ComboPersonalizado
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        
        for carrito_item in carrito.items.all():
            pedido_item = PedidoItem.objects.create(
                pedido=pedido,
                producto=carrito_item.producto,
                combo=carrito_item.combo,
                combo_personalizado=carrito_item.combo_personalizado if hasattr(carrito_item, 'combo_personalizado') else None,
                cantidad=carrito_item.cantidad,
                precio_unitario=carrito_item.precio_total / carrito_item.cantidad if carrito_item.cantidad > 0 else 0
            )
            
            # Si es un combo personalizado publicado, otorgar puntos al creador
            if hasattr(carrito_item, 'combo_personalizado') and carrito_item.combo_personalizado:
                combo_personalizado = carrito_item.combo_personalizado
                if combo_personalizado.publicado and combo_personalizado.usuario != user:
                    # Calcular puntos: 40% del valor de la compra
                    valor_compra = float(carrito_item.precio_total)
                    puntos_ganados = int(valor_compra * 0.40)
                    
                    # Otorgar puntos al creador del combo
                    creador = combo_personalizado.usuario
                    creador.points += puntos_ganados
                    creador.save()
                    
                    # Incrementar contador de veces comprado
                    combo_personalizado.veces_comprado += carrito_item.cantidad
                    combo_personalizado.save()
                    
                    # Crear notificación al creador
                    try:
                        from notifications.models import Notificacion
                        estado_info, _ = Estado.objects.get_or_create(descripcion='Información')
                        Notificacion.objects.create(
                            usuario=creador,
                            mensaje=f"¡Has ganado {puntos_ganados} puntos! Alguien compró tu combo personalizado '{combo_personalizado.nombre}' por ${valor_compra:,.0f}.",
                            estado=estado_info
                        )
                    except ImportError:
                        pass
        
        # Limpiar carrito
        carrito.items.all().delete()
        
        # Crear notificación
        try:
            from notifications.models import Notificacion
            estado_no_leido, _ = Estado.objects.get_or_create(descripcion='No Leído')
            Notificacion.objects.create(
                usuario=user,
                mensaje=f"Tu pedido #{pedido.id} ha sido creado y está siendo procesado.",
                estado=estado_no_leido
            )
        except ImportError:
            pass  # Si no existe la app de notificaciones
        
        response_serializer = PedidoSerializer(pedido)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class ClearCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        carrito = Carrito.objects.filter(usuario=request.user).first()
        if carrito:
            carrito.items.all().delete()
        return Response({'ok': True, 'cleared': True})

    @action(detail=True, methods=['patch'])
    def actualizar_estado(self, request, pk=None):
        """Actualizar estado del pedido (solo para staff/admin)"""
        pedido = self.get_object()
        
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo el personal autorizado puede actualizar estados'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        nuevo_estado_id = request.data.get('estado_id')
        if not nuevo_estado_id:
            return Response(
                {'error': 'Debe proporcionar un estado_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            nuevo_estado = Estado.objects.get(id=nuevo_estado_id)
            pedido.estado = nuevo_estado
            pedido.save()
            
            # Crear notificación al usuario
            try:
                from notifications.models import Notificacion
                estado_no_leido, _ = Estado.objects.get_or_create(descripcion='No Leído')
                Notificacion.objects.create(
                    usuario=pedido.usuario,
                    mensaje=f"El estado de tu pedido #{pedido.id} ha cambiado a: {nuevo_estado.descripcion}",
                    estado=estado_no_leido
                )
            except ImportError:
                pass
            
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data)
            
        except Estado.DoesNotExist:
            return Response(
                {'error': 'Estado no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """Obtener estadísticas de pedidos del usuario"""
        user = request.user
        pedidos = self.get_queryset()
        
        total_pedidos = pedidos.count()
        total_gastado = sum(pedido.total for pedido in pedidos)
        
        # Estadísticas por estado
        estados_stats = {}
        for pedido in pedidos:
            estado = pedido.estado.descripcion if pedido.estado else 'Sin estado'
            estados_stats[estado] = estados_stats.get(estado, 0) + 1
        
        return Response({
            'total_pedidos': total_pedidos,
            'total_gastado': float(total_gastado),
            'pedidos_por_estado': estados_stats,
            'promedio_por_pedido': float(total_gastado / total_pedidos) if total_pedidos > 0 else 0
        })

class EstadoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Estado.objects.all()
    serializer_class = EstadoSerializer
    permission_classes = [permissions.IsAuthenticated]

