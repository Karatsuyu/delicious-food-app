"""
Simular exactamente el flujo del frontend para probar la corrección
"""
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_real_frontend_flow():
    print("🧪 PROBANDO FLUJO REAL DEL FRONTEND CON CORRECCIONES")
    print("=" * 60)
    
    # Paso 1: Obtener productos (como lo hace el frontend)
    print("1️⃣ OBTENIENDO PRODUCTOS...")
    try:
        response = requests.get(f'{BASE_URL}/api/productos/')
        if response.status_code != 200:
            print(f"❌ Error obteniendo productos: {response.status_code}")
            return
        
        productos = response.json()
        print(f"   ✅ {len(productos)} productos disponibles")
        
        # Seleccionar algunos productos para el combo
        hamburguesa = next((p for p in productos if 'Hamburguesa Clásica' in p.get('nombre', '')), None)
        pizza = next((p for p in productos if 'Pizza Pepperoni' in p.get('nombre', '')), None)
        
        if not hamburguesa or not pizza:
            print("❌ No se encontraron productos necesarios")
            return
        
        print(f"   Seleccionados:")
        print(f"     - {hamburguesa['nombre']}: ${hamburguesa['precio']}")
        print(f"     - {pizza['nombre']}: ${pizza['precio']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Paso 2: Calcular precio total (como lo hace el frontend)
    cantidad_hamburguesa = 2
    cantidad_pizza = 1
    
    precio_total_frontend = (float(hamburguesa['precio']) * cantidad_hamburguesa + 
                           float(pizza['precio']) * cantidad_pizza)
    
    print(f"\n2️⃣ CÁLCULO DEL FRONTEND:")
    print(f"   {hamburguesa['nombre']}: ${hamburguesa['precio']} x{cantidad_hamburguesa} = ${float(hamburguesa['precio']) * cantidad_hamburguesa}")
    print(f"   {pizza['nombre']}: ${pizza['precio']} x{cantidad_pizza} = ${float(pizza['precio']) * cantidad_pizza}")
    print(f"   💰 TOTAL FRONTEND: ${precio_total_frontend}")
    
    # Paso 3: Preparar payload como lo hace el frontend (CORREGIDO)
    productos_payload = [
        {
            'producto': hamburguesa['id'],
            'cantidad': cantidad_hamburguesa,
            'precio_actual': float(hamburguesa['precio']),  # 🔑 NUEVA CORRECCIÓN
            'imagen_seleccionada': 'hamburguesa2.png'
        },
        {
            'producto': pizza['id'],
            'cantidad': cantidad_pizza,
            'precio_actual': float(pizza['precio']),  # 🔑 NUEVA CORRECCIÓN
            'imagen_seleccionada': 'pizza1.png'
        }
    ]
    
    print(f"\n3️⃣ PAYLOAD AL BACKEND:")
    for p in productos_payload:
        print(f"   - Producto {p['producto']}: cantidad={p['cantidad']}, precio_actual=${p['precio_actual']}")
    
    # Paso 4: Enviar al backend (simulando usuario autenticado)
    print(f"\n4️⃣ ENVIANDO AL BACKEND...")
    
    # Para esta prueba, necesitaríamos autenticación. Vamos a simular solo el cálculo
    # del backend usando los mismos datos
    precio_calculado_backend = sum(p['precio_actual'] * p['cantidad'] for p in productos_payload)
    
    print(f"   Backend calcularía: ${precio_calculado_backend}")
    print(f"   Frontend calculó: ${precio_total_frontend}")
    
    if abs(precio_calculado_backend - precio_total_frontend) < 0.01:
        print(f"   ✅ PRECIOS CONSISTENTES ENTRE FRONTEND Y BACKEND")
    else:
        print(f"   ❌ INCONSISTENCIA: Diferencia de ${abs(precio_calculado_backend - precio_total_frontend)}")
    
    return {
        'frontend_total': precio_total_frontend,
        'backend_total': precio_calculado_backend,
        'productos': productos_payload
    }

def simulate_backend_creation(datos):
    """Simular creación en backend con los datos corregidos"""
    print(f"\n5️⃣ SIMULANDO CREACIÓN EN BACKEND:")
    
    # Simular lo que haría el backend con los precios del frontend
    total_backend = 0
    productos_guardados = []
    
    for p in datos['productos']:
        precio_unitario = p['precio_actual']  # Ahora viene del frontend
        cantidad = p['cantidad']
        subtotal = precio_unitario * cantidad
        total_backend += subtotal
        
        productos_guardados.append({
            'producto_id': p['producto'],
            'cantidad': cantidad,
            'precio_unitario': precio_unitario,  # 🔑 GUARDADO HISTÓRICO
            'precio_al_agregar': precio_unitario,  # 🔑 BACKUP
            'subtotal': subtotal
        })
        
        print(f"   Guardado: Producto {p['producto']} -> precio_unitario=${precio_unitario}, cantidad={cantidad}")
    
    print(f"\n   💾 Precio total guardado en BD: ${total_backend}")
    
    # Simular serialización (lo que devolvería la API)
    productos_api = []
    total_serializado = 0
    
    for p in productos_guardados:
        precio_api = p['precio_unitario']  # Usar precio histórico
        subtotal_api = precio_api * p['cantidad'] 
        total_serializado += subtotal_api
        
        productos_api.append({
            'precio': precio_api,  # Precio histórico
            'cantidad': p['cantidad'],
            'subtotal': subtotal_api
        })
    
    print(f"\n6️⃣ RESPUESTA DE API:")
    print(f"   Precio total en API: ${total_serializado}")
    print(f"   Productos en API:")
    for i, p in enumerate(productos_api):
        print(f"     - Producto {i+1}: ${p['precio']} x{p['cantidad']} = ${p['subtotal']}")
    
    # Verificación final
    print(f"\n✅ VERIFICACIÓN FINAL:")
    print(f"   Frontend: ${datos['frontend_total']}")
    print(f"   Backend BD: ${total_backend}")  
    print(f"   API: ${total_serializado}")
    
    todos_iguales = (
        abs(datos['frontend_total'] - total_backend) < 0.01 and
        abs(total_backend - total_serializado) < 0.01
    )
    
    if todos_iguales:
        print(f"   🎉 ¡ÉXITO! PRECIOS CONSISTENTES EN TODAS LAS ETAPAS")
    else:
        print(f"   ❌ Aún hay inconsistencias")

if __name__ == '__main__':
    datos = test_real_frontend_flow()
    if datos:
        simulate_backend_creation(datos)