from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, IngredienteViewSet, ComboViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'ingredientes', IngredienteViewSet, basename='ingrediente')
router.register(r'combos', ComboViewSet, basename='combo')

urlpatterns = [
    path('', include(router.urls)),
]
