#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
sys.path.append('/backend')
django.setup()

from users.models import PurchaseHistory, PurchaseItem

print("=== HISTORIAL DE COMPRAS ===")
purchases = PurchaseHistory.objects.all().order_by('-created_at')

for purchase in purchases:
    print(f"\n🛒 Compra ID: {purchase.id}")
    print(f"   Comprador: {purchase.buyer.username}")
    print(f"   Fecha: {purchase.created_at}")
    print(f"   Total: ${purchase.total_amount}")
    print(f"   Stripe Session: {purchase.stripe_session_id}")
    
    # Items de la compra
    items = purchase.items.all()
    print(f"   Items ({len(items)}):")
    for item in items:
        print(f"      - {item.item_name}")
        print(f"        Tipo: {item.item_type}")
        print(f"        Precio: ${item.unit_price}")
        print(f"        Creador: {item.creator_user}")
        print(f"        Producto original ID: {item.original_product_id}")
        print(f"        Producto original nombre: {item.original_product_name}")
        print(f"        Producto original imagen: {item.original_product_image}")
        print()

print("\n=== VERIFICAR DUPLICADOS ===")
sessions = list(purchases.values_list('stripe_session_id', flat=True))
duplicated_sessions = []
for session in set(sessions):
    count = sessions.count(session)
    if count > 1 and session:
        duplicated_sessions.append(session)
        print(f"⚠️ Sesión duplicada: {session} ({count} veces)")

if not duplicated_sessions:
    print("✅ No hay sesiones duplicadas")