# API Reference - Endpoints Rápidos

## Tabla Resumen de Endpoints

| Método | Endpoint | Descripción | Autenticación | Parámetros |
|--------|----------|-------------|---------------|-----------|
| **AUTENTICACIÓN** |
| POST | `/api/register/` | Registrar nuevo usuario | No | username, email, password, password_confirm, first_name, last_name, phone_number |
| POST | `/api/token/` | Obtener token (Login) | No | email, password |
| POST | `/api/token/refresh/` | Refrescar token | No | refresh |
| **USUARIOS** |
| GET | `/api/profile/` | Obtener perfil autenticado | Sí | - |
| PATCH | `/api/profile/` | Actualizar perfil | Sí | first_name, last_name, phone_number, profile_image |
| DELETE | `/api/profile/` | Desactivar cuenta | Sí | - |
| PUT | `/api/change-password/` | Cambiar contraseña | Sí | old_password, new_password, confirm_password |
| GET | `/api/users/me/` | Obtener usuario autenticado | Sí | - |
| GET | `/api/users/estadisticas/` | Estadísticas del usuario | Sí | - |
| DELETE | `/api/users/{id}/delete_me/` | Desactivar mi cuenta | Sí | - |
| PATCH | `/api/users/{id}/reactivate/` | Reactivar cuenta (staff) | Sí (staff) | - |
| **PRODUCTOS** |
| GET | `/api/productos/` | Listar productos | No | search, page |
| GET | `/api/productos/{id}/` | Obtener producto | No | - |
| **INGREDIENTES** |
| GET | `/api/ingredientes/` | Listar ingredientes | No | - |
| GET | `/api/ingredientes/{id}/` | Obtener ingrediente | No | - |
| **COMBOS PREDEFINIDOS** |
| GET | `/api/combos/` | Listar combos | No | - |
| GET | `/api/combos/{id}/` | Obtener combo | No | - |
| **COMBOS PERSONALIZADOS** |
| GET | `/api/combos-personalizados/` | Mis combos personalizados | Sí | - |
| POST | `/api/combos-personalizados/` | Crear combo personalizado | Sí | nombre, productos[] |
| GET | `/api/combos-personalizados/{id}/` | Obtener combo personalizado | Sí | - |
| PATCH | `/api/combos-personalizados/{id}/` | Actualizar combo personalizado | Sí | nombre, productos[] |
| DELETE | `/api/combos-personalizados/{id}/` | Eliminar combo personalizado | Sí | - |
| **CARRITO** |
| GET | `/api/orders/cart/` | Obtener carrito | Sí | - |
| POST | `/api/orders/add-to-cart/` | Agregar item al carrito | Sí | producto_id, cantidad, ingredientes[] |
| **PEDIDOS** |
| POST | `/api/orders/pedidos/` | Crear pedido | Sí | direccion, telefono_contacto, metodo_pago |
| GET | `/api/orders/pedidos/` | Listar mis pedidos | Sí | - |
| GET | `/api/orders/pedidos/{id}/` | Obtener detalles del pedido | Sí | - |
| PATCH | `/api/orders/pedidos/{id}/actualizar_estado/` | Actualizar estado (staff) | Sí (staff) | estado_id |
| GET | `/api/orders/pedidos/estadisticas/` | Estadísticas de pedidos | Sí | - |
| GET | `/api/orders/estados/` | Listar estados | Sí | - |
| **RESEÑAS** |
| GET | `/api/reviews/` | Listar reseñas | No | producto |
| POST | `/api/reviews/` | Crear reseña | Sí | producto, texto, calificacion |
| GET | `/api/reviews/{id}/` | Obtener reseña | No | - |
| PATCH | `/api/reviews/{id}/` | Actualizar reseña | Sí (autor) | texto, calificacion |
| DELETE | `/api/reviews/{id}/` | Eliminar reseña | Sí (autor) | - |
| GET | `/api/reviews/mis_reviews/` | Mis reseñas | Sí | - |
| GET | `/api/reviews/estadisticas_producto/` | Estadísticas de producto | No | producto |
| **NOTIFICACIONES** |
| GET | `/api/notifications/` | Listar notificaciones | Sí | - |
| POST | `/api/notifications/` | Crear notificación | Sí (staff) | mensaje, estado |
| GET | `/api/notifications/{id}/` | Obtener notificación | Sí (propietario) | - |
| PATCH | `/api/notifications/{id}/` | Actualizar notificación | Sí (propietario) | estado |
| DELETE | `/api/notifications/{id}/` | Eliminar notificación | Sí (propietario) | - |
| GET | `/api/notifications/no_leidas/` | Notificaciones no leídas | Sí | - |
| PATCH | `/api/notifications/{id}/marcar_leida/` | Marcar como leída | Sí | - |
| PATCH | `/api/notifications/marcar_todas_leidas/` | Marcar todas como leídas | Sí | - |
| DELETE | `/api/notifications/limpiar_leidas/` | Limpiar notificaciones leídas | Sí | - |

---

## Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-----------|---------|
| 200 | OK - Éxito | GET exitoso, actualización completada |
| 201 | Created - Recurso creado | Nuevo usuario, pedido, reseña |
| 204 | No Content - Eliminación exitosa | DELETE sin respuesta |
| 400 | Bad Request - Datos inválidos | Contraseñas no coinciden, campo faltante |
| 401 | Unauthorized - No autenticado | Token faltante o expirado |
| 403 | Forbidden - No autorizado | Intentar editar reseña de otro usuario |
| 404 | Not Found - Recurso no existe | Producto no encontrado |
| 500 | Server Error - Error del servidor | Error interno del backend |

---

## Headers Comunes

### Request
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Response
```
Content-Type: application/json
```

---

## Ejemplos de Uso en JavaScript/Fetch

### 1. Login
```javascript
const response = await fetch('http://localhost:8000/api/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@example.com',
    password: 'password123'
  })
});
const { access, refresh } = await response.json();
localStorage.setItem('access_token', access);
```

### 2. Obtener Productos
```javascript
const response = await fetch('http://localhost:8000/api/productos/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
const products = await response.json();
```

### 3. Crear Pedido
```javascript
const response = await fetch('http://localhost:8000/api/orders/pedidos/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    direccion: 'Calle Principal 123',
    telefono_contacto: '+1234567890',
    metodo_pago: 'TARJETA'
  })
});
const order = await response.json();
```

---

## Campos de Validación

### Usuario
- **email**: Debe ser único y válido
- **username**: 1-150 caracteres, alfanuméricos + _ - .
- **password**: Mínimo 8 caracteres, no completamente numérico
- **phone_number**: Formato internacional (opcional)

### Reseña
- **calificacion**: Número entre 1 y 5 (requerido)
- **texto**: Máximo 1000 caracteres (opcional)
- **producto**: ID de producto existente (requerido)

### Pedido
- **direccion**: Máximo 400 caracteres (requerido)
- **telefono_contacto**: Máximo 30 caracteres (requerido)
- **metodo_pago**: 'SIMULADO', 'TARJETA', etc. (opcional)

### CarritoItem
- **cantidad**: Mínimo 1 (requerido)
- **producto** O **combo**: Al menos uno debe estar presente

---

## Rate Limiting & Throttling

Por defecto: **No configurado** (configurable en producción)

Recomendación para producción:
```python
# settings.py
REST_FRAMEWORK = {
    ...
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

---

## Paginación

Por defecto: **10 resultados por página**

Query parameter:
```
GET /api/productos/?page=1
```

Respuesta con paginación:
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/productos/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Filtrado y Búsqueda

### Productos
```
GET /api/productos/?search=hamburguesa
GET /api/productos/?page=2
```

### Reseñas por Producto
```
GET /api/reviews/?producto=1
```

### Notificaciones No Leídas
```
GET /api/notifications/no_leidas/
```

---

## Respuestas de Error Comunes

### 400 - Bad Request
```json
{
  "email": ["El usuario con este email ya existe."],
  "password": ["Este campo no puede estar en blanco."]
}
```

### 401 - Unauthorized
```json
{
  "detail": "Token inválido o expirado."
}
```

### 403 - Forbidden
```json
{
  "error": "Solo puedes editar tus propias reseñas"
}
```

### 404 - Not Found
```json
{
  "detail": "No encontrado."
}
```

---

## Test Rápido con cURL

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"testpass123"}'

# 2. Login
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# 3. Obtener perfil (con token)
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Listar productos
curl -X GET http://localhost:8000/api/productos/

# 5. Crear reseña (con token)
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"producto":1,"texto":"Excelente","calificacion":5}'
```

---

**Última Actualización:** 21 de Octubre, 2024
