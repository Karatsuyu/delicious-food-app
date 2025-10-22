# 📚 Índice Completo de Documentación - Backend

Bienvenido a la documentación del backend de **Delicious Food App**. Aquí encontrarás todos los recursos necesarios para entender, instalar, configurar e integrar el backend con el frontend.

---

## 📖 Documentación Principal

### [README.md](README.md) ⭐ **COMIENZA AQUÍ**
- Descripción general del proyecto
- Stack tecnológico
- Quick start (5 minutos)
- Estructura del proyecto
- Endpoints por categoría

---

## 🚀 Guías de Setup e Instalación

### [SETUP.md](SETUP.md) - **Guía Completa de Instalación**
**Para:** Desarrolladores que instalan por primera vez

- Requisitos previos
- Paso a paso de instalación
- Configuración de variables de entorno
- Crear datos iniciales
- Verificar que todo funciona
- Comandos útiles
- Troubleshooting
- Deployment (Heroku, DigitalOcean, AWS)

**Tiempo estimado:** 30 minutos

---

## 📚 Referencia Técnica

### [DOCUMENTACION.md](DOCUMENTACION.md) - **Documentación Técnica Completa**
**Para:** Desarrolladores que necesitan entender la arquitectura

- Stack tecnológico detallado
- Estructura del proyecto en profundidad
- Modelos de datos (15 modelos documentados)
- Relaciones entre entidades
- Autenticación JWT
- Flujos de negocio
- Diagrama relacional
- Queries SQL útiles
- Guía de configuración

**Secciones principales:**
- ✅ Introducción
- ✅ Stack Tecnológico
- ✅ Estructura del Proyecto
- ✅ Modelos de Datos (User, Producto, Combo, Pedido, Review, Notificacion, etc.)
- ✅ Endpoints API (32 endpoints)
- ✅ Ejemplos de Requests/Responses
- ✅ Flujos de Negocio
- ✅ Base de Datos

**Lectura recomendada:** 45 minutos

---

## 🔍 Referencia Rápida de Endpoints

### [API_REFERENCE.md](API_REFERENCE.md) - **Consulta Rápida**
**Para:** Referencia rápida mientras desarrollas

- Tabla resumen de todos los endpoints
- Códigos de estado HTTP
- Headers comunes
- Ejemplos en JavaScript/Fetch
- Campos de validación
- Rate limiting
- Paginación
- Filtrado y búsqueda

**Uso:** Ctrl+F para buscar rápidamente

---

## 🔗 Integración Frontend-Backend

### [INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md) - **Conectar React al Backend**
**Para:** Desarrolladores frontend que conectarán React

- Setup inicial (instalación de axios)
- Configuración del API client
- Gestión de autenticación
- Manejo de tokens JWT
- Interceptores para requests
- Refresh token automático
- Ejemplos de integración:
  - Login/Registro
  - Listar productos
  - Carrito
  - Crear pedidos
  - Sistema de reseñas
- Manejo de errores
- Best practices
- Checklist de integración

**Resultado:** Una aplicación React completamente conectada

---

## 🧪 Testing y Ejemplos

### [CURL_EXAMPLES.md](CURL_EXAMPLES.md) - **Ejemplos de Testing**
**Para:** Probar endpoints sin frontend (via cURL)

- 50+ ejemplos listos para copiar y pegar
- Registro y autenticación
- Gestión de usuarios
- Productos e ingredientes
- Combos
- Carrito
- Pedidos
- Reseñas
- Notificaciones
- Flujo completo de compra
- Tips para testing
- Errores comunes

**Uso:** Copiar, pegar y ejecutar en terminal

---

## 🎯 Rutas de Aprendizaje Recomendadas

### Para Nuevos Desarrolladores (Backend)
1. **Leer:** [README.md](README.md) (10 min)
2. **Instalar:** Seguir [SETUP.md](SETUP.md) (30 min)
3. **Explorar:** [DOCUMENTACION.md](DOCUMENTACION.md) - Secciones 1-6 (30 min)
4. **Probar:** [CURL_EXAMPLES.md](CURL_EXAMPLES.md) - Flujo completo (20 min)
5. **Entender:** [DOCUMENTACION.md](DOCUMENTACION.md) - Secciones 7-10 (30 min)

**Total: ~2 horas**

### Para Desarrolladores Frontend
1. **Leer:** [README.md](README.md) - Secciones "Quick Start" (5 min)
2. **Conocer:** [API_REFERENCE.md](API_REFERENCE.md) - Tabla de endpoints (15 min)
3. **Integrar:** [INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md) (60 min)
4. **Implementar:** Crear componentes React conectados
5. **Probar:** Usar [CURL_EXAMPLES.md](CURL_EXAMPLES.md) para validar

**Total: ~2 horas**

### Para DevOps/Deployment
1. **Configuración:** [SETUP.md](SETUP.md) - Sección Deployment
2. **Seguridad:** [DOCUMENTACION.md](DOCUMENTACION.md) - Antes de producción
3. **Variables:** Configurar según ambiente (dev, staging, prod)
4. **Testing:** [CURL_EXAMPLES.md](CURL_EXAMPLES.md) - Verificar que funciona

---

## 📋 Tabla de Contenidos Rápida

| Tema | Archivo | Tiempo |
|------|---------|--------|
| Introducción | README.md | 10 min |
| Instalación | SETUP.md | 30 min |
| Arquitectura | DOCUMENTACION.md | 60 min |
| Endpoints | API_REFERENCE.md | 15 min |
| Integración | INTEGRACION_FRONTEND.md | 60 min |
| Testing | CURL_EXAMPLES.md | 20 min |

---

## 🔧 Stack Tecnológico Quick Reference

```
Backend: Django 5.2.6 + Django REST Framework 3.16.1
Auth: JWT (SimpleJWT 5.5.1)
BD: SQLite (dev) / PostgreSQL (prod)
API: RESTful + 32 endpoints
```

---

## 🌐 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Backend API | http://localhost:8000/api/ | API REST principal |
| Admin Panel | http://localhost:8000/admin/ | Panel de administración Django |
| Frontend (Vite) | http://localhost:5173/ | Aplicación React |
| Documentación API | http://127.0.0.1:8000/ | DRF browsable API |

---

## 📦 Endpoints por App

### Users (6 endpoints)
- Registro, Login, Token Refresh
- Perfil, Cambio de contraseña
- Estadísticas, Desactivación de cuenta

### Products (4 endpoints)
- Productos, Ingredientes
- Combos predefinidos, Combos personalizados

### Orders (5 endpoints)
- Carrito, Agregar items
- Crear pedido, Listar pedidos
- Actualizar estado, Estadísticas

### Reviews (6 endpoints)
- Listar reseñas, Crear, Editar, Eliminar
- Mis reseñas, Estadísticas de producto

### Notifications (6 endpoints)
- Listar, Ver no leídas
- Marcar como leída, Marcar todas leídas
- Limpiar leídas

**Total: 32 endpoints**

---

## ✅ Checklist de Lectura

### Mínimo Obligatorio (1 hora)
- [ ] README.md completo
- [ ] SETUP.md - Pasos 1-8
- [ ] API_REFERENCE.md - Tabla de endpoints

### Recomendado (3 horas)
- [ ] DOCUMENTACION.md - Modelos + Endpoints
- [ ] INTEGRACION_FRONTEND.md - Secciones 1-4
- [ ] CURL_EXAMPLES.md - Flujo completo

### Completo (5+ horas)
- [ ] Todo lo anterior
- [ ] DOCUMENTACION.md completo
- [ ] INTEGRACION_FRONTEND.md completo
- [ ] CURL_EXAMPLES.md - Todos los ejemplos
- [ ] Explorar código fuente

---

## 🎓 Conceptos Clave

### Autenticación JWT
Tokens seguros para autenticar requests:
- Usuario hace login → recibe token
- Frontend guarda token en localStorage
- Cada request incluye: `Authorization: Bearer <token>`
- Token expira → usar refresh token para renovar

### Serializers (DRF)
Validan y transforman datos JSON ↔ modelos Django

### ViewSets
Automatizan CRUD (Create, Read, Update, Delete)

### Modelos (ORM)
Definen estructura de BD con relaciones (M2M, FK, etc.)

---

## 🚨 Información Importante

### Seguridad en Producción
- ❌ NUNCA usar DEBUG=True
- ❌ NUNCA exponer SECRET_KEY
- ✅ Usar HTTPS
- ✅ CORS configurado correctamente
- ✅ Usar PostgreSQL (no SQLite)
- ✅ Cambiar SECRET_KEY regularmente

### Antes de Deployment
1. Revisar [SETUP.md](SETUP.md) - Sección "Preparación para Producción"
2. Cambiar todas las variables de entorno
3. Ejecutar tests
4. Verificar permisos correctos
5. Hacer backup de base de datos

---

## 🤝 Convenciones de Desarrollo

### Nombrado de Archivos
- Modelos: `models.py`
- Vistas: `views.py`
- Serializadores: `serializers.py`
- URLs: `urls.py`

### Estructura de Apps Django
```
app/
├── models.py         # Definir modelos
├── serializers.py    # Validar datos
├── views.py          # Lógica de negocio
├── urls.py           # Rutas
├── admin.py          # Panel admin
├── tests.py          # Tests
└── migrations/       # Historial de BD
```

---

## 🐛 Ayuda y Soporte

### Problemas Comunes

**"ModuleNotFoundError: No module named 'django'"**
- Solución: [SETUP.md](SETUP.md) - Paso 3

**"CORS request blocked"**
- Solución: [SETUP.md](SETUP.md) - Paso 4

**"Database is locked"**
- Solución: [SETUP.md](SETUP.md) - Troubleshooting

### Recursos Externos
- Django Docs: https://docs.djangoproject.com/
- DRF Docs: https://www.django-rest-framework.org/
- SimpleJWT: https://django-rest-framework-simplejwt.readthedocs.io/

---

## 📊 Estadísticas del Proyecto

- **32 Endpoints API**
- **15 Modelos de Datos**
- **5 Apps Django**
- **3000+ líneas de código backend**
- **100% Documentación en español**

---

## 🗺️ Mapa Mental de la Aplicación

```
┌─────────────────────────────────────────────┐
│         Delicious Food App Backend          │
├─────────────────────────────────────────────┤
│                                             │
│  👤 Users (Autenticación JWT)              │
│   ├─ Register                              │
│   ├─ Login                                 │
│   └─ Profile Management                    │
│                                             │
│  🍔 Products                               │
│   ├─ Productos                             │
│   ├─ Ingredientes                          │
│   └─ Combos                                │
│                                             │
│  🛒 Orders                                 │
│   ├─ Carrito                               │
│   └─ Pedidos                               │
│                                             │
│  ⭐ Reviews                                │
│   └─ Reseñas de Productos                  │
│                                             │
│  🔔 Notifications                          │
│   └─ Notificaciones del Sistema            │
│                                             │
└─────────────────────────────────────────────┘
        ↓
    ┌──────────┐
    │ Database │  SQLite (dev) / PostgreSQL (prod)
    │ (ORM)    │
    └──────────┘
        ↓
    ┌──────────────────┐
    │ Django REST API  │  32 Endpoints
    └──────────────────┘
        ↓
    ┌──────────────────┐
    │ React Frontend   │  http://localhost:5173
    └──────────────────┘
```

---

## 🎯 Next Steps

Después de leer la documentación:

1. **Instalar el backend** siguiendo [SETUP.md](SETUP.md)
2. **Crear datos iniciales** en admin panel
3. **Probar endpoints** con [CURL_EXAMPLES.md](CURL_EXAMPLES.md)
4. **Integrar con React** siguiendo [INTEGRACION_FRONTEND.md](INTEGRACION_FRONTEND.md)
5. **Deployar a producción** según tu plataforma

---

## 📞 Información de Contacto

Para preguntas o problemas:
- 📧 Email: development@deliciousfood.com
- 🐛 Issues: GitHub Issues
- 💬 Chat: Discord (si tienes enlace)

---

## 📄 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 21/10/2024 | 1.0.0 | Documentación inicial completa |
| - | - | - |

---

## ✨ Agradecimientos

Documentación creada para facilitar el desarrollo y mantenimiento de **Delicious Food App**.

---

**Última Actualización:** 21 de Octubre, 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Completo

🚀 ¡Listo para comenzar!
