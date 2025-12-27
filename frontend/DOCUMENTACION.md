# Documentación Frontend - Delicious Food App

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración Inicial](#configuración-inicial)
5. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
6. [Componentes](#componentes)
7. [Páginas](#páginas)
8. [Context API](#context-api)
9. [Servicios API](#servicios-api)
10. [Rutas y Navegación](#rutas-y-navegación)
11. [Estilos y Assets](#estilos-y-assets)
12. [Flujos de Usuario](#flujos-de-usuario)

---

## Introducción

**Delicious Food App Frontend** es una aplicación React moderna que proporciona una interfaz de usuario completa para:
- Explorar productos y combos del restaurante
- Personalizar productos según preferencias del usuario
- Gestionar carrito de compra por usuario
- Crear y gestionar pedidos
- Ver perfiles públicos y combos de la comunidad
- Panel de administración para gestionar productos

El frontend está construido con **React 19** y **Vite**, utilizando **React Router DOM** para navegación y **Context API** para gestión de estado global.

---

## Stack Tecnológico

| Componente | Versión | Descripción |
|-----------|---------|-------------|
| React | 19.1.1 | Biblioteca JavaScript para construir interfaces de usuario |
| React DOM | 19.1.1 | Renderizado de React en el navegador |
| React Router DOM | 7.9.4 | Enrutamiento y navegación en React |
| Axios | 1.12.2 | Cliente HTTP para peticiones API |
| Vite | 7.1.2 | Build tool y servidor de desarrollo |
| ESLint | 9.33.0 | Linter para código JavaScript/React |

### Dependencias Principales (package.json)
```json
{
  "dependencies": {
    "axios": "^1.12.2",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.1.2",
    "eslint": "^9.33.0"
  }
}
```

---

## Estructura del Proyecto

```
frontend/
├── public/                    # Archivos estáticos públicos
├── src/
│   ├── api/                   # Servicios API
│   │   └── api.js             # Cliente Axios y servicios API
│   │
│   ├── assets/                # Imágenes y recursos estáticos
│   │   ├── logo.png
│   │   ├── hamburguesa*.png
│   │   ├── pizza*.png
│   │   └── ...
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── AdminRoute.jsx     # Ruta protegida para administradores
│   │   ├── Banner.jsx          # Banner principal
│   │   ├── Carrito.jsx         # Componente de carrito lateral
│   │   ├── CartModal.jsx       # Modal de carrito
│   │   ├── Footer.jsx           # Pie de página
│   │   ├── Header.jsx          # Encabezado con navegación
│   │   ├── ProductCard.jsx     # Tarjeta de producto
│   │   └── ProtectedRoute.jsx  # Ruta protegida para usuarios autenticados
│   │
│   ├── context/                # Context API para estado global
│   │   ├── AuthContext.jsx     # Contexto de autenticación
│   │   └── CartContext.jsx      # Contexto de carrito
│   │
│   ├── pages/                  # Páginas/Views principales
│   │   ├── Home.jsx            # Página de inicio
│   │   ├── Menu.jsx             # Menú de productos
│   │   ├── Login.jsx            # Página de login
│   │   ├── Register.jsx         # Página de registro
│   │   ├── ProductoDetalle.jsx  # Detalle de producto
│   │   ├── Personalizador.jsx  # Personalizador de productos
│   │   ├── Perfil.jsx           # Perfil de usuario
│   │   ├── CrearCombo.jsx       # Crear combo personalizado
│   │   ├── Checkout.jsx         # Proceso de pago
│   │   ├── AdminPanel.jsx      # Panel de administración
│   │   ├── AdminDashboard.jsx   # Dashboard de administración
│   │   ├── CombosPublicos.jsx   # Combos públicos de la comunidad
│   │   └── PerfilPublico.jsx    # Perfil público de usuario
│   │
│   ├── utils/                  # Utilidades
│   │   └── hamburguesaImageMap.js  # Mapeo de imágenes de hamburguesas
│   │
│   ├── App.jsx                 # Componente raíz y rutas
│   ├── App.css                 # Estilos globales de App
│   ├── main.jsx                # Punto de entrada de la aplicación
│   └── index.css               # Estilos globales
│
├── package.json                # Dependencias y scripts
├── vite.config.js              # Configuración de Vite
└── README.md                    # Documentación básica
```

---

## Configuración Inicial

### Requisitos Previos
- Node.js 18+ y npm/yarn
- Backend Django corriendo en `http://127.0.0.1:8000`

### Instalación

1. **Instalar dependencias:**
```bash
cd frontend
npm install
```

2. **Configurar URL del backend:**
Editar `src/api/api.js` si es necesario:
```javascript
export const API_BASE_URL = "http://127.0.0.1:8000/api/";
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Abrir en el navegador:**
```
http://localhost:5173
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta ESLint para verificar código |

---

## Arquitectura de la Aplicación

### Flujo de Datos

```
┌─────────────────────────────────────────────┐
│         React Frontend (Vite)               │
├─────────────────────────────────────────────┤
│                                             │
│  🎨 UI Components (React)                   │
│   ├─ Pages (Home, Menu, Login, etc.)       │
│   ├─ Components (Header, Footer, etc.)     │
│   └─ Routes (React Router DOM)              │
│                                             │
│  🔄 State Management (Context API)          │
│   ├─ AuthContext (Usuario, Login, Logout)  │
│   └─ CartContext (Carrito por usuario)     │
│                                             │
│  🌐 API Services (Axios)                    │
│   ├─ authService (Login, Register, Profile) │
│   ├─ productService (Productos, Combos)    │
│   ├─ orderService (Pedidos, Carrito)       │
│   └─ adminService (Admin CRUD)              │
│                                             │
└─────────────────────────────────────────────┘
              ↓ HTTP Requests
┌─────────────────────────────────────────────┐
│    Django REST API Backend                  │
│    http://127.0.0.1:8000/api/               │
└─────────────────────────────────────────────┘
```

### Principios de Diseño

1. **Componentes Funcionales**: Todos los componentes usan funciones y hooks
2. **Context API**: Estado global para autenticación y carrito
3. **Separación de Responsabilidades**: 
   - `pages/` para vistas completas
   - `components/` para componentes reutilizables
   - `api/` para comunicación con backend
   - `context/` para estado global
4. **Rutas Protegidas**: `ProtectedRoute` y `AdminRoute` para control de acceso

---

## Componentes

### Componentes Principales

#### 1. **Header.jsx**
- **Ubicación**: `src/components/Header.jsx`
- **Descripción**: Encabezado con navegación, búsqueda y carrito
- **Funcionalidades**:
  - Navegación principal (Home, Menú, Combos)
  - Búsqueda de productos
  - Icono de carrito con modal
  - Menú de usuario (Login/Perfil/Logout)
  - Enlaces de administración (solo para admins)
- **Props**: Ninguna (usa Context API)
- **Estilos**: `Header.css`

#### 2. **Footer.jsx**
- **Ubicación**: `src/components/Footer.jsx`
- **Descripción**: Pie de página con información del restaurante
- **Estilos**: `Footer.css`

#### 3. **ProductCard.jsx**
- **Ubicación**: `src/components/ProductCard.jsx`
- **Descripción**: Tarjeta para mostrar productos en listas
- **Props**:
  - `producto`: Objeto con datos del producto
  - `onClick`: Función callback al hacer clic
- **Funcionalidades**:
  - Muestra imagen, nombre, precio
  - Botones "Agregar al carrito" y "Personalizar"
  - Oculta botones para administradores
- **Estilos**: `ProductCard.css`

#### 4. **Carrito.jsx**
- **Ubicación**: `src/components/Carrito.jsx`
- **Descripción**: Sidebar lateral con carrito de compra
- **Funcionalidades**:
  - Lista de items del carrito
  - Modificar cantidades
  - Eliminar items
  - Resumen de totales
  - Botones "Limpiar Carrito" y "Finalizar Compra"
  - Se oculta automáticamente para administradores
- **Estilos**: `Carrito.css`

#### 5. **CartModal.jsx**
- **Ubicación**: `src/components/CartModal.jsx`
- **Descripción**: Modal flotante con vista rápida del carrito
- **Funcionalidades**:
  - Vista previa de items
  - Botones "Ver carrito completo" y "Finalizar compra"
  - Se posiciona debajo del icono de carrito
- **Estilos**: `CartModal.css`

#### 6. **Banner.jsx**
- **Ubicación**: `src/components/Banner.jsx`
- **Descripción**: Banner rotativo con imágenes promocionales
- **Estilos**: `Banner.css`

#### 7. **ProtectedRoute.jsx**
- **Ubicación**: `src/components/ProtectedRoute.jsx`
- **Descripción**: Componente wrapper para rutas que requieren autenticación
- **Funcionalidad**: Redirige a `/login` si el usuario no está autenticado

#### 8. **AdminRoute.jsx**
- **Ubicación**: `src/components/AdminRoute.jsx`
- **Descripción**: Componente wrapper para rutas de administración
- **Funcionalidad**: 
  - Verifica autenticación
  - Verifica que el usuario sea administrador (`is_staff`)
  - Redirige a `/login` o `/` si no cumple requisitos

---

## Páginas

### Páginas Públicas

#### 1. **Home.jsx**
- **Ruta**: `/`
- **Descripción**: Página de inicio con banners y productos destacados
- **Funcionalidades**:
  - Banner rotativo
  - Sección de productos destacados
  - Enlaces a categorías principales

#### 2. **Menu.jsx**
- **Ruta**: `/menu`
- **Descripción**: Menú completo de productos por categorías
- **Funcionalidades**:
  - Filtrado por categoría (hamburguesas, pizzas, pollo, etc.)
  - Búsqueda de productos
  - Carga productos desde backend
  - Fallback a productos locales si el backend falla
- **Query Params**: `?categoria=hamburguesas`

#### 3. **ProductoDetalle.jsx**
- **Ruta**: `/producto/:id`
- **Descripción**: Página de detalle de un producto
- **Funcionalidades**:
  - Muestra información completa del producto
  - Botón "Agregar al carrito"
  - Botón "Personalizar" (si es personalizable)
  - Botón "Editar Producto" (solo para admins)
  - Carga desde backend si ID es numérico, sino desde productos locales

#### 4. **Personalizador.jsx**
- **Ruta**: `/personalizador/:categoria`
- **Descripción**: Personalizador de productos por categoría
- **Categorías soportadas**:
  - `hamburguesas`: Personalización de pan, carnes, ingredientes
  - `pizzas`: Personalización de masa, tamaño, ingredientes
  - `pollo`: Personalización de tipo de pollo y salsas
  - `perros`: Personalización de tipo de perro y complementos
  - `postres`: Personalización de tipo y agregados
  - `bebidas`: Selección de bebida
- **Funcionalidades**:
  - Selección de ingredientes
  - Cálculo de precio con extras
  - Vista previa del producto
  - Agregar al carrito con personalización

#### 5. **Buscar.jsx**
- **Ruta**: `/buscar`
- **Query Params**: `?q=termino`
- **Descripción**: Página de búsqueda de productos
- **Funcionalidades**: Búsqueda por nombre, categoría, descripción

#### 6. **CombosPublicos.jsx**
- **Ruta**: `/combos-publicos`
- **Descripción**: Lista de combos personalizados publicados por usuarios
- **Funcionalidades**:
  - Muestra combos públicos de la comunidad
  - Información del creador
  - Navegación a perfil público del creador

#### 7. **PerfilPublico.jsx**
- **Ruta**: `/perfil/:userId`
- **Descripción**: Perfil público de un usuario
- **Funcionalidades**:
  - Información básica del usuario
  - Lista de combos publicados por ese usuario

### Páginas de Autenticación

#### 8. **Login.jsx**
- **Ruta**: `/login`
- **Descripción**: Página de inicio de sesión
- **Funcionalidades**:
  - Formulario de login (email/username y contraseña)
  - Manejo de errores
  - Redirección después de login exitoso
- **Estilos**: `Login.css`

#### 9. **Register.jsx**
- **Ruta**: `/register`
- **Descripción**: Página de registro de nuevos usuarios
- **Funcionalidades**:
  - Formulario de registro
  - Validación de campos
  - Redirección a login después de registro
- **Estilos**: `Register.css`

### Páginas Protegidas (Requieren Autenticación)

#### 10. **Perfil.jsx**
- **Ruta**: `/perfil`
- **Protección**: `ProtectedRoute`
- **Descripción**: Perfil del usuario autenticado
- **Funcionalidades**:
  - Información del usuario
  - Puntos acumulados (solo usuarios regulares)
  - Estadísticas de pedidos (solo usuarios regulares)
  - Enlaces de administración (solo admins)
  - Enlace a combos públicos
- **Estilos**: `Perfil.css`

#### 11. **CrearCombo.jsx**
- **Ruta**: `/crear-combo` y `/editar-combo/:id`
- **Protección**: `ProtectedRoute`
- **Descripción**: Crear o editar combo personalizado
- **Funcionalidades**:
  - Selección de productos
  - Personalización de cada producto
  - Opción de publicar el combo
  - Guardar y editar combos existentes
- **Estilos**: `CrearCombo.css`

#### 12. **Checkout.jsx**
- **Ruta**: `/checkout`
- **Descripción**: Proceso de finalización de compra
- **Funcionalidades**:
  - Resumen del pedido
  - Formulario de datos de entrega
  - Procesamiento de pago
  - Creación de pedido en backend
- **Estilos**: `Checkout.css`

#### 13. **PaymentResult.jsx**
- **Rutas**: `/success`, `/failure`, `/pending`
- **Descripción**: Página de resultado del pago
- **Props**: `type` ("success", "failure", "pending")
- **Funcionalidades**: Muestra mensaje según resultado del pago

### Páginas de Administración

#### 14. **AdminPanel.jsx**
- **Ruta**: `/admin/productos`
- **Protección**: `AdminRoute`
- **Descripción**: Panel de gestión de productos
- **Funcionalidades**:
  - Lista de todos los productos
  - Crear nuevo producto (con subida de imagen)
  - Editar producto existente
  - Eliminar producto
  - Formulario con validación
  - Vista previa de imagen
- **Estilos**: `AdminPanel.css`

#### 15. **AdminDashboard.jsx**
- **Ruta**: `/admin/dashboard`
- **Protección**: `AdminRoute`
- **Descripción**: Dashboard con estadísticas
- **Funcionalidades**:
  - Total de productos
  - Total de pedidos
  - Ingresos totales
  - Top 10 productos más vendidos
- **Estilos**: `AdminDashboard.css`

### Páginas de Combos Específicos

#### 16-19. **ComboBBQCrispy.jsx, ComboClasicoBacon.jsx, etc.**
- **Rutas**: `/combo-bbq-crispy`, `/combo-clasico-bacon`, etc.
- **Descripción**: Páginas dedicadas para combos específicos
- **Funcionalidades**: Información detallada del combo

---

## Context API

### AuthContext

**Ubicación**: `src/context/AuthContext.jsx`

**Propósito**: Gestiona el estado de autenticación del usuario

**Estado**:
- `user`: Objeto con información del usuario (null si no está autenticado)
- `loading`: Boolean indicando si está cargando
- `isAuthenticated`: Boolean derivado de `user`

**Métodos**:
- `login(username, password)`: Inicia sesión y guarda tokens
- `register(userData)`: Registra nuevo usuario
- `logout()`: Cierra sesión y limpia tokens
- `updateUser(userData)`: Actualiza información del usuario
- `loadUser()`: Carga usuario desde token guardado

**Uso**:
```javascript
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);
  
  // Usar estado y métodos
}
```

**Hook personalizado**: `useAuth()`

### CartContext

**Ubicación**: `src/context/CartContext.jsx`

**Propósito**: Gestiona el carrito de compra por usuario

**Estado**:
- `cartItems`: Array de items en el carrito
- `isOpen`: Boolean indicando si el carrito está abierto
- `hydrated`: Boolean indicando si el carrito se cargó desde localStorage

**Métodos**:
- `addToCart(producto, personalizacion)`: Agrega producto al carrito
- `removeFromCart(id)`: Elimina item del carrito
- `updateQuantity(id, cantidad)`: Actualiza cantidad de un item
- `clearCart()`: Vacía el carrito
- `toggleCart()`: Abre/cierra el carrito
- `getTotalItems()`: Retorna total de items
- `getTotalPrice()`: Retorna precio total

**Características**:
- **Carrito por usuario**: Guarda en localStorage con clave `cart_{userId}`
- **Persistencia**: Se guarda automáticamente en localStorage
- **Limpieza**: Se limpia al cerrar sesión

**Uso**:
```javascript
import { useCart } from './context/CartContext';

function MyComponent() {
  const { cartItems, addToCart, getTotalPrice } = useCart();
  
  // Usar carrito
}
```

---

## Servicios API

**Ubicación**: `src/api/api.js`

### Configuración Base

```javascript
export const API_BASE_URL = "http://127.0.0.1:8000/api/";
export const API_ORIGIN = "http://127.0.0.1:8000";
```

### Cliente Axios

- **Interceptores de Request**: Agrega token JWT automáticamente
- **Interceptores de Response**: 
  - Maneja errores 401 (no autorizado)
  - Refresca token automáticamente
  - Redirige a login si el refresh falla

### Servicios Disponibles

#### 1. **authService**
- `login(username, password)`: Iniciar sesión
- `register(userData)`: Registrar usuario
- `getProfile()`: Obtener perfil del usuario
- `updateProfile(userData)`: Actualizar perfil
- `changePassword(oldPassword, newPassword)`: Cambiar contraseña
- `getPublicProfile(userId)`: Obtener perfil público

#### 2. **productService**
- `getProducts()`: Listar todos los productos
- `getProduct(id)`: Obtener producto por ID
- `getIngredientes()`: Listar ingredientes
- `getCombos()`: Listar combos predefinidos
- `getCombo(id)`: Obtener combo por ID
- `getCombosPersonalizados()`: Listar combos personalizados del usuario
- `createComboPersonalizado(comboData)`: Crear combo personalizado
- `updateComboPersonalizado(id, comboData)`: Actualizar combo
- `deleteComboPersonalizado(id)`: Eliminar combo
- `getPublicCombos()`: Listar combos públicos

#### 3. **orderService**
- `getCart()`: Obtener carrito del usuario
- `addToCart(itemData)`: Agregar item al carrito
- `updateCartItem(itemId, quantity)`: Actualizar cantidad
- `removeFromCart(itemId)`: Eliminar item
- `clearCart()`: Vaciar carrito
- `createOrder(orderData)`: Crear pedido
- `getOrders()`: Listar pedidos del usuario
- `getOrder(id)`: Obtener pedido por ID

#### 4. **adminService**
- `getAllProducts()`: Listar todos los productos (admin)
- `getProduct(id)`: Obtener producto (admin)
- `createProduct(productData)`: Crear producto (admin)
- `updateProduct(id, productData)`: Actualizar producto (admin)
- `deleteProduct(id)`: Eliminar producto (admin)
- `getAdminStats()`: Obtener estadísticas de administración

### Utilidades

- `absolutizeMediaUrl(url)`: Convierte URLs relativas de imágenes a absolutas

---

## Rutas y Navegación

### Configuración de Rutas

**Archivo**: `src/App.jsx`

### Rutas Públicas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `Home` | Página de inicio |
| `/menu` | `Menu` | Menú de productos |
| `/buscar` | `Buscar` | Búsqueda de productos |
| `/login` | `Login` | Inicio de sesión |
| `/register` | `Register` | Registro de usuario |
| `/producto/:id` | `ProductoDetalle` | Detalle de producto |
| `/personalizador/:categoria` | `Personalizador` | Personalizador de productos |
| `/combos-publicos` | `CombosPublicos` | Combos de la comunidad |
| `/perfil/:userId` | `PerfilPublico` | Perfil público de usuario |
| `/combo-bbq-crispy` | `ComboBBQCrispy` | Combo específico |
| `/combo-clasico-bacon` | `ComboClasicoBacon` | Combo específico |
| `/combo-pepperoni-lovers` | `ComboPepperoniLovers` | Combo específico |
| `/combo-crocante-deluxe` | `ComboCrocanteDeluxe` | Combo específico |
| `/combo/:id` | `ComboDetalle` | Detalle de combo dinámico |

### Rutas Protegidas (Autenticación Requerida)

| Ruta | Componente | Wrapper | Descripción |
|------|------------|---------|-------------|
| `/perfil` | `Perfil` | `ProtectedRoute` | Perfil del usuario |
| `/crear-combo` | `CrearCombo` | `ProtectedRoute` | Crear combo personalizado |
| `/editar-combo/:id` | `CrearCombo` | `ProtectedRoute` | Editar combo personalizado |
| `/checkout` | `Checkout` | - | Proceso de pago |
| `/success` | `PaymentResult` | - | Pago exitoso |
| `/failure` | `PaymentResult` | - | Pago fallido |
| `/pending` | `PaymentResult` | - | Pago pendiente |

### Rutas de Administración

| Ruta | Componente | Wrapper | Descripción |
|------|------------|---------|-------------|
| `/admin/productos` | `AdminPanel` | `AdminRoute` | Gestión de productos |
| `/admin/dashboard` | `AdminDashboard` | `AdminRoute` | Dashboard de estadísticas |

### Navegación Programática

```javascript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  // Navegar a una ruta
  navigate('/menu');
  
  // Navegar con query params
  navigate('/buscar?q=hamburguesa');
  
  // Navegar con parámetros
  navigate(`/producto/${productId}`);
}
```

---

## Estilos y Assets

### Estructura de Estilos

- **CSS Modules**: Cada componente tiene su archivo CSS correspondiente
- **Estilos Globales**: `index.css` y `App.css`
- **Fuentes**: Google Fonts importadas en algunos componentes

### Assets

**Ubicación**: `src/assets/`

**Categorías**:
- **Productos**: Imágenes de hamburguesas, pizzas, pollo, perros, postres, papas, bebidas
- **UI**: Logo, iconos (carrito, lupa, etc.)
- **Banners**: Imágenes promocionales
- **Ingredientes**: Imágenes para personalizador

### Mapeo de Imágenes

**Archivo**: `src/utils/hamburguesaImageMap.js`

Centraliza el mapeo de imágenes de ingredientes de hamburguesas para facilitar mantenimiento.

---

## Flujos de Usuario

### 1. Flujo de Autenticación

```
Usuario → /login
  ↓
Ingresa credenciales
  ↓
AuthContext.login()
  ↓
API: POST /api/users/login/
  ↓
Recibe tokens (access, refresh)
  ↓
Guarda tokens en localStorage
  ↓
Carga perfil del usuario
  ↓
Redirige a Home o ruta previa
```

### 2. Flujo de Compra

```
Usuario → /menu
  ↓
Selecciona producto
  ↓
/producto/:id
  ↓
Opción A: Agregar al carrito directamente
Opción B: Personalizar → /personalizador/:categoria
  ↓
Agrega al carrito (CartContext.addToCart)
  ↓
Abre carrito (CartModal o Carrito sidebar)
  ↓
/checkout
  ↓
Completa formulario de entrega
  ↓
Procesa pago
  ↓
/success o /failure
```

### 3. Flujo de Personalización

```
Usuario → /producto/:id
  ↓
Clic en "Personalizar"
  ↓
/personalizador/:categoria
  ↓
Selecciona opciones (pan, ingredientes, etc.)
  ↓
Vista previa actualizada
  ↓
Precio calculado con extras
  ↓
"Agregar al carrito"
  ↓
Producto agregado con personalización guardada
```

### 4. Flujo de Administración

```
Admin → Login
  ↓
Verifica is_staff = true
  ↓
Header muestra enlaces de admin
  ↓
/admin/dashboard (estadísticas)
  ↓
/admin/productos (gestión de productos)
  ↓
Crear/Editar/Eliminar productos
  ↓
Subir imágenes
  ↓
Guardar cambios
```

### 5. Flujo de Carrito por Usuario

```
Usuario A → Agrega productos
  ↓
CartContext guarda en localStorage: cart_{userIdA}
  ↓
Usuario A cierra sesión
  ↓
CartContext limpia carrito
  ↓
Usuario B inicia sesión
  ↓
CartContext carga carrito: cart_{userIdB}
  ↓
Cada usuario tiene su propio carrito independiente
```

---

## Características Especiales

### 1. Carrito por Usuario
- Cada usuario tiene su propio carrito guardado en localStorage
- Clave: `cart_{userId}` para usuarios autenticados, `cart_guest` para no autenticados
- Se limpia automáticamente al cerrar sesión

### 2. Personalización de Productos
- Sistema completo de personalización por categoría
- Cálculo automático de precios con extras
- Vista previa en tiempo real
- Guarda personalización en el carrito

### 3. Panel de Administración
- CRUD completo de productos
- Subida de imágenes
- Dashboard con estadísticas
- Validación de permisos (solo `is_staff`)

### 4. Combos Públicos
- Usuarios pueden publicar sus combos personalizados
- Otros usuarios pueden ver combos de la comunidad
- Navegación a perfiles públicos

### 5. Rutas Protegidas
- `ProtectedRoute`: Requiere autenticación
- `AdminRoute`: Requiere autenticación + `is_staff = true`
- Redirección automática a login si no cumple requisitos

---

## Mejores Prácticas

### 1. Gestión de Estado
- Usar Context API para estado global (auth, cart)
- Usar `useState` para estado local de componentes
- Evitar prop drilling excesivo

### 2. Llamadas API
- Usar servicios centralizados en `api/api.js`
- Manejar errores apropiadamente
- Mostrar loading states durante peticiones

### 3. Navegación
- Usar `useNavigate` para navegación programática
- Usar `Link` para navegación declarativa
- Preservar estado con `sessionStorage` cuando sea necesario

### 4. Rendimiento
- Lazy loading de componentes pesados (si es necesario)
- Optimización de imágenes
- Evitar re-renders innecesarios

### 5. Accesibilidad
- Usar elementos semánticos HTML
- Agregar `aria-label` donde sea necesario
- Manejar navegación por teclado

---

## Troubleshooting

### Problemas Comunes

**1. "CORS request blocked"**
- Verificar que el backend esté corriendo
- Verificar configuración de CORS en backend
- Verificar `API_BASE_URL` en `api/api.js`

**2. "Token expired"**
- El interceptor debería refrescar automáticamente
- Si falla, redirige a login
- Verificar que los tokens se guarden correctamente

**3. "Carrito no se guarda"**
- Verificar que el usuario esté autenticado
- Verificar localStorage en DevTools
- Verificar que `user.id` esté disponible

**4. "Rutas protegidas no funcionan"**
- Verificar que `AuthContext` esté envolviendo la app
- Verificar que `isAuthenticated` sea correcto
- Verificar que `user.is_staff` sea correcto para admin routes

---

## Próximos Pasos

1. **Testing**: Agregar tests unitarios y de integración
2. **TypeScript**: Migrar a TypeScript para type safety
3. **Optimización**: Implementar code splitting y lazy loading
4. **PWA**: Convertir en Progressive Web App
5. **Internacionalización**: Agregar soporte multi-idioma

---

**Última Actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: ✅ Completo

