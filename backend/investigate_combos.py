"""
Script para investigar y reparar el problema de combos sin productos
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto
from orders.models import Pedido, PedidoItem
from users.models import User

def investigate_combo_products():
    print("=== INVESTIGACIÓN DE COMBOS SIN PRODUCTOS ===\n")
    
    # 1. Verificar el estado de todos los combos
    print("1. ESTADO DE TODOS LOS COMBOS:")
    all_combos = ComboPersonalizado.objects.all()
    for combo in all_combos:
        productos_count = ComboPersonalizadoProducto.objects.filter(combo=combo).count()
        print(f"   Combo ID {combo.id} '{combo.nombre}': {productos_count} productos asociados")
        print(f"      Pagado: {combo.is_paid}, Precio: ${combo.precio_total}")
        if combo.stripe_session_id:
            print(f"      Stripe Session: {combo.stripe_session_id}")
    
    # 2. Verificar pedidos para entender el flujo
    print("\n\n2. PEDIDOS RELACIONADOS CON COMBOS:")
    pedidos = Pedido.objects.all()[:5]
    for pedido in pedidos:
        print(f"   Pedido ID {pedido.id}: {pedido.total}")
        items = PedidoItem.objects.filter(pedido=pedido)
        for item in items:
            if hasattr(item, 'combo_personalizado') and item.combo_personalizado:
                print(f"      - Combo: {item.combo_personalizado.nombre}")
            else:
                print(f"      - Item: {item.producto.nombre if item.producto else 'Producto desconocido'}")
    
    # 3. Verificar si hay algún ComboPersonalizadoProducto huérfano
    print("\n\n3. PRODUCTOS DE COMBOS HUÉRFANOS:")
    productos_huerfanos = ComboPersonalizadoProducto.objects.filter(combo__isnull=True)
    print(f"   Productos sin combo: {productos_huerfanos.count()}")
    
    # 4. Verificar todos los ComboPersonalizadoProducto
    print("\n\n4. TODOS LOS PRODUCTOS DE COMBOS:")
    todos_productos_combo = ComboPersonalizadoProducto.objects.all()
    print(f"   Total productos de combos en BD: {todos_productos_combo.count()}")
    
    for prod in todos_productos_combo:
        combo_id = prod.combo.id if prod.combo else "NULL"
        print(f"     - Producto: {prod.producto.nombre}, Combo: {combo_id}, Cantidad: {prod.cantidad}")
        if hasattr(prod, 'precio_al_agregar'):
            print(f"       Precio al agregar: {prod.precio_al_agregar}")

def create_test_combo_with_products():
    """Crear un combo de prueba para verificar que el sistema funciona"""
    print("\n\n=== CREANDO COMBO DE PRUEBA ===")
    
    try:
        user = User.objects.first()
        if not user:
            print("❌ No hay usuarios en el sistema")
            return
            
        # Crear combo
        combo = ComboPersonalizado.objects.create(
            usuario=user,
            nombre="Combo de Prueba Sistema",
            precio_total=25000,
            is_paid=True
        )
        print(f"✅ Combo creado: ID {combo.id}")
        
        # Agregar productos
        productos = Producto.objects.all()[:3]  # Primeros 3 productos
        for i, producto in enumerate(productos, 1):
            combo_producto = ComboPersonalizadoProducto.objects.create(
                combo=combo,
                producto=producto,
                cantidad=i,
                precio_al_agregar=producto.precio  # Usar el nuevo campo
            )
            print(f"✅ Producto agregado: {producto.nombre} x{i} - ${combo_producto.precio_al_agregar}")
        
        # Verificar la serialización
        from products.serializers import ComboPersonalizadoSerializer
        serializer = ComboPersonalizadoSerializer(combo)
        data = serializer.data
        
        print(f"\n📊 RESULTADO DE LA SERIALIZACIÓN:")
        print(f"   Nombre: {data.get('nombre')}")
        print(f"   Precio: ${data.get('precio_total')}")
        print(f"   Productos en API:")
        
        if 'productos_detalle' in data:
            for prod in data['productos_detalle']:
                print(f"     - {prod.get('nombre')}: ${prod.get('precio')} x{prod.get('cantidad')}")
        
        return combo
        
    except Exception as e:
        print(f"❌ Error creando combo de prueba: {e}")
        return None

if __name__ == '__main__':
    investigate_combo_products()
    create_test_combo_with_products()