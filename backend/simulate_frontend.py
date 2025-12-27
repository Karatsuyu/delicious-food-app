#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import ProductoPersonalizado
from products.serializers import ProductoPersonalizadoSerializer

def simulate_frontend_display():
    print("🖼️ === SIMULACIÓN DE VISUALIZACIÓN EN FRONTEND ===\n")
    
    # Obtener usuario Karatsuyu1
    karatsuyu = User.objects.get(username='Karatsuyu1')
    productos = ProductoPersonalizado.objects.filter(usuario=karatsuyu, publicado=True)
    
    print(f"👤 Perfil público de: {karatsuyu.username}")
    print(f"📦 Productos personalizados publicados: {productos.count()}\n")
    
    for producto in productos:
        # Serializar como lo hace el API
        serializer = ProductoPersonalizadoSerializer(producto)
        data = serializer.data
        
        print(f"🍔 {data['nombre_personalizado']}")
        print(f"   💰 Precio: ${data['precio_total']}")
        
        # Simular la lógica del frontend actualizada
        imagen_a_mostrar = (
            data.get('local_product_image') or 
            (data.get('producto_base_detalle', {}).get('imagen') if data.get('producto_base_detalle') else None) or
            "getCategoryImage(categoria)" # Fallback
        )
        
        nombre_a_mostrar = (
            data.get('local_product_name') or
            (data.get('producto_base_detalle', {}).get('nombre') if data.get('producto_base_detalle') else None) or
            "Producto base"
        )
        
        print(f"   🖼️  Imagen: {imagen_a_mostrar}")
        print(f"   📋 Basado en: {nombre_a_mostrar}")
        print(f"   🛒 Veces comprado: {data['veces_comprado']}")
        print("-" * 50)
    
    print(f"\n✅ RESULTADO: Todos los productos ahora deberían mostrar las imágenes correctas")
    print(f"   - Las imágenes de hamburguesas mostrarán: ../assets/hamburguesa.png")
    print(f"   - Las imágenes de pizzas mostrarán: ../assets/pizza1.png")
    print(f"   - Etc...")

if __name__ == "__main__":
    simulate_frontend_display()