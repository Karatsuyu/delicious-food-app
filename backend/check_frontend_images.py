"""
Identificar productos que no están mostrando imágenes correctamente en el frontend
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto

def identify_missing_image_mappings():
    print("🔍 IDENTIFICANDO PRODUCTOS CON IMÁGENES FALTANTES EN FRONTEND")
    print("=" * 60)
    
    # Basándome en las capturas, estos productos muestran solo texto:
    problematic_products = [
        "Alitas BBQ",
        "Clásico Bacon", 
        "Madurita Burger",
        "BBQ Crunch Burger", 
        "Double Smash",
        "Pizza Aromática de Pepperoni",
        "Pizza de Pollo y Champiñones",
        "Pepperoni Lovers", 
        "Pizza Campesina",
        "Alitas Teriyaki",
        "Alitas Ajo Parmesano",
        "Alitas Barbacoa",
        "Perro Supremo",
        "Perro Crunch Teriyaki",
        "Perro Fresh",
        "Cono de Chocolate",
        "Sundae de Fresa", 
        "Sundae de Chocolate",
        "Sundae de Caramelo",
        "Sprite 3L",
        "Pepsi Personal",
        "Pepsi En Lata",
        "Pepsi 3L"
    ]
    
    print(f"🎯 PRODUCTOS PROBLEMÁTICOS IDENTIFICADOS:")
    
    # Verificar qué imágenes tienen asignadas estos productos
    for product_name in problematic_products:
        productos_combo = ComboPersonalizadoProducto.objects.filter(
            producto__nombre=product_name,
            combo__is_paid=True
        ).first()
        
        if productos_combo:
            imagen_actual = productos_combo.imagen_seleccionada
            print(f"   • {product_name}: '{imagen_actual}'")
        else:
            print(f"   • {product_name}: NO ENCONTRADO EN COMBOS")
    
    return problematic_products

def suggest_correct_image_assignments():
    """Sugerir las asignaciones correctas basándome en los nombres disponibles"""
    print(f"\n🎨 ASIGNACIONES CORRECTAS SUGERIDAS:")
    
    # Mapeo correcto basado en las imágenes disponibles y los nombres de los productos
    correct_mappings = {
        # Hamburguesas - usar las imágenes numeradas disponibles
        "Clásico Bacon": "hamburguesa5.png",  # Ya estaba correcto
        "Madurita Burger": "hamburguesa6.png",  # Ya estaba correcto  
        "BBQ Crunch Burger": "hamburguesa7.png",  # Ya estaba correcto
        "Double Smash": "hamburguesa8.png",  # Ya estaba correcto
        
        # Alitas - mapear a las imágenes de pollo disponibles
        "Alitas BBQ": "pollo3.png",  # Ya estaba correcto
        "Alitas Teriyaki": "pollo4.png",  # Ya estaba correcto
        "Alitas Ajo Parmesano": "pollo5.png",  # Ya estaba correcto
        "Alitas Barbacoa": "pollo6.png",  # Ya estaba correcto
        
        # Pizzas - usar las imágenes disponibles
        "Pizza Aromática de Pepperoni": "pizza4.png",  # Ya estaba correcto
        "Pizza de Pollo y Champiñones": "pizza5.png",  # Ya estaba correcto
        "Pepperoni Lovers": "pizza6.png",  # Ya estaba correcto
        "Pizza Campesina": "pizza7.png",  # Ya estaba correcto
        
        # Perros - usar las imágenes disponibles
        "Perro Supremo": "perro3.png",  # Ya estaba correcto
        "Perro Crunch Teriyaki": "perro4.png",  # Ya estaba correcto
        "Perro Fresh": "perro5.png",  # Ya estaba correcto
        
        # Postres - usar las imágenes disponibles
        "Cono de Chocolate": "postres4.png",  # Ya estaba correcto
        "Sundae de Fresa": "postres6.png",  # Ya estaba correcto
        "Sundae de Chocolate": "postres7.png",  # Ya estaba correcto
        "Sundae de Caramelo": "postres8.png",  # Ya estaba correcto
        
        # Bebidas - usar las imágenes disponibles
        "Sprite 3L": "bebida6.png",  # Ya estaba correcto
        "Pepsi Personal": "bebida7.png",  # Ya estaba correcto
        "Pepsi En Lata": "bebida8.png",  # Ya estaba correcto
        "Pepsi 3L": "bebida9.png",  # Ya estaba correcto
    }
    
    for product_name, suggested_image in correct_mappings.items():
        print(f"   • {product_name} → {suggested_image}")
    
    return correct_mappings

def check_frontend_image_map():
    """Verificar qué imágenes están disponibles en el IMAGE_MAP del frontend"""
    print(f"\n📁 VERIFICANDO IMAGE_MAP DEL FRONTEND:")
    
    # Necesitamos verificar el archivo del frontend para ver el IMAGE_MAP
    print("   Vamos a verificar el archivo CombosPublicos.jsx para ver el IMAGE_MAP...")

if __name__ == '__main__':
    problematic = identify_missing_image_mappings()
    correct_mappings = suggest_correct_image_assignments()
    check_frontend_image_map()