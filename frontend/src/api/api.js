import axios from "axios";

// Base URLs centralizados para reuso
export const API_BASE_URL = "http://127.0.0.1:8000/api/";
export const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/i, "");

// Convierte una ruta /media/... o relativa en URL absoluta al backend
export const absolutizeMediaUrl = (url) => {
  if (!url) return null;
  try {
    if (/^https?:\/\//i.test(url)) return url; // ya es absoluta
    if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
    return `${API_ORIGIN}/${url}`;
  } catch {
    return url;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de conexión y refrescar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es de autorización y aún no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
            refresh: refreshToken
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresh falla, limpiar tokens y redirigir a login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('🚫 Error de conexión con el backend. Verifica que el servidor esté corriendo.');
    }
    return Promise.reject(error);
  }
);

// Servicios específicos para productos
export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get('productos/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`productos/?categoria=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo productos de categoría ${category}:`, error);
      throw error;
    }
  },

  // Obtener un producto específico
  getProduct: async (id) => {
    try {
      const response = await api.get(`productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error);
      throw error;
    }
  },

  // Obtener ingredientes
  getIngredients: async () => {
    try {
      const response = await api.get('ingredientes/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ingredientes:', error);
      throw error;
    }
  },

  // Obtener combos
  getCombos: async () => {
    try {
      const response = await api.get('combos/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo combos:', error);
      throw error;
    }
  },

  // Obtener combos personalizados públicos
  getCombosPublicos: async () => {
    try {
      const response = await api.get('productos/combos-personalizados/publicos/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo combos públicos:', error);
      throw error;
    }
  }
};

// Servicios de autenticación
export const authService = {
  login: async (username, password) => {
    try {
      // Acepta email o username; normaliza y arma el payload correcto
      const identifier = (username || '').trim();
      const pwd = (password || '').trim();
      // Enviar ambos campos para máxima compatibilidad con el serializer backend
      const response = await api.post('token/', {
        username: identifier,
        email: identifier,
        password: pwd
      });
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      // Backend expone el registro en /api/users/register/
      const response = await api.post('users/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      // Perfil del usuario autenticado: /api/users/profile/
      const response = await api.get('users/profile/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },
  
  getMe: async () => {
    try {
      // Acción del ViewSet UserViewSet -> ruta: /api/users/users/me/
      const response = await api.get('users/users/me/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil (me):', error);
      throw error;
    }
  },
  
  getStats: async () => {
    try {
      // Acción del ViewSet UserViewSet -> ruta: /api/users/users/estadisticas/
      const response = await api.get('users/users/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      // Soporta JSON o FormData (para subir imágenes)
      const isFormData = typeof FormData !== 'undefined' && userData instanceof FormData;
      const response = await api.patch('users/profile/', userData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },
  
  changePassword: async (oldPassword, newPassword) => {
    try {
      // UpdateAPIView espera un update; además el serializer requiere confirm_password
      const response = await api.patch('users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  },

  // Obtener perfil público de un usuario
  getPerfilPublico: async (userId) => {
    try {
      const response = await api.get(`users/users/${userId}/perfil_publico/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil público:', error);
      throw error;
    }
  }
};

// Servicios de carrito y pedidos
export const orderService = {
  getCart: async () => {
    try {
      const response = await api.get('orders/cart/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      throw error;
    }
  },
  
  addToCart: async (productId, quantity = 1, customizations = {}) => {
    try {
      const response = await api.post('orders/add-to-cart/', {
        producto: productId,
        cantidad: quantity,
        ingredientes: customizations.ingredientes || []
      });
      return response.data;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      throw error;
    }
  },
  
  createOrder: async (orderData) => {
    try {
      const response = await api.post('orders/create-order/', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  },
  
  getOrders: async () => {
    try {
      const response = await api.get('orders/pedidos/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      throw error;
    }
  },
  
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`orders/pedidos/${orderId}/`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      throw error;
    }
  }
};

// Servicios de reviews
export const reviewService = {
  getReviews: async (productId) => {
    try {
      const response = await api.get(`reviews/?producto=${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reviews:', error);
      throw error;
    }
  },
  
  createReview: async (reviewData) => {
    try {
      const response = await api.post('reviews/', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error creando review:', error);
      throw error;
    }
  }
};

// Servicios de notificaciones
export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('notifications/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      throw error;
    }
  }
};

// Servicios de administración
export const adminService = {
  // CRUD de productos
  getAllProducts: async () => {
    try {
      const response = await api.get('admin/productos/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos (admin):', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await api.get(`admin/productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo producto ${id} (admin):`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && productData instanceof FormData;
      const response = await api.post('admin/productos/', productData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error creando producto (admin):', error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const isFormData = typeof FormData !== 'undefined' && productData instanceof FormData;
      const response = await api.patch(`admin/productos/${id}/`, productData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error(`Error actualizando producto ${id} (admin):`, error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`admin/productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando producto ${id} (admin):`, error);
      throw error;
    }
  },

  // Estadísticas
  getEstadisticas: async () => {
    try {
      const response = await api.get('admin/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas (admin):', error);
      throw error;
    }
  }
};

export default api;
