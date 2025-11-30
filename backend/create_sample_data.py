#!/usr/bin/env python
"""
Script para crear datos de prueba en el backend
Ejecutar con: python manage.py shell < create_sample_data.py
"""

from django.contrib.auth.models import User
from products.models import Producto, Ingrediente, Combo
from decimal import Decimal

# Crear usuario de prueba si no existe
user, created = User.objects.get_or_create(
    username='admin',
    defaults={
        'email': 'admin@deliciousfood.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'is_staff': True,
        'is_superuser': True
    }
)
if created:
    user.set_password('admin123')
    user.save()
    print("✅ Usuario admin creado")

# Crear ingredientes
ingredientes_data = [
    {'nombre': 'Queso Extra', 'costos_extras': Decimal('1.50')},
    {'nombre': 'Tomate', 'costos_extras': Decimal('0.50')},
    {'nombre': 'Lechuga', 'costos_extras': Decimal('0.50')},
    {'nombre': 'Cebolla', 'costos_extras': Decimal('0.50')},
    {'nombre': 'Pepperoni', 'costos_extras': Decimal('2.00')},
    {'nombre': 'Champiñones', 'costos_extras': Decimal('1.00')},
    {'nombre': 'Jamón', 'costos_extras': Decimal('1.50')},
    {'nombre': 'Piña', 'costos_extras': Decimal('1.00')},
    {'nombre': 'Aceitunas', 'costos_extras': Decimal('0.75')},
    {'nombre': 'Pimiento', 'costos_extras': Decimal('0.75')},
    {'nombre': 'Bacon', 'costos_extras': Decimal('2.50')},
    {'nombre': 'Pollo', 'costos_extras': Decimal('2.00')},
]

ingredientes = []
for ing_data in ingredientes_data:
    ingrediente, created = Ingrediente.objects.get_or_create(
        nombre=ing_data['nombre'],
        defaults={'costos_extras': ing_data['costos_extras']}
    )
    ingredientes.append(ingrediente)
    if created:
        print(f"✅ Ingrediente creado: {ingrediente.nombre}")

# Crear productos de hamburguesas
hamburguesas_data = [
    {
        'nombre': 'Hamburguesa Clásica',
        'descripcion': 'Hamburguesa tradicional con carne, lechuga, tomate y cebolla',
        'precio': Decimal('15.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'Hamburguesa con Queso',
        'descripcion': 'Deliciosa hamburguesa con queso derretido',
        'precio': Decimal('18.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'Hamburguesa Deluxe',
        'descripcion': 'Hamburguesa premium con ingredientes especiales',
        'precio': Decimal('22.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'BBQ Crispy',
        'descripcion': 'Hamburguesa con barbecue y crujiente',
        'precio': Decimal('19.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'Clásico Bacon',
        'descripcion': 'Hamburguesa con tocino crujiente',
        'precio': Decimal('21.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'Madurita Burger',
        'descripcion': 'Hamburguesa con ingredientes frescos',
        'precio': Decimal('17.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'BBQ Crunch Burger',
        'descripcion': 'Hamburguesa BBQ con ingredientes crujientes',
        'precio': Decimal('24.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    },
    {
        'nombre': 'Double Smash',
        'descripcion': 'Doble hamburguesa jugosa',
        'precio': Decimal('28.90'),
        'categoria': 'hamburguesas',
        'es_personalizable': True
    }
]

# Crear productos de pizzas
pizzas_data = [
    {
        'nombre': 'Pizza Hawaiana',
        'descripcion': 'Pizza con jamón y piña',
        'precio': Decimal('32.00'),
        'categoria': 'pizzas',
        'es_personalizable': True
    },
    {
        'nombre': 'Pizza de Queso',
        'descripcion': 'Pizza con queso derretido',
        'precio': Decimal('34.90'),
        'categoria': 'pizzas',
        'es_personalizable': True
    },
    {
        'nombre': 'Pizza de Pepperoni',
        'descripcion': 'Pizza con pepperoni',
        'precio': Decimal('36.90'),
        'categoria': 'pizzas',
        'es_personalizable': True
    },
    {
        'nombre': 'Pizza Aromática de Pepperoni',
        'descripcion': 'Pizza de pepperoni con hierbas aromáticas',
        'precio': Decimal('38.00'),
        'categoria': 'pizzas',
        'es_personalizable': True
    },
    {
        'nombre': 'Pizza de Pollo y Champiñones',
        'descripcion': 'Pizza con pollo y champiñones',
        'precio': Decimal('38.00'),
        'categoria': 'pizzas',
        'es_personalizable': True
    },
    {
        'nombre': 'Pepperoni Lovers',
        'descripcion': 'Pizza cargada de pepperoni',
        'precio': Decimal('40.90'),
        'categoria': 'pizzas',
        'es_personalizable': True
    },
    {
        'nombre': 'Pizza Campesina',
        'descripcion': 'Pizza con ingredientes del campo',
        'precio': Decimal('41.50'),
        'categoria': 'pizzas',
        'es_personalizable': True
    }
]

# Crear productos de pollo
pollo_data = [
    {
        'nombre': 'Alitas Simples',
        'descripcion': 'Alitas de pollo tradicionales',
        'precio': Decimal('12.00'),
        'categoria': 'pollo',
        'es_personalizable': True
    },
    {
        'nombre': 'Alitas Crocantes',
        'descripcion': 'Alitas extra crujientes',
        'precio': Decimal('12.90'),
        'categoria': 'pollo',
        'es_personalizable': True
    },
    {
        'nombre': 'Alitas BBQ',
        'descripcion': 'Alitas con salsa BBQ',
        'precio': Decimal('16.00'),
        'categoria': 'pollo',
        'es_personalizable': True
    },
    {
        'nombre': 'Alitas Teriyaki',
        'descripcion': 'Alitas con salsa teriyaki',
        'precio': Decimal('16.50'),
        'categoria': 'pollo',
        'es_personalizable': True
    },
    {
        'nombre': 'Alitas Ajo Parmesano',
        'descripcion': 'Alitas con ajo y parmesano',
        'precio': Decimal('18.00'),
        'categoria': 'pollo',
        'es_personalizable': True
    },
    {
        'nombre': 'Alitas Barbacoa',
        'descripcion': 'Alitas con salsa barbacoa',
        'precio': Decimal('18.00'),
        'categoria': 'pollo',
        'es_personalizable': True
    }
]

# Crear productos de perros
perros_data = [
    {
        'nombre': 'Perro Clásico',
        'descripcion': 'Perro caliente tradicional',
        'precio': Decimal('9.00'),
        'categoria': 'perros',
        'es_personalizable': True
    },
    {
        'nombre': 'Perro Supremo',
        'descripcion': 'Perro caliente con ingredientes premium',
        'precio': Decimal('12.00'),
        'categoria': 'perros',
        'es_personalizable': True
    },
    {
        'nombre': 'Perro Crocante',
        'descripcion': 'Perro caliente crujiente',
        'precio': Decimal('16.00'),
        'categoria': 'perros',
        'es_personalizable': True
    },
    {
        'nombre': 'Perro Especial',
        'descripcion': 'Perro caliente con ingredientes especiales',
        'precio': Decimal('16.50'),
        'categoria': 'perros',
        'es_personalizable': True
    }
]

# Crear productos de postres
postres_data = [
    {
        'nombre': 'Brownie de Chocolate',
        'descripcion': 'Brownie casero con chocolate',
        'precio': Decimal('8.00'),
        'categoria': 'postres',
        'es_personalizable': False
    },
    {
        'nombre': 'Cheesecake',
        'descripcion': 'Torta de queso cremosa',
        'precio': Decimal('12.00'),
        'categoria': 'postres',
        'es_personalizable': False
    },
    {
        'nombre': 'Helado de Vainilla',
        'descripcion': 'Helado artesanal de vainilla',
        'precio': Decimal('6.00'),
        'categoria': 'postres',
        'es_personalizable': False
    }
]

# Crear productos de papas
papas_data = [
    {
        'nombre': 'Papas Fritas Clásicas',
        'descripcion': 'Papas fritas crujientes',
        'precio': Decimal('7.00'),
        'categoria': 'papas',
        'es_personalizable': False
    },
    {
        'nombre': 'Papas con Queso',
        'descripcion': 'Papas fritas con queso derretido',
        'precio': Decimal('9.00'),
        'categoria': 'papas',
        'es_personalizable': False
    }
]

# Crear productos de bebidas
bebidas_data = [
    {
        'nombre': 'Coca Cola',
        'descripcion': 'Bebida gaseosa',
        'precio': Decimal('5.00'),
        'categoria': 'bebidas',
        'es_personalizable': False
    },
    {
        'nombre': 'Jugo de Naranja',
        'descripcion': 'Jugo natural de naranja',
        'precio': Decimal('4.00'),
        'categoria': 'bebidas',
        'es_personalizable': False
    },
    {
        'nombre': 'Agua',
        'descripcion': 'Agua natural',
        'precio': Decimal('2.00'),
        'categoria': 'bebidas',
        'es_personalizable': False
    }
]

# Función para crear productos
def crear_productos(datos_productos, categoria):
    productos_creados = []
    for prod_data in datos_productos:
        producto, created = Producto.objects.get_or_create(
            nombre=prod_data['nombre'],
            defaults={
                'descripcion': prod_data['descripcion'],
                'precio': prod_data['precio'],
                'categoria': prod_data['categoria'],
                'es_personalizable': prod_data['es_personalizable'],
                'usuario': user
            }
        )
        productos_creados.append(producto)
        if created:
            print(f"✅ {categoria} creado: {producto.nombre}")
    return productos_creados

# Crear todos los productos
print("🍔 Creando hamburguesas...")
hamburguesas = crear_productos(hamburguesas_data, "Hamburguesa")

print("🍕 Creando pizzas...")
pizzas = crear_productos(pizzas_data, "Pizza")

print("🍗 Creando pollo...")
pollo = crear_productos(pollo_data, "Pollo")

print("🌭 Creando perros...")
perros = crear_productos(perros_data, "Perro")

print("🧁 Creando postres...")
postres = crear_productos(postres_data, "Postre")

print("🍟 Creando papas...")
papas = crear_productos(papas_data, "Papas")

print("🥤 Creando bebidas...")
bebidas = crear_productos(bebidas_data, "Bebida")

# Crear algunos combos
combos_data = [
    {
        'nombre': 'Combo Hamburguesa Clásica',
        'descripcion': 'Hamburguesa clásica + papas + bebida',
        'precio_total': Decimal('25.90'),
        'es_personalizable': False
    },
    {
        'nombre': 'Combo Pizza Familiar',
        'descripcion': 'Pizza familiar + bebidas',
        'precio_total': Decimal('45.00'),
        'es_personalizable': False
    },
    {
        'nombre': 'Combo Alitas',
        'descripcion': 'Alitas + papas + bebida',
        'precio_total': Decimal('22.00'),
        'es_personalizable': False
    }
]

print("🍽️ Creando combos...")
for combo_data in combos_data:
    combo, created = Combo.objects.get_or_create(
        nombre=combo_data['nombre'],
        defaults={
            'descripcion': combo_data['descripcion'],
            'precio_total': combo_data['precio_total'],
            'es_personalizable': combo_data['es_personalizable'],
            'usuario': user
        }
    )
    if created:
        print(f"✅ Combo creado: {combo.nombre}")

print("\n🎉 ¡Datos de prueba creados exitosamente!")
print(f"📊 Total productos: {Producto.objects.count()}")
print(f"🧪 Total ingredientes: {Ingrediente.objects.count()}")
print(f"🍽️ Total combos: {Combo.objects.count()}")
print(f"👤 Usuario admin creado: admin/admin123")





