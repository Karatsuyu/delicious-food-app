#!/usr/bin/env python3

import os
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import Producto, ProductoPersonalizado, ComboPersonalizado, ComboPersonalizadoProducto
from orders.models import Pedido, PedidoItem

def test_complete_points_system():
    print("🎯 === TEST COMPLETO DEL SISTEMA DE PUNTOS ===\n")
    
    # Usuarios para el test
    try:
        karatsuyu = User.objects.get(username='Karatsuyu1')  # Creador
        comprador = User.objects.get(username='demo_reviews')  # Comprador
        admin_user = User.objects.get(username='admin')  # Usuario adicional
    except User.DoesNotExist as e:
        print(f"❌ Error: Usuario no encontrado - {e}")
        return False
    
    print(f"👤 Creador: {karatsuyu.username} (Puntos: {karatsuyu.points})")
    print(f"🛒 Comprador: {comprador.username} (Puntos: {comprador.points})")
    print(f"👨‍💼 Admin: {admin_user.username} (Puntos: {admin_user.points})")
    
    # Crear productos y combos de prueba
    producto_test = create_test_product(karatsuyu)
    combo_test = create_test_combo(karatsuyu)
    
    print(f"\n📦 Creados para test:")
    print(f"   - Producto: {producto_test.nombre_personalizado} (${producto_test.precio_total})")
    print(f"   - Combo: {combo_test.nombre} (${combo_test.precio_total})")
    
    # Puntos iniciales
    karatsuyu_initial = karatsuyu.points
    comprador_initial = comprador.points
    
    print(f"\n💰 Puntos iniciales:")
    print(f"   - Creador: {karatsuyu_initial}")
    print(f"   - Comprador: {comprador_initial}")
    
    # TEST 1: Compra de producto personalizado
    print(f"\n🛍️ TEST 1: Comprando producto personalizado...")
    pedido1 = create_order_with_custom_product(comprador, producto_test)
    
    # Recargar usuarios
    karatsuyu.refresh_from_db()
    comprador.refresh_from_db()
    
    print(f"✅ Pedido creado: #{pedido1.id}")
    print(f"   Creador: {karatsuyu_initial} → {karatsuyu.points} puntos (+{karatsuyu.points - karatsuyu_initial})")
    print(f"   Comprador: {comprador_initial} → {comprador.points} puntos (+{comprador.points - comprador_initial})")
    
    # Actualizar valores para el siguiente test
    karatsuyu_after_test1 = karatsuyu.points
    comprador_after_test1 = comprador.points
    
    # TEST 2: Compra de combo personalizado
    print(f"\n🛍️ TEST 2: Comprando combo personalizado...")
    pedido2 = create_order_with_custom_combo(comprador, combo_test)
    
    # Recargar usuarios
    karatsuyu.refresh_from_db()
    comprador.refresh_from_db()
    
    print(f"✅ Pedido creado: #{pedido2.id}")
    print(f"   Creador: {karatsuyu_after_test1} → {karatsuyu.points} puntos (+{karatsuyu.points - karatsuyu_after_test1})")
    print(f"   Comprador: {comprador_after_test1} → {comprador.points} puntos (+{comprador.points - comprador_after_test1})")
    
    # RESUMEN FINAL
    print(f"\n📊 === RESUMEN FINAL ===")
    
    total_creator_gained = karatsuyu.points - karatsuyu_initial
    total_buyer_gained = comprador.points - comprador_initial
    
    print(f"🎯 PUNTOS GANADOS POR CREADOR: {total_creator_gained}")
    expected_creator = int(producto_test.precio_total * Decimal('0.1')) + int(combo_test.precio_total * Decimal('0.1'))
    print(f"   Esperado: {expected_creator} (10% de ${producto_test.precio_total} + 10% de ${combo_test.precio_total})")
    print(f"   Estado: {'✅ CORRECTO' if total_creator_gained == expected_creator else '❌ INCORRECTO'}")
    
    print(f"\n🛒 BONIFICACIÓN DE COMPRADOR: {total_buyer_gained}")
    expected_buyer = 10 + 10  # 10 por producto + 10 por combo
    print(f"   Esperado: {expected_buyer} (10 + 10 puntos de bonificación)")
    print(f"   Estado: {'✅ CORRECTO' if total_buyer_gained == expected_buyer else '❌ INCORRECTO'}")
    
    # Validar contadores de veces comprado
    producto_test.refresh_from_db()
    combo_test.refresh_from_db()
    
    print(f"\n📈 CONTADORES DE VENTA:")
    print(f"   Producto '{producto_test.nombre_personalizado}': {producto_test.veces_comprado} veces")
    print(f"   Combo '{combo_test.nombre}': {combo_test.veces_comprado} veces")
    
    return True

def create_test_product(creator):
    """Crear producto personalizado de prueba"""
    # Buscar si ya existe
    existing = ProductoPersonalizado.objects.filter(
        usuario=creator, 
        nombre_personalizado="Test Producto Puntos"
    ).first()
    
    if existing:
        return existing
    
    base_product = Producto.objects.first()
    if not base_product:
        print("❌ No hay productos base")
        return None
    
    return ProductoPersonalizado.objects.create(
        nombre_personalizado="Test Producto Puntos",
        producto_base=base_product,
        usuario=creator,
        precio_total=Decimal('30.00'),
        publicado=True,
    )

def create_test_combo(creator):
    """Crear combo personalizado de prueba"""
    # Buscar si ya existe
    existing = ComboPersonalizado.objects.filter(
        usuario=creator,
        nombre="Test Combo Puntos"
    ).first()
    
    if existing:
        return existing
    
    # Crear combo
    combo = ComboPersonalizado.objects.create(
        usuario=creator,
        nombre="Test Combo Puntos",
        precio_total=Decimal('50.00'),
        publicado=True,
        is_paid=True
    )
    
    # Agregar productos al combo
    productos = Producto.objects.all()[:2]
    for i, producto in enumerate(productos):
        ComboPersonalizadoProducto.objects.create(
            combo=combo,
            producto=producto,
            cantidad=1,
            precio_unitario=Decimal('15.00') + (i * 5)
        )
    
    return combo

def create_order_with_custom_product(buyer, custom_product):
    """Crear pedido con producto personalizado"""
    pedido = Pedido.objects.create(
        usuario=buyer,
        total=custom_product.precio_total,
        direccion="Test Address",
        telefono_contacto="123456789",
        metodo_pago="test"
    )
    
    PedidoItem.objects.create(
        pedido=pedido,
        producto_personalizado=custom_product,
        cantidad=1,
        precio_unitario=custom_product.precio_total
    )
    
    return pedido

def create_order_with_custom_combo(buyer, custom_combo):
    """Crear pedido con combo personalizado"""
    pedido = Pedido.objects.create(
        usuario=buyer,
        total=custom_combo.precio_total,
        direccion="Test Address",
        telefono_contacto="123456789",
        metodo_pago="test"
    )
    
    PedidoItem.objects.create(
        pedido=pedido,
        combo_personalizado=custom_combo,
        cantidad=1,
        precio_unitario=custom_combo.precio_total
    )
    
    return pedido

if __name__ == "__main__":
    test_complete_points_system()