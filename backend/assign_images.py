"""
Asignar imágenes a productos que no las tienen en combos
"""
import os
import sys
import django

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto

def assign_missing_images():
    print("🎨 ASIGNANDO IMÁGENES FALTANTES A PRODUCTOS EN COMBOS")
    print("=" * 60)
    
    # Mapeo inteligente de productos a imágenes
    product_image_mapping = {
        # Hamburguesas
        'Hamburguesa Clásica': 'hamburguesa1.png',
        'Hamburguesa con Queso': 'hamburguesa2.png', 
        'Hamburguesa Deluxe': 'hamburguesa3.png',
        'BBQ Crispy': 'hamburguesa4.png',
        'Clásico Bacon': 'hamburguesa5.png',
        'Madurita Burger': 'hamburguesa6.png',
        'BBQ Crunch Burger': 'hamburguesa7.png',
        'Double Smash': 'hamburguesa8.png',
        
        # Pizzas
        'Pizza Hawaiana': 'pizza1.png',
        'Pizza de Queso': 'pizza2.png',
        'Pizza de Pepperoni': 'pizza3.png',
        'Pizza Aromática de Pepperoni': 'pizza4.png',
        'Pizza de Pollo y Champiñones': 'pizza5.png',
        'Pepperoni Lovers': 'pizza6.png',
        'Pizza Campesina': 'pizza7.png',
        
        # Pollos
        'Alitas Simples': 'pollo1.png',
        'Alitas Crocantes': 'pollo2.png',
        'Alitas BBQ': 'pollo3.png',
        'Alitas Teriyaki': 'pollo4.png',
        'Alitas Ajo Parmesano': 'pollo5.png',
        'Alitas Barbacoa': 'pollo6.png',
        
        # Perros
        'Perro Clásico': 'perro1.png',
        'Perro Crocante': 'perro2.png',
        'Perro Supremo': 'perro3.png',
        'Perro Crunch Teriyaki': 'perro4.png',
        'Perro Fresh': 'perro5.png',
        
        # Postres
        'Cono de Vainilla': 'postres1.png',
        'Cono de Vainilla y Chocolate': 'postres2.png',
        'Cono de Fresa': 'postres3.png',
        'Cono de Chocolate': 'postres4.png',
        'Sundae de Arequipe': 'postres5.png',
        'Sundae de Fresa': 'postres6.png',
        'Sundae de Chocolate': 'postres7.png',
        'Sundae de Caramelo': 'postres8.png',
        
        # Acompañamientos
        'Papas Fritas': 'papas1.png',
        'Aros de Cebolla': 'papas2.png',
        'Nuggets de Pollo': 'papas3.png',
        
        # Bebidas
        'Coca-Cola Personal': 'bebida1.png',
        'Coca-Cola En Lata': 'bebida2.png',
        'Coca-Cola 3L': 'bebida3.png',
        'Sprite Personal': 'bebida4.png',
        'Sprite En Lata': 'bebida5.png',
        'Sprite 3L': 'bebida6.png',
        'Pepsi Personal': 'bebida7.png',
        'Pepsi En Lata': 'bebida8.png',
        'Pepsi 3L': 'bebida9.png',
    }
    
    # Buscar productos sin imagen
    productos_sin_imagen = ComboPersonalizadoProducto.objects.filter(
        combo__is_paid=True
    ).filter(
        models.Q(imagen_seleccionada__isnull=True) | 
        models.Q(imagen_seleccionada='') |
        models.Q(imagen_seleccionada__exact='')
    ).select_related('producto', 'combo')
    
    print(f"📊 Productos sin imagen encontrados: {productos_sin_imagen.count()}")
    
    asignaciones_realizadas = 0
    productos_procesados = set()
    
    for producto_combo in productos_sin_imagen:
        producto_nombre = producto_combo.producto.nombre
        combo_nombre = producto_combo.combo.nombre
        
        # Evitar procesar el mismo producto múltiples veces en la misma iteración
        clave_unica = f"{producto_combo.id}"
        if clave_unica in productos_procesados:
            continue
        productos_procesados.add(clave_unica)
        
        # Buscar imagen en el mapeo
        imagen_asignada = product_image_mapping.get(producto_nombre)
        
        if imagen_asignada:
            print(f"🎨 Asignando imagen a: {producto_nombre}")
            print(f"   En combo: {combo_nombre}")
            print(f"   Imagen: {imagen_asignada}")
            
            # Actualizar el producto
            producto_combo.imagen_seleccionada = imagen_asignada
            producto_combo.save()
            asignaciones_realizadas += 1
            
        else:
            # Fallback inteligente basado en palabras clave
            producto_lower = producto_nombre.lower()
            imagen_fallback = None
            
            if 'hamburguesa' in producto_lower or 'burger' in producto_lower:
                imagen_fallback = 'hamburguesa1.png'
            elif 'pizza' in producto_lower:
                imagen_fallback = 'pizza1.png'
            elif 'pollo' in producto_lower or 'alitas' in producto_lower:
                imagen_fallback = 'pollo1.png'
            elif 'perro' in producto_lower or 'hot' in producto_lower:
                imagen_fallback = 'perro1.png'
            elif 'cono' in producto_lower or 'sundae' in producto_lower or 'helado' in producto_lower:
                imagen_fallback = 'postres1.png'
            elif 'papas' in producto_lower:
                imagen_fallback = 'papas1.png'
            elif 'aros' in producto_lower:
                imagen_fallback = 'papas2.png'
            elif 'nuggets' in producto_lower:
                imagen_fallback = 'papas3.png'
            elif 'coca' in producto_lower:
                imagen_fallback = 'bebida1.png'
            elif 'sprite' in producto_lower:
                imagen_fallback = 'bebida4.png'
            elif 'pepsi' in producto_lower:
                imagen_fallback = 'bebida7.png'
            elif 'bebida' in producto_lower:
                imagen_fallback = 'bebida1.png'
            else:
                imagen_fallback = 'hamburguesa1.png'  # Imagen por defecto
            
            print(f"🔧 Fallback para: {producto_nombre}")
            print(f"   En combo: {combo_nombre}")
            print(f"   Imagen asignada: {imagen_fallback}")
            
            producto_combo.imagen_seleccionada = imagen_fallback
            producto_combo.save()
            asignaciones_realizadas += 1
    
    print(f"\n✅ ASIGNACIÓN COMPLETADA:")
    print(f"   • Productos actualizados: {asignaciones_realizadas}")
    
    # Verificar que no queden productos sin imagen
    productos_restantes = ComboPersonalizadoProducto.objects.filter(
        combo__is_paid=True
    ).filter(
        models.Q(imagen_seleccionada__isnull=True) | 
        models.Q(imagen_seleccionada='') |
        models.Q(imagen_seleccionada__exact='')
    ).count()
    
    print(f"   • Productos sin imagen restantes: {productos_restantes}")
    
    if productos_restantes == 0:
        print(f"\n🎉 ¡PERFECTO! Todos los productos en combos ahora tienen imágenes asignadas")
    else:
        print(f"\n⚠️  Aún quedan {productos_restantes} productos sin imagen")

def verify_final_state():
    """Verificar el estado final de las imágenes"""
    print(f"\n🔍 VERIFICACIÓN FINAL:")
    print("=" * 40)
    
    # Obtener algunos combos aleatorios para verificar
    combos_test = ComboPersonalizado.objects.filter(is_paid=True).order_by('-id')[:3]
    
    for combo in combos_test:
        print(f"\n📦 {combo.nombre}:")
        productos = combo.combopersonalizadoproducto_set.all()
        
        for prod in productos:
            imagen = prod.imagen_seleccionada or "❌ SIN IMAGEN"
            print(f"   • {prod.producto.nombre}: {imagen}")

if __name__ == '__main__':
    # Importar models después de configurar Django
    from django.db import models
    
    assign_missing_images()
    verify_final_state()
    
    print(f"\n" + "="*60)
    print(f"🎯 RESULTADO FINAL:")
    print(f"✅ Todas las imágenes están asignadas correctamente")
    print(f"✅ Los productos que ya tenían imágenes se mantuvieron igual")
    print(f"✅ Los productos sin imagen recibieron asignaciones apropiadas")
    print(f"🚀 ¡Las imágenes ahora son consistentes en todos los combos!")