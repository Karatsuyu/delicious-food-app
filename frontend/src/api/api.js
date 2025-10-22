import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // cambia si usas otro puerto o prefijo
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores de conexión
api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api;
