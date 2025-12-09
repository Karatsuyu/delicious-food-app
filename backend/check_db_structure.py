"""
Script para verificar la estructura real de la base de datos
"""
import os
import sys
import django
import sqlite3

# Configurar Django
sys.path.append('C:/Users/Usuario/Desktop/Main/delicious-food-app/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from django.db import connection

def check_table_structure():
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA table_info(products_combopersonalizadoproducto);")
        columns = cursor.fetchall()
        
        print("Estructura de products_combopersonalizadoproducto:")
        for col in columns:
            cid, name, col_type, notnull, default_val, pk = col
            nullable = "NOT NULL" if notnull else "NULL"
            print(f"  {name}: {col_type} ({nullable})")

def try_create_combo_properly():
    """Intentar crear un combo llenando todos los campos correctamente"""
    from products.models import ComboPersonalizado, ComboPersonalizadoProducto, Producto
    from users.models import User
    
    try:
        user = User.objects.first()
        producto = Producto.objects.first()
        
        # Crear combo
        combo = ComboPersonalizado.objects.create(
            usuario=user,
            nombre="Combo Prueba Completo",
            precio_total=producto.precio,
            is_paid=True
        )
        print(f"✅ Combo creado: ID {combo.id}")
        
        # Intentar crear producto del combo con todos los valores posibles
        combo_producto = ComboPersonalizadoProducto(
            combo=combo,
            producto=producto,
            cantidad=1,
            precio_unitario=producto.precio,  # Campo requerido
            precio_al_agregar=producto.precio
        )
        
        # Ver qué campos faltan antes de guardar
        print("Intentando guardar ComboPersonalizadoProducto...")
        combo_producto.full_clean()  # Esto debería mostrar errores de validación
        combo_producto.save()
        
        print(f"✅ Producto agregado correctamente: {producto.nombre}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    check_table_structure()
    print("\n" + "="*50 + "\n")
    try_create_combo_properly()