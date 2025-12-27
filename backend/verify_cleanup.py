"""
Verificar que se eliminó correctamente la información de precio actual
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado
from products.serializers import ComboPersonalizadoSerializer

def verify_precio_actual_removed():
    print("🧹 VERIFICANDO ELIMINACIÓN DE 'PRECIO ACTUAL'")
    print("=" * 50)
    
    # Obtener un combo pagado para verificar
    combo = ComboPersonalizado.objects.filter(is_paid=True).first()
    
    if not combo:
        print("❌ No hay combos pagados para verificar")
        return
    
    print(f"📦 Verificando combo: {combo.nombre}")
    
    # Serializar el combo
    serializer = ComboPersonalizadoSerializer(combo)
    data = serializer.data
    
    productos = data.get('productos_detalle', [])
    
    if not productos:
        print("⚠️  Este combo no tiene productos")
        return
    
    print(f"🔍 Productos en API ({len(productos)}):")
    
    precio_actual_found = False
    
    for i, prod in enumerate(productos[:3]):  # Solo mostrar primeros 3
        print(f"   Producto {i+1}: {prod.get('nombre')}")
        print(f"     - precio: ${prod.get('precio', 'N/A')}")
        print(f"     - cantidad: {prod.get('cantidad', 'N/A')}")
        
        # Verificar si aún existe precio_actual
        if 'precio_actual' in prod:
            precio_actual_found = True
            print(f"     - ❌ precio_actual: ${prod.get('precio_actual')} (NO DEBERÍA ESTAR)")
        else:
            print(f"     - ✅ precio_actual: eliminado correctamente")
    
    if precio_actual_found:
        print(f"\n❌ ERROR: Aún se está enviando 'precio_actual' en algunos productos")
    else:
        print(f"\n✅ ÉXITO: 'precio_actual' eliminado correctamente de la API")
        print(f"✅ Los detalles del combo solo muestran el precio histórico")

if __name__ == '__main__':
    verify_precio_actual_removed()