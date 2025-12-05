"""
Script para reparar combos antiguos con precios incorrectos
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto
from decimal import Decimal

def repair_old_combos():
    print("🔧 REPARANDO COMBOS ANTIGUOS CON PRECIOS INCORRECTOS")
    print("=" * 60)
    
    # Buscar combos donde el precio_unitario es 0 pero el combo tiene un precio_total > 0
    combos_problematicos = []
    
    for combo in ComboPersonalizado.objects.filter(precio_total__gt=0):
        productos = combo.combopersonalizadoproducto_set.all()
        if productos.exists():
            # Verificar si todos los productos tienen precio_unitario = 0
            productos_sin_precio = productos.filter(precio_unitario=0).count()
            if productos_sin_precio > 0:
                combos_problematicos.append(combo)
    
    print(f"📊 Combos encontrados con precios problemáticos: {len(combos_problematicos)}")
    
    for combo in combos_problematicos:
        print(f"\n🔍 Reparando combo: {combo.nombre or f'ID {combo.id}'}")
        print(f"   Precio total actual: ${combo.precio_total}")
        
        productos = combo.combopersonalizadoproducto_set.all()
        total_productos = productos.count()
        
        # Estrategia: Distribuir el precio total del combo entre los productos
        # basándose en sus precios actuales proporcionales
        precio_total_actual = sum(p.producto.precio * p.cantidad for p in productos)
        
        print(f"   Productos: {total_productos}")
        print(f"   Precio total actual de productos: ${precio_total_actual}")
        
        if precio_total_actual > 0:
            # Calcular factor de escala
            factor = combo.precio_total / precio_total_actual
            print(f"   Factor de escala: {factor:.4f}")
            
            for prod_combo in productos:
                precio_actual = prod_combo.producto.precio
                precio_escalado = precio_actual * factor
                
                # Actualizar el precio_unitario con el precio escalado
                prod_combo.precio_unitario = precio_escalado
                if prod_combo.precio_al_agregar is None or prod_combo.precio_al_agregar == 0:
                    prod_combo.precio_al_agregar = precio_escalado
                prod_combo.save()
                
                print(f"     - {prod_combo.producto.nombre}: ${precio_actual} → ${precio_escalado:.2f} x{prod_combo.cantidad}")
        else:
            print("   ⚠️  No se puede reparar: productos sin precios base")
    
    # Verificar reparación
    print(f"\n✅ VERIFICACIÓN POST-REPARACIÓN:")
    for combo in combos_problematicos:
        productos = combo.combopersonalizadoproducto_set.all()
        precio_recalculado = sum(p.precio_unitario * p.cantidad for p in productos if p.precio_unitario)
        
        print(f"   {combo.nombre}: ${combo.precio_total} (BD) vs ${precio_recalculado:.2f} (calculado)")
        
        # Ajustar precio total si hay diferencias menores (por redondeo)
        if abs(combo.precio_total - precio_recalculado) > 0.01:
            print(f"     🔄 Ajustando precio total: ${combo.precio_total} → ${precio_recalculado:.2f}")
            combo.precio_total = precio_recalculado
            combo.save()

def verify_repair():
    print(f"\n🧪 VERIFICACIÓN FINAL DE APIS:")
    from products.serializers import ComboPersonalizadoSerializer
    
    combos_test = ComboPersonalizado.objects.filter(
        precio_total__gt=0, 
        is_paid=True
    )[:5]
    
    for combo in combos_test:
        try:
            serializer = ComboPersonalizadoSerializer(combo)
            data = serializer.data
            
            productos_api = data.get('productos_detalle', [])
            if productos_api:
                precio_api = float(data.get('precio_total', 0))
                suma_productos = sum(p.get('precio', 0) * p.get('cantidad', 1) for p in productos_api)
                
                print(f"   Combo '{combo.nombre}' (ID {combo.id}):")
                print(f"     API total: ${precio_api}")
                print(f"     Suma productos: ${suma_productos:.2f}")
                
                if abs(precio_api - suma_productos) < 0.1:
                    print(f"     ✅ Consistente")
                else:
                    print(f"     ❌ Inconsistente (diff: ${abs(precio_api - suma_productos):.2f})")
            else:
                print(f"   Combo '{combo.nombre}': Sin productos en API")
                
        except Exception as e:
            print(f"   ⚠️ Error con combo {combo.id}: {e}")

if __name__ == '__main__':
    repair_old_combos()
    verify_repair()