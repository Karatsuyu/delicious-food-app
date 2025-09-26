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
from products.models import Producto, Ingrediente
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
        
        # Crear PedidoItems desde CarritoItems
        for carrito_item in carrito.items.all():
            PedidoItem.objects.create(
                pedido=pedido,
                producto=carrito_item.producto,
                combo=carrito_item.combo,
                cantidad=carrito_item.cantidad,
                precio_unitario=carrito_item.precio_total / carrito_item.cantidad
            )
        
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

