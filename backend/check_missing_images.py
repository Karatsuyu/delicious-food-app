"""
Identificar productos en combos que no tienen imágenes asignadas
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto

def check_missing_images():
    print("🔍 IDENTIFICANDO PRODUCTOS SIN IMÁGENES EN COMBOS")
    print("=" * 60)
    
    # Obtener todos los productos que están en combos
    productos_en_combos = ComboPersonalizadoProducto.objects.filter(
        combo__is_paid=True
    ).select_related('producto')
    
    # Agrupar por producto para ver cuáles no tienen imagen
    productos_sin_imagen = {}
    productos_con_imagen = {}
    
    for producto_combo in productos_en_combos:
        producto_nombre = producto_combo.producto.nombre
        imagen_seleccionada = producto_combo.imagen_seleccionada
        
        if not imagen_seleccionada or imagen_seleccionada.strip() == '':
            if producto_nombre not in productos_sin_imagen:
                productos_sin_imagen[producto_nombre] = {
                    'producto': producto_combo.producto,
                    'categoria': producto_combo.producto.categoria if producto_combo.producto.categoria else 'Sin categoría',
                    'count': 0
                }
            productos_sin_imagen[producto_nombre]['count'] += 1
        else:
            if producto_nombre not in productos_con_imagen:
                productos_con_imagen[producto_nombre] = imagen_seleccionada
    
    print(f"📊 ESTADÍSTICAS:")
    print(f"   • Productos únicos con imagen: {len(productos_con_imagen)}")
    print(f"   • Productos únicos sin imagen: {len(productos_sin_imagen)}")
    
    print(f"\n✅ PRODUCTOS QUE YA TIENEN IMÁGENES:")
    for nombre, imagen in sorted(productos_con_imagen.items()):
        print(f"   • {nombre}: {imagen}")
    
    print(f"\n❌ PRODUCTOS SIN IMÁGENES (necesitan asignación):")
    for nombre, data in sorted(productos_sin_imagen.items()):
        categoria = data['categoria']
        count = data['count']
        print(f"   • {nombre} ({categoria}) - Aparece {count} veces")
    
    return productos_sin_imagen

def suggest_images_mapping():
    """Sugerir imágenes basándose en nombres y categorías"""
    print(f"\n🎨 SUGERENCIAS DE IMÁGENES BASADAS EN NOMBRES:")
    
    # Mapeo de imágenes disponibles organizadas por tipo
    image_suggestions = {
        # Hamburguesas
        'hamburguesa': ['hamburguesa1.png', 'hamburguesa2.png', 'hamburguesa3.png', 'hamburguesa4.png', 
                       'hamburguesa5.png', 'hamburguesa6.png', 'hamburguesa7.png', 'hamburguesa8.png'],
        'burger': ['hamburguesa1.png', 'hamburguesa2.png', 'hamburguesa3.png', 'hamburguesa4.png'],
        
        # Pizzas
        'pizza': ['pizza1.png', 'pizza2.png', 'pizza3.png', 'pizza4.png', 'pizza5.png', 'pizza6.png', 'pizza7.png'],
        'pepperoni': ['pizza3.png', 'pizza4.png', 'pizza6.png'],
        
        # Pollos
        'pollo': ['pollo1.png', 'pollo2.png', 'pollo3.png', 'pollo4.png', 'pollo5.png', 'pollo6.png'],
        'alitas': ['pollo1.png', 'pollo2.png', 'pollo3.png', 'pollo4.png', 'pollo5.png', 'pollo6.png'],
        
        # Perros
        'perro': ['perro1.png', 'perro2.png', 'perro3.png', 'perro4.png', 'perro5.png'],
        'hot': ['perro1.png', 'perro2.png'],
        
        # Postres
        'cono': ['postres1.png', 'postres2.png', 'postres3.png', 'postres4.png'],
        'sundae': ['postres5.png', 'postres6.png', 'postres7.png', 'postres8.png'],
        'helado': ['postres1.png', 'postres2.png', 'postres3.png'],
        
        # Acompañamientos
        'papas': ['papas1.png'],
        'aros': ['papas2.png'],
        'nuggets': ['papas3.png'],
        
        # Bebidas
        'coca': ['bebida1.png', 'bebida2.png', 'bebida3.png'],
        'sprite': ['bebida4.png', 'bebida5.png', 'bebida6.png'],
        'pepsi': ['bebida7.png', 'bebida8.png', 'bebida9.png'],
        'bebida': ['bebida1.png', 'bebida2.png', 'bebida3.png'],
    }
    
    productos_sin_imagen = check_missing_images()
    
    print(f"\n🎯 ASIGNACIONES SUGERIDAS:")
    asignaciones = {}
    
    for nombre, data in productos_sin_imagen.items():
        nombre_lower = nombre.lower()
        imagen_sugerida = None
        
        # Buscar coincidencias en palabras clave
        for keyword, imagenes in image_suggestions.items():
            if keyword in nombre_lower:
                # Usar la primera imagen disponible del tipo
                imagen_sugerida = imagenes[0]
                break
        
        # Fallback basado en categoría
        if not imagen_sugerida:
            categoria = data['categoria'].lower()
            if 'hamburguesa' in categoria:
                imagen_sugerida = 'hamburguesa1.png'
            elif 'pizza' in categoria:
                imagen_sugerida = 'pizza1.png'
            elif 'pollo' in categoria:
                imagen_sugerida = 'pollo1.png'
            elif 'bebida' in categoria:
                imagen_sugerida = 'bebida1.png'
            elif 'postre' in categoria:
                imagen_sugerida = 'postres1.png'
            else:
                imagen_sugerida = 'hamburguesa1.png'  # Imagen por defecto
        
        asignaciones[nombre] = imagen_sugerida
        print(f"   • {nombre} → {imagen_sugerida}")
    
    return asignaciones

if __name__ == '__main__':
    suggest_images_mapping()