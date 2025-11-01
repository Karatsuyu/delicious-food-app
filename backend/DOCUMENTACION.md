# Documentación Backend - Delicious Food App

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración Inicial](#configuración-inicial)
5. [Autenticación](#autenticación)
6. [Modelos de Datos](#modelos-de-datos)
7. [Endpoints API](#endpoints-api)
8. [Ejemplos de Requests/Responses](#ejemplos-de-requestsresponses)
9. [Flujos de Negocio](#flujos-de-negocio)
10. [Base de Datos](#base-de-datos)

---

## Introducción

**Delicious Food App** es una aplicación de restaurante que permite a los usuarios:
- Registrarse y autenticarse
- Explorar productos y combos
- Personalizar combos según sus preferencias
- Gestionar su carrito de compra
- Crear y rastrear pedidos
- Dejar reseñas sobre productos
- Recibir notificaciones del sistema

El backend está construido con **Django REST Framework** y proporciona una API RESTful completa que comunica con el frontend de React.

---

## Stack Tecnológico

| Componente | Versión | Descripción |
|-----------|---------|-------------|
| Django | 5.2.6 | Framework web backend |
| Django REST Framework | 3.16.1 | Herramientas para construir APIs REST |
| djangorestframework-simplejwt | 5.5.1 | Autenticación JWT (tokens) |
| django-cors-headers | 4.8.0 | Manejo de CORS para frontend |
| Pillow | 11.3.0 | Procesamiento de imágenes |
| SQLite3 | (default) | Base de datos local (desarrollo) |
| PostgreSQL | (con psycopg2) | Base de datos producción |

### Dependencias Principales (requirements.txt)
```
Django==5.2.6
djangorestframework==3.16.1
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.8.0
Pillow==11.3.0
psycopg2-binary==2.9.10
```

---

## Estructura del Proyecto

```
backend/
├── manage.py                 # Script de administración Django
├── db.sqlite3               # Base de datos SQLite (desarrollo)
├── requirements.txt         # Dependencias Python
│
├── restaurant_api/          # Configuración global del proyecto
│   ├── settings.py          # Configuración de Django (DEBUG, INSTALLED_APPS, etc.)
│   ├── urls.py              # Rutas principales y enrutamiento de apps
│   ├── wsgi.py              # Interfaz para servidores WSGI
│   └── asgi.py              # Interfaz para servidores ASGI
│
├── users/                   # App de autenticación y perfiles
│   ├── models.py            # Modelo User personalizado
│   ├── views.py             # Vistas (registro, perfil, cambio contraseña)
│   ├── serializers.py       # Serializadores DRF
│   ├── urls.py              # Rutas de users
│   ├── admin.py             # Configuración admin
│   └── migrations/          # Migraciones de BD
│
├── products/                # App de productos y combos
│   ├── models.py            # Modelos (Producto, Ingrediente, Combo, etc.)
│   ├── views.py             # Vistas (CRUD de productos, combos personalizados)
│   ├── serializers.py       # Serializadores DRF
│   ├── urls.py              # Rutas de products
│   ├── admin.py             # Configuración admin
│   └── migrations/          # Migraciones de BD
│
├── orders/                  # App de pedidos y carrito
│   ├── models.py            # Modelos (Pedido, PedidoItem, Carrito, Estado)
│   ├── views.py             # Vistas (gestión de carrito y pedidos)
│   ├── serializers.py       # Serializadores DRF
│   ├── urls.py              # Rutas de orders
│   ├── admin.py             # Configuración admin
│   └── migrations/          # Migraciones de BD
│
├── reviews/                 # App de reseñas de productos
│   ├── models.py            # Modelo Review
│   ├── views.py             # Vistas (CRUD de reseñas, estadísticas)
│   ├── serializers.py       # Serializadores DRF
│   ├── urls.py              # Rutas de reviews
│   ├── admin.py             # Configuración admin
│   └── migrations/          # Migraciones de BD
│
└── notifications/           # App de notificaciones
    ├── models.py            # Modelo Notificacion
    ├── views.py             # Vistas (gestión de notificaciones)
    ├── serializers.py       # Serializadores DRF
    ├── urls.py              # Rutas de notifications
    ├── admin.py             # Configuración admin
    └── migrations/          # Migraciones de BD
```

---

## Configuración Inicial

### 1. Instalación del Proyecto

```bash
# Clonar repositorio
git clone <repository-url>
cd delicious-food-app/backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configuración de Variables de Entorno

Crear archivo `.env` en la raíz del proyecto backend:

```env
DEBUG=True
SECRET_KEY=django-insecure-6y5%)9^%p5cae!$old!9u@za2=_!gc&v@p!z0ccddoh79w4way
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (opcional, por defecto usa SQLite)
DATABASE_URL=postgresql://user:password@localhost:5432/delicious_food

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_DELTA=3600
```

### 3. Migraciones de Base de Datos

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (admin)
python manage.py createsuperuser
# Ingresar: email, username, contraseña

# (Opcional) Cargar datos iniciales
python manage.py loaddata fixtures/initial_data.json
```

### 4. Ejecutar el Servidor de Desarrollo

```bash
python manage.py runserver
# El servidor correrá en http://127.0.0.1:8000/
```

### 5. Acceder a la Admin Panel

```
http://127.0.0.1:8000/admin/
```

---

## Autenticación

### Sistema JWT (JSON Web Tokens)

El backend utiliza **SimpleJWT** para autenticación. Los tokens son válidos por un período específico y deben incluirse en los headers de cada request autenticado.

### Flujo de Autenticación

```
1. Usuario se registra → POST /api/register/
   → Retorna datos del usuario

2. Usuario inicia sesión → POST /api/token/
   → Retorna { access, refresh } tokens

3. Cliente guarda tokens en localStorage

4. Cada request autenticado incluye:
   Authorization: Bearer <access_token>

5. Cuando access_token expira → POST /api/token/refresh/
   → Retorna nuevo access_token
```

### Headers Requeridos

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

---

## Modelos de Datos

### 1. User (Autenticación)

```python
class User(AbstractUser):
    email                  # EmailField (único)
    username              # CharField (heredado de AbstractUser)
    first_name           # CharField
    last_name            # CharField
    phone_number         # CharField (opcional)
    points               # IntegerField (puntos del cliente)
    profile_image        # ImageField (opcional)
    is_active            # BooleanField (para desactivar cuenta)
    date_joined          # DateTimeField (automático)
```

**Relaciones:**
- Uno a muchos → Pedido
- Uno a muchos → Review
- Uno a muchos → ComboPersonalizado
- Uno a muchos → Notificacion

---

### 2. Producto (Catálogo)

```python
class Producto(models.Model):
    usuario              # FK → User (quien lo crea/administra)
    nombre              # CharField
    descripcion         # TextField
    precio_base         # DecimalField
    imagen              # ImageField
    es_personalizable   # BooleanField
    ingredientes        # M2M → Ingrediente (relación ProductoIngrediente)
    creado              # DateTimeField (automático)
```

**Relaciones:**
- Muchos a uno → User (administrador)
- Muchos a muchos → Ingrediente (mediante ProductoIngrediente)
- Uno a muchos → Review

---

### 3. Ingrediente (Opciones Personalizables)

```python
class Ingrediente(models.Model):
    nombre              # CharField
    costo_extra         # DecimalField (precio adicional)
```

**Relaciones:**
- Muchos a muchos → Producto (mediante ProductoIngrediente)
- Muchos a muchos → ComboPersonalizado (mediante ComboPersonalizadoProducto)

---

### 4. ProductoIngrediente (Relación M2M)

```python
class ProductoIngrediente(models.Model):
    producto            # FK → Producto
    ingrediente         # FK → Ingrediente
    cantidad            # IntegerField (por defecto 1)
```

**Propósito:** Definir qué ingredientes tiene cada producto.

---

### 5. Combo (Promociones)

```python
class Combo(models.Model):
    usuario              # FK → User
    nombre              # CharField
    descripcion         # TextField
    precio_total        # DecimalField (precio del combo completo)
    productos           # M2M → Producto (mediante ComboProducto)
    es_personalizable   # BooleanField
    creado              # DateTimeField
```

**Relaciones:**
- Muchos a uno → User
- Muchos a muchos → Producto (mediante ComboProducto)

---

### 6. ComboProducto (Relación M2M)

```python
class ComboProducto(models.Model):
    combo               # FK → Combo
    producto            # FK → Producto
    cantidad            # IntegerField (cuántos de este producto en el combo)
```

---

### 7. ComboPersonalizado (Carrito → Combo)

```python
class ComboPersonalizado(models.Model):
    usuario              # FK → User
    nombre              # CharField
    productos           # M2M → Producto (mediante ComboPersonalizadoProducto)
    precio_total        # DecimalField (calculado automáticamente)
    creado_en          # DateTimeField
```

**Propósito:** Guardar combos personalizados creados por el usuario.

---

### 8. ComboPersonalizadoProducto (Relación M2M)

```python
class ComboPersonalizadoProducto(models.Model):
    combo               # FK → ComboPersonalizado
    producto            # FK → Producto
    cantidad            # IntegerField
```

---

### 9. Carrito

```python
class Carrito(models.Model):
    usuario              # FK → User
    creado              # DateTimeField (automático)
```

**Relaciones:**
- Uno a muchos → CarritoItem

---

### 10. CarritoItem (Items en el Carrito)

```python
class CarritoItem(models.Model):
    carrito              # FK → Carrito
    producto            # FK → Producto (nullable)
    combo               # FK → Combo (nullable)
    cantidad            # IntegerField
    ingredientes        # M2M → Ingrediente
    precio_total        # DecimalField (precio_unitario × cantidad)
```

---

### 11. Pedido (Órdenes)

```python
class Pedido(models.Model):
    usuario              # FK → User
    estado              # FK → Estado
    total               # DecimalField
    direccion           # CharField (dirección de entrega)
    telefono_contacto   # CharField
    metodo_pago         # CharField (por defecto 'SIMULADO')
    creado              # DateTimeField (automático)
```

**Relaciones:**
- Muchos a uno → User
- Muchos a uno → Estado
- Uno a muchos → PedidoItem

---

### 12. PedidoItem (Items del Pedido)

```python
class PedidoItem(models.Model):
    pedido              # FK → Pedido
    producto            # FK → Producto (nullable)
    combo               # FK → Combo (nullable)
    cantidad            # PositiveIntegerField
    precio_unitario     # DecimalField (precio al momento del pedido)
```

---

### 13. Estado (Estados del Sistema)

```python
class Estado(models.Model):
    descripcion         # CharField (único)
    # Ejemplos: "Enviado", "Entregado", "Cancelado", "No Leído", "Leído"
```

**Relaciones:**
- Uno a muchos → Pedido
- Uno a muchos → Notificacion

---

### 14. Review (Reseñas de Productos)

```python
class Review(models.Model):
    usuario              # FK → User
    producto            # FK → Producto
    texto               # TextField
    calificacion        # IntegerField (1-5)
    creado              # DateTimeField (automático)
```

**Validación:** calificacion debe estar entre 1 y 5.

---

### 15. Notificacion (Mensajes del Sistema)

```python
class Notificacion(models.Model):
    usuario              # FK → User
    mensaje             # CharField (máximo 500 caracteres)
    estado              # FK → Estado
    creado              # DateTimeField (automático)
```

---

## Endpoints API

### Autenticación

#### 1. Registro de Usuario
```
POST /api/token/
```

**Request Body:**
```json
{
  "username": "juan_doe",
  "email": "juan@example.com",
  "password": "securepassword123",
  "password_confirm": "securepassword123",
  "first_name": "Juan",
  "last_name": "Doe",
  "phone_number": "+1234567890"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "username": "juan_doe",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Doe"
  }
}
```

---

#### 2. Obtener Token (Login)
```
POST /api/token/
```

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

#### 3. Refrescar Token
```
POST /api/token/refresh/
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### Usuarios

#### 1. Obtener Perfil del Usuario Autenticado
```
GET /api/profile/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "juan_doe",
  "email": "juan@example.com",
  "first_name": "Juan",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "points": 150,
  "profile_image": "/media/profiles/user1.jpg",
  "date_joined": "2024-10-08T10:30:00Z"
}
```

---

#### 2. Actualizar Perfil
```
PATCH /api/profile/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "first_name": "Juan Pablo",
  "phone_number": "+9876543210"
}
```

**Response (200):**
```json
{
  "message": "Perfil actualizado exitosamente",
  "user": {
    "id": 1,
    "username": "juan_doe",
    "email": "juan@example.com",
    "first_name": "Juan Pablo",
    "last_name": "Doe",
    "phone_number": "+9876543210",
    "points": 150,
    "profile_image": "/media/profiles/user1.jpg",
    "date_joined": "2024-10-08T10:30:00Z"
  }
}
```

---

#### 3. Cambiar Contraseña
```
PUT /api/change-password/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "old_password": "securepassword123",
  "new_password": "newpassword456",
  "confirm_password": "newpassword456"
}
```

**Response (200):**
```json
{
  "message": "Contraseña cambiada exitosamente"
}
```

---

#### 4. Desactivar Cuenta
```
DELETE /api/profile/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Tu cuenta ha sido desactivada exitosamente",
  "note": "Tu cuenta está desactivada pero no eliminada. Puedes contactar al soporte para reactivarla."
}
```

---

#### 5. Obtener Info del Usuario Autenticado
```
GET /api/users/me/
```

**Response (200):**
```json
{
  "id": 1,
  "username": "juan_doe",
  "email": "juan@example.com",
  "first_name": "Juan",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "points": 150,
  "profile_image": "/media/profiles/user1.jpg",
  "date_joined": "2024-10-08T10:30:00Z"
}
```

---

#### 6. Estadísticas del Usuario
```
GET /api/users/estadisticas/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "usuario": "juan_doe",
  "email": "juan@example.com",
  "puntos": 150,
  "fecha_registro": "2024-10-08T10:30:00Z",
  "total_pedidos": 5,
  "total_reviews": 8,
  "cuenta_activa": true
}
```

---

### Productos

#### 1. Listar Todos los Productos
```
GET /api/productos/
```

**Query Parameters (opcionales):**
- `search`: búsqueda por nombre
- `page`: número de página (paginación)

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "nombre": "Hamburguesa Clásica",
    "descripcion": "Hamburguesa de carne de res con queso y lechuga",
    "precio_base": 8.99,
    "imagen": "/media/products/burger1.jpg",
    "es_personalizable": true,
    "ingredientes": [
      {
        "id": 1,
        "nombre": "Queso Extra",
        "costo_extra": 1.50
      },
      {
        "id": 2,
        "nombre": "Tocino",
        "costo_extra": 2.00
      }
    ]
  }
]
```

---

#### 2. Obtener Detalles de Producto
```
GET /api/productos/{id}/
```

**Response (200):**
```json
{
  "id": 1,
  "usuario": 1,
  "nombre": "Hamburguesa Clásica",
  "descripcion": "Hamburguesa de carne de res con queso y lechuga",
  "precio_base": 8.99,
  "imagen": "/media/products/burger1.jpg",
  "es_personalizable": true,
  "ingredientes": [
    {
      "id": 1,
      "nombre": "Queso Extra",
      "costo_extra": 1.50
    }
  ]
}
```

---

### Ingredientes

#### 1. Listar Ingredientes
```
GET /api/ingredientes/
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre": "Queso Extra",
    "costo_extra": 1.50
  },
  {
    "id": 2,
    "nombre": "Tocino",
    "costo_extra": 2.00
  }
]
```

---

### Combos

#### 1. Listar Combos (Predefinidos)
```
GET /api/combos/
```

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "nombre": "Combo BBQ Crispy",
    "descripcion": "Hamburguesa BBQ con papas y bebida",
    "precio_total": 15.99,
    "es_personalizable": true,
    "productos": [
      {
        "id": 1,
        "nombre": "Hamburguesa BBQ",
        "precio_base": 8.99,
        "es_personalizable": true
      }
    ]
  }
]
```

---

#### 2. Crear Combo Personalizado
```
POST /api/combos-personalizados/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
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
}
```

**Response (201):**
```json
{
  "id": 1,
  "usuario": 1,
  "nombre": "Mi Combo Especial",
  "precio_total": 20.50,
  "creado_en": "2024-10-21T14:30:00Z",
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
}
```

---

#### 3. Listar Combos Personalizados del Usuario
```
GET /api/combos-personalizados/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "nombre": "Mi Combo Especial",
    "precio_total": 20.50,
    "creado_en": "2024-10-21T14:30:00Z",
    "productos": [
      {
        "producto": 1,
        "cantidad": 1
      }
    ]
  }
]
```

---

### Carrito

#### 1. Obtener Carrito del Usuario
```
GET /api/orders/cart/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "usuario": 1,
  "creado": "2024-10-21T10:00:00Z",
  "items": [
    {
      "id": 1,
      "producto": 1,
      "combo": null,
      "cantidad": 2,
      "precio_total": 17.98
    }
  ],
  "total_carrito": 17.98
}
```

---

#### 2. Agregar Item al Carrito
```
POST /api/orders/add-to-cart/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "producto_id": 1,
  "cantidad": 2,
  "ingredientes": [1, 2]
}
```

**Response (200):**
```json
{
  "ok": true,
  "item_id": 1
}
```

---

### Pedidos

#### 1. Crear Pedido (desde Carrito)
```
POST /api/orders/pedidos/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "direccion": "Calle Principal 123, Apt 4B",
  "telefono_contacto": "+1234567890",
  "metodo_pago": "TARJETA"
}
```

**Response (201):**
```json
{
  "id": 1,
  "usuario": 1,
  "usuario_email": "juan@example.com",
  "estado": 1,
  "estado_descripcion": "Enviado",
  "total": 17.98,
  "direccion": "Calle Principal 123, Apt 4B",
  "telefono_contacto": "+1234567890",
  "metodo_pago": "TARJETA",
  "creado": "2024-10-21T14:35:00Z",
  "items": [
    {
      "id": 1,
      "producto": 1,
      "combo": null,
      "cantidad": 2,
      "precio_unitario": 8.99
    }
  ]
}
```

---

#### 2. Listar Pedidos del Usuario
```
GET /api/orders/pedidos/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "usuario_email": "juan@example.com",
    "estado": 1,
    "estado_descripcion": "Enviado",
    "total": 17.98,
    "direccion": "Calle Principal 123, Apt 4B",
    "telefono_contacto": "+1234567890",
    "metodo_pago": "TARJETA",
    "creado": "2024-10-21T14:35:00Z",
    "items": [...]
  }
]
```

---

#### 3. Obtener Detalles de un Pedido
```
GET /api/orders/pedidos/{id}/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "usuario": 1,
  "usuario_email": "juan@example.com",
  "estado": 1,
  "estado_descripcion": "Enviado",
  "total": 17.98,
  "direccion": "Calle Principal 123, Apt 4B",
  "telefono_contacto": "+1234567890",
  "metodo_pago": "TARJETA",
  "creado": "2024-10-21T14:35:00Z",
  "items": [
    {
      "id": 1,
      "producto": 1,
      "combo": null,
      "cantidad": 2,
      "precio_unitario": 8.99
    }
  ]
}
```

---

#### 4. Actualizar Estado de Pedido (Solo Staff)
```
PATCH /api/orders/pedidos/{id}/actualizar_estado/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "estado_id": 2
}
```

**Response (200):**
```json
{
  "id": 1,
  "estado": 2,
  "estado_descripcion": "Entregado",
  ...
}
```

---

#### 5. Estadísticas de Pedidos
```
GET /api/orders/pedidos/estadisticas/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "total_pedidos": 5,
  "total_gastado": 89.90,
  "pedidos_por_estado": {
    "Enviado": 2,
    "Entregado": 3
  },
  "promedio_por_pedido": 17.98
}
```

---

### Reseñas

#### 1. Crear Reseña
```
POST /api/reviews/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "producto": 1,
  "texto": "Excelente hamburguesa, muy sabrosa",
  "calificacion": 5
}
```

**Response (201):**
```json
{
  "id": 1,
  "usuario": 1,
  "usuario_email": "juan@example.com",
  "producto": 1,
  "producto_nombre": "Hamburguesa Clásica",
  "texto": "Excelente hamburguesa, muy sabrosa",
  "calificacion": 5,
  "creado": "2024-10-21T15:00:00Z"
}
```

---

#### 2. Listar Reseñas de un Producto
```
GET /api/reviews/?producto=1
```

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "usuario_email": "juan@example.com",
    "producto": 1,
    "producto_nombre": "Hamburguesa Clásica",
    "texto": "Excelente hamburguesa, muy sabrosa",
    "calificacion": 5,
    "creado": "2024-10-21T15:00:00Z"
  }
]
```

---

#### 3. Obtener Mis Reseñas
```
GET /api/reviews/mis_reviews/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "usuario_email": "juan@example.com",
    "producto": 1,
    "producto_nombre": "Hamburguesa Clásica",
    "texto": "Excelente hamburguesa, muy sabrosa",
    "calificacion": 5,
    "creado": "2024-10-21T15:00:00Z"
  }
]
```

---

#### 4. Actualizar Reseña
```
PATCH /api/reviews/{id}/
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "texto": "Actualización: Muy bueno",
  "calificacion": 4
}
```

**Response (200):**
```json
{
  "id": 1,
  "usuario": 1,
  "usuario_email": "juan@example.com",
  "producto": 1,
  "producto_nombre": "Hamburguesa Clásica",
  "texto": "Actualización: Muy bueno",
  "calificacion": 4,
  "creado": "2024-10-21T15:00:00Z"
}
```

---

#### 5. Eliminar Reseña
```
DELETE /api/reviews/{id}/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (204):** No content

---

#### 6. Estadísticas de Reseñas de Producto
```
GET /api/reviews/estadisticas_producto/?producto=1
```

**Response (200):**
```json
{
  "producto_id": 1,
  "producto_nombre": "Hamburguesa Clásica",
  "total_reviews": 8,
  "promedio_calificacion": 4.63,
  "distribucion_calificaciones": {
    "1": 0,
    "2": 1,
    "3": 1,
    "4": 2,
    "5": 4
  }
}
```

---

### Notificaciones

#### 1. Listar Notificaciones del Usuario
```
GET /api/notifications/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "usuario": 1,
    "usuario_email": "juan@example.com",
    "mensaje": "Tu pedido #1 ha sido entregado exitosamente",
    "estado": 2,
    "estado_descripcion": "Leído",
    "creado": "2024-10-21T16:00:00Z"
  }
]
```

---

#### 2. Obtener Notificaciones No Leídas
```
GET /api/notifications/no_leidas/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "count": 3,
  "results": [
    {
      "id": 2,
      "usuario": 1,
      "usuario_email": "juan@example.com",
      "mensaje": "Tu pedido #2 está siendo preparado",
      "estado": 1,
      "estado_descripcion": "No Leído",
      "creado": "2024-10-21T17:00:00Z"
    }
  ]
}
```

---

#### 3. Marcar Notificación como Leída
```
PATCH /api/notifications/{id}/marcar_leida/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 2,
  "usuario": 1,
  "usuario_email": "juan@example.com",
  "mensaje": "Tu pedido #2 está siendo preparado",
  "estado": 2,
  "estado_descripcion": "Leído",
  "creado": "2024-10-21T17:00:00Z"
}
```

---

#### 4. Marcar Todas las Notificaciones como Leídas
```
PATCH /api/notifications/marcar_todas_leidas/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Se marcaron 3 notificaciones como leídas",
  "count": 3
}
```

---

#### 5. Limpiar Notificaciones Leídas
```
DELETE /api/notifications/limpiar_leidas/
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Se eliminaron 5 notificaciones leídas",
  "count": 5
}
```

---

## Ejemplos de Requests/Responses

### Flujo Completo: Registro → Pedido → Reseña

#### Paso 1: Registrar Usuario

```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_doe",
    "email": "juan@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "first_name": "Juan",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "username": "juan_doe",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Doe"
  }
}
```

---

#### Paso 2: Obtener Token (Login)

```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "securepass123"
  }'
```

**Respuesta:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

> **Guardar el `access` token para todas las próximas requests autenticadas**

---

#### Paso 3: Obtener Productos

```bash
curl -X GET http://localhost:8000/api/productos/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "nombre": "Hamburguesa Clásica",
    "precio_base": 8.99,
    "imagen": "/media/products/burger1.jpg"
  },
  {
    "id": 2,
    "nombre": "Pizza Margherita",
    "precio_base": 12.99,
    "imagen": "/media/products/pizza1.jpg"
  }
]
```

---

#### Paso 4: Agregar Items al Carrito

```bash
curl -X POST http://localhost:8000/api/orders/add-to-cart/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 2,
    "ingredientes": [1, 2]
  }'
```

**Respuesta:**
```json
{
  "ok": true,
  "item_id": 1
}
```

---

#### Paso 5: Crear Pedido

```bash
curl -X POST http://localhost:8000/api/orders/pedidos/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "direccion": "Calle Principal 123, Apt 4B",
    "telefono_contacto": "+1234567890",
    "metodo_pago": "TARJETA"
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "usuario": 1,
  "estado": 1,
  "estado_descripcion": "Enviado",
  "total": 17.98,
  "direccion": "Calle Principal 123, Apt 4B",
  "creado": "2024-10-21T14:35:00Z",
  "items": [
    {
      "id": 1,
      "producto": 1,
      "cantidad": 2,
      "precio_unitario": 8.99
    }
  ]
}
```

---

#### Paso 6: Dejar Reseña del Producto

```bash
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "producto": 1,
    "texto": "Excelente hamburguesa, muy sabrosa y fresca",
    "calificacion": 5
  }'
```

**Respuesta:**
```json
{
  "id": 1,
  "usuario": 1,
  "usuario_email": "juan@example.com",
  "producto": 1,
  "producto_nombre": "Hamburguesa Clásica",
  "texto": "Excelente hamburguesa, muy sabrosa y fresca",
  "calificacion": 5,
  "creado": "2024-10-21T15:00:00Z"
}
```

---

## Flujos de Negocio

### 1. Flujo de Registro e Inicio de Sesión

```
Usuario → GET / → SiteHeader (botones Sign in, Register)
         ↓
    [Nuevo Usuario?]
         ↓
    POST /api/register/ (crear cuenta)
         ↓
    Response: usuario creado
         ↓
    POST /api/token/ (login)
         ↓
    Response: { access, refresh } tokens
         ↓
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
         ↓
    Redirect a /menu o /home
```

---

### 2. Flujo de Compra (Carrito → Pedido)

```
Usuario Autenticado
         ↓
    GET /api/productos/ (explorar catálogo)
         ↓
    POST /api/orders/add-to-cart/ (agregar a carrito, puede repetir)
         ↓
    GET /api/orders/cart/ (ver carrito antes de comprar)
         ↓
    POST /api/orders/pedidos/ (crear pedido desde carrito)
         ↓
    Response: pedido creado con estado "Enviado"
         ↓
    Carrito se limpia automáticamente
         ↓
    Notificación: "Tu pedido #X ha sido creado"
         ↓
    GET /api/orders/pedidos/ (ver historial de pedidos)
```

---

### 3. Flujo de Combo Personalizado

```
Usuario Autenticado
         ↓
    GET /api/productos/ (listar productos disponibles)
         ↓
    GET /api/ingredientes/ (ver opciones de personalización)
         ↓
    POST /api/combos-personalizados/ (crear combo personalizado)
         ↓
    Response: combo personalizado guardado
         ↓
    GET /api/combos-personalizados/ (ver combos personalizados)
         ↓
    POST /api/orders/add-to-cart/ (agregar a carrito desde combo personalizado)
```

---

### 4. Flujo de Reseñas

```
Usuario Autenticado (después de compra)
         ↓
    GET /api/reviews/?producto=1 (ver reseñas existentes del producto)
         ↓
    POST /api/reviews/ (crear propia reseña)
         ↓
    Response: reseña creada
         ↓
    GET /api/reviews/estadisticas_producto/?producto=1 (ver promedio de calificación)
         ↓
    [Usuario quiere editar su reseña?]
         ├→ PATCH /api/reviews/{id}/ (editar)
         └→ DELETE /api/reviews/{id}/ (eliminar)
```

---

### 5. Flujo de Notificaciones

```
Sistema (Backend Event)
         ↓
    Pedido creado → POST Notificación
         ↓
    Estado de pedido actualizado → POST Notificación
    (solo si es staff/admin)
         ↓
    Usuario Autenticado
         ↓
    GET /api/notifications/ (ver todas las notificaciones)
         ↓
    GET /api/notifications/no_leidas/ (ver solo no leídas)
         ↓
    PATCH /api/notifications/{id}/marcar_leida/ (marcar como leída)
         ↓
    DELETE /api/notifications/limpiar_leidas/ (eliminar leídas)
```

---

## Base de Datos

### Diagrama Relacional

```
┌─────────────┐
│    User     │ (Autenticación)
└─────────────┘
      │
      ├──→ Pedido
      ├──→ Review
      ├──→ ComboPersonalizado
      └──→ Notificacion

┌─────────────┐          ┌──────────────┐
│  Producto   │◄────────►│ Ingrediente  │
└─────────────┘          └──────────────┘
      │                         │
      ├──→ ProductoIngrediente  │
      ├──→ Review               │
      └──→ ComboProducto        │
                                │
┌──────────────┐                │
│    Combo     │────────────────┘
└──────────────┘
      │
      └──→ ComboProducto

┌──────────────────────┐
│ ComboPersonalizado   │
└──────────────────────┘
      │
      └──→ ComboPersonalizadoProducto
            (Ingrediente)

┌──────────┐
│ Carrito  │
└──────────┘
      │
      └──→ CarritoItem
            ├──→ Producto
            └──→ Combo
                 ├──→ Ingrediente

┌──────────┐
│  Pedido  │ ◄─── Estado
└──────────┘
      │
      └──→ PedidoItem
            ├──→ Producto
            └──→ Combo

┌──────────────────┐
│ Notificacion     │ ◄─── Estado
└──────────────────┘
```

---

### Migraciones Principales

```
001_initial (app users):
  - User (personalizado de AbstractUser)

002_initial (app products):
  - Producto
  - Ingrediente
  - ProductoIngrediente (M2M)
  - Combo
  - ComboProducto (M2M)
  - ComboPersonalizado
  - ComboPersonalizadoProducto (M2M)

003_initial (app orders):
  - Estado
  - Carrito
  - CarritoItem
  - Pedido
  - PedidoItem

004_initial (app reviews):
  - Review

005_initial (app notifications):
  - Notificacion
```

---

### Consultas SQL Útiles (Ejemplos)

```sql
-- Productos más reseñados
SELECT p.id, p.nombre, COUNT(r.id) as total_reviews, AVG(r.calificacion) as promedio
FROM products_producto p
LEFT JOIN reviews_review r ON p.id = r.producto_id
GROUP BY p.id
ORDER BY total_reviews DESC;

-- Usuarios más activos (por número de pedidos)
SELECT u.id, u.email, COUNT(o.id) as total_pedidos, SUM(o.total) as total_gastado
FROM users_user u
LEFT JOIN orders_pedido o ON u.id = o.usuario_id
GROUP BY u.id
ORDER BY total_pedidos DESC;

-- Productos en combos personalizados más usados
SELECT p.id, p.nombre, COUNT(cpp.id) as veces_usado
FROM products_producto p
JOIN products_combopersonalizadoproducto cpp ON p.id = cpp.producto_id
GROUP BY p.id
ORDER BY veces_usado DESC;
```

---

### Variables de Configuración Importantes

En `settings.py`:

```python
# Autenticación
AUTH_USER_MODEL = 'users.User'  # Modelo User personalizado

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    )
}

# CORS (para comunicación con frontend)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
]

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## Guía de Desarrollo Frontend

### Conectarse al Backend desde React

#### 1. Crear archivo API helper (`src/api/api.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token en requests autenticados
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exportar métodos para cada endpoint
export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (email, password) => api.post('/token/', { email, password }),
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  getProfile: () => api.get('/profile/'),
};

export const productsAPI = {
  getProducts: (params) => api.get('/productos/', { params }),
  getProduct: (id) => api.get(`/productos/${id}/`),
  getIngredients: () => api.get('/ingredientes/'),
  getCombos: () => api.get('/combos/'),
};

export const cartAPI = {
  getCart: () => api.get('/orders/cart/'),
  addToCart: (data) => api.post('/orders/add-to-cart/', data),
};

export const ordersAPI = {
  createOrder: (data) => api.post('/orders/pedidos/', data),
  getOrders: () => api.get('/orders/pedidos/'),
  getOrder: (id) => api.get(`/orders/pedidos/${id}/`),
};

export const reviewsAPI = {
  getReviews: (productId) => api.get('/reviews/', { params: { producto: productId } }),
  createReview: (data) => api.post('/reviews/', data),
};

export const notificationsAPI = {
  getNotifications: () => api.get('/notifications/'),
  getUnreadNotifications: () => api.get('/notifications/no_leidas/'),
};

export default api;
```

---

#### 2. Usar en Componentes React

```javascript
// Login.jsx
import { authAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { setUser, setToken } = useContext(AuthContext);

  const handleLogin = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { access, refresh } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);

      // Obtener perfil del usuario
      const profileRes = await authAPI.getProfile();
      setUser(profileRes.data);

      // Redirect a home
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  return (
    // JSX del login
  );
}
```

---

#### 3. Manejar Tokens Expirados

```javascript
// Interceptor para refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post('/token/refresh/', {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Reintentar la request original con nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token expirado, hacer logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Deployment

### Preparación para Producción

1. **Configurar variables de entorno (`.env` en producción):**
   ```
   DEBUG=False
   SECRET_KEY=<generate-new-secret-key>
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   DATABASE_URL=postgresql://user:password@prod-db-host:5432/delicious_food
   ```

2. **Configurar servidor (gunicorn + nginx):**
   ```bash
   pip install gunicorn
   gunicorn restaurant_api.wsgi:application --bind 0.0.0.0:8000
   ```

3. **Recopilar archivos estáticos:**
   ```bash
   python manage.py collectstatic --noinput
   ```

4. **Usar PostgreSQL en producción:**
   ```bash
   pip install psycopg2-binary
   # Actualizar DATABASES en settings.py
   ```

---

## Troubleshooting

### Problema: Error 401 (No Autorizado)

**Solución:** Verificar que el token está siendo enviado correctamente.

```javascript
// En el cliente React
const response = await fetch('http://localhost:8000/api/profile/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});
```

---

### Problema: CORS Error

**Solución:** Verificar `CORS_ALLOWED_ORIGINS` en `settings.py`.

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
]
```

---

### Problema: Upload de Imágenes Falla

**Solución:** Verificar que `MEDIA_ROOT` está configurado y permisos de carpeta están correctos.

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

En `urls.py`:
```python
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [...]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## Contacto y Soporte

Para preguntas o problemas con la API backend, consulta:
- Documentación de Django: https://docs.djangoproject.com/
- DRF Documentation: https://www.django-rest-framework.org/
- SimpleJWT: https://django-rest-framework-simplejwt.readthedocs.io/

---

**Última Actualización:** 21 de Octubre, 2024
