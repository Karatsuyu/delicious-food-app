from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session/', views.CreateCheckoutSessionView.as_view(), name='stripe_create_checkout_session'),
    path('webhook/', views.stripe_webhook, name='stripe_webhook'),
    path('retrieve-session/', views.retrieve_session, name='stripe_retrieve_session'),
    path('confirm-session/', views.ConfirmSessionView.as_view(), name='stripe_confirm_session'),
]
