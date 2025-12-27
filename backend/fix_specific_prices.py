"""
Script para corregir precios específicos basándose en las imágenes del usuario
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto
from decimal import Decimal

def fix_specific_combo_prices():
    print("🎯 CORRIGIENDO PRECIOS ESPECÍFICOS SEGÚN IMÁGENES DEL USUARIO")
    print("=" * 60)
    
    # Según las imágenes del usuario, el combo "Uy" debería costar $672.800
    # pero aparece como $72.512,4 en el perfil
    
    try:
        combo_uy = ComboPersonalizado.objects.filter(nombre="Uy").first()
        if combo_uy:
            print(f"\n📦 Combo encontrado: {combo_uy.nombre}")
            print(f"   Precio actual: ${combo_uy.precio_total}")
            print(f"   Precio esperado (según imagen): $672.800")
            
            # El precio correcto según la imagen es $672.800 (formato colombiano)
            # En formato decimal esto sería $672800.00
            precio_correcto = Decimal('672800.00')
            
            # Actualizar precio del combo
            combo_uy.precio_total = precio_correcto
            combo_uy.save()
            
            print(f"   ✅ Precio actualizado a: ${combo_uy.precio_total}")
            
            # Ahora actualizar los precios unitarios de los productos proporcionalmente
            productos = combo_uy.combopersonalizadoproducto_set.all()
            precio_actual_productos = sum(p.precio_unitario * p.cantidad for p in productos)
            
            if precio_actual_productos > 0:
                factor = precio_correcto / precio_actual_productos
                print(f"   Factor de ajuste: {factor:.4f}")
                
                for prod_combo in productos:
                    precio_anterior = prod_combo.precio_unitario
                    precio_nuevo = precio_anterior * factor
                    
                    prod_combo.precio_unitario = precio_nuevo
                    prod_combo.precio_al_agregar = precio_nuevo
                    prod_combo.save()
                    
                    print(f"     - {prod_combo.producto.nombre}: ${precio_anterior:.2f} → ${precio_nuevo:.2f}")
            
        else:
            print("❌ Combo 'Uy' no encontrado")
    
    except Exception as e:
        print(f"❌ Error procesando combo 'Uy': {e}")
    
    # También verificar otros combos que puedan tener el mismo problema
    print(f"\n🔍 VERIFICANDO OTROS COMBOS CON PRECIOS SOSPECHOSAMENTE ALTOS:")
    
    combos_altos = ComboPersonalizado.objects.filter(precio_total__gte=50000)
    for combo in combos_altos:
        print(f"   {combo.nombre}: ${combo.precio_total}")
        
        # Si es mayor a 50.000, podría ser un error de formato
        # Dividir por 10 para ver si tiene más sentido
        if combo.precio_total >= 50000:
            precio_ajustado = combo.precio_total / 10
            print(f"     Posible precio ajustado: ${precio_ajustado}")
            
            # Solo ajustar automáticamente si es obvio que está mal
            # (no tocar el combo "Uy" que ya corregimos manualmente)
            if combo.nombre != "Uy" and combo.precio_total > 60000:
                respuesta = input(f"   ¿Ajustar {combo.nombre} de ${combo.precio_total} a ${precio_ajustado}? (y/n): ")
                if respuesta.lower() == 'y':
                    # Actualizar combo y productos proporcionalmente
                    factor_ajuste = precio_ajustado / combo.precio_total
                    
                    combo.precio_total = precio_ajustado
                    combo.save()
                    
                    productos = combo.combopersonalizadoproducto_set.all()
                    for prod in productos:
                        prod.precio_unitario = prod.precio_unitario * factor_ajuste
                        prod.precio_al_agregar = prod.precio_al_agregar * factor_ajuste if prod.precio_al_agregar else None
                        prod.save()
                    
                    print(f"     ✅ {combo.nombre} ajustado a ${precio_ajustado}")

def test_api_after_fix():
    print(f"\n🧪 PROBANDO API DESPUÉS DE CORRECCIONES:")
    
    from products.serializers import ComboPersonalizadoSerializer
    
    combo_uy = ComboPersonalizado.objects.filter(nombre="Uy").first()
    if combo_uy:
        try:
            serializer = ComboPersonalizadoSerializer(combo_uy)
            data = serializer.data
            
            print(f"   Combo 'Uy' en API:")
            print(f"     Precio total: ${data.get('precio_total')}")
            
            productos = data.get('productos_detalle', [])
            suma_productos = sum(p.get('precio', 0) * p.get('cantidad', 1) for p in productos)
            print(f"     Suma productos: ${suma_productos:.2f}")
            
            if abs(float(data.get('precio_total', 0)) - suma_productos) < 1:
                print(f"     ✅ API consistente")
            else:
                print(f"     ❌ API inconsistente")
                
            # Mostrar algunos productos como ejemplo
            print(f"     Ejemplos de productos:")
            for prod in productos[:5]:
                print(f"       - {prod.get('nombre')}: ${prod.get('precio'):.2f} x{prod.get('cantidad')}")
            
        except Exception as e:
            print(f"     ❌ Error en API: {e}")

if __name__ == '__main__':
    fix_specific_combo_prices()
    test_api_after_fix()