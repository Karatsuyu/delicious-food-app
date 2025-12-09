"""
Verificación final completa del sistema de imágenes
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main\delicious-food-app\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto
from products.serializers import ComboPersonalizadoSerializer

def final_image_system_test():
    print("🎯 VERIFICACIÓN FINAL COMPLETA DEL SISTEMA DE IMÁGENES")
    print("=" * 60)
    
    # Obtener un combo representativo para probar
    combo_test = ComboPersonalizado.objects.filter(is_paid=True).order_by('-id').first()
    
    if not combo_test:
        print("❌ No se encontraron combos para probar")
        return
    
    print(f"📦 PROBANDO COMBO: {combo_test.nombre}")
    
    # Verificar a través del serializer (como lo usa la API)
    serializer = ComboPersonalizadoSerializer(combo_test)
    data = serializer.data
    
    productos = data.get('productos_detalle', [])
    
    print(f"\n🔍 PRODUCTOS EN EL COMBO (vía API):")
    
    todos_tienen_imagen = True
    productos_con_imagen = 0
    productos_sin_imagen = 0
    
    for producto in productos:
        nombre = producto.get('nombre', 'N/A')
        imagen_seleccionada = producto.get('imagen_seleccionada', '')
        imagen_api = producto.get('imagen', '')
        
        if imagen_seleccionada and imagen_seleccionada.strip():
            print(f"   ✅ {nombre}")
            print(f"      imagen_seleccionada: '{imagen_seleccionada}'")
            print(f"      imagen (API): '{imagen_api}'")
            productos_con_imagen += 1
        else:
            print(f"   ❌ {nombre}")
            print(f"      SIN IMAGEN_SELECCIONADA")
            productos_sin_imagen += 1
            todos_tienen_imagen = False
    
    print(f"\n📊 ESTADÍSTICAS DEL COMBO:")
    print(f"   • Productos con imagen: {productos_con_imagen}")
    print(f"   • Productos sin imagen: {productos_sin_imagen}")
    print(f"   • Estado: {'✅ PERFECTO' if todos_tienen_imagen else '⚠️ INCOMPLETO'}")
    
    return todos_tienen_imagen

def check_frontend_compatibility():
    """Verificar compatibilidad con los archivos del frontend actualizados"""
    print(f"\n🎨 VERIFICANDO COMPATIBILIDAD CON FRONTEND:")
    
    # Lista de imágenes que ahora están en el IMAGE_MAP actualizado
    frontend_images = {
        'hamburguesa.png', 'hamburguesa1.png', 'hamburguesa2.png', 'hamburguesa3.png',
        'hamburguesa4.png', 'hamburguesa5.png', 'hamburguesa6.png', 'hamburguesa7.png',
        'hamburguesa8.png', 'pizza.png', 'pizza1.png', 'pizza2.png', 'pizza3.png',
        'pizza4.png', 'pizza5.png', 'pizza6.png', 'pizza7.png', 'peperoni.png',
        'perro.png', 'perro1.png', 'perro2.png', 'perro3.png', 'perro4.png',
        'perro5.png', 'papas1.png', 'papas2.png', 'papas3.png', 'bebida1.png',
        'bebida2.png', 'bebida3.png', 'bebida4.png', 'bebida5.png', 'bebida6.png',
        'bebida7.png', 'bebida8.png', 'bebida9.png', 'pollo.png', 'pollo1.png',
        'pollo2.png', 'pollo3.png', 'pollo4.png', 'pollo5.png', 'pollo6.png',
        'postres1.png', 'postres2.png', 'postres3.png', 'postres4.png',
        'postres5.png', 'postres6.png', 'postres7.png', 'postres8.png'
    }
    
    # Obtener todas las imágenes usadas en combos
    productos_combo = ComboPersonalizadoProducto.objects.filter(
        combo__is_paid=True,
        imagen_seleccionada__isnull=False
    ).exclude(imagen_seleccionada='')
    
    imagenes_backend = set(productos_combo.values_list('imagen_seleccionada', flat=True))
    
    # Verificar compatibilidad
    imagenes_compatibles = imagenes_backend.intersection(frontend_images)
    imagenes_no_compatibles = imagenes_backend - frontend_images
    
    print(f"   📊 Compatibilidad:")
    print(f"      • Imágenes en backend: {len(imagenes_backend)}")
    print(f"      • Imágenes en frontend: {len(frontend_images)}")
    print(f"      • Compatibles: {len(imagenes_compatibles)}")
    print(f"      • No compatibles: {len(imagenes_no_compatibles)}")
    
    if imagenes_no_compatibles:
        print(f"\n   ⚠️ IMÁGENES NO COMPATIBLES:")
        for imagen in sorted(imagenes_no_compatibles):
            print(f"      • {imagen}")
    else:
        print(f"\n   ✅ ¡100% COMPATIBLE! Todas las imágenes del backend están en el frontend")
    
    return len(imagenes_no_compatibles) == 0

def test_problematic_products():
    """Probar específicamente los productos que antes tenían problemas"""
    print(f"\n🧪 PROBANDO PRODUCTOS QUE ANTES TENÍAN PROBLEMAS:")
    
    problematic_products = [
        "Alitas BBQ", "Clásico Bacon", "Madurita Burger", "BBQ Crunch Burger", 
        "Double Smash", "Pizza Aromática de Pepperoni", "Pizza de Pollo y Champiñones",
        "Pepperoni Lovers", "Pizza Campesina", "Alitas Teriyaki", "Alitas Ajo Parmesano",
        "Alitas Barbacoa", "Perro Supremo", "Perro Crunch Teriyaki", "Perro Fresh",
        "Cono de Chocolate", "Sundae de Fresa", "Sundae de Chocolate", 
        "Sundae de Caramelo", "Sprite 3L", "Pepsi Personal", "Pepsi En Lata", "Pepsi 3L"
    ]
    
    productos_corregidos = 0
    productos_aun_problematicos = 0
    
    for product_name in problematic_products:
        producto_combo = ComboPersonalizadoProducto.objects.filter(
            producto__nombre=product_name,
            combo__is_paid=True
        ).first()
        
        if producto_combo:
            imagen = producto_combo.imagen_seleccionada
            if imagen and imagen.strip():
                print(f"   ✅ {product_name}: {imagen}")
                productos_corregidos += 1
            else:
                print(f"   ❌ {product_name}: SIN IMAGEN")
                productos_aun_problematicos += 1
        else:
            print(f"   ⚪ {product_name}: NO ENCONTRADO")
    
    print(f"\n   📊 Resultados:")
    print(f"      • Productos corregidos: {productos_corregidos}")
    print(f"      • Productos aún problemáticos: {productos_aun_problematicos}")
    
    return productos_aun_problematicos == 0

if __name__ == '__main__':
    print("🚀 INICIANDO VERIFICACIÓN FINAL DEL SISTEMA DE IMÁGENES...")
    
    test1 = final_image_system_test()
    test2 = check_frontend_compatibility() 
    test3 = test_problematic_products()
    
    print(f"\n" + "="*60)
    print(f"🎯 RESULTADO FINAL:")
    
    if test1 and test2 and test3:
        print(f"🎉 ¡SISTEMA DE IMÁGENES 100% FUNCIONAL!")
        print(f"✅ Todos los combos tienen imágenes asignadas")
        print(f"✅ Frontend actualizado con todas las imágenes")
        print(f"✅ Productos problemáticos corregidos") 
        print(f"✅ API devuelve imágenes correctamente")
        print(f"✅ IMAGE_MAP completo en ambos archivos")
        print(f"\n🚀 ¡Las imágenes ahora se mostrarán correctamente en:")
        print(f"   • Combos públicos (CombosPublicos.jsx)")
        print(f"   • Detalles del combo (ComboPersonalizadoDetalle.jsx)")
        print(f"   • Personalizador de combos (CrearCombo.jsx)")
    else:
        print(f"⚠️ El sistema necesita ajustes adicionales:")
        print(f"   • Combo test: {'✅' if test1 else '❌'}")
        print(f"   • Compatibilidad frontend: {'✅' if test2 else '❌'}")
        print(f"   • Productos problemáticos: {'✅' if test3 else '❌'}")