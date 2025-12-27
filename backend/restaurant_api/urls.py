from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView

def api_status(request):
    """Vista simple para la raíz que muestra el status de la API"""
    return JsonResponse({
        'status': 'online',
        'message': 'Delicious Food API is running!',
        'version': '1.0.0',
        'endpoints': {
            'api': '/api/',
            'admin': '/admin/',
            'products': '/api/products/',
            'users': '/api/users/',
            'orders': '/api/orders/',
            'reviews': '/api/reviews/',
            'payments': '/api/payments/',
            'notifications': '/api/notification/'
        }
    })

urlpatterns = [
    # Página de bienvenida en la raíz
    path('', api_status, name='api_status'),
    
    path('admin/', admin.site.urls),
    
    # Rutas de autenticación
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rutas de la API
    path('api/', include('products.urls')),
    path('api/users/', include('users.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/notification/', include('notifications.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
