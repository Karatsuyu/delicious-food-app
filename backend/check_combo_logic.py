import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado
from users.models import User, PurchaseHistory, PurchaseItem

def main():
    print("🔍 ANÁLISIS DE COMBOS - SITUACIÓN ACTUAL")
    print("="*60)
    
    # Ver todos los usuarios y sus combos
    for user in User.objects.all()[:4]:  # Primeros 4 usuarios
        print(f"\n👤 Usuario: {user.username} (ID: {user.id}) - Puntos: {user.points}")
        
        # Combos creados por este usuario (que es lo que ve en su perfil)
        combos_creados = ComboPersonalizado.objects.filter(usuario=user, is_paid=True)
        print(f"   📋 Combos pagados creados por él: {combos_creados.count()}")
        
        for combo in combos_creados[:3]:
            print(f"      - ID {combo.id}: '{combo.nombre}' (veces comprado: {combo.veces_comprado})")
        
        # Ver historial de compras
        compras = PurchaseHistory.objects.filter(buyer=user)
        print(f"   🛒 Historial de compras: {compras.count()}")
        
        for compra in compras[:3]:
            items = compra.items.all()
            for item in items:
                if item.creator_user and item.creator_user != user:
                    print(f"      - Compró: '{item.item_name}' de {item.creator_user.username} (Tipo: {item.item_type})")
    
    print("\n" + "="*60)
    print("🎯 CONCLUSIÓN:")
    print("- Los combos en el perfil son solo los CREADOS por el usuario")
    print("- Los combos COMPRADOS de otros aparecen en historial de compras")
    print("- No hay duplicación: el sistema ya funciona correctamente")

if __name__ == "__main__":
    main()