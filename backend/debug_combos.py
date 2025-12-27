#!/usr/bin/env python
"""
Script para debuggear los combos personalizados y encontrar por qué algunos funcionan y otros no.
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'restaurant_api.settings')
django.setup()

from products.models import ComboPersonalizado, ComboPersonalizadoProducto
from django.contrib.auth import get_user_model

User = get_user_model()

def debug_combos():
    print("=== ANÁLISIS DE COMBOS PERSONALIZADOS ===")
    
    # Buscar todos los combos
    combos = ComboPersonalizado.objects.all().order_by('id')
    
    for combo in combos:
        print(f"\n--- Combo ID: {combo.id} ---")
        print(f"Nombre: {combo.nombre}")
        print(f"Usuario: {combo.usuario.email}")
        print(f"Precio total guardado: {combo.precio_total}")
        print(f"Es pagado: {combo.is_paid}")
        print(f"Publicado: {combo.publicado}")
        print(f"Fecha creación: {combo.creado_en}")
        
        # Verificar productos relacionados
        productos_relacionados = combo.combopersonalizadoproducto_set.all()
        print(f"Productos relacionados: {productos_relacionados.count()}")
        
        total_calculado = 0
        for cp in productos_relacionados:
            precio_producto = float(cp.producto.precio)
            cantidad = int(cp.cantidad)
            subtotal = precio_producto * cantidad
            total_calculado += subtotal
            print(f"  - {cp.producto.nombre}: ${precio_producto} x {cantidad} = ${subtotal}")
            if cp.imagen_seleccionada:
                print(f"    Imagen seleccionada: {cp.imagen_seleccionada}")
        
        print(f"Total calculado: ${total_calculado}")
        
        if productos_relacionados.count() == 0:
            print("❌ PROBLEMA: No tiene productos relacionados")
        elif total_calculado == 0:
            print("❌ PROBLEMA: Total calculado es 0")
        elif float(combo.precio_total) != total_calculado:
            print(f"⚠️  DIFERENCIA: Guardado ${combo.precio_total} vs Calculado ${total_calculado}")
        else:
            print("✅ OK: Combo tiene datos correctos")

if __name__ == '__main__':
    debug_combos()