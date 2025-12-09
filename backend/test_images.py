"""
Test para verificar que las imágenes se guardan y muestran correctamente
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto
from users.models import User
from products.serializers import ComboPersonalizadoSerializer

def test_image_consistency():
    print("🖼️ VERIFICANDO CONSISTENCIA DE IMÁGENES EN COMBOS")
    print("=" * 60)
    
    # Obtener datos
    user = User.objects.first()
    hamburguesa = Producto.objects.filter(nombre__icontains="Hamburguesa Clásica").first()
    pizza = Producto.objects.filter(nombre__icontains="Pizza Pepperoni").first()
    
    # Simular lo que haría el frontend corregido
    productos_data = [
        {
            'producto': hamburguesa.id,
            'cantidad': 1,
            'precio_actual': float(hamburguesa.precio),
            'imagen_seleccionada': 'hamburguesa2.png'  # Nombre de archivo limpio
        },
        {
            'producto': pizza.id,
            'cantidad': 1,
            'precio_actual': float(pizza.precio),
            'imagen_seleccionada': 'pizza1.png'  # Nombre de archivo limpio
        }
    ]
    
    print("📤 IMÁGENES QUE DEBERÍA GUARDAR EL FRONTEND:")
    for p in productos_data:
        prod = Producto.objects.get(id=p['producto'])
        print(f"   - {prod.nombre}: {p['imagen_seleccionada']}")
    
    # Crear combo
    combo = ComboPersonalizado.objects.create(
        usuario=user,
        nombre='🖼️ Test Imágenes Consistentes',
        precio_total=0,
        is_paid=True,
        publicado=True
    )
    
    total = 0
    for pd in productos_data:
        prod = Producto.objects.get(id=pd['producto'])
        precio_usar = pd['precio_actual']
        
        combo_producto = ComboPersonalizadoProducto.objects.create(
            combo=combo,
            producto=prod,
            cantidad=pd['cantidad'],
            precio_unitario=precio_usar,
            imagen_seleccionada=pd['imagen_seleccionada'],  # 🔑 IMAGEN GUARDADA
            precio_al_agregar=precio_usar
        )
        
        total += precio_usar * pd['cantidad']
        print(f"   ✅ Guardado {prod.nombre}: imagen_seleccionada = '{combo_producto.imagen_seleccionada}'")
    
    combo.precio_total = total
    combo.save()
    
    # Verificar via API (como lo ven las páginas de detalle)
    print(f"\n🔍 VERIFICANDO VIA API (COMO LO VEN LOS DETALLES):")
    serializer = ComboPersonalizadoSerializer(combo)
    data = serializer.data
    
    productos_api = data.get('productos_detalle', [])
    
    for p in productos_api:
        nombre = p.get('nombre', 'N/A')
        imagen_seleccionada = p.get('imagen_seleccionada', 'N/A')
        imagen_url = p.get('imagen', 'N/A')
        
        print(f"   - {nombre}:")
        print(f"     imagen_seleccionada: '{imagen_seleccionada}'")
        print(f"     imagen (URL): '{imagen_url}'")
        
        # Verificar que la imagen_seleccionada no sea None o vacía
        if imagen_seleccionada and imagen_seleccionada != 'N/A':
            print(f"     ✅ Tiene imagen_seleccionada guardada")
        else:
            print(f"     ❌ No tiene imagen_seleccionada")
    
    # Simulación de lo que haría getProductImage() en los componentes frontend
    print(f"\n🎨 SIMULANDO getProductImage() EN COMPONENTES:")
    
    # Mapeo como el que existe en ComboPersonalizadoDetalle y CombosPublicos
    IMAGE_MAP = {
        'hamburguesa.png': 'hamburguesa_import',
        'hamburguesa1.png': 'hamburguesa1_import', 
        'hamburguesa2.png': 'hamburguesa2_import',
        'pizza.png': 'pizza_import',
        'pizza1.png': 'pizza1_import',
        'pizza2.png': 'pizza2_import',
    }
    
    for p in productos_api:
        imagen_seleccionada = p.get('imagen_seleccionada')
        imagen_backend = p.get('imagen')
        
        print(f"\n   Producto: {p.get('nombre')}")
        print(f"   imagen_seleccionada de BD: '{imagen_seleccionada}'")
        
        if imagen_seleccionada and imagen_seleccionada in IMAGE_MAP:
            print(f"   ✅ Se encontraría en IMAGE_MAP: {IMAGE_MAP[imagen_seleccionada]}")
            print(f"   ✅ Se usaría la imagen del personalizador")
        else:
            print(f"   ⚠️  No se encuentra en IMAGE_MAP, usaría imagen del backend")
            print(f"   📷 Imagen del backend: {imagen_backend}")
    
    return combo

def test_existing_combos():
    """Verificar combos existentes"""
    print(f"\n🔍 VERIFICANDO COMBOS EXISTENTES:")
    
    combos = ComboPersonalizado.objects.filter(is_paid=True)[:3]
    
    for combo in combos:
        print(f"\n📦 Combo: {combo.nombre}")
        productos = combo.combopersonalizadoproducto_set.all()
        
        for prod in productos:
            imagen_sel = prod.imagen_seleccionada or 'N/A'
            print(f"   - {prod.producto.nombre}: imagen_seleccionada = '{imagen_sel}'")

if __name__ == '__main__':
    combo = test_image_consistency()
    test_existing_combos()
    
    print(f"\n" + "="*60)
    print(f"📋 RESULTADO:")
    print(f"✅ Si imagen_seleccionada tiene valores como 'hamburguesa2.png'")
    print(f"   entonces los componentes la encontrarán en IMAGE_MAP")
    print(f"✅ Si imagen_seleccionada está vacía o es None")
    print(f"   entonces usarán la imagen del backend como fallback")
    print(f"\n🎯 LA CORRECCIÓN EN EL FRONTEND DEBE ASEGURAR QUE SE GUARDEN")
    print(f"   NOMBRES LIMPIOS COMO 'hamburguesa2.png' NO RUTAS COMPLETAS")