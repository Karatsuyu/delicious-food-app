#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import ProductoPersonalizado

def fix_existing_products():
    print("🔧 === ARREGLANDO PRODUCTOS EXISTENTES SIN IMÁGENES ===\n")
    
    # Obtener productos sin imagen local
    productos_sin_imagen = ProductoPersonalizado.objects.filter(
        local_product_image__isnull=True,
        publicado=True
    )
    
    print(f"📦 Productos encontrados sin imagen: {productos_sin_imagen.count()}")
    
    for producto in productos_sin_imagen:
        print(f"\n🔍 Arreglando: {producto.nombre_personalizado}")
        
        # Determinar la imagen basada en la categoría del producto base
        categoria = None
        imagen_path = "../assets/hamburguesa.png"  # Default
        
        if producto.producto_base:
            categoria = producto.producto_base.categoria
            print(f"   Categoría: {categoria}")
            
            # Mapear categoría a imagen
            if categoria:
                cat_lower = categoria.lower()
                if 'hamburguesa' in cat_lower:
                    imagen_path = "../assets/hamburguesa.png"
                elif 'pizza' in cat_lower:
                    imagen_path = "../assets/pizza1.png"
                elif 'perro' in cat_lower:
                    imagen_path = "../assets/perro.png"
                elif 'pollo' in cat_lower or 'alita' in cat_lower:
                    imagen_path = "../assets/pollo.png"
                elif 'postre' in cat_lower:
                    imagen_path = "../assets/postres1.png"
        
        # Actualizar producto
        producto.local_product_image = imagen_path
        if not producto.local_product_name and producto.producto_base:
            producto.local_product_name = producto.producto_base.nombre
        if not producto.local_product_id and producto.producto_base:
            producto.local_product_id = str(producto.producto_base.id)
        
        producto.save()
        
        print(f"   ✅ Actualizado:")
        print(f"      local_product_image: {producto.local_product_image}")
        print(f"      local_product_name: {producto.local_product_name}")
        print(f"      local_product_id: {producto.local_product_id}")

if __name__ == "__main__":
    fix_existing_products()