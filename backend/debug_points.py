#!/usr/bin/env python3

import os
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import ProductoPersonalizado
from orders.models import Pedido, PedidoItem

def manual_points_test():
    print("🔧 === TEST MANUAL DE PUNTOS ===\n")
    
    # Obtener usuarios y producto
    karatsuyu = User.objects.get(username='Karatsuyu1')
    comprador = User.objects.get(username='demo_reviews')
    producto = ProductoPersonalizado.objects.filter(usuario=karatsuyu, publicado=True).first()
    
    print(f"👤 Creador: {karatsuyu.username} (Puntos: {karatsuyu.points})")
    print(f"🛒 Comprador: {comprador.username}")
    print(f"📦 Producto: {producto.nombre_personalizado} (${producto.precio_total})")
    
    # Crear pedido manualmente paso a paso
    print("\n📋 Creando pedido paso a paso...")
    
    # Paso 1: Crear el pedido
    pedido = Pedido(
        usuario=comprador,
        total=producto.precio_total,
        direccion="Test Address",
        telefono_contacto="123456789",
        metodo_pago="test"
    )
    
    print(f"1. Pedido creado en memoria (ID: {pedido.id})")
    print(f"   Puntos asignados: {getattr(pedido, 'puntos_asignados', 'No definido')}")
    
    # Paso 2: Guardar pedido (debería activar lógica de puntos)
    print("2. Guardando pedido...")
    pedido.save()
    
    print(f"   Pedido guardado (ID: {pedido.id})")
    print(f"   Puntos asignados: {pedido.puntos_asignados}")
    
    # Paso 3: Crear item del pedido
    print("3. Creando item del pedido...")
    item = PedidoItem.objects.create(
        pedido=pedido,
        producto_personalizado=producto,
        cantidad=1,
        precio_unitario=producto.precio_total
    )
    print(f"   Item creado: {item}")
    
    # Paso 4: Llamar manualmente assign_points_to_creators
    print("4. Llamando manualmente assign_points_to_creators...")
    karatsuyu_before = karatsuyu.points
    
    try:
        pedido.assign_points_to_creators()
        print("   Método ejecutado sin errores")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Recargar usuario
    karatsuyu.refresh_from_db()
    pedido.refresh_from_db()
    
    print(f"\n📊 RESULTADOS:")
    print(f"   Puntos antes: {karatsuyu_before}")
    print(f"   Puntos después: {karatsuyu.points}")
    print(f"   Puntos ganados: {karatsuyu.points - karatsuyu_before}")
    print(f"   Puntos asignados (flag): {pedido.puntos_asignados}")
    
    # Calcular esperado
    expected = int(producto.precio_total * Decimal('0.1'))
    print(f"   Esperado: {expected} puntos")
    
    return pedido

def test_existing_orders():
    print("\n🔄 === PROCESANDO ÓRDENES EXISTENTES ===\n")
    
    # Buscar órdenes con productos personalizados que no tengan puntos asignados
    orders_with_custom = Pedido.objects.filter(
        items__producto_personalizado__isnull=False,
        puntos_asignados=False
    ).distinct()
    
    print(f"📊 Órdenes encontradas sin puntos procesados: {orders_with_custom.count()}")
    
    for order in orders_with_custom:
        print(f"\n🛒 Procesando pedido #{order.id}")
        
        for item in order.items.filter(producto_personalizado__isnull=False):
            creator = item.producto_personalizado.usuario
            before_points = creator.points
            
            print(f"   📦 {item.producto_personalizado.nombre_personalizado}")
            print(f"   👤 Creador: {creator.username} (Puntos: {before_points})")
            
            # Procesar puntos manualmente
            order.assign_points_to_creators()
            
            creator.refresh_from_db()
            print(f"   💰 Puntos después: {creator.points} (+{creator.points - before_points})")

if __name__ == "__main__":
    pedido = manual_points_test()
    test_existing_orders()