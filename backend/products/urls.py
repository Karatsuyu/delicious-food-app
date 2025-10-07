from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, IngredienteViewSet, ComboViewSet, ComboPersonalizadoViewSet,ComboPersonalizadoCreateView, ComboPersonalizadoListView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'ingredientes', IngredienteViewSet, basename='ingrediente')
router.register(r'combos', ComboViewSet, basename='combo')
router.register(r'combos-personalizados', ComboPersonalizadoViewSet, basename='combo-personalizado')

urlpatterns = [
    path('', include(router.urls)),
    path('combos-personalizados/create/',ComboPersonalizadoCreateView.as_view(), name='combo-personalizado-create'),
    path('combos-personalizados/list/',ComboPersonalizadoListView.as_view(), name='combo-personalizo-list'),
]
