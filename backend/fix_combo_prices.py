"""
Script para diagnosticar y reparar inconsistencias de precios en combos
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto
from products.serializers import ComboPersonalizadoSerializer
from decimal import Decimal

def fix_combo_prices():
    print("🔧 REPARANDO PRECIOS DE COMBOS")
    print("=" * 50)
    
    combos_reparados = 0
    
    for combo in ComboPersonalizado.objects.all():
        print(f"\n📦 Combo: {combo.nombre or f'ID {combo.id}'}")
        print(f"   Precio actual en BD: ${combo.precio_total}")
        
        # Recalcular precio basado en productos y sus precios históricos
        productos = combo.combopersonalizadoproducto_set.all()
        precio_calculado = Decimal('0.00')
        
        print(f"   Productos ({productos.count()}):")
        for prod_combo in productos:
            # Usar precio_unitario como fuente principal (es el más confiable)
            precio_usar = None
            
            if hasattr(prod_combo, 'precio_unitario') and prod_combo.precio_unitario is not None:
                precio_usar = prod_combo.precio_unitario
                origen = "precio_unitario"
            elif prod_combo.precio_al_agregar is not None:
                precio_usar = prod_combo.precio_al_agregar
                origen = "precio_al_agregar"
            else:
                precio_usar = prod_combo.producto.precio
                origen = "precio_actual"
            
            subtotal = precio_usar * prod_combo.cantidad
            precio_calculado += subtotal
            
            print(f"     - {prod_combo.producto.nombre}: ${precio_usar} x{prod_combo.cantidad} = ${subtotal} ({origen})")
        
        print(f"   💰 Precio recalculado: ${precio_calculado}")
        
        # Actualizar si hay diferencia
        if combo.precio_total != precio_calculado:
            print(f"   🔄 ACTUALIZANDO: ${combo.precio_total} → ${precio_calculado}")
            combo.precio_total = precio_calculado
            combo.save()
            combos_reparados += 1
        else:
            print(f"   ✅ Precio correcto, no requiere cambios")
    
    print(f"\n🎯 RESUMEN:")
    print(f"   Combos reparados: {combos_reparados}")
    print(f"   Total combos: {ComboPersonalizado.objects.count()}")
    
    # Verificar serialización después de la reparación
    print(f"\n🧪 VERIFICANDO SERIALIZACIÓN:")
    for combo in ComboPersonalizado.objects.filter(is_paid=True)[:3]:
        try:
            serializer = ComboPersonalizadoSerializer(combo)
            data = serializer.data
            print(f"   Combo '{combo.nombre}': ${data.get('precio_total')} (API)")
            
            productos_api = data.get('productos_detalle', [])
            total_productos = sum(p.get('precio', 0) * p.get('cantidad', 1) for p in productos_api)
            print(f"   Suma productos API: ${total_productos}")
            
            if abs(float(data.get('precio_total', 0)) - total_productos) < 0.01:
                print(f"   ✅ Consistente")
            else:
                print(f"   ❌ Inconsistente: total combo vs suma productos")
                
        except Exception as e:
            print(f"   ⚠️ Error: {e}")

if __name__ == '__main__':
    fix_combo_prices()