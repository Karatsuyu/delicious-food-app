import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        // Intentar con el endpoint alternativo
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (error2) {
          console.error('Error cargando perfil alternativo:', error2);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      // Obtener perfil del usuario
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (profileError) {
        // Si falla getProfile, intentar con getMe
        try {
          const profile = await authService.getMe();
          setUser(profile);
        } catch (meError) {
          console.error('Error obteniendo perfil:', meError);
          // Si también falla, usar la información del token
          if (response.user) {
            setUser(response.user);
          }
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response?.data) {
        // Manejar diferentes formatos de error
        if (error.response.data.non_field_errors && Array.isArray(error.response.data.non_field_errors)) {
          errorMessage = error.response.data.non_field_errors[0];
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          // Si es un objeto, intentar extraer el primer mensaje de error
          const firstError = Object.values(error.response.data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error en registro:', error);
      let errorMessage = 'Error al registrar';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        } else {
          // Si es un objeto con múltiples errores, concatenarlos
          const errors = Object.values(error.response.data).flat();
          errorMessage = errors.join(', ');
        }
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      updateUser,
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
