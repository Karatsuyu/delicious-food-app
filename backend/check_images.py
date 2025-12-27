#!/usr/bin/env python3

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from users.models import User
from products.models import ProductoPersonalizado

def check_images():
    k = User.objects.get(username='Karatsuyu1')
    prods = ProductoPersonalizado.objects.filter(usuario=k, publicado=True)
    print('Productos encontrados:', prods.count())
    
    for p in prods:
        print(f'- {p.nombre_personalizado}:')
        print(f'  local_image: {p.local_product_image or "None"}')
        print(f'  local_name: {p.local_product_name or "None"}')
        print(f'  base_image: {p.producto_base.imagen if p.producto_base else "None"}')
        print(f'  base_name: {p.producto_base.nombre if p.producto_base else "None"}')
        print()

if __name__ == "__main__":
    check_images()