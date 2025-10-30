# 📊 Análisis Completo del Repositorio - Delicious Food App

## 📑 Tabla de Contenidos
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Backend - Django REST Framework](#backend---django-rest-framework)
6. [Frontend - React + Vite](#frontend---react--vite)
7. [Funcionamiento del Código](#funcionamiento-del-código)
8. [Flujo de Datos](#flujo-de-datos)
9. [Patrones de Diseño](#patrones-de-diseño)
10. [Mejoras y Recomendaciones](#mejoras-y-recomendaciones)

---

## 📋 Resumen Ejecutivo

**Delicious Food App** es una aplicación full-stack de pedidos de comida en línea que combina:
- **Backend**: API REST desarrollada con Django 5.2.6 y Django REST Framework
- **Frontend**: Aplicación SPA (Single Page Application) construida con React 19.1.1 y Vite
- **Arquitectura**: Cliente-Servidor con autenticación JWT
- **Base de datos**: SQLite3 (desarrollo) / PostgreSQL (producción recomendada)
- **Características**: Carrito de compras, personalización de productos, combos, reseñas, notificaciones

---

## 🗂️ Estructura de Archivos

### Estructura General del Proyecto

```
delicious-food-app/
│
├── backend/                          # Servidor Django REST API
│   ├── restaurant_api/              # Configuración principal del proyecto
│   │   ├── settings.py              # Configuración Django (apps, middleware, db)
│   │   ├── urls.py                  # Rutas principales de la API
│   │   ├── wsgi.py                  # Punto de entrada WSGI
│   │   └── asgi.py                  # Punto de entrada ASGI (async)
│   │
│   ├── users/                       # App: Gestión de usuarios
│   │   ├── models.py                # Modelo User personalizado
│   │   ├── serializers.py           # Serialización de datos
│   │   ├── views.py                 # Lógica de endpoints
│   │   ├── urls.py                  # Rutas de usuarios
│   │   └── admin.py                 # Configuración admin panel
│   │
│   ├── products/                    # App: Productos y combos
│   │   ├── models.py                # Producto, Ingrediente, Combo
│   │   ├── serializers.py           # Serialización productos/combos
│   │   ├── views.py                 # CRUD productos
│   │   ├── urls.py                  # Rutas de productos
│   │   └── management/commands/     # Comandos personalizados
│   │       └── create_sample_data.py # Poblar BD con datos
│   │
│   ├── orders/                      # App: Carrito y pedidos
│   │   ├── models.py                # Carrito, Pedido, CarritoItem
│   │   ├── serializers.py           # Serialización de pedidos
│   │   ├── views.py                 # Lógica carrito/checkout
│   │   └── urls.py                  # Rutas de pedidos
│   │
│   ├── reviews/                     # App: Sistema de reseñas
│   │   ├── models.py                # Review (usuario, producto, rating)
│   │   ├── serializers.py           # Serialización de reseñas
│   │   ├── views.py                 # CRUD reseñas
│   │   └── urls.py                  # Rutas de reseñas
│   │
│   ├── notifications/               # App: Notificaciones de usuario
│   │   ├── models.py                # Notificacion (mensaje, leído)
│   │   ├── serializers.py           # Serialización notificaciones
│   │   ├── views.py                 # Gestión de notificaciones
│   │   └── urls.py                  # Rutas de notificaciones
│   │
│   ├── requirements.txt             # Dependencias Python
│   ├── manage.py                    # CLI de Django
│   ├── db.sqlite3                   # Base de datos (desarrollo)
│   └── media/                       # Archivos subidos (imágenes)
│
├── frontend/                         # Cliente React
│   ├── src/
│   │   ├── main.jsx                 # Punto de entrada React
│   │   ├── App.jsx                  # Componente raíz + Router
│   │   ├── App.css                  # Estilos globales
│   │   ├── index.css                # Reset CSS y variables globales
│   │   │
│   │   ├── api/
│   │   │   └── api.js               # Cliente Axios + servicios API
│   │   │
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── Header.jsx           # Barra de navegación
│   │   │   ├── Header.css
│   │   │   ├── Footer.jsx           # Pie de página
│   │   │   ├── Footer.css
│   │   │   ├── Banner.jsx           # Banner principal (Home)
│   │   │   ├── Banner.css
│   │   │   ├── ProductCard.jsx      # Tarjeta de producto
│   │   │   ├── CartModal.jsx        # Modal del carrito
│   │   │   └── CartModal.css
│   │   │
│   │   ├── pages/                   # Páginas/vistas principales
│   │   │   ├── Home.jsx             # Página de inicio
│   │   │   ├── Home.css
│   │   │   ├── Menu.jsx             # Menú de productos por categoría
│   │   │   ├── Menu.css
│   │   │   ├── ProductoDetalle.jsx  # Detalle de un producto
│   │   │   ├── ProductoDetalle.css
│   │   │   ├── Personalizador.jsx   # Personalizar producto/combo
│   │   │   ├── Personalizador.css
│   │   │   ├── Carrito.jsx          # Vista del carrito (overlay)
│   │   │   ├── Carrito.css
│   │   │   ├── Login.jsx            # Formulario de login
│   │   │   ├── Login.css
│   │   │   ├── Register.jsx         # Formulario de registro
│   │   │   ├── Register.css
│   │   │   ├── Perfil.jsx           # Perfil de usuario
│   │   │   └── Perfil.css (no existe aún)
│   │   │
│   │   ├── context/                 # Context API para estado global
│   │   │   ├── CartContext.jsx      # Estado del carrito
│   │   │   └── AuthContext.jsx      # Estado de autenticación
│   │   │
│   │   └── assets/                  # Imágenes estáticas
│   │       ├── ham1.png - ham8.png  # Imágenes de hamburguesas
│   │       ├── piz1.png - piz7.png  # Imágenes de pizzas
│   │       ├── po1.png - po6.png    # Imágenes de pollo
│   │       ├── pe1.png - pe2.png    # Imágenes de perros calientes
│   │       └── banner*.png          # Imágenes de banners
│   │
│   ├── public/                      # Archivos públicos estáticos
│   ├── index.html                   # HTML base
│   ├── package.json                 # Dependencias npm
│   ├── vite.config.js               # Configuración de Vite
│   └── eslint.config.js             # Configuración de ESLint
│
├── .gitignore                       # Archivos ignorados por git
├── CAMBIOS_REALIZADOS.md           # Historial de cambios previos
└── help                             # Archivo de ayuda (less command)
```

---

## 🛠️ Stack Tecnológico

### Backend (Django)

#### Framework y Core
- **Django 5.2.6**: Framework web Python de alto nivel
- **Django REST Framework 3.16.1**: Toolkit para construir Web APIs
- **Python 3.x**: Lenguaje de programación base

#### Autenticación y Seguridad
- **djangorestframework-simplejwt 5.5.1**: Autenticación con JSON Web Tokens
  - Implementa access tokens y refresh tokens
  - Permite autenticación stateless
- **PyJWT 2.10.1**: Librería para codificar/decodificar JWT

#### Base de Datos
- **SQLite3**: Base de datos por defecto (desarrollo)
- **psycopg2-binary 2.9.10**: Adaptador PostgreSQL (producción)
- **sqlparse 0.5.3**: Parser SQL no validante

#### Gestión de Archivos y APIs
- **Pillow 11.3.0**: Procesamiento de imágenes
- **django-cors-headers 4.8.0**: Manejo de CORS para permitir requests del frontend

#### Utilidades
- **python-dotenv 1.1.1**: Carga variables de entorno desde archivo .env
- **asgiref 3.9.1**: Especificación ASGI para async
- **typing_extensions 4.15.0**: Extensiones de tipos para Python
- **tzdata 2025.2**: Base de datos de zonas horarias

### Frontend (React)

#### Framework y Core
- **React 19.1.1**: Librería para construir interfaces de usuario
- **React DOM 19.1.1**: Renderizado de React en el DOM
- **Vite 7.1.2**: Build tool y dev server ultra-rápido

#### Routing y Peticiones HTTP
- **React Router DOM 7.9.4**: Manejo de rutas en SPA
- **Axios 1.12.2**: Cliente HTTP para peticiones a la API

#### Herramientas de Desarrollo
- **@vitejs/plugin-react 5.0.0**: Plugin de React para Vite
- **ESLint 9.33.0**: Linter para JavaScript
- **eslint-plugin-react-hooks 5.2.0**: Reglas de ESLint para React Hooks
- **eslint-plugin-react-refresh 0.4.20**: Soporte Fast Refresh
- **@types/react 19.1.10**: Tipos TypeScript para React
- **@types/react-dom 19.1.7**: Tipos TypeScript para React DOM
- **globals 16.3.0**: Variables globales para ESLint

---

## 🏗️ Arquitectura del Sistema

### Patrón Arquitectónico: Cliente-Servidor REST

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        Browser - React App (SPA)                       │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  Components & Pages (UI)                         │  │ │
│  │  │  ↕                                                │  │ │
│  │  │  Context API (Estado Global)                     │  │ │
│  │  │  ↕                                                │  │ │
│  │  │  API Service (Axios) - HTTP Requests             │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    HTTP/HTTPS (JSON)
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   SERVIDOR (Backend)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        Django REST Framework API                       │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │  URLs & Router                                   │  │ │
│  │  │  ↕                                                │  │ │
│  │  │  Views & ViewSets (Lógica de negocio)           │  │ │
│  │  │  ↕                                                │  │ │
│  │  │  Serializers (Validación y transformación)      │  │ │
│  │  │  ↕                                                │  │ │
│  │  │  Models (ORM Django)                             │  │ │
│  │  │  ↕                                                │  │ │
│  │  │  Database (SQLite/PostgreSQL)                    │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación JWT

```
1. Usuario → Login (email + password)
2. Backend → Valida credenciales
3. Backend → Genera access_token y refresh_token
4. Frontend → Guarda tokens en localStorage
5. Frontend → Incluye access_token en cada request (Header: Authorization: Bearer <token>)
6. Backend → Valida token en cada request
7. Si token expira → Frontend usa refresh_token para obtener nuevo access_token
```

---

## 🔧 Backend - Django REST Framework

### Aplicaciones Django (Apps)

#### 1. **users/** - Gestión de Usuarios
**Modelo Principal: User**
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)  # Email único para login
    phone_number = models.CharField(max_length=15)
    points = models.IntegerField(default=0)  # Sistema de puntos
    profile_image = models.ImageField(upload_to='profiles/')
    
    USERNAME_FIELD = 'email'  # Login con email en lugar de username
```

**Funcionalidades:**
- Registro de usuarios nuevos
- Login con JWT (access y refresh tokens)
- Actualización de perfil
- Cambio de contraseña
- Sistema de puntos (gamificación)
- Gestión de imagen de perfil

#### 2. **products/** - Productos y Combos
**Modelos:**

```python
class Ingrediente(models.Model):
    nombre = models.CharField(max_length=100)
    costos_extras = models.DecimalField(max_digits=7, decimal_places=2)

class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=7, decimal_places=2)
    imagen = models.ImageField(upload_to='productos/')
    es_personalizable = models.BooleanField(default=True)
    categoria = models.CharField(max_length=50)
    ingredientes = models.ManyToManyField(Ingrediente)

class Combo(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio_total = models.DecimalField(max_digits=7, decimal_places=2)
    productos = models.ManyToManyField(Producto)

class ComboPersonalizado(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    productos = models.ManyToManyField(Producto)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)
    creado_en = models.DateTimeField(auto_now_add=True)
```

**Funcionalidades:**
- CRUD de productos
- Gestión de ingredientes
- Combos predefinidos
- Combos personalizados por usuario
- Filtrado por categoría (hamburguesas, pizzas, pollo, etc.)

#### 3. **orders/** - Carrito y Pedidos
**Modelos:**

```python
class Carrito(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    creado_en = models.DateTimeField(auto_now_add=True)

class CarritoItem(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    ingredientes_extras = models.ManyToManyField(Ingrediente)

class Pedido(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20)  # pendiente, en_proceso, entregado
    total = models.DecimalField(max_digits=10, decimal_places=2)
    direccion_entrega = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
```

**Funcionalidades:**
- Agregar/eliminar productos del carrito
- Gestión de cantidades
- Personalización con ingredientes extras
- Checkout y creación de pedidos
- Historial de pedidos del usuario
- Actualización de estado de pedidos

#### 4. **reviews/** - Sistema de Reseñas
**Modelo:**

```python
class Review(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    rating = models.IntegerField()  # 1-5 estrellas
    comentario = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)
```

**Funcionalidades:**
- Crear reseñas de productos
- Editar/eliminar propias reseñas
- Listar reseñas por producto
- Calcular rating promedio
- Validación: 1 reseña por usuario por producto

#### 5. **notifications/** - Notificaciones
**Modelo:**

```python
class Notificacion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    mensaje = models.TextField()
    leida = models.BooleanField(default=False)
    tipo = models.CharField(max_length=20)  # pedido, sistema, promocion
    creado_en = models.DateTimeField(auto_now_add=True)
```

**Funcionalidades:**
- Notificaciones de cambio de estado de pedidos
- Notificaciones de promociones
- Marcar como leída/no leída
- Eliminar notificaciones leídas

### Endpoints Principales

#### Autenticación
- `POST /api/register/` - Registro
- `POST /api/token/` - Login (obtener tokens)
- `POST /api/token/refresh/` - Refrescar access token

#### Usuarios
- `GET /api/profile/` - Ver perfil
- `PUT/PATCH /api/profile/` - Actualizar perfil

#### Productos
- `GET /api/productos/` - Listar productos
- `GET /api/productos/{id}/` - Detalle de producto
- `GET /api/productos/?categoria=pizzas` - Filtrar por categoría
- `GET /api/ingredientes/` - Listar ingredientes
- `GET /api/combos/` - Listar combos
- `POST /api/combos-personalizados/` - Crear combo personalizado

#### Carrito
- `GET /api/orders/cart/` - Ver carrito
- `POST /api/orders/add-to-cart/` - Agregar al carrito
- `DELETE /api/orders/cart/{item_id}/` - Eliminar del carrito

#### Pedidos
- `POST /api/orders/pedidos/` - Crear pedido
- `GET /api/orders/pedidos/` - Listar mis pedidos
- `GET /api/orders/pedidos/{id}/` - Detalle de pedido

#### Reseñas
- `GET /api/reviews/` - Listar reseñas
- `POST /api/reviews/` - Crear reseña
- `PUT /api/reviews/{id}/` - Actualizar reseña
- `DELETE /api/reviews/{id}/` - Eliminar reseña

#### Notificaciones
- `GET /api/notifications/` - Listar notificaciones
- `PATCH /api/notifications/{id}/` - Marcar como leída
- `POST /api/notifications/mark-all-read/` - Marcar todas como leídas

---

## ⚛️ Frontend - React + Vite

### Arquitectura de Componentes

```
App (Router + CartProvider)
│
├── Header (Navegación)
│   └── CartModal (Icono de carrito)
│
├── Routes (React Router)
│   ├── Home
│   │   └── Banner
│   ├── Menu
│   │   └── ProductCard (múltiples)
│   ├── ProductoDetalle
│   ├── Personalizador
│   ├── Login
│   └── Register
│
├── Carrito (Overlay global)
│
└── Footer
```

### Context API - Estado Global

#### CartContext
Maneja el estado global del carrito:

```javascript
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const addToCart = (product, quantity) => { /* ... */ };
  const removeFromCart = (productId) => { /* ... */ };
  const updateQuantity = (productId, quantity) => { /* ... */ };
  const clearCart = () => { /* ... */ };
  const getTotal = () => { /* ... */ };
  
  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      addToCart,
      removeFromCart,
      // ... más funciones
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

#### AuthContext
Maneja el estado de autenticación:

```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  
  const login = async (email, password) => { /* ... */ };
  const logout = () => { /* ... */ };
  const register = async (userData) => { /* ... */ };
  
  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      register,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### API Service (Axios)

**Configuración Base:**
```javascript
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión con backend');
    }
    return Promise.reject(error);
  }
);
```

**Servicios:**
```javascript
export const productService = {
  getAllProducts: async () => {
    const response = await api.get('productos/');
    return response.data;
  },
  
  getProductsByCategory: async (category) => {
    const response = await api.get(`productos/?categoria=${category}`);
    return response.data;
  },
  
  getProduct: async (id) => {
    const response = await api.get(`productos/${id}/`);
    return response.data;
  },
  
  // ... más métodos
};
```

### Componentes Principales

#### 1. Header.jsx
- Barra de navegación principal
- Links a Home, Menu, Login/Register
- Icono de carrito con contador de items
- Responsive con menú hamburguesa en móvil

#### 2. ProductCard.jsx
- Tarjeta de producto reutilizable
- Muestra imagen, nombre, precio
- Botón "Agregar al carrito"
- Click navega a detalle del producto

#### 3. Menu.jsx
- Muestra productos por categoría
- Botones de navegación: Hamburguesas, Pizzas, Pollo, etc.
- Grid responsivo de ProductCard
- Filtrado por categoría con estado local

#### 4. ProductoDetalle.jsx
- Vista detallada de un producto
- Muestra imagen grande, descripción completa
- Selector de cantidad
- Botón "Personalizar" (si es personalizable)
- Botón "Agregar al carrito"
- Fallback a datos locales si backend no disponible

#### 5. Personalizador.jsx
- Interfaz para personalizar producto
- Selección de ingredientes extras
- Cálculo de precio en tiempo real
- Botón "Agregar al carrito" con configuración

#### 6. Carrito.jsx
- Implementado como **overlay** (no página separada)
- Se superpone sobre la página actual
- Lista de items con imagen y precio
- Controles de cantidad (+/-)
- Botón "Eliminar" por item
- Resumen de totales
- Botones "Limpiar carrito" y "Proceder al pago"
- Animaciones de entrada/salida

#### 7. Login.jsx & Register.jsx
- Formularios de autenticación
- Validación de inputs
- Mensajes de error
- Redirección tras login exitoso

### Características de la UI

#### Diseño Responsivo
- Mobile first design
- Breakpoints para tablet y desktop
- Grid system con CSS Grid/Flexbox
- Menú hamburguesa en móvil

#### Animaciones y Transiciones
- Transiciones suaves en hover
- Animaciones de entrada para el carrito overlay
- Loading spinners para estados de carga
- Feedback visual en botones

#### Sistema de Carrito como Overlay
- **z-index alto** para superponerse a todo
- **Backdrop blur** para efecto de profundidad
- **Sidebar deslizable** desde la derecha
- **Cierre con click fuera** del carrito
- **Persistencia en localStorage** (opcional)

---

## 🔄 Funcionamiento del Código

### Flujo de Usuario Típico

#### 1. Navegación y Exploración
```
Usuario visita Home → Ve Banner → 
Click "Explorar Menú" → Navega a /menu → 
Selecciona categoría (ej: Pizzas) → 
Ve lista de pizzas con ProductCard
```

**Código implicado:**
- `Home.jsx` renderiza `Banner.jsx`
- `Menu.jsx` filtra productos por categoría
- `ProductCard.jsx` muestra cada producto

#### 2. Ver Detalle de Producto
```
Usuario click en ProductCard → 
Navega a /producto/:id → 
ProductoDetalle carga datos del producto → 
Muestra información completa
```

**Código implicado:**
```javascript
// En ProductoDetalle.jsx
useEffect(() => {
  const fetchProduct = async () => {
    try {
      // Intenta obtener del backend
      const data = await productService.getProduct(id);
      setProducto(data);
    } catch (error) {
      // Si falla, usa datos locales como fallback
      const localProduct = localProducts.find(p => p.id === parseInt(id));
      setProducto(localProduct);
    }
  };
  fetchProduct();
}, [id]);
```

#### 3. Personalizar Producto
```
Usuario click "Personalizar" → 
Navega a /personalizar/:id → 
Selecciona ingredientes extras → 
Ve precio actualizado en tiempo real → 
Click "Agregar al carrito"
```

**Código implicado:**
```javascript
// En Personalizador.jsx
const handleIngredientToggle = (ingrediente) => {
  if (selectedIngredients.includes(ingrediente)) {
    // Remover ingrediente
    setSelectedIngredients(prev => prev.filter(i => i !== ingrediente));
  } else {
    // Agregar ingrediente
    setSelectedIngredients(prev => [...prev, ingrediente]);
  }
  // Recalcular precio
  updateTotalPrice();
};

const handleAddToCart = () => {
  addToCart({
    ...producto,
    ingredientesExtras: selectedIngredients,
    precioFinal: totalPrice
  }, quantity);
  navigate('/menu');
};
```

#### 4. Gestión del Carrito
```
Usuario click icono carrito → 
Carrito se abre como overlay → 
Usuario ve items, ajusta cantidades → 
Click "Proceder al pago"
```

**Código implicado:**
```javascript
// En CartContext.jsx
const addToCart = (product, quantity) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Si ya existe, actualizar cantidad
      return prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Si no existe, agregar nuevo item
      return [...prevCart, { ...product, quantity }];
    }
  });
};

// En Carrito.jsx
const CartOverlay = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  
  return (
    <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
      <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />
      <div className="cart-sidebar">
        {/* Contenido del carrito */}
      </div>
    </div>
  );
};
```

#### 5. Autenticación (si implementada)
```
Usuario click "Login" → 
Ingresa email y password → 
Frontend envía POST a /api/token/ → 
Backend valida y devuelve tokens → 
Frontend guarda en localStorage → 
Usuario autenticado
```

**Código implicado:**
```javascript
// En Login.jsx
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('token/', {
      email: email,
      password: password
    });
    
    // Guardar tokens
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Actualizar estado
    setUser(response.data.user);
    
    // Redirigir
    navigate('/menu');
  } catch (error) {
    setError('Credenciales inválidas');
  }
};

// Agregar token a todas las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Manejo de Estados

#### Estados Locales (useState)
Usados en componentes individuales:
```javascript
const [producto, setProducto] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [quantity, setQuantity] = useState(1);
const [selectedIngredients, setSelectedIngredients] = useState([]);
```

#### Estados Globales (Context API)
Compartidos entre componentes:
```javascript
// CartContext
const [cart, setCart] = useState([]);
const [isCartOpen, setIsCartOpen] = useState(false);

// AuthContext
const [user, setUser] = useState(null);
const [token, setToken] = useState(null);
```

#### Efectos Secundarios (useEffect)
Para operaciones asíncronas y side effects:
```javascript
// Cargar datos al montar componente
useEffect(() => {
  fetchProductos();
}, []);

// Reaccionar a cambios de dependencias
useEffect(() => {
  calculateTotal();
}, [selectedIngredients, quantity]);

// Cleanup al desmontar
useEffect(() => {
  return () => {
    // Limpiar subscripciones, timers, etc.
  };
}, []);
```

---

## 📊 Flujo de Datos

### Patrón de Comunicación

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│                                                          │
│  User Action (click, submit)                            │
│         ↓                                                │
│  Event Handler (onClick, onSubmit)                      │
│         ↓                                                │
│  API Call (axios)                                        │
│         ↓                                                │
└─────────┼────────────────────────────────────────────────┘
          │
          │ HTTP Request (JSON)
          ↓
┌─────────┼────────────────────────────────────────────────┐
│         ↓                BACKEND                         │
│  URL Router (urls.py)                                    │
│         ↓                                                │
│  View/ViewSet (views.py)                                │
│         ↓                                                │
│  Serializer Validation (serializers.py)                 │
│         ↓                                                │
│  Model Operation (ORM)                                   │
│         ↓                                                │
│  Database Query                                          │
│         ↓                                                │
│  Response (JSON)                                         │
└─────────┼────────────────────────────────────────────────┘
          │
          │ HTTP Response (JSON)
          ↓
┌─────────┼────────────────────────────────────────────────┐
│         ↓               FRONTEND                         │
│  .then() or async/await                                  │
│         ↓                                                │
│  Update State (setState, setCart, etc.)                 │
│         ↓                                                │
│  Re-render Component                                     │
│         ↓                                                │
│  Updated UI                                              │
└──────────────────────────────────────────────────────────┘
```

### Ejemplo Concreto: Agregar al Carrito

**1. Usuario hace click en "Agregar al carrito"**
```javascript
// ProductoDetalle.jsx
<button onClick={() => handleAddToCart()}>
  Agregar al Carrito
</button>
```

**2. Handler llama a función del Context**
```javascript
const handleAddToCart = () => {
  addToCart(producto, quantity);
  setIsCartOpen(true); // Abre el carrito
};
```

**3. Context actualiza estado global**
```javascript
// CartContext.jsx
const addToCart = (product, quantity) => {
  setCart(prevCart => {
    // Lógica para agregar/actualizar
    const updatedCart = [...prevCart, { ...product, quantity }];
    
    // Opcional: guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return updatedCart;
  });
};
```

**4. Componentes suscritos se re-renderizan**
```javascript
// Header.jsx - actualiza contador
const { cart } = useCart();
const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

<span className="cart-count">{itemCount}</span>

// Carrito.jsx - actualiza lista
const { cart } = useCart();
return (
  <ul>
    {cart.map(item => (
      <CartItem key={item.id} item={item} />
    ))}
  </ul>
);
```

---

## 🎨 Patrones de Diseño

### 1. Container/Presentational Pattern
Separación entre lógica y presentación:

```javascript
// Container (lógica)
const MenuContainer = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProductos();
  }, []);
  
  return <MenuView productos={productos} loading={loading} />;
};

// Presentational (UI)
const MenuView = ({ productos, loading }) => {
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="menu-grid">
      {productos.map(p => <ProductCard key={p.id} producto={p} />)}
    </div>
  );
};
```

### 2. Provider Pattern
Estado global con Context API:

```javascript
// Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  // ... lógica
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook para consumir
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

// Uso en componentes
const SomeComponent = () => {
  const { cart, addToCart } = useCart();
  // ...
};
```

### 3. Compound Components Pattern
Componentes que trabajan juntos:

```javascript
<Carrito>
  <Carrito.Header />
  <Carrito.ItemList />
  <Carrito.Summary />
  <Carrito.Actions />
</Carrito>
```

### 4. Higher-Order Component (HOC) Pattern
Para autenticación:

```javascript
const withAuth = (Component) => {
  return (props) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};

// Uso
const ProtectedPage = withAuth(ProfilePage);
```

### 5. Repository Pattern (Backend)
Abstracción de acceso a datos:

```python
# Serializers actúan como repositorios
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
    
    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError("Precio debe ser positivo")
        return value

# ViewSets exponen operaciones CRUD
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        return queryset
```

### 6. Service Layer Pattern
Lógica de negocio separada:

```javascript
// api/productService.js
export const productService = {
  getAllProducts: async () => {
    // Lógica centralizada
  },
  
  getProductWithFallback: async (id) => {
    try {
      return await api.get(`productos/${id}/`);
    } catch (error) {
      // Fallback a datos locales
      return getLocalProduct(id);
    }
  }
};
```

---

## 🚀 Mejoras y Recomendaciones

### Seguridad

#### Frontend
1. **Sanitización de inputs**: Implementar validación robusta
2. **HTTPS en producción**: Forzar conexiones seguras
3. **XSS Protection**: Escapar contenido dinámico
4. **Token Refresh automático**: Implementar refresh antes de expiración

#### Backend
1. **SECRET_KEY en variables de entorno**: No hardcodear
2. **Rate Limiting**: Limitar requests por IP
3. **CORS configurado correctamente**: Solo dominios permitidos
4. **Validación exhaustiva**: En todos los serializers
5. **SQL Injection protection**: Django ORM ya protege, pero validar inputs

### Performance

#### Frontend
1. **Lazy Loading de imágenes**: Cargar bajo demanda
2. **Code Splitting**: Dividir bundle por rutas
3. **Memoización**: useCallback, useMemo para optimizar renders
4. **Virtual Scrolling**: Para listas largas
5. **Service Worker**: PWA para cache offline

Ejemplo:
```javascript
// Lazy loading de rutas
const Menu = lazy(() => import('./pages/Menu'));
const ProductoDetalle = lazy(() => import('./pages/ProductoDetalle'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/menu" element={<Menu />} />
    <Route path="/producto/:id" element={<ProductoDetalle />} />
  </Routes>
</Suspense>
```

#### Backend
1. **Caching**: Redis para datos frecuentes
2. **Database Indexing**: Índices en campos de búsqueda
3. **Query Optimization**: select_related, prefetch_related
4. **Pagination**: Limitar resultados por página
5. **Compresión de respuestas**: gzip

Ejemplo:
```python
# Optimizar queries
class ProductoViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Producto.objects.select_related('usuario').prefetch_related('ingredientes')
    
    # Paginación
    pagination_class = PageNumberPagination
```

### Testing

#### Frontend
1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: Testing de flujos completos
3. **E2E Tests**: Playwright o Cypress

Ejemplo:
```javascript
// ProductCard.test.jsx
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

test('renders product name', () => {
  const producto = { id: 1, nombre: 'Pizza', precio: 10000 };
  render(<ProductCard producto={producto} />);
  expect(screen.getByText('Pizza')).toBeInTheDocument();
});
```

#### Backend
1. **Unit Tests**: TestCase de Django
2. **API Tests**: APITestCase de DRF
3. **Coverage**: Mantener >80%

Ejemplo:
```python
# products/tests.py
from rest_framework.test import APITestCase

class ProductoAPITest(APITestCase):
    def test_create_producto(self):
        data = {
            'nombre': 'Test Pizza',
            'precio': 15000,
            'categoria': 'pizzas'
        }
        response = self.client.post('/api/productos/', data)
        self.assertEqual(response.status_code, 201)
```

### Escalabilidad

1. **Microservicios**: Separar en servicios independientes
2. **Load Balancing**: Nginx para distribuir carga
3. **Kubernetes**: Orquestación de contenedores
4. **Database Replication**: Réplicas de lectura
5. **CDN**: Para archivos estáticos e imágenes

### UI/UX

1. **Dark Mode**: Tema oscuro opcional
2. **Accesibilidad**: ARIA labels, navegación por teclado
3. **Internacionalización**: Soporte multi-idioma (i18n)
4. **Animaciones mejoradas**: Framer Motion
5. **Error Boundaries**: Manejo de errores en React

Ejemplo:
```javascript
// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Algo salió mal. Por favor recarga la página.</h1>;
    }
    return this.props.children;
  }
}

// Uso
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### DevOps

1. **CI/CD**: GitHub Actions para deploy automático
2. **Docker**: Containerización de la app
3. **Environment Variables**: .env para configuración
4. **Logging**: Winston (frontend), Django Logging (backend)
5. **Monitoring**: Sentry para error tracking

Ejemplo Dockerfile:
```dockerfile
# Backend Dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "restaurant_api.wsgi:application", "--bind", "0.0.0.0:8000"]

# Frontend Dockerfile
FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "preview"]
```

### Documentación

1. **API Documentation**: Swagger/OpenAPI
2. **Component Documentation**: Storybook
3. **README mejorado**: Badges, screenshots
4. **Changelog**: Mantener historial de cambios
5. **Code Comments**: JSDoc y docstrings

---

## 📝 Conclusión

**Delicious Food App** es una aplicación full-stack moderna y bien estructurada que implementa:

✅ **Arquitectura limpia**: Separación frontend/backend  
✅ **Stack moderno**: React 19 + Django 5  
✅ **Autenticación segura**: JWT tokens  
✅ **Estado global**: Context API  
✅ **API RESTful**: Django REST Framework  
✅ **Diseño responsivo**: Mobile-first  
✅ **Carrito avanzado**: Overlay con animaciones  
✅ **Personalización**: Ingredientes extras  
✅ **Fallback system**: Funciona sin backend  

### Próximos Pasos Sugeridos

1. ✅ Implementar sistema de pagos (Stripe, PayPal)
2. ✅ Agregar tracking de pedidos en tiempo real
3. ✅ Implementar sistema de búsqueda avanzada
4. ✅ Agregar más tests (unit, integration, e2e)
5. ✅ Implementar PWA para instalación móvil
6. ✅ Agregar notificaciones push
7. ✅ Implementar sistema de cupones/descuentos
8. ✅ Dashboard de administración mejorado
9. ✅ Analytics de ventas y productos más vendidos
10. ✅ Sistema de fidelización con puntos

---

**Fecha de Análisis**: 30 de Octubre, 2025  
**Versión del Proyecto**: 1.0.0  
**Estado**: ✅ En Desarrollo Activo
