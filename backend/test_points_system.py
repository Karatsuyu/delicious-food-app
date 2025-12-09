#!/usr/bin/env python3

import os
import django
import json
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import Producto, ProductoPersonalizado, ComboPersonalizado
from orders.models import Pedido, PedidoItem
from django.contrib.auth import authenticate

def test_points_system():
    print("🎯 === VALIDACIÓN SISTEMA DE PUNTOS ===\n")
    
    # Obtener usuarios
    try:
        karatsuyu = User.objects.get(username='Karatsuyu1')  # El creador
        comprador = User.objects.get(username='demo_reviews')  # El comprador
    except User.DoesNotExist as e:
        print(f"❌ Error: Usuario no encontrado - {e}")
        return False
    
    print(f"👤 Creador: {karatsuyu.username} ({karatsuyu.email})")
    print(f"🛒 Comprador: {comprador.username} ({comprador.email})")
    print(f"💰 Puntos iniciales del creador: {karatsuyu.points}")
    print(f"💰 Puntos iniciales del comprador: {comprador.points}\n")
    
    # Verificar productos personalizados del creador
    custom_products = ProductoPersonalizado.objects.filter(usuario=karatsuyu, publicado=True)
    print(f"📦 Productos personalizados públicos de {karatsuyu.username}: {custom_products.count()}")
    
    if not custom_products.exists():
        print("⚠️  No hay productos personalizados públicos. Creando uno...")
        create_test_custom_product(karatsuyu)
        custom_products = ProductoPersonalizado.objects.filter(usuario=karatsuyu, publicado=True)
    
    for product in custom_products[:3]:  # Mostrar solo los primeros 3
        print(f"   - {product.nombre_personalizado} (${product.precio_total})")
    
    print(f"\n🛍️ Simulando compra de producto personalizado...\n")
    
    # Simular compra
    if custom_products.exists():
        test_product = custom_products.first()
        initial_creator_points = karatsuyu.points
        initial_buyer_points = comprador.points
        
        # Crear orden de prueba
        order = create_test_order(comprador, test_product)
        
        if order:
            # Recargar usuarios para ver puntos actualizados
            karatsuyu.refresh_from_db()
            comprador.refresh_from_db()
            
            print(f"✅ Orden creada: #{order.id}")
            print(f"💰 Puntos del creador ANTES: {initial_creator_points}")
            print(f"💰 Puntos del creador DESPUÉS: {karatsuyu.points}")
            print(f"📈 Puntos ganados por el creador: {karatsuyu.points - initial_creator_points}")
            print(f"💰 Puntos del comprador ANTES: {initial_buyer_points}")  
            print(f"💰 Puntos del comprador DESPUÉS: {comprador.points}")
            
            # Verificar cálculo de puntos
            expected_points = int(test_product.precio_total * Decimal('0.1'))  # 10% del precio
            actual_points_gained = karatsuyu.points - initial_creator_points
            
            print(f"\n🧮 Cálculo esperado: ${test_product.precio_total} * 10% = {expected_points} puntos")
            print(f"🎯 Puntos realmente ganados: {actual_points_gained}")
            
            if actual_points_gained == expected_points:
                print("✅ ¡Sistema de puntos funcionando CORRECTAMENTE!")
            else:
                print("❌ ¡PROBLEMA en el sistema de puntos!")
                
        else:
            print("❌ Error al crear la orden de prueba")
    
    return True

def create_test_custom_product(user):
    """Crear un producto personalizado de prueba"""
    try:
        # Obtener un producto base
        base_product = Producto.objects.first()
        if not base_product:
            print("❌ No hay productos base disponibles")
            return None
            
        custom_product = ProductoPersonalizado.objects.create(
            nombre_personalizado="Producto Test Puntos",
            producto_base=base_product,
            usuario=user,
            precio_total=Decimal('25.00'),
            publicado=True,
        )
        print(f"✅ Producto personalizado creado: {custom_product.nombre_personalizado}")
        return custom_product
    except Exception as e:
        print(f"❌ Error creando producto: {e}")
        return None

def create_test_order(buyer, custom_product):
    """Crear una orden de prueba"""
    try:
        # Crear la orden
        order = Pedido.objects.create(
            usuario=buyer,
            total=custom_product.precio_total,
            direccion="Dirección de prueba",
            telefono_contacto="123456789",
            metodo_pago='test'
        )
        
        # Crear el item de la orden
        PedidoItem.objects.create(
            pedido=order,
            producto_personalizado=custom_product,
            cantidad=1,
            precio_unitario=custom_product.precio_total
        )
        
        print(f"✅ Orden de prueba creada: #{order.id}")
        return order
        
    except Exception as e:
        print(f"❌ Error creando orden: {e}")
        return None

def check_points_logic():
    """Verificar la lógica de asignación de puntos en el código"""
    print("\n🔍 === VERIFICACIÓN DE LÓGICA DE PUNTOS ===\n")
    
    # Verificar que el modelo Order tenga el método save personalizado
    from django.db import models
    import inspect
    
    # Buscar el archivo models.py de orders
    try:
        from orders.models import Pedido
        
        # Verificar si tiene método save personalizado
        if hasattr(Pedido, 'save'):
            print("✅ Modelo Pedido tiene método save")
            
            # Inspeccionar el código del método save
            source = inspect.getsource(Pedido.save)
            if 'points' in source.lower():
                print("✅ El método save menciona 'points'")
                print("📝 Fragmento del código:")
                lines = source.split('\n')
                for i, line in enumerate(lines):
                    if 'point' in line.lower():
                        print(f"   {i+1}: {line.strip()}")
            else:
                print("⚠️  El método save NO menciona puntos")
        else:
            print("⚠️  Modelo Pedido no tiene método save personalizado")
            
    except Exception as e:
        print(f"❌ Error verificando lógica: {e}")

def show_current_orders():
    """Mostrar órdenes actuales del sistema"""
    print("\n📊 === ÓRDENES ACTUALES ===\n")
    
    orders = Pedido.objects.all().order_by('-creado')[:10]
    
    for order in orders:
        print(f"🛒 Pedido #{order.id}")
        print(f"   Usuario: {order.usuario.username}")
        print(f"   Total: ${order.total}")
        print(f"   Estado: {order.estado}")
        print(f"   Fecha: {order.creado}")
        
        # Mostrar items
        for item in order.items.all():
            if hasattr(item, 'producto_personalizado') and item.producto_personalizado:
                creator = item.producto_personalizado.usuario
                print(f"   📦 Producto personalizado: {item.producto_personalizado.nombre_personalizado}")
                print(f"       Creador: {creator.username} (Puntos: {creator.points})")
            elif hasattr(item, 'producto') and item.producto:
                print(f"   📦 Producto regular: {item.producto.nombre}")
        print()

if __name__ == "__main__":
    test_points_system()
    check_points_logic()
    show_current_orders()