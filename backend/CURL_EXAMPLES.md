# Ejemplos de Testing con cURL

Este archivo contiene ejemplos listos para copiar y pegar en la terminal para probar todos los endpoints del backend.

---

## 🔑 Autenticación

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_doe",
    "email": "juan@example.com",
    "password": "SecurePass123",
    "password_confirm": "SecurePass123",
    "first_name": "Juan",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }'
```

**Respuesta esperada (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 2,
    "username": "juan_doe",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Doe"
  }
}
```

---

### 2. Obtener Token (Login)

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "SecurePass123"
  }'
```

**Respuesta esperada (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**IMPORTANTE:** Guardar el `access` token para usar en próximas requests.

---

### 3. Refrescar Token (Cuando Expira)

```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }'
```

---

## 👤 Gestión de Usuarios

### 1. Obtener Perfil (Usuario Autenticado)

```bash
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Actualizar Perfil

```bash
curl -X PATCH http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan Pablo",
    "phone_number": "+9876543210"
  }'
```

---

### 3. Cambiar Contraseña

```bash
curl -X PUT http://localhost:8000/api/change-password/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "SecurePass123",
    "new_password": "NewPass456",
    "confirm_password": "NewPass456"
  }'
```

---

### 4. Obtener Información del Usuario Autenticado

```bash
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5. Estadísticas del Usuario

```bash
curl -X GET http://localhost:8000/api/users/estadisticas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Desactivar Mi Cuenta

```bash
curl -X DELETE http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🍔 Productos

### 1. Listar Todos los Productos

```bash
curl -X GET http://localhost:8000/api/productos/
```

---

### 2. Listar Productos con Paginación

```bash
curl -X GET "http://localhost:8000/api/productos/?page=1"
```

---

### 3. Buscar Productos

```bash
curl -X GET "http://localhost:8000/api/productos/?search=hamburguesa"
```

---

### 4. Obtener Detalles de un Producto

```bash
curl -X GET http://localhost:8000/api/productos/1/
```

---

## 🥬 Ingredientes

### 1. Listar Ingredientes

```bash
curl -X GET http://localhost:8000/api/ingredientes/
```

---

### 2. Obtener Detalles de Ingrediente

```bash
curl -X GET http://localhost:8000/api/ingredientes/1/
```

---

## 🎁 Combos

### 1. Listar Combos Predefinidos

```bash
curl -X GET http://localhost:8000/api/combos/
```

---

### 2. Obtener Detalles de un Combo

```bash
curl -X GET http://localhost:8000/api/combos/1/
```

---

### 3. Crear Combo Personalizado

```bash
curl -X POST http://localhost:8000/api/combos-personalizados/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Combo Especial",
    "productos": [
      {
        "producto": 1,
        "cantidad": 1
      },
      {
        "producto": 2,
        "cantidad": 2
      }
    ]
  }'
```

---

### 4. Listar Mis Combos Personalizados

```bash
curl -X GET http://localhost:8000/api/combos-personalizados/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5. Obtener Detalles de Combo Personalizado

```bash
curl -X GET http://localhost:8000/api/combos-personalizados/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Actualizar Combo Personalizado

```bash
curl -X PATCH http://localhost:8000/api/combos-personalizados/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Combo Actualizado",
    "productos": [
      {
        "producto": 1,
        "cantidad": 3
      }
    ]
  }'
```

---

### 7. Eliminar Combo Personalizado

```bash
curl -X DELETE http://localhost:8000/api/combos-personalizados/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🛒 Carrito

### 1. Ver Mi Carrito

```bash
curl -X GET http://localhost:8000/api/orders/cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Agregar Item al Carrito

```bash
curl -X POST http://localhost:8000/api/orders/add-to-cart/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 2,
    "ingredientes": [1, 2]
  }'
```

**Respuesta esperada (200):**
```json
{
  "ok": true,
  "item_id": 1
}
```

---

## 📦 Pedidos

### 1. Crear Pedido (desde Carrito)

```bash
curl -X POST http://localhost:8000/api/orders/pedidos/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direccion": "Calle Principal 123, Apt 4B",
    "telefono_contacto": "+1234567890",
    "metodo_pago": "TARJETA"
  }'
```

---

### 2. Listar Mis Pedidos

```bash
curl -X GET http://localhost:8000/api/orders/pedidos/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. Obtener Detalles de Pedido

```bash
curl -X GET http://localhost:8000/api/orders/pedidos/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Actualizar Estado de Pedido (Solo Staff)

```bash
curl -X PATCH http://localhost:8000/api/orders/pedidos/1/actualizar_estado/ \
  -H "Authorization: Bearer STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "estado_id": 5
  }'
```

**Estados disponibles:**
- 1: No Leído
- 2: Leído
- 3: Enviado
- 4: En Preparación
- 5: En Camino
- 6: Entregado
- 7: Cancelado

---

### 5. Estadísticas de Pedidos

```bash
curl -X GET http://localhost:8000/api/orders/pedidos/estadisticas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Listar Estados

```bash
curl -X GET http://localhost:8000/api/orders/estados/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⭐ Reseñas

### 1. Listar Reseñas de un Producto

```bash
curl -X GET "http://localhost:8000/api/reviews/?producto=1"
```

---

### 2. Crear Reseña

```bash
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": 1,
    "texto": "Excelente hamburguesa, muy sabrosa y fresca",
    "calificacion": 5
  }'
```

---

### 3. Obtener Mis Reseñas

```bash
curl -X GET http://localhost:8000/api/reviews/mis_reviews/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Actualizar Reseña

```bash
curl -X PATCH http://localhost:8000/api/reviews/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "texto": "Reseña actualizada",
    "calificacion": 4
  }'
```

---

### 5. Eliminar Reseña

```bash
curl -X DELETE http://localhost:8000/api/reviews/1/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Estadísticas de Producto (Reseñas)

```bash
curl -X GET "http://localhost:8000/api/reviews/estadisticas_producto/?producto=1"
```

---

## 🔔 Notificaciones

### 1. Listar Notificaciones

```bash
curl -X GET http://localhost:8000/api/notifications/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Obtener Solo Notificaciones No Leídas

```bash
curl -X GET http://localhost:8000/api/notifications/no_leidas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. Marcar Notificación como Leída

```bash
curl -X PATCH http://localhost:8000/api/notifications/1/marcar_leida/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Marcar Todas las Notificaciones como Leídas

```bash
curl -X PATCH http://localhost:8000/api/notifications/marcar_todas_leidas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 5. Limpiar Notificaciones Leídas

```bash
curl -X DELETE http://localhost:8000/api/notifications/limpiar_leidas/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📋 Flujo Completo de Compra

Este es un flujo completo que debes ejecutar en orden:

```bash
#!/bin/bash

# 1. Registrar usuario
echo "=== 1. Registrando usuario ==="
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "TestPass123",
    "password_confirm": "TestPass123",
    "first_name": "Test",
    "last_name": "User"
  }'

# 2. Login y obtener token
echo -e "\n\n=== 2. Obteniendo token ==="
TOKEN=$(curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }' | grep -o '"access":"[^"]*' | grep -o '[^"]*$')

echo "Token: $TOKEN"

# 3. Ver productos disponibles
echo -e "\n\n=== 3. Listando productos ==="
curl -s -X GET http://localhost:8000/api/productos/ | head -20

# 4. Agregar producto al carrito
echo -e "\n\n=== 4. Agregando al carrito ==="
curl -X POST http://localhost:8000/api/orders/add-to-cart/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 2,
    "ingredientes": []
  }'

# 5. Ver carrito
echo -e "\n\n=== 5. Viendo carrito ==="
curl -X GET http://localhost:8000/api/orders/cart/ \
  -H "Authorization: Bearer $TOKEN"

# 6. Crear pedido
echo -e "\n\n=== 6. Creando pedido ==="
curl -X POST http://localhost:8000/api/orders/pedidos/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "direccion": "Calle Principal 123",
    "telefono_contacto": "+1234567890",
    "metodo_pago": "TARJETA"
  }'

# 7. Ver mis pedidos
echo -e "\n\n=== 7. Viendo mis pedidos ==="
curl -X GET http://localhost:8000/api/orders/pedidos/ \
  -H "Authorization: Bearer $TOKEN"

# 8. Crear reseña
echo -e "\n\n=== 8. Dejando reseña ==="
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": 1,
    "texto": "Muy bueno!",
    "calificacion": 5
  }'
```

---

## 💡 Tips para Testing

### 1. Guardar Token en Variable
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}' \
  | grep -o '"access":"[^"]*' | grep -o '[^"]*$')
```

### 2. Formatear JSON Response
```bash
# Usar jq para formatear pretty print
curl -s http://localhost:8000/api/productos/ | jq .

# O instalar jq si no lo tienes:
# Ubuntu: sudo apt-get install jq
# Mac: brew install jq
```

### 3. Verificar Status Code
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/api/productos/
# Outputs: 200
```

### 4. Ver Headers de Response
```bash
curl -i http://localhost:8000/api/productos/
```

---

## 🐛 Errores Comunes

### Error 401: Unauthorized
**Causa:** Token inválido o faltante  
**Solución:** Verificar que el token es válido y no expiró

```bash
# Token expirado? Refrescar:
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "YOUR_REFRESH_TOKEN"}'
```

### Error 400: Bad Request
**Causa:** Datos inválidos  
**Solución:** Verificar que los datos cumplen con las validaciones

```bash
# Ejemplo: calificación debe estar entre 1-5
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "producto": 1,
    "calificacion": 6  # Error! Máximo 5
  }'
```

### Error 403: Forbidden
**Causa:** No tienes permiso para esta acción  
**Solución:** Solo el autor puede editar/eliminar sus reseñas

### Error 404: Not Found
**Causa:** Recurso no existe  
**Solución:** Verificar que el ID es válido

```bash
# Verificar productos disponibles
curl http://localhost:8000/api/productos/
```

---

**Última Actualización:** 21 de Octubre, 2024
