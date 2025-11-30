# 📚 Índice Completo de Documentación - Frontend

Bienvenido a la documentación del frontend de **Delicious Food App**. Aquí encontrarás todos los recursos necesarios para entender, instalar, configurar y desarrollar el frontend React.

---

## 📖 Documentación Principal

### [DOCUMENTACION.md](DOCUMENTACION.md) ⭐ **COMIENZA AQUÍ**
- Descripción general del proyecto
- Stack tecnológico (React, Vite, React Router)
- Estructura completa del proyecto
- Guía de componentes y páginas
- Context API (AuthContext, CartContext)
- Servicios API y comunicación con backend
- Rutas y navegación
- Flujos de usuario

**Lectura recomendada:** 45 minutos

---

## 🚀 Quick Start

### Instalación Rápida (5 minutos)

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### Requisitos Previos
- Node.js 18+ y npm
- Backend Django corriendo en `http://127.0.0.1:8000`

---

## 📚 Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/              # Servicios API (Axios)
│   ├── assets/           # Imágenes y recursos
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Context API (Auth, Cart)
│   ├── pages/            # Páginas/Vistas
│   ├── utils/            # Utilidades
│   ├── App.jsx           # Componente raíz
│   └── main.jsx         # Punto de entrada
```

---

## 🎯 Componentes Principales

### Componentes de UI
- **Header**: Navegación, búsqueda, carrito
- **Footer**: Pie de página
- **ProductCard**: Tarjeta de producto
- **Banner**: Banner rotativo
- **Carrito**: Sidebar de carrito
- **CartModal**: Modal de carrito rápido

### Componentes de Rutas
- **ProtectedRoute**: Ruta protegida (requiere auth)
- **AdminRoute**: Ruta de administración (requiere is_staff)

---

## 📄 Páginas Principales

### Páginas Públicas
- `/` - Home
- `/menu` - Menú de productos
- `/buscar` - Búsqueda
- `/login` - Inicio de sesión
- `/register` - Registro
- `/producto/:id` - Detalle de producto
- `/personalizador/:categoria` - Personalizador
- `/combos-publicos` - Combos de la comunidad

### Páginas Protegidas
- `/perfil` - Perfil de usuario
- `/crear-combo` - Crear combo personalizado
- `/checkout` - Proceso de pago

### Páginas de Administración
- `/admin/dashboard` - Dashboard de estadísticas
- `/admin/productos` - Gestión de productos

---

## 🔄 Context API

### AuthContext
- **Estado**: `user`, `loading`, `isAuthenticated`
- **Métodos**: `login()`, `register()`, `logout()`, `updateUser()`
- **Uso**: `const { user, login } = useContext(AuthContext)`

### CartContext
- **Estado**: `cartItems`, `isOpen`
- **Métodos**: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
- **Características**: Carrito por usuario en localStorage
- **Uso**: `const { cartItems, addToCart } = useCart()`

---

## 🌐 Servicios API

### authService
- `login(username, password)`
- `register(userData)`
- `getProfile()`
- `updateProfile(userData)`

### productService
- `getProducts()`
- `getProduct(id)`
- `getCombos()`
- `createComboPersonalizado(comboData)`

### orderService
- `getCart()`
- `addToCart(itemData)`
- `createOrder(orderData)`
- `getOrders()`

### adminService
- `getAllProducts()`
- `createProduct(productData)`
- `updateProduct(id, productData)`
- `deleteProduct(id)`
- `getAdminStats()`

---

## 🛣️ Rutas y Navegación

### Rutas Públicas
| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Home | Página de inicio |
| `/menu` | Menu | Menú de productos |
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro |
| `/producto/:id` | ProductoDetalle | Detalle de producto |

### Rutas Protegidas
| Ruta | Componente | Requisito |
|------|------------|-----------|
| `/perfil` | Perfil | Autenticación |
| `/crear-combo` | CrearCombo | Autenticación |
| `/checkout` | Checkout | Autenticación |

### Rutas de Administración
| Ruta | Componente | Requisito |
|------|------------|-----------|
| `/admin/dashboard` | AdminDashboard | Admin (is_staff) |
| `/admin/productos` | AdminPanel | Admin (is_staff) |

---

## 🎨 Estilos y Assets

### Estructura de Estilos
- Cada componente tiene su archivo CSS
- Estilos globales en `index.css` y `App.css`
- Fuentes de Google Fonts

### Assets
- **Ubicación**: `src/assets/`
- Imágenes de productos, logo, iconos, banners

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build para producción |
| `npm run preview` | Previsualizar build |
| `npm run lint` | Ejecutar ESLint |

---

## 📊 Estadísticas del Proyecto

- **15+ Páginas** (Home, Menu, Login, Register, etc.)
- **8 Componentes** reutilizables
- **2 Context API** (Auth, Cart)
- **4 Servicios API** (auth, product, order, admin)
- **20+ Rutas** configuradas
- **100% React Hooks** (funcional components)

---

## 🗺️ Mapa Mental de la Aplicación

```
┌─────────────────────────────────────────────┐
│      React Frontend (Vite + React 19)        │
├─────────────────────────────────────────────┤
│                                             │
│  🎨 UI Layer                                │
│   ├─ Pages (Home, Menu, Login, etc.)       │
│   ├─ Components (Header, Footer, etc.)    │
│   └─ Routes (React Router DOM)              │
│                                             │
│  🔄 State Management                        │
│   ├─ AuthContext (Usuario, Login)           │
│   └─ CartContext (Carrito por usuario)     │
│                                             │
│  🌐 API Services (Axios)                   │
│   ├─ authService                            │
│   ├─ productService                         │
│   ├─ orderService                           │
│   └─ adminService                           │
│                                             │
└─────────────────────────────────────────────┘
              ↓ HTTP Requests
┌─────────────────────────────────────────────┐
│    Django REST API Backend                  │
│    http://127.0.0.1:8000/api/               │
└─────────────────────────────────────────────┘
```

---

## 🎯 Características Principales

### 1. Carrito por Usuario
- Cada usuario tiene su propio carrito
- Guardado en localStorage: `cart_{userId}`
- Se limpia al cerrar sesión

### 2. Personalización de Productos
- Sistema completo por categoría
- Cálculo automático de precios
- Vista previa en tiempo real

### 3. Panel de Administración
- CRUD completo de productos
- Subida de imágenes
- Dashboard con estadísticas

### 4. Combos Públicos
- Usuarios pueden publicar combos
- Ver combos de la comunidad
- Navegación a perfiles públicos

### 5. Rutas Protegidas
- `ProtectedRoute`: Requiere autenticación
- `AdminRoute`: Requiere admin (is_staff)

---

## 🚨 Troubleshooting

### Problemas Comunes

**"CORS request blocked"**
- Verificar que el backend esté corriendo
- Verificar `API_BASE_URL` en `api/api.js`

**"Token expired"**
- El interceptor refresca automáticamente
- Si falla, redirige a login

**"Carrito no se guarda"**
- Verificar que el usuario esté autenticado
- Verificar localStorage en DevTools

**"Rutas protegidas no funcionan"**
- Verificar que `AuthContext` envuelva la app
- Verificar `isAuthenticated` y `user.is_staff`

---

## 📋 Checklist de Desarrollo

### Para Nuevos Desarrolladores
- [ ] Leer [DOCUMENTACION.md](DOCUMENTACION.md) (45 min)
- [ ] Instalar dependencias (`npm install`)
- [ ] Configurar URL del backend
- [ ] Ejecutar servidor de desarrollo
- [ ] Explorar componentes principales
- [ ] Probar flujo de autenticación
- [ ] Probar flujo de compra

### Para Desarrolladores Frontend
- [ ] Entender estructura de componentes
- [ ] Revisar Context API (Auth, Cart)
- [ ] Explorar servicios API
- [ ] Revisar rutas y navegación
- [ ] Probar todas las páginas
- [ ] Verificar responsive design

---

## 🔗 Integración con Backend

### Configuración
```javascript
// src/api/api.js
export const API_BASE_URL = "http://127.0.0.1:8000/api/";
```

### Autenticación
- Tokens JWT guardados en localStorage
- Interceptor de Axios agrega token automáticamente
- Refresh token automático

### Comunicación
- Todos los servicios en `api/api.js`
- Manejo de errores centralizado
- URLs absolutas para imágenes

---

## 🎓 Conceptos Clave

### React Hooks
- `useState`: Estado local
- `useEffect`: Efectos secundarios
- `useContext`: Acceso a context
- `useNavigate`: Navegación programática

### Context API
- Estado global sin Redux
- `AuthContext`: Autenticación
- `CartContext`: Carrito

### React Router
- Rutas declarativas
- Rutas protegidas con wrappers
- Navegación programática

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
| Diciembre 2024 | 1.0.0 | Documentación inicial completa |

---

## ✨ Agradecimientos

Documentación creada para facilitar el desarrollo y mantenimiento del frontend de **Delicious Food App**.

---

**Última Actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Completo

🚀 ¡Listo para comenzar!

