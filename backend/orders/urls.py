from django.urls import path
from .views import AgregarCarritoAPIView, CrearPedidoAPIView, CarritoView

urlpatterns = [
    path('cart/', CarritoView.as_view(), name='view_cart'),
    path('add-to-cart/', AgregarCarritoAPIView.as_view(), name='add_to_cart'),
    path('create-order/', CrearPedidoAPIView.as_view(), name='create_order'),
]
