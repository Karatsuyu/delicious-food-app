#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import ComboPersonalizado
from products.serializers import ComboPersonalizadoSerializer

def simulate_frontend_combo_display():
    print("🎭 === SIMULACIÓN EXACTA DEL FRONTEND ===\n")
    
    # Mapeo de categorías a imágenes (como en el frontend)
    def getCategoryImage(categoria):
        if not categoria:
            return "../assets/hamburguesa.png"
        
        cat = categoria.lower()
        
        if 'hamburguesa' in cat:
            return "../assets/hamburguesa.png"
        elif 'pizza' in cat:
            return "../assets/pizza1.png"
        elif 'perro' in cat:
            return "../assets/perro.png"
        elif 'pollo' in cat or 'alita' in cat:
            return "../assets/pollo.png"
        elif 'postre' in cat:
            return "../assets/postres1.png"
        else:
            return "../assets/hamburguesa.png"
    
    def absolutizeMediaUrl(path):
        if not path:
            return None
        if path.startswith('http'):
            return path
        return f"http://127.0.0.1:8000/media/{path}"
    
    # Obtener combos publicados
    combos = ComboPersonalizado.objects.filter(publicado=True)[:3]  # Solo los primeros 3
    
    print(f"🍔 Mostrando {combos.count()} combos como aparecerían en el perfil público:\n")
    
    for combo in combos:
        print(f"📦 {combo.nombre}")
        print(f"   💰 Precio: ${combo.precio_total}")
        print(f"   👤 Creador: {combo.usuario.username}")
        
        # Serializar como lo hace el API
        serializer = ComboPersonalizadoSerializer(combo)
        data = serializer.data
        
        print(f"   📋 Incluye:")
        
        for prod in data.get('productos_detalle', []):
            # Simular la lógica exacta del frontend actualizado
            tiene_imagen = (prod.get('imagen') and 
                           prod['imagen'] != 'null' and 
                           'null' not in prod['imagen'])
            
            if tiene_imagen:
                imagen_src = absolutizeMediaUrl(prod['imagen'])
                print(f"      🖼️  {prod['nombre']} x{prod['cantidad']} - Imagen: {imagen_src}")
            else:
                imagen_src = getCategoryImage(prod.get('categoria'))
                print(f"      🖼️  {prod['nombre']} x{prod['cantidad']} - Imagen: {imagen_src} (por categoría: {prod.get('categoria', 'sin categoría')})")
        
        print(f"   🛒 Veces comprado: {combo.veces_comprado}")
        print("-" * 70)
    
    print("\n✅ Con estos cambios, las imágenes deberían mostrarse correctamente:")
    print("   - Si el producto tiene imagen real → Se usa la imagen del producto")
    print("   - Si no tiene imagen → Se usa getCategoryImage(categoria)")
    print("   - Si la imagen falla al cargar → onError fallback a getCategoryImage")

if __name__ == "__main__":
    simulate_frontend_combo_display()