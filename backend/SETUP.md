# Guía de Instalación y Setup - Backend Django

## Requisitos Previos

- **Python 3.8+** (recomendado 3.10 o 3.11)
- **pip** (gestor de paquetes Python)
- **Git** (para clonar el repositorio)
- **SQLite3** (incluido en Python)
- **PostgreSQL** (opcional, para producción)

---

## Paso 1: Clonar el Repositorio

```bash
git clone <repository-url>
cd delicious-food-app/backend
```

---

## Paso 2: Crear y Activar Entorno Virtual

### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/Mac
```bash
python3 -m venv venv
source venv/bin/activate
```

**Verificar que el entorno está activo:** Deberías ver `(venv)` al inicio de la terminal.

---

## Paso 3: Instalar Dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Tiempo estimado:** 2-3 minutos

---

## Paso 4: Configurar Variables de Entorno

Crear archivo `.env` en la raíz del backend (`backend/.env`):

```env
# Django
DEBUG=True
SECRET_KEY=django-insecure-6y5%)9^%p5cae!$old!9u@za2=_!gc&v@p!z0ccddoh79w4way
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database (opcional, por defecto SQLite)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/delicious_food

# CORS (para comunicación con frontend)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# JWT (opcional)
JWT_EXPIRATION_DELTA=3600
JWT_SECRET_KEY=your-secret-key-here
```

### Alternativa: Variables en settings.py (desarrollo)

No es necesario `.env` si usas la configuración por defecto en `settings.py`.

---

## Paso 5: Ejecutar Migraciones de BD

```bash
# Crear migraciones (generalmente ya existen)
python manage.py makemigrations

# Aplicar migraciones a la BD
python manage.py migrate
```

**Salida esperada:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, notifications, ...
Running migrations:
  Applying users.0001_initial... OK
  Applying users.0002_initial... OK
  ...
```

---

## Paso 6: Crear Superusuario (Admin)

```bash
python manage.py createsuperuser
```

**Ingresar:**
```
Email address: admin@example.com
Username: admin
Password: <enter-strong-password>
Password (again): <confirm-password>
```

---

## Paso 7: Crear Datos Iniciales (Opcional)

### Crear Estados (para Notificaciones y Pedidos)

```bash
python manage.py shell
```

Luego en la consola Python:

```python
from orders.models import Estado

# Crear estados comunes
estados = [
    'No Leído',
    'Leído',
    'Enviado',
    'En Preparación',
    'En Camino',
    'Entregado',
    'Cancelado'
]

for estado_nombre in estados:
    Estado.objects.get_or_create(descripcion=estado_nombre)

print("Estados creados exitosamente")
exit()
```

---

## Paso 8: Ejecutar el Servidor de Desarrollo

```bash
python manage.py runserver
```

**Salida esperada:**
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
October 21, 2024 - 14:30:00
Django version 5.2.6, using settings 'restaurant_api.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Acceder al servidor:
- **API Base:** http://127.0.0.1:8000/api/
- **Admin Panel:** http://127.0.0.1:8000/admin/

---

## Paso 9: Verificar que Todo Funciona

### 1. Probar Registro
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Respuesta esperada (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 2,
    "username": "test_user",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

### 2. Probar Login
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Respuesta esperada (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 3. Listar Productos
```bash
curl -X GET http://localhost:8000/api/productos/
```

**Respuesta esperada (200):** Array de productos (puede estar vacío inicialmente)

---

## Panel de Administración Django

### Acceder

1. Ir a: http://127.0.0.1:8000/admin/
2. Ingresar credenciales del superusuario
3. Crear datos iniciales:

#### Agregar Ingredientes
1. Click en "Ingredientes"
2. Click en "Add Ingredient"
3. Ingresar nombre y costo_extra

#### Agregar Productos
1. Click en "Productos"
2. Click en "Add Producto"
3. Rellenar: nombre, descripción, precio_base, seleccionar ingredientes
4. Click en "Save"

#### Agregar Combos
1. Click en "Combos"
2. Click en "Add Combo"
3. Rellenar: nombre, descripción, precio_total, seleccionar productos
4. Click en "Save"

---

## Estructura de Carpetas Después de Setup

```
backend/
├── venv/                          # Entorno virtual (creado)
├── .env                           # Variables de entorno (creado)
├── db.sqlite3                     # Base de datos SQLite (creado)
├── manage.py
├── requirements.txt
│
├── restaurant_api/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── users/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── ...
│
├── products/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── ...
│
├── orders/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── ...
│
├── reviews/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── ...
│
├── notifications/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── admin.py
│   └── ...
│
├── media/                         # Imágenes subidas (creada con upload)
│   ├── profiles/
│   ├── products/
│   └── ...
│
└── DOCUMENTACION.md               # Este documento
    API_REFERENCE.md               # Referencia de endpoints
```

---

## Comandos Útiles

### Reiniciar Base de Datos (⚠️ Borra todos los datos)
```bash
# Eliminar migraciones y datos
python manage.py reset_db  # (requiere django-extensions)

# O manualmente:
# 1. Eliminar db.sqlite3
# 2. Eliminar archivos de migraciones (excepto __init__.py)
# 3. Ejecutar:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Crear Migraciones Después de Cambios en Models
```bash
python manage.py makemigrations
python manage.py migrate
```

### Ver SQL de una Migración
```bash
python manage.py sqlmigrate users 0001
```

### Ejecutar Tests
```bash
python manage.py test
```

### Consola de Django Shell
```bash
python manage.py shell
```

En la consola:
```python
from users.models import User
from products.models import Producto

# Listar usuarios
users = User.objects.all()
print(users)

# Crear un producto
product = Producto.objects.create(
    nombre="Hamburguesa",
    descripcion="Deliciosa hamburguesa",
    precio_base=8.99
)

# Listar productos
productos = Producto.objects.all()
for p in productos:
    print(f"{p.nombre} - ${p.precio_base}")
```

---

## Debugging

### Activar Logs Detallados

En `settings.py`, añadir:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

### Ver Queries SQL Ejecutadas

```python
from django.db import connection
from django.test.utils import CaptureQueriesContext

# En shell o en una view:
from django.db import connection
print(connection.queries)
```

### Usar Django Debug Toolbar (desarrollo)

```bash
pip install django-debug-toolbar
```

En `settings.py`:
```python
INSTALLED_APPS = [
    ...
    'debug_toolbar',
]

MIDDLEWARE = [
    ...
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

INTERNAL_IPS = ['127.0.0.1']
```

En `urls.py`:
```python
import debug_toolbar

urlpatterns = [
    path('__debug__/', include(debug_toolbar.urls)),
    ...
]
```

---

## Problemas Comunes

### Error: "ModuleNotFoundError: No module named 'django'"

**Solución:** Asegurate que el entorno virtual está activado y las dependencias están instaladas.

```bash
# Activar venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt
```

---

### Error: "django.core.exceptions.ImproperlyConfigured: Set the DATABASE ... setting"

**Solución:** Las migraciones no se han ejecutado correctamente.

```bash
python manage.py migrate
```

---

### Error: "ConnectionRefusedError" (PostgreSQL)

**Solución:** PostgreSQL no está ejecutándose o credenciales son incorrectas.

```bash
# Verificar que PostgreSQL está ejecutándose
# Windows: Services → PostgreSQL

# O usar SQLite (por defecto)
# En settings.py, usar DATABASES['default'] con sqlite3
```

---

### Error: "CORS request blocked"

**Solución:** El frontend está en origin diferente que no está en CORS_ALLOWED_ORIGINS.

En `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite
    "http://127.0.0.1:3000",  # Otra URL de desarrollo
]
```

---

### Error: "Permission denied" (media files)

**Solución:** Problema de permisos en carpeta media.

```bash
# Linux/Mac:
chmod -R 755 media/

# Windows: Click derecho → Properties → Security → Edit → Full Control
```

---

## Deployment en Producción

### Usando Heroku

1. **Instalar Heroku CLI**
   ```bash
   https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Crear App en Heroku**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Configurar variables de entorno**
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=<new-secret-key>
   heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
   ```

4. **Usar PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Desplegar**
   ```bash
   git push heroku main
   heroku run python manage.py migrate
   ```

---

### Usando DigitalOcean App Platform

1. **Conectar repositorio GitHub**
2. **Configurar build command:**
   ```
   pip install -r requirements.txt && python manage.py migrate
   ```
3. **Configurar start command:**
   ```
   gunicorn restaurant_api.wsgi:application
   ```
4. **Configurar variables de entorno**
5. **Deploy**

---

### Usando AWS Elastic Beanstalk

1. **Instalar EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Inicializar proyecto**
   ```bash
   eb init -p python-3.11 my-app
   ```

3. **Crear environment**
   ```bash
   eb create production --envvars DEBUG=False,SECRET_KEY=xyz...
   ```

4. **Desplegar**
   ```bash
   eb deploy
   ```

---

## Next Steps

- ✅ Backend instalado y corriendo
- ⏭️ Instalar y configurar Frontend (React)
- ⏭️ Conectar Frontend con Backend API
- ⏭️ Crear datos iniciales (productos, combos, etc.)
- ⏭️ Testing y QA
- ⏭️ Deployment a producción

---

**Última Actualización:** 21 de Octubre, 2024
