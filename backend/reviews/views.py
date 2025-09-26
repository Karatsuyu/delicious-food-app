from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from products.models import Producto

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        producto_id = self.request.query_params.get('producto', None)
        if producto_id is not None:
            queryset = queryset.filter(producto=producto_id)
        return queryset.order_by('-creado')

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            # Solo el autor puede editar/eliminar sus reseñas
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            # Lectura permitida para todos
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        review = self.get_object()
        if review.usuario != request.user:
            return Response({'error': 'Solo puedes editar tus propias reseñas'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        review = self.get_object()
        if review.usuario != request.user:
            return Response({'error': 'Solo puedes eliminar tus propias reseñas'}, status=403)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def mis_reviews(self, request):
        """Obtener las reseñas del usuario autenticado"""
        if not request.user.is_authenticated:
            return Response({'error': 'Debes estar autenticado'}, status=401)
        
        reviews = Review.objects.filter(usuario=request.user).order_by('-creado')
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def estadisticas_producto(self, request):
        """Obtener estadísticas de reseñas por producto"""
        producto_id = request.query_params.get('producto')
        if not producto_id:
            return Response({'error': 'Debes especificar un producto'}, status=400)
        
        try:
            producto = Producto.objects.get(id=producto_id)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=404)
        
        reviews = Review.objects.filter(producto=producto)
        total_reviews = reviews.count()
        
        if total_reviews == 0:
            return Response({
                'producto_id': producto_id,
                'producto_nombre': producto.nombre,
                'total_reviews': 0,
                'promedio_calificacion': 0,
                'distribucion_calificaciones': {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            })
        
        promedio = reviews.aggregate(Avg('calificacion'))['calificacion__avg']
        
        # Distribuición de calificaciones
        distribucion = {}
        for i in range(1, 6):
            distribucion[i] = reviews.filter(calificacion=i).count()
        
        return Response({
            'producto_id': producto_id,
            'producto_nombre': producto.nombre,
            'total_reviews': total_reviews,
            'promedio_calificacion': round(promedio, 2),
            'distribucion_calificaciones': distribucion
        })
