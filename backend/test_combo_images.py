#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import ComboPersonalizado
from products.serializers import ComboPersonalizadoSerializer

def test_combo_images():
    print("🖼️ === VERIFICACIÓN DE IMÁGENES EN COMBOS PERSONALIZADOS ===\n")
    
    # Obtener usuario con combos
    try:
        users_with_combos = User.objects.filter(combos_personalizados__publicado=True).distinct()
        if not users_with_combos.exists():
            print("❌ No hay usuarios con combos personalizados publicados")
            return
        
        user = users_with_combos.first()
        print(f"👤 Usuario: {user.username}")
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Obtener combos personalizados publicados
    combos = ComboPersonalizado.objects.filter(usuario=user, publicado=True)
    print(f"🍔 Combos personalizados publicados: {combos.count()}\n")
    
    for combo in combos:
        print(f"📦 Combo: {combo.nombre}")
        print(f"   Precio: ${combo.precio_total}")
        
        # Serializar el combo
        serializer = ComboPersonalizadoSerializer(combo)
        data = serializer.data
        
        productos_detalle = data.get('productos_detalle', [])
        print(f"   Productos incluidos: {len(productos_detalle)}")
        
        for i, producto in enumerate(productos_detalle, 1):
            print(f"   {i}. {producto['nombre']} x{producto['cantidad']}")
            print(f"      imagen: {producto.get('imagen', 'Sin imagen')}")
            print(f"      categoria: {producto.get('categoria', 'Sin categoría')}")
            
            # Simular lógica del frontend
            if producto.get('imagen'):
                imagen_final = f"absolutizeMediaUrl({producto['imagen']})"
            else:
                categoria = producto.get('categoria', '')
                imagen_final = f"getCategoryImage('{categoria}')"
            
            print(f"      🖼️  Frontend mostrará: {imagen_final}")
        
        print("-" * 60)

if __name__ == "__main__":
    test_combo_images()