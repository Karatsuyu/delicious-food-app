#!/usr/bin/env python
import os
import django
import sys

# Setup Django
sys.path.append('/c/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ProductoPersonalizado
from users.models import User, PurchaseHistory

def debug_combos_ownership():
    print("🔍 ANÁLISIS DE COMBOS PERSONALIZADOS")
    print("="*50)
    
    # Obtener todos los usuarios
    users = User.objects.all()
    
    for user in users:
        print(f"\n👤 Usuario: {user.username} (ID: {user.id})")
        
        # Combos creados por el usuario
        combos_creados = ComboPersonalizado.objects.filter(usuario=user)
        print(f"   📋 Combos creados: {combos_creados.count()}")
        for combo in combos_creados[:3]:  # Solo los primeros 3
            print(f"      - ID {combo.id}: '{combo.nombre}' (Pagado: {combo.is_paid}, Compras: {combo.veces_comprado})")
        
        # Combos comprados por el usuario (aparecen en purchase history)
        compras = PurchaseHistory.objects.filter(buyer=user)
        print(f"   🛒 Historial de compras: {compras.count()}")
        for compra in compras[:3]:  # Solo las primeras 3
            items = compra.items.filter(item_type__in=['combo_personalizado', 'producto_personalizado'])
            for item in items:
                if item.creator_user and item.creator_user != user:
                    print(f"      - Compró: '{item.item_name}' del usuario {item.creator_user.username}")

def check_duplicate_issue():
    print("\n🚨 VERIFICANDO POSIBLES DUPLICADOS")
    print("="*50)
    
    # Buscar si algún combo está marcado como pagado por alguien que no es el creador
    all_combos = ComboPersonalizado.objects.filter(is_paid=True)
    print(f"Total de combos pagados: {all_combos.count()}")
    
    # Ver si hay combos que podrían estar duplicados por compras
    potential_issues = []
    for combo in all_combos:
        # Verificar si hay compras de este combo en el historial
        purchase_items = None
        try:
            from users.models import PurchaseItem
            purchase_items = PurchaseItem.objects.filter(
                item_type='combo_personalizado',
                creator_user=combo.usuario
            ).exclude(purchase__buyer=combo.usuario)
            
            if purchase_items.exists() and combo.veces_comprado == 0:
                potential_issues.append({
                    'combo': combo,
                    'compras_externas': purchase_items.count()
                })
        except Exception as e:
            print(f"Error verificando combo {combo.id}: {e}")
    
    if potential_issues:
        print(f"⚠️  Se encontraron {len(potential_issues)} posibles inconsistencias:")
        for issue in potential_issues[:5]:
            combo = issue['combo']
            print(f"   - Combo ID {combo.id} del usuario {combo.usuario.username}: compras externas pero veces_comprado=0")
    else:
        print("✅ No se encontraron inconsistencias evidentes")

if __name__ == "__main__":
    debug_combos_ownership()
    check_duplicate_issue()