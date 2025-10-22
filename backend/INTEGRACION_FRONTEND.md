# Guía de Integración Frontend-Backend

Este documento explica cómo conectar el frontend React con el backend Django REST API.

---

## Tabla de Contenidos

1. [Setup Inicial](#setup-inicial)
2. [Configuración API Client](#configuración-api-client)
3. [Gestión de Autenticación](#gestión-de-autenticación)
4. [Ejemplos de Integración](#ejemplos-de-integración)
5. [Manejo de Errores](#manejo-de-errores)
6. [Best Practices](#best-practices)

---

## Setup Inicial

### 1. Instalar Dependencias Necesarias

```bash
cd frontend

# Instalar axios (cliente HTTP)
npm install axios

# (Ya debe estar instalado react-router-dom)
npm install react-router-dom
```

---

### 2. Crear Estructura de Carpetas

```
frontend/src/
├── api/
│   ├── api.js              # Configuración de axios
│   ├── auth.js             # Funciones de autenticación
│   ├── products.js         # Funciones de productos
│   ├── orders.js           # Funciones de pedidos
│   ├── reviews.js          # Funciones de reseñas
│   └── notifications.js    # Funciones de notificaciones
│
├── context/
│   ├── AuthContext.jsx     # Contexto de autenticación
│   ├── CartContext.jsx     # Contexto de carrito
│   └── NotificationContext.jsx  # Contexto de notificaciones
│
├── hooks/
│   ├── useAuth.js          # Hook para autenticación
│   ├── useCart.js          # Hook para carrito
│   └── useFetch.js         # Hook para fetch genérico
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Menu.jsx
│   ├── Carrito.jsx
│   └── ...
│
└── ...
```

---

## Configuración API Client

### 1. Archivo: `src/api/api.js`

```javascript
import axios from 'axios';

// Configurar URL base según ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies
});

// **INTERCEPTOR: Agregar token a cada request**
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **INTERCEPTOR: Manejar respuestas y refresh token**
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 (no autorizado) e intentos de refresh aún disponibles
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Intentar refrescar el token
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        // Reintentar request original con nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló, hacer logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Redirigir a login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 2. Variables de Entorno: `frontend/.env`

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Delicious Food
```

---

## Gestión de Autenticación

### 1. Archivo: `src/context/AuthContext.jsx`

```javascript
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuario y token al montar la aplicación
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Obtener perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profile/');
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/register/', userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error en registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/token/', { email, password });
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setToken(access);

      await fetchUserProfile();
      return { success: true, user };
    } catch (err) {
      setError(err.response?.data?.detail || 'Error en login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setToken(null);
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.patch('/profile/', profileData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 2. Hook: `src/hooks/useAuth.js`

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

---

## Ejemplos de Integración

### 1. Página de Login

**Archivo:** `src/pages/Login.jsx`

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/'); // Redirigir a home después del login
    } catch (err) {
      setError(err.response?.data?.detail || 'Error en login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
}
```

---

### 2. Página de Productos (Menu)

**Archivo:** `src/pages/Menu.jsx`

```javascript
import { useState, useEffect } from 'react';
import api from '../api/api';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/productos/');
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Menú</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imagen} alt={product.nombre} />
            <h3>{product.nombre}</h3>
            <p>{product.descripcion}</p>
            <p className="price">${product.precio_base}</p>
            <button onClick={() => addToCart(product.id)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  function addToCart(productId) {
    // Implementar agregar al carrito
    console.log('Agregar producto', productId, 'al carrito');
  }
}
```

---

### 3. Página de Carrito

**Archivo:** `src/pages/Carrito.jsx`

```javascript
import { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';

export default function Carrito() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/cart/');
      setCart(response.data);
    } catch (err) {
      setError('Error al cargar carrito');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      const response = await api.post('/orders/pedidos/', {
        direccion: 'Calle Principal 123',
        telefono_contacto: '+1234567890',
        metodo_pago: 'TARJETA',
      });
      alert('Pedido creado exitosamente!');
      fetchCart(); // Refrescar carrito (debe estar vacío)
    } catch (err) {
      alert('Error al crear pedido: ' + err.response?.data?.error);
    }
  };

  if (!isAuthenticated) {
    return <p>Debes estar autenticado para ver el carrito</p>;
  }

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>{error}</p>;

  if (!cart || cart.items.length === 0) {
    return <p>El carrito está vacío</p>;
  }

  return (
    <div>
      <h1>Mi Carrito</h1>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.producto?.nombre || item.combo?.nombre} x {item.cantidad} = $
            {item.precio_total}
          </li>
        ))}
      </ul>
      <h3>Total: ${cart.total_carrito}</h3>
      <button onClick={createOrder}>Crear Pedido</button>
    </div>
  );
}
```

---

### 4. Agregar Item al Carrito

```javascript
// Función reutilizable
export async function addToCart(productId, cantidad = 1, ingredientes = []) {
  try {
    const response = await api.post('/orders/add-to-cart/', {
      producto_id: productId,
      cantidad,
      ingredientes,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}
```

**Uso en componente:**

```javascript
const handleAddToCart = async (productId) => {
  try {
    await addToCart(productId, 1, [1, 2]); // producto 1, cantidad 1, ingredientes [1, 2]
    alert('Agregado al carrito!');
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
```

---

### 5. Página de Reseñas

```javascript
import { useState, useEffect } from 'react';
import api from '../api/api';

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [newReview, setNewReview] = useState({ texto: '', calificacion: 5 });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/?producto=${productId}`);
      setReviews(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(
        `/reviews/estadisticas_producto/?producto=${productId}`
      );
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews/', {
        producto: productId,
        ...newReview,
      });
      setNewReview({ texto: '', calificacion: 5 });
      fetchReviews();
      fetchStats();
      alert('Reseña enviada!');
    } catch (err) {
      alert('Error: ' + err.response?.data?.calificacion?.[0]);
    }
  };

  return (
    <div>
      <h2>Reseñas</h2>
      
      {stats && (
        <div className="stats">
          <p>Promedio: {stats.promedio_calificacion} ⭐</p>
          <p>Total: {stats.total_reviews} reseñas</p>
        </div>
      )}

      <form onSubmit={submitReview}>
        <textarea
          value={newReview.texto}
          onChange={(e) =>
            setNewReview({ ...newReview, texto: e.target.value })
          }
          placeholder="Tu opinión..."
        />
        <select
          value={newReview.calificacion}
          onChange={(e) =>
            setNewReview({ ...newReview, calificacion: parseInt(e.target.value) })
          }
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
        <button type="submit">Enviar Reseña</button>
      </form>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <p>
              <strong>{review.usuario_email}</strong> - {review.calificacion} ⭐
            </p>
            <p>{review.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Manejo de Errores

### 1. Crear Componente de Error

**Archivo:** `src/components/ErrorBoundary.jsx`

```javascript
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Algo salió mal</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Wrapper en App.jsx

```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          {/* Resto de la aplicación */}
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

---

## Best Practices

### 1. **Usar Variables de Entorno para URLs**

```javascript
// ✅ Bien
const API_URL = import.meta.env.VITE_API_URL;

// ❌ Evitar
const API_URL = 'http://localhost:8000/api';
```

---

### 2. **Implementar Caché de Datos**

```javascript
const [cache, setCache] = useState({});

const fetchData = async (url) => {
  if (cache[url]) {
    return cache[url];
  }

  const response = await api.get(url);
  setCache({ ...cache, [url]: response.data });
  return response.data;
};
```

---

### 3. **Usar AbortController para Cancelar Requests**

```javascript
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const response = await api.get('/products/', {
        signal: controller.signal,
      });
      setProducts(response.data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    }
  };

  fetchData();

  return () => controller.abort(); // Cleanup
}, []);
```

---

### 4. **Validar Datos Antes de Enviar**

```javascript
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSubmit = (email) => {
  if (!validateEmail(email)) {
    setError('Email inválido');
    return;
  }
  // Proceder con el submit
};
```

---

### 5. **Implementar Retry Logic**

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await api.get(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## Checklist de Integración

- [ ] Configurar `api.js` con interceptores
- [ ] Crear `AuthContext` y hook `useAuth`
- [ ] Implementar página de Login
- [ ] Implementar página de Registro
- [ ] Crear página de Productos (Menu)
- [ ] Implementar Carrito
- [ ] Crear formulario de Pedido
- [ ] Agregar página de Reseñas
- [ ] Implementar notificaciones
- [ ] Testing de flows principales
- [ ] Manejar errores y loading states
- [ ] Optimizar performance

---

**Última Actualización:** 21 de Octubre, 2024
