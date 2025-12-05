"""
Script de prueba para verificar el sistema de combos personalizados
con precios históricos después de la migración
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto
from users.models import User

def test_combos_system():
    print("=== TESTING COMBO PERSONALIZATION SYSTEM ===\n")
    
    # 1. Verificar combos existentes pagados
    print("1. COMBOS PAGADOS EXISTENTES:")
    combos_pagados = ComboPersonalizado.objects.filter(is_paid=True)
    print(f"   Total combos pagados: {combos_pagados.count()}")
    
    for combo in combos_pagados[:3]:  # Mostrar solo los primeros 3
        print(f"\n   Combo ID: {combo.id}")
        print(f"   Nombre: {combo.nombre}")
        print(f"   Precio Total: ${combo.precio_total}")
        print(f"   Pagado en: {combo.paid_at}")
        print(f"   Productos:")
        
        productos = ComboPersonalizadoProducto.objects.filter(combo=combo)
        for prod in productos:
            precio_mostrar = prod.precio_al_agregar if prod.precio_al_agregar else "No guardado"
            print(f"     - {prod.producto.nombre} x{prod.cantidad}")
            print(f"       Precio al agregar: {precio_mostrar}")
            print(f"       Precio actual: ${prod.producto.precio}")
            if prod.imagen_seleccionada:
                print(f"       Imagen seleccionada: {prod.imagen_seleccionada}")
    
    # 2. Verificar productos disponibles para crear un combo de prueba
    print("\n\n2. PRODUCTOS DISPONIBLES:")
    productos = Producto.objects.all()[:5]
    for prod in productos:
        print(f"   - {prod.nombre}: ${prod.precio}")
    
    # 3. Simular creación de un combo nuevo (sin crearlo realmente)
    print("\n\n3. SIMULACIÓN DE NUEVO COMBO:")
    user = User.objects.first()
    if user and productos:
        producto_test = productos[0]
        print(f"   Usuario: {user.username}")
        print(f"   Producto de prueba: {producto_test.nombre}")
        print(f"   Precio actual del producto: ${producto_test.precio}")
        print(f"   Al crear el combo, se guardaría precio_al_agregar = ${producto_test.precio}")
    
    # 4. Verificar serialización
    print("\n\n4. TESTING SERIALIZATION:")
    from products.serializers import ComboPersonalizadoSerializer
    
    combo_test = combos_pagados.first()
    if combo_test:
        serializer = ComboPersonalizadoSerializer(combo_test)
        data = serializer.data
        
        print(f"   Combo serializado: {combo_test.nombre}")
        print(f"   Precio total en API: ${data.get('precio_total', 'N/A')}")
        
        if 'productos_detalle' in data:
            print("   Productos en API:")
            for prod in data['productos_detalle']:
                precio_api = prod.get('precio', 'N/A')
                print(f"     - {prod.get('nombre', 'N/A')}: ${precio_api}")
        else:
            print("   ⚠️  productos_detalle no encontrado en serialización")

if __name__ == '__main__':
    test_combos_system()