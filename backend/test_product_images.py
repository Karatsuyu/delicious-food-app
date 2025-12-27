#!/usr/bin/env python3

import os
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import Producto, ProductoPersonalizado

def create_test_product_with_images():
    print("🖼️ === CREANDO PRODUCTO DE PRUEBA CON IMÁGENES ===\n")
    
    # Obtener usuarios
    karatsuyu = User.objects.get(username='Karatsuyu1')
    base_product = Producto.objects.first()
    
    if not base_product:
        print("❌ No hay productos base disponibles")
        return
    
    print(f"👤 Usuario: {karatsuyu.username}")
    print(f"📦 Producto base: {base_product.nombre}")
    
    # Crear producto personalizado con datos de imagen completos
    producto = ProductoPersonalizado.objects.create(
        usuario=karatsuyu,
        nombre_personalizado="Hamburguesa Delux Especial",
        producto_base=base_product,
        precio_total=Decimal('35.00'),
        publicado=True,
        # Datos de imagen local (simulando lo que viene del frontend)
        local_product_id=str(base_product.id),
        local_product_name=base_product.nombre,
        local_product_image="../assets/hamburguesa.png"  # Imagen que debería mostrarse
    )
    
    print(f"✅ Producto creado: {producto.nombre_personalizado}")
    print(f"   ID: {producto.id}")
    print(f"   local_product_image: {producto.local_product_image}")
    print(f"   local_product_name: {producto.local_product_name}")
    
    return producto

def test_serialization(producto):
    print(f"\n📤 === PROBANDO SERIALIZACIÓN ===")
    
    from products.serializers import ProductoPersonalizadoSerializer
    serializer = ProductoPersonalizadoSerializer(producto)
    data = serializer.data
    
    print(f"🔍 Datos que recibirá el frontend:")
    print(f"   nombre_personalizado: {data['nombre_personalizado']}")
    print(f"   local_product_image: {data.get('local_product_image')}")
    print(f"   local_product_name: {data.get('local_product_name')}")
    
    if data.get('producto_base_detalle'):
        print(f"   producto_base_detalle.nombre: {data['producto_base_detalle']['nombre']}")
        print(f"   producto_base_detalle.imagen: {data['producto_base_detalle'].get('imagen', 'No tiene')}")
    
    # Simular la lógica del frontend
    imagen_final = (
        data.get('local_product_image') or 
        (data.get('producto_base_detalle', {}).get('imagen') if data.get('producto_base_detalle') else None) or
        "Imagen por categoría"
    )
    
    print(f"\n✅ Imagen que debería mostrarse: {imagen_final}")
    
    return data

if __name__ == "__main__":
    producto = create_test_product_with_images()
    test_serialization(producto)