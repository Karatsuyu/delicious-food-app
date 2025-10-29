# Backend - Delicious Food App

## 🍔 Bienvenido al Backend

Este es el servidor backend de **Delicious Food App**, una aplicación full-stack de pedidos de comida con autenticación JWT, gestión de combos personalizados y sistema de reseñas.

---

## 📚 Documentación Completa

| Documento | Descripción |
|-----------|-------------|
| **[DOCUMENTACION.md](DOCUMENTACION.md)** | 📖 Documentación técnica completa del backend, arquitectura, modelos y endpoints |
| **[API_REFERENCE.md](API_REFERENCE.md)** | 🔍 Referencia rápida de todos los endpoints, ejemplos y códigos de estado |
| **[SETUP.md](SETUP.md)** | 🚀 Guía de instalación y configuración inicial del backend |
| **[INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md)** | 🔗 Guía para conectar el frontend React con el backend |

---

## ⚡ Quick Start

### 1. Instalar Dependencias
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configurar Base de Datos
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 3. Ejecutar Servidor
```bash
python manage.py runserver
```

**Servidor corriendo en:** http://127.0.0.1:8000/

---

## 🏗️ Stack Tecnológico

- **Django 5.2.6** - Framework web
- **Django REST Framework 3.16.1** - API REST
- **SimpleJWT 5.5.1** - Autenticación con tokens JWT
- **django-cors-headers 4.8.0** - CORS para frontend
- **PostgreSQL / SQLite3** - Base de datos
- **Pillow 11.3.0** - Procesamiento de imágenes

---

## 📁 Estructura del Proyecto

```
backend/
├── restaurant_api/       # Configuración global
│   ├── settings.py       # Configuración Django
│   ├── urls.py           # Rutas principales
│   ├── wsgi.py           # WSGI
│   └── asgi.py           # ASGI
│
├── users/                # App: Autenticación y perfiles
├── products/             # App: Productos, combos e ingredientes
├── orders/               # App: Pedidos y carrito
├── reviews/              # App: Reseñas de productos
├── notifications/        # App: Sistema de notificaciones
│
├── manage.py             # CLI de Django
├── requirements.txt      # Dependencias Python
├── db.sqlite3            # BD SQLite (desarrollo)
└── media/                # Archivos subidos (imágenes)
```

---

## 🔐 Autenticación JWT

El backend usa **JSON Web Tokens** para autenticación segura:

```bash
# 1. Registrarse
POST /api/register/

# 2. Obtener token
POST /api/token/

# 3. Usar token en requests
Authorization: Bearer <access_token>

# 4. Refrescar token cuando expira
POST /api/token/refresh/
```

**Más detalles:** Ver [INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md#gestión-de-autenticación)

---

## 📊 Modelos Principales

- **User** - Usuario autenticado con email y puntos
- **Producto** - Artículos del menú con ingredientes opcionales
- **Ingrediente** - Opciones personalizables (queso extra, tocino, etc.)
- **Combo** - Promociones predefinidas
- **ComboPersonalizado** - Combos creados por el usuario
- **Carrito** - Carrito de compra del usuario
- **Pedido** - Órdenes completadas
- **Review** - Reseñas de productos (1-5 estrellas)
- **Notificacion** - Mensajes del sistema para el usuario

**Diagrama relacional completo:** Ver [DOCUMENTACION.md](DOCUMENTACION.md#base-de-datos)

---

## 🔌 Principales Endpoints

### Autenticación
- `POST /api/register/` - Registrar nuevo usuario
- `POST /api/token/` - Obtener token (login)
- `POST /api/token/refresh/` - Refrescar token

### Productos & Combos
- `GET /api/productos/` - Listar productos
- `GET /api/combos/` - Listar combos predefinidos
- `POST /api/combos-personalizados/` - Crear combo personalizado

### Carrito & Pedidos
- `GET /api/orders/cart/` - Ver carrito
- `POST /api/orders/add-to-cart/` - Agregar al carrito
- `POST /api/orders/pedidos/` - Crear pedido
- `GET /api/orders/pedidos/` - Ver mis pedidos

### Reseñas & Notificaciones
- `GET /api/reviews/` - Listar reseñas
- `POST /api/reviews/` - Crear reseña
- `GET /api/notifications/` - Ver notificaciones

**Referencia completa:** Ver [API_REFERENCE.md](API_REFERENCE.md)

---

## 🧪 Testing

### Probar un Endpoint con cURL

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "email": "test@example.com",
    "password": "test123456",
    "password_confirm": "test123456"
  }'

# 2. Obtener token
TOKEN=$(curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}' \
  | jq -r '.access')

# 3. Hacer request autenticado
curl -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer $TOKEN"
```

### Panel de Administración Django

```
http://127.0.0.1:8000/admin/

Usuario: admin
Contraseña: <la que ingresaste en createsuperuser>
```

Aquí puedes:
- Crear/editar productos e ingredientes
- Gestionar combos
- Ver pedidos de usuarios
- Revisar reseñas

---

## 🔒 Configuración de Seguridad

### En Producción (IMPORTANTE)

1. **Cambiar SECRET_KEY**
   ```python
   # settings.py
   SECRET_KEY = 'nuevo-secret-key-seguro'
   ```

2. **Desactivar DEBUG**
   ```python
   DEBUG = False
   ```

3. **Configurar ALLOWED_HOSTS**
   ```python
   ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
   ```

4. **Usar HTTPS**
   ```python
   SECURE_SSL_REDIRECT = True
   ```

5. **Usar PostgreSQL** (no SQLite)

---

## 🚀 Deployment

### Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set DEBUG=False
heroku addons:create heroku-postgresql
git push heroku main
heroku run python manage.py migrate
```

### DigitalOcean / AWS
Ver sección de deployment en [SETUP.md](SETUP.md#deployment-en-producción)

---

## 🔗 Integración con Frontend

El frontend (React) se comunica con este backend mediante la API REST.

**Requisitos:**
1. Frontend debe estar en `http://localhost:5173` (Vite dev server)
2. Backend debe tener CORS configurado para esa URL
3. Frontend debe guardar tokens en localStorage

**Guía completa:** Ver [INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md)

**Ejemplo de conexión:**
```javascript
// frontend/src/api/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// Agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🐛 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'django'"
```bash
# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt
```

### Error: CORS request blocked
```python
# En settings.py, agregar URL del frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:3000",
]
```

### Error: "Database is locked" (SQLite)
```bash
# Eliminar db.sqlite3 y recrear
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## 📞 API Endpoints por Categoría

### Autenticación (3 endpoints)
- Registro, Login, Refresh Token

### Usuarios (6 endpoints)
- Perfil, Actualización, Cambio de contraseña, Estadísticas, Reactivación

### Productos (4 endpoints)
- Productos, Ingredientes, Combos, Combos Personalizados

### Carrito (2 endpoints)
- Ver carrito, Agregar items

### Pedidos (5 endpoints)
- Crear, Listar, Detalles, Actualizar estado, Estadísticas

### Reseñas (6 endpoints)
- Listar, Crear, Actualizar, Eliminar, Mis reseñas, Estadísticas

### Notificaciones (6 endpoints)
- Listar, Ver no leídas, Marcar leída, Marcar todas leídas, Limpiar leídas

**Total: 32 endpoints**

---

## 📝 Convenios de Código

### Serializers
- Siempre validar inputs
- Usar `read_only_fields` para campos que no deben modificarse
- Incluir mensajes de error en español

### Views
- Usar ViewSets para CRUD estándar
- Usar permisos adecuados (`IsAuthenticated`, `IsAuthenticatedOrReadOnly`)
- Retornar respuestas JSON descriptivas

### Modelos
- Usar `on_delete=models.CASCADE` cuidadosamente
- Incluir método `__str__`
- Documentar relaciones complejas

---

## ✅ Checklist de Desarrollo

- [ ] Backend instalado y funcionando
- [ ] Base de datos migrada
- [ ] Superusuario creado
- [ ] Datos iniciales cargados
- [ ] CORS configurado
- [ ] Frontend integrado
- [ ] Testing completado
- [ ] Seguridad revisada
- [ ] Listo para deployment

---

## 📚 Recursos Útiles

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [SimpleJWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Django CORS](https://github.com/adamchainz/django-cors-headers)

---

## 👨‍💻 Contribuyendo

1. Crear rama para nueva feature: `git checkout -b feature/nueva-feature`
2. Hacer commits descriptivos: `git commit -am 'Agregar nueva feature'`
3. Push a la rama: `git push origin feature/nueva-feature`
4. Crear Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

## 📞 Contacto

Para preguntas o reportar bugs:
- Email: development@deliciousfood.com
- Issues: GitHub Issues

---

**Última Actualización:** 21 de Octubre, 2024  
**Versión:** 1.0.0  
**Estado:** ✅ En Desarrollo

