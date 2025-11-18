from django.urls import path
from .views import create_preference, account_status

urlpatterns = [
    path('create_preference/', create_preference, name='mp_create_preference'),
    path('account_status/', account_status, name='mp_account_status'),
]
