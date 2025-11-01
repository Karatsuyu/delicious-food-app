import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
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
  }
};

// Servicios de autenticación
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('token/', { username, password });
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('register/', userData);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('profile/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get('users/me/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo perfil (me):', error);
      throw error;
    }
  },
  
  getStats: async () => {
    try {
      const response = await api.get('users/estadisticas/');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('profile/', userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },
  
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
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

export default api;
