"""
Test completo de la API de combos personalizados
"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_combos_api():
    print("=== TESTING COMBOS API ===\n")
    
    # 1. Obtener combos personalizados (debe mostrar solo los pagados)
    print("1. PROBANDO API DE COMBOS PAGADOS:")
    try:
        response = requests.get(f'{BASE_URL}/api/combos-personalizados/')
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Total combos: {len(data)}")
            
            for combo in data:
                print(f"\n   Combo: {combo.get('nombre', 'Sin nombre')}")
                print(f"   ID: {combo.get('id')}")
                print(f"   Precio: ${combo.get('precio_total', 0)}")
                print(f"   Pagado: {combo.get('is_paid', False)}")
                
                productos = combo.get('productos_detalle', [])
                print(f"   Productos ({len(productos)}):")
                for prod in productos:
                    precio_compra = prod.get('precio', 0)
                    precio_actual = prod.get('precio_actual', 0)
                    print(f"     - {prod.get('nombre')}: ${precio_compra} (actual: ${precio_actual}) x{prod.get('cantidad')}")
                    if prod.get('imagen_seleccionada'):
                        print(f"       Imagen: {prod.get('imagen_seleccionada')}")
        else:
            print(f"   Error: {response.text}")
    
    except Exception as e:
        print(f"   ❌ Error conectando a API: {e}")
    
    # 2. Probar combo público
    print("\n\n2. PROBANDO API DE COMBOS PÚBLICOS:")
    try:
        response = requests.get(f'{BASE_URL}/api/combos-publicos/')
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Total combos públicos: {len(data)}")
            
            for combo in data[:2]:  # Solo primeros 2
                print(f"\n   Combo Público: {combo.get('nombre', 'Sin nombre')}")
                print(f"   Precio: ${combo.get('precio_total', 0)}")
                print(f"   Compras: {combo.get('veces_comprado', 0)}")
                
                productos = combo.get('productos_detalle', [])
                print(f"   Productos: {len(productos)}")
                for prod in productos[:3]:  # Solo primeros 3 productos
                    print(f"     - {prod.get('nombre')}: ${prod.get('precio')} x{prod.get('cantidad')}")
        else:
            print(f"   Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error conectando a API: {e}")

if __name__ == '__main__':
    test_combos_api()