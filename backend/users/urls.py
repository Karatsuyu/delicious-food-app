from django.urls import path
from .views import (
    UserRegistrationView,  # Era RegisterView
    UserProfileView,
    ChangePasswordView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]