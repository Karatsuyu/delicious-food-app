from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AgregarCarritoAPIView, 
    CrearPedidoAPIView, 
    CarritoView,
    PedidoViewSet,
    EstadoViewSet
)

router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'estados', EstadoViewSet, basename='estado')

urlpatterns = [
    # Carrito endpoints
    path('cart/', CarritoView.as_view(), name='view_cart'),
    path('add-to-cart/', AgregarCarritoAPIView.as_view(), name='add_to_cart'),
    
    # Pedidos endpoints via ViewSet
    path('', include(router.urls)),
    
    # Mantener compatibilidad con endpoint anterior
    path('create-order/', CrearPedidoAPIView.as_view(), name='create_order'),
]
