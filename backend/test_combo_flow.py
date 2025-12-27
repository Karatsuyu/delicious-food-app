"""
Crear un combo de prueba pequeño para verificar el flujo completo
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
from products.serializers import ComboPersonalizadoSerializer
from decimal import Decimal

def create_test_combo():
    print("🧪 CREANDO COMBO DE PRUEBA PARA VERIFICAR FLUJO COMPLETO")
    print("=" * 60)
    
    try:
        # Obtener usuario y productos
        user = User.objects.first()
        hamburguesa = Producto.objects.filter(nombre__icontains="Hamburguesa Clásica").first()
        pizza = Producto.objects.filter(nombre__icontains="Pizza Pepperoni").first()
        
        if not all([user, hamburguesa, pizza]):
            print("❌ No se encontraron usuario o productos necesarios")
            return
        
        # Simular creación de combo (como lo haría el frontend)
        print(f"🛠️  Simulando proceso de creación de combo:")
        print(f"   Usuario: {user.email}")
        print(f"   Producto 1: {hamburguesa.nombre} - ${hamburguesa.precio}")
        print(f"   Producto 2: {pizza.nombre} - ${pizza.precio}")
        
        # Calcular precio total (como lo hace el frontend)
        precio_calculado = hamburguesa.precio * 2 + pizza.precio * 1
        print(f"   Precio calculado: ${precio_calculado}")
        
        # Crear combo
        combo = ComboPersonalizado.objects.create(
            usuario=user,
            nombre="🧪 Combo Prueba Precios",
            precio_total=precio_calculado,
            is_paid=True,
            publicado=True
        )
        print(f"   ✅ Combo creado: ID {combo.id}")
        
        # Crear productos del combo
        ComboPersonalizadoProducto.objects.create(
            combo=combo,
            producto=hamburguesa,
            cantidad=2,
            precio_unitario=hamburguesa.precio,
            precio_al_agregar=hamburguesa.precio,
            imagen_seleccionada="hamburguesa1.png"
        )
        
        ComboPersonalizadoProducto.objects.create(
            combo=combo,
            producto=pizza,
            cantidad=1,
            precio_unitario=pizza.precio,
            precio_al_agregar=pizza.precio,
            imagen_seleccionada="pizza1.png"
        )
        
        print(f"   ✅ Productos agregados al combo")
        
        # Verificar serialización
        print(f"\n🔍 VERIFICANDO SERIALIZACIÓN:")
        serializer = ComboPersonalizadoSerializer(combo)
        data = serializer.data
        
        print(f"   Precio en BD: ${combo.precio_total}")
        print(f"   Precio en API: ${data.get('precio_total')}")
        
        productos_api = data.get('productos_detalle', [])
        suma_productos = sum(p.get('precio', 0) * p.get('cantidad', 1) for p in productos_api)
        print(f"   Suma productos API: ${suma_productos}")
        
        print(f"\n📊 PRODUCTOS EN API:")
        for prod in productos_api:
            precio_compra = prod.get('precio', 0)
            precio_actual = prod.get('precio_actual', 0)
            print(f"     - {prod.get('nombre')}: ${precio_compra} (actual: ${precio_actual}) x{prod.get('cantidad')}")
        
        # Verificar consistencia
        if abs(float(data.get('precio_total', 0)) - suma_productos) < 0.01:
            print(f"\n   ✅ ÉXITO: Precios consistentes en todas las etapas")
        else:
            print(f"\n   ❌ ERROR: Inconsistencia de precios")
        
        print(f"\n🎯 RESUMEN:")
        print(f"   - Precio de creación: ${precio_calculado}")
        print(f"   - Precio en BD: ${combo.precio_total}")
        print(f"   - Precio en API: ${data.get('precio_total')}")
        print(f"   - En frontend se mostrará como: ${int(float(data.get('precio_total', 0)))}")
        print(f"     (con formato colombiano será similar a: $27.900)")
        
        return combo
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == '__main__':
    create_test_combo()