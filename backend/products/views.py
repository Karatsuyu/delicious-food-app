from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q, F
from django.http import JsonResponse
from .models import Producto, Ingrediente, Combo, ComboPersonalizado, ProductoPersonalizado
from .serializers import ProductoSerializer, IngredienteSerializer, ComboSerializer, ComboPersonalizadoSerializer, ProductoPersonalizadoSerializer
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
        # Mostrar SOLO los combos personalizados PAGADOS del usuario
        return ComboPersonalizado.objects.filter(
            usuario=self.request.user,
            is_paid=True
        ).prefetch_related('combopersonalizadoproducto_set__producto')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['post'])
    def marcar_todos_pagados(self, request):
        """Marca todos los combos personalizados del usuario autenticado como pagados.
        Útil para corregir estados cuando el webhook/confirmación no se ejecutó.
        """
        from django.utils import timezone
        usuario = request.user
        combos = ComboPersonalizado.objects.filter(usuario=usuario)
        count = 0
        for combo in combos:
            if not combo.is_paid:
                combo.is_paid = True
                if not combo.paid_at:
                    combo.paid_at = timezone.now()
                combo.save(update_fields=["is_paid", "paid_at"])
                count += 1
        return Response({"ok": True, "actualizados": count})

    @action(detail=False, methods=['get'])
    def debug_info(self, request):
        """Debug endpoint para analizar todos los combos del usuario."""
        usuario = request.user
        combos = ComboPersonalizado.objects.filter(usuario=usuario).order_by('id')
        
        debug_data = []
        for combo in combos:
            productos_relacionados = combo.combopersonalizadoproducto_set.all()
            
            productos_info = []
            total_calculado = 0
            for cp in productos_relacionados:
                precio_producto = float(cp.producto.precio)
                cantidad = int(cp.cantidad)
                subtotal = precio_producto * cantidad
                total_calculado += subtotal
                productos_info.append({
                    'nombre': cp.producto.nombre,
                    'precio': precio_producto,
                    'cantidad': cantidad,
                    'subtotal': subtotal,
                    'imagen_seleccionada': cp.imagen_seleccionada
                })
            
            combo_info = {
                'id': combo.id,
                'nombre': combo.nombre,
                'precio_total_guardado': float(combo.precio_total or 0),
                'precio_total_calculado': total_calculado,
                'es_pagado': combo.is_paid,
                'publicado': combo.publicado,
                'fecha_creacion': combo.creado_en.isoformat(),
                'productos_count': productos_relacionados.count(),
                'productos': productos_info,
                'problema': 'sin_productos' if productos_relacionados.count() == 0 else (
                    'precio_cero' if total_calculado == 0 else (
                        'precio_diferente' if float(combo.precio_total or 0) != total_calculado else 'ok'
                    )
                )
            }
            debug_data.append(combo_info)
        
        return Response(debug_data)

    @action(detail=False, methods=['post'])
    def fix_all_combos(self, request):
        """Corrige todos los combos del usuario recalculando precios desde sus productos."""
        usuario = request.user
        combos = ComboPersonalizado.objects.filter(usuario=usuario)
        
        corregidos = 0
        for combo in combos:
            productos_relacionados = combo.combopersonalizadoproducto_set.all()
            
            if productos_relacionados.count() > 0:
                # Recalcular precio
                total_real = 0
                for cp in productos_relacionados:
                    total_real += float(cp.producto.precio) * int(cp.cantidad)
                
                # Actualizar solo si es diferente
                if float(combo.precio_total or 0) != total_real:
                    combo.precio_total = total_real
                    combo.save(update_fields=['precio_total'])
                    corregidos += 1
        
        return Response({"ok": True, "corregidos": corregidos})

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
    authentication_classes = []  # Permitir acceso sin autenticación
    
    def get_queryset(self):
        return ComboPersonalizado.objects.filter(
            publicado=True
        ).prefetch_related('combopersonalizadoproducto_set__producto').order_by('-veces_comprado', '-creado_en')
    
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


class ProductoPersonalizadoViewSet(viewsets.ModelViewSet):
    serializer_class = ProductoPersonalizadoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Mostrar TODOS los productos personalizados del usuario (pagados y no pagados)
        # Los usuarios deben poder ver sus propias creaciones antes y después del pago
        return ProductoPersonalizado.objects.filter(
            usuario=self.request.user
        ).prefetch_related('ingredientes', 'producto_base')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['post'])
    def marcar_todos_pagados(self, request):
        """Marca todos los productos personalizados del usuario autenticado como pagados.
        Útil para corregir estados cuando el webhook/confirmación no se ejecutó.
        """
        from django.utils import timezone
        productos_actualizados = ProductoPersonalizado.objects.filter(
            usuario=request.user,
            is_paid=False
        ).update(is_paid=True, paid_at=timezone.now())
        
        return Response({
            'message': f'Se marcaron {productos_actualizados} productos personalizados como pagados'
        })

    @action(detail=False, methods=['get'])
    def debug_info(self, request):
        """Debug endpoint para analizar todos los productos del usuario."""
        productos_todos = ProductoPersonalizado.objects.filter(usuario=request.user)
        productos_pagados = productos_todos.filter(is_paid=True)
        productos_pendientes = productos_todos.filter(is_paid=False)
        
        return Response({
            'usuario': request.user.username,
            'total_productos': productos_todos.count(),
            'productos_pagados': productos_pagados.count(),
            'productos_pendientes': productos_pendientes.count(),
            'productos_lista': [
                {
                    'id': p.id,
                    'nombre': p.nombre_personalizado,
                    'precio': str(p.precio_total),
                    'is_paid': p.is_paid,
                    'paid_at': p.paid_at,
                    'stripe_session_id': p.stripe_session_id
                }
                for p in productos_todos
            ]
        })


class ProductoPersonalizadoPublicosView(generics.ListAPIView):
    serializer_class = ProductoPersonalizadoSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Mostrar solo productos personalizados que están publicados Y pagados
        return ProductoPersonalizado.objects.filter(
            publicado=True,
            is_paid=True
        ).select_related('usuario', 'producto_base').prefetch_related('ingredientes').order_by('-creado_en')




