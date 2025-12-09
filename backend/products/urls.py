from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, IngredienteViewSet, ComboViewSet, ComboPersonalizadoViewSet,
    ProductoPersonalizadoViewSet, ProductoPersonalizadoPublicosView, ComboPersonalizadoCreateView, 
    ComboPersonalizadoListView, ComboPersonalizadoPublicosView, AdminProductoViewSet, AdminEstadisticasView
)

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'ingredientes', IngredienteViewSet, basename='ingrediente')
router.register(r'combos', ComboViewSet, basename='combo')
router.register(r'combos-personalizados', ComboPersonalizadoViewSet, basename='combo-personalizado')
router.register(r'productos-personalizados', ProductoPersonalizadoViewSet, basename='producto-personalizado')

# Rutas de administración
admin_router = DefaultRouter()
admin_router.register(r'admin/productos', AdminProductoViewSet, basename='admin-producto')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(admin_router.urls)),
    path('combos-personalizados/create/',ComboPersonalizadoCreateView.as_view(), name='combo-personalizado-create'),
    path('combos-personalizados/list/',ComboPersonalizadoListView.as_view(), name='combo-personalizo-list'),
    # Cambiar la ruta para evitar conflicto con el ViewSet
    path('combos-publicos/',ComboPersonalizadoPublicosView.as_view(), name='combo-personalizado-publicos'),
    path('productos-publicos/',ProductoPersonalizadoPublicosView.as_view(), name='producto-personalizado-publicos'),

    # Ruta de estadísticas para administradores
    path('admin/estadisticas/', AdminEstadisticasView.as_view(), name='admin-estadisticas'),
]
