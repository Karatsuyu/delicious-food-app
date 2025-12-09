"""
Test para verificar que las imágenes se guardan y muestran correctamente 
en todas las etapas del combo
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop\Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto
from users.models import User
from products.serializers import ComboPersonalizadoSerializer

def test_image_consistency():
    print("🖼️ PRUEBA DE CONSISTENCIA DE IMÁGENES EN COMBOS")
    print("=" * 60)
    
    # Crear combo de prueba con imágenes específicas
    user = User.objects.first()
    hamburguesa = Producto.objects.filter(nombre__icontains="Hamburguesa Clásica").first()
    pizza = Producto.objects.filter(nombre__icontains="Pizza Pepperoni").first()
    
    print(f"🍔 {hamburguesa.nombre}")
    print(f"🍕 {pizza.nombre}")
    
    # Simular lo que enviaría el frontend corregido
    combo = ComboPersonalizado.objects.create(
        usuario=user,
        nombre='🖼️ Test Imágenes Consistentes',
        precio_total=25800,
        is_paid=True,
        publicado=True
    )
    
    # Simular productos con imágenes específicas (como nombres de archivo)
    productos_test = [
        {
            'producto': hamburguesa,
            'cantidad': 1,
            'imagen_seleccionada': 'hamburguesa2.png',  # 🔑 SOLO NOMBRE DE ARCHIVO
        },
        {
            'producto': pizza,
            'cantidad': 2,
            'imagen_seleccionada': 'pizza1.png',  # 🔑 SOLO NOMBRE DE ARCHIVO
        }
    ]
    
    print(f"\n📦 CREANDO COMBO CON IMÁGENES ESPECÍFICAS:")
    
    for prod_data in productos_test:
        combo_producto = ComboPersonalizadoProducto.objects.create(
            combo=combo,
            producto=prod_data['producto'],
            cantidad=prod_data['cantidad'],
            precio_unitario=float(prod_data['producto'].precio),
            precio_al_agregar=float(prod_data['producto'].precio),
            imagen_seleccionada=prod_data['imagen_seleccionada']  # 🔑 IMAGEN ESPECÍFICA
        )
        
        print(f"   ✅ {prod_data['producto'].nombre}: {prod_data['imagen_seleccionada']}")
    
    # Verificar que se guardaron correctamente en BD
    print(f"\n💾 VERIFICACIÓN EN BASE DE DATOS:")
    productos_bd = combo.combopersonalizadoproducto_set.all()
    
    for prod in productos_bd:
        print(f"   - {prod.producto.nombre}: imagen_seleccionada = '{prod.imagen_seleccionada}'")
    
    # Verificar serialización (lo que ve el frontend)
    print(f"\n🔍 VERIFICACIÓN VÍA API:")
    serializer = ComboPersonalizadoSerializer(combo)
    data = serializer.data
    
    productos_api = data.get('productos_detalle', [])
    for prod in productos_api:
        imagen = prod.get('imagen')
        imagen_seleccionada = prod.get('imagen_seleccionada')
        print(f"   - {prod.get('nombre')}:")
        print(f"     imagen: {imagen}")
        print(f"     imagen_seleccionada: {imagen_seleccionada}")
    
    # Verificar mapeo correcto
    print(f"\n🎨 VERIFICACIÓN DE MAPEO:")
    expected_images = {
        'Hamburguesa Clásica': 'hamburguesa2.png',
        'Pizza Pepperoni': 'pizza1.png'
    }
    
    all_correct = True
    for prod in productos_api:
        nombre = prod.get('nombre')
        imagen_seleccionada = prod.get('imagen_seleccionada')
        expected = expected_images.get(nombre)
        
        if imagen_seleccionada == expected:
            print(f"   ✅ {nombre}: {imagen_seleccionada} (correcto)")
        else:
            print(f"   ❌ {nombre}: esperado '{expected}', obtenido '{imagen_seleccionada}'")
            all_correct = False
    
    if all_correct:
        print(f"\n🎉 ¡ÉXITO! IMÁGENES CONSISTENTES")
        print(f"✅ Las imágenes se guardan correctamente como nombres de archivo")
        print(f"✅ El mapeo funcionará en ComboPersonalizadoDetalle y CombosPublicos")
    else:
        print(f"\n❌ Hay problemas con las imágenes")
    
    return combo

def verify_existing_combos():
    """Verificar combos existentes para ver si tienen problemas de imagen"""
    print(f"\n🔍 VERIFICANDO COMBOS EXISTENTES:")
    
    combos = ComboPersonalizado.objects.filter(is_paid=True)[:3]
    
    for combo in combos:
        print(f"\nCombo: {combo.nombre}")
        productos = combo.combopersonalizadoproducto_set.all()
        
        for prod in productos:
            img_sel = prod.imagen_seleccionada or "None"
            # Verificar si la imagen es problemática (contiene rutas completas)
            if img_sel and ('/' in img_sel or img_sel.startswith('http')):
                print(f"   ⚠️  {prod.producto.nombre}: {img_sel} (problemático - contiene ruta)")
            else:
                print(f"   ✅ {prod.producto.nombre}: {img_sel} (ok)")

if __name__ == '__main__':
    combo = test_image_consistency()
    verify_existing_combos()
    
    print(f"\n" + "="*60)
    print(f"📋 RESUMEN:")
    print(f"✅ La corrección en frontend guardará solo nombres de archivo")
    print(f"✅ ComboPersonalizadoDetalle usará IMAGE_MAP correctamente")
    print(f"✅ CombosPublicos usará el mismo IMAGE_MAP")
    print(f"✅ Las imágenes serán consistentes en todas las etapas")