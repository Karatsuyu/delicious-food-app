#!/usr/bin/env python
import os
import sys
import django
import stripe

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
sys.path.append('/backend')
django.setup()

from users.models import PurchaseHistory, PurchaseItem

# Configurar Stripe
import os
from decouple import config
stripe.api_key = config('STRIPE_SECRET_KEY')

print("=== RELLENAR ITEMS FALTANTES ===")

# Mapeo de nombres a IDs
name_to_id_map = {
    'Hamburguesa Clásica': 'hamburguesa1',
    'Hamburguesa con Queso': 'hamburguesa2', 
    'Hamburguesa Deluxe': 'hamburguesa3',
    'BBQ Crispy': 'hamburguesa4',
    'Clásico Bacon': 'hamburguesa5',
    'Madurita Burger': 'hamburguesa6',
    'BBQ Crunch Burger': 'hamburguesa7',
    'Double Smash': 'hamburguesa8',
    'Pizza Hawaiana': 'pizza1',
    'Pizza de Queso': 'pizza2',
    'Pizza de Pepperoni': 'pizza3',
    'Pizza Aromática de Pepperoni': 'pizza4',
    'Pizza de Pollo y Champiñones': 'pizza5',
    'Pepperoni Lovers': 'pizza6',
    'Pizza Campesina': 'pizza7',
    'Alitas Simples': 'pollo1',
    'Alitas Crocantes': 'pollo2',
    'Alitas BBQ': 'pollo3',
    'Alitas Teriyaki': 'pollo4',
    'Alitas Ajo Parmesano': 'pollo5',
    'Alitas Barbacoa': 'pollo6',
}

# Buscar compras sin items
empty_purchases = PurchaseHistory.objects.filter(items__isnull=True).distinct()

for purchase in empty_purchases:
    print(f"\n🔄 Procesando compra ID {purchase.id} - {purchase.stripe_session_id}")
    
    try:
        # Obtener line items de Stripe
        line_items = stripe.checkout.Session.list_line_items(purchase.stripe_session_id, limit=10)
        
        for line_item in line_items.data:
            product_name = line_item.description
            quantity = line_item.quantity
            unit_price = line_item.amount_total / 100 / quantity
            
            product_id = name_to_id_map.get(product_name)
            
            item = PurchaseItem.objects.create(
                purchase=purchase,
                item_type='product',
                item_name=product_name,
                quantity=quantity,
                unit_price=unit_price,
                original_product_name=product_name,
                original_product_id=product_id,
                original_product_image=None
            )
            
            print(f"   ✅ Item creado: {product_name} x{quantity} - ${unit_price}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

print(f"\n✅ Proceso completado!")