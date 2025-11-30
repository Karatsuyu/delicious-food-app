# Delicious Food App - Frontend

Frontend de **Delicious Food App** construido con React 19, Vite y React Router DOM.

## 🚀 Quick Start

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### Requisitos Previos

- Node.js 18+ y npm
- Backend Django corriendo en `http://127.0.0.1:8000`

## 📚 Documentación

### [📖 DOCUMENTACION.md](DOCUMENTACION.md) - Documentación Completa
Documentación técnica completa del frontend:
- Stack tecnológico
- Estructura del proyecto
- Componentes y páginas
- Context API
- Servicios API
- Rutas y navegación
- Flujos de usuario

### [📑 INDICE.md](INDICE.md) - Índice de Documentación
Índice completo con referencias rápidas y guías.

## 🛠️ Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint para verificar código |

## 🏗️ Stack Tecnológico

- **React 19.1.1** - Biblioteca JavaScript para UI
- **Vite 7.1.2** - Build tool y servidor de desarrollo
- **React Router DOM 7.9.4** - Enrutamiento
- **Axios 1.12.2** - Cliente HTTP para API

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/              # Servicios API
│   ├── assets/           # Imágenes y recursos
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Context API (Auth, Cart)
│   ├── pages/            # Páginas/Vistas
│   ├── utils/            # Utilidades
│   ├── App.jsx           # Componente raíz
│   └── main.jsx          # Punto de entrada
```

## 🎯 Características Principales

- ✅ **Carrito por usuario**: Cada usuario tiene su propio carrito guardado en localStorage
- ✅ **Personalización de productos**: Sistema completo de personalización por categoría
- ✅ **Panel de administración**: CRUD completo de productos con subida de imágenes
- ✅ **Combos públicos**: Usuarios pueden publicar y ver combos de la comunidad
- ✅ **Rutas protegidas**: Control de acceso con `ProtectedRoute` y `AdminRoute`
- ✅ **Autenticación JWT**: Integración completa con backend Django

## 🔗 Integración con Backend

El frontend se comunica con el backend Django a través de una API REST:

- **URL Base**: `http://127.0.0.1:8000/api/`
- **Autenticación**: JWT tokens (access + refresh)
- **Configuración**: Ver `src/api/api.js`

## 📖 Más Información

Para documentación completa, ver:
- [DOCUMENTACION.md](DOCUMENTACION.md) - Documentación técnica completa
- [INDICE.md](INDICE.md) - Índice y referencias rápidas

## 🚨 Troubleshooting

### "CORS request blocked"
- Verificar que el backend esté corriendo
- Verificar configuración de CORS en backend
- Verificar `API_BASE_URL` en `src/api/api.js`

### "Token expired"
- El interceptor debería refrescar automáticamente
- Si falla, redirige a login
- Verificar que los tokens se guarden en localStorage

### "Carrito no se guarda"
- Verificar que el usuario esté autenticado
- Verificar localStorage en DevTools
- Verificar que `user.id` esté disponible

## 📞 Soporte

Para más información, consulta la [documentación completa](DOCUMENTACION.md).

---

**Versión:** 1.0.0  
**Última Actualización:** Diciembre 2024

