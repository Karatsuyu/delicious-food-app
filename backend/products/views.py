from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Sum, Count, Q, F
from .models import Producto, Ingrediente, Combo, ComboPersonalizado
from .serializers import ProductoSerializer, IngredienteSerializer, ComboSerializer, ComboPersonalizadoSerializer
from orders.models import PedidoItem, Pedido

class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        """Asegurar que el request esté en el contexto del serializer"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class IngredienteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ingrediente.objects.all()
    serializer_class = IngredienteSerializer

class ComboViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Combo.objects.all()
    serializer_class = ComboSerializer
    permission_classes = [permissions.AllowAny]



class ComboPersonalizadoViewSet(viewsets.ModelViewSet):
    serializer_class = ComboPersonalizadoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Mostrar todos los combos del usuario
        return ComboPersonalizado.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ComboPersonalizadoCreateView(generics.CreateAPIView):
    serializer_class = ComboPersonalizadoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ComboPersonalizadoListView(generics.ListAPIView):
    serializer_class = ComboPersonalizadoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ComboPersonalizado.objects.filter(usuario=self.request.user, is_paid=True)

class ComboPersonalizadoPublicosView(generics.ListAPIView):
    """Vista para listar combos personalizados publicados para que otros usuarios los compren"""
    serializer_class = ComboPersonalizadoSerializer
    permission_classes = [permissions.AllowAny]
    queryset = ComboPersonalizado.objects.filter(publicado=True).order_by('-veces_comprado', '-creado_en')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


# ========== VISTAS DE ADMINISTRACIÓN ==========

class AdminProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para administradores: CRUD completo de productos
    Solo accesible para usuarios con is_staff=True
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_serializer_context(self):
        """Asegurar que el request esté en el contexto del serializer"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        """Asignar el usuario actual como creador del producto"""
        serializer.save(usuario=self.request.user)

    def perform_update(self, serializer):
        """Actualizar producto manteniendo el usuario original si existe"""
        serializer.save()
    
    def update(self, request, *args, **kwargs):
        """Sobrescribir update para asegurar que el serializer tenga el request y manejar actualizaciones parciales"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_object_cache', None):
            instance._prefetched_object_cache = {}
        
        # Recargar la instancia para obtener la imagen actualizada
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class AdminEstadisticasView(generics.RetrieveAPIView):
    """
    Vista para obtener estadísticas de productos más vendidos
    Solo accesible para administradores
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        """
        Retorna estadísticas de productos más vendidos
        """
        # Obtener todos los items de pedidos con cálculo correcto de ingresos
        items_pedidos = PedidoItem.objects.filter(
            producto__isnull=False
        ).values('producto').annotate(
            total_vendido=Sum('cantidad'),
            total_ingresos=Sum(F('precio_unitario') * F('cantidad'))
        ).order_by('-total_vendido')[:10]  # Top 10 productos más vendidos

        productos_mas_vendidos = []
        for item in items_pedidos:
            try:
                producto = Producto.objects.get(id=item['producto'])
                # Obtener la URL absoluta de la imagen si existe
                imagen_url = None
                if producto.imagen:
                    try:
                        imagen_url = request.build_absolute_uri(producto.imagen.url)
                    except:
                        imagen_url = producto.imagen.url if producto.imagen else None
                
                productos_mas_vendidos.append({
                    'id': producto.id,
                    'nombre': producto.nombre,
                    'categoria': producto.categoria,
                    'precio': float(producto.precio),
                    'total_vendido': item['total_vendido'],
                    'total_ingresos': float(item['total_ingresos'] or 0),
                    'imagen': imagen_url
                })
            except Producto.DoesNotExist:
                continue

        # Estadísticas generales
        total_productos = Producto.objects.count()
        total_pedidos = Pedido.objects.count()
        total_ingresos_generales = PedidoItem.objects.filter(
            producto__isnull=False
        ).aggregate(
            total=Sum(F('precio_unitario') * F('cantidad'))
        )['total'] or 0

        # Productos por categoría
        productos_por_categoria = Producto.objects.values('categoria').annotate(
            cantidad=Count('id')
        ).order_by('-cantidad')

        return Response({
            'productos_mas_vendidos': productos_mas_vendidos,
            'estadisticas_generales': {
                'total_productos': total_productos,
                'total_pedidos': total_pedidos,
                'total_ingresos': float(total_ingresos_generales),
            },
            'productos_por_categoria': list(productos_por_categoria)
        })

