
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService, absolutizeMediaUrl } from '../api/api';

export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (u) => {
    if (!u) return u;
    const profile_image = absolutizeMediaUrl(u.profile_image);
    // Preservar is_staff y otros campos importantes
    // Asegurar que is_staff sea un booleano explícito
    const isStaff = u.is_staff === true || u.is_staff === 'true' || u.is_staff === 1;
    const normalized = { 
      ...u, 
      profile_image,
      is_staff: isStaff
    };
    console.log('normalizeUser - Input:', u, 'Output:', normalized, 'is_staff value:', normalized.is_staff);
    return normalized;
  };

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const profile = await authService.getProfile();
        const userData = normalizeUser(profile);
        console.log('loadUser - User data:', userData); // Debug
        setUser(userData);
      } catch (error) {
        console.error('Error cargando perfil:', error);
        // Intentar con el endpoint alternativo
        try {
          const profile = await authService.getMe();
          const userData = normalizeUser(profile);
          console.log('loadUser (getMe) - User data:', userData); // Debug
          setUser(userData);
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
      
      // Priorizar is_staff del response del login (más confiable)
      const isStaffFromLogin = response.user?.is_staff || false;
      
      // Obtener perfil del usuario
      try {
        const profile = await authService.getProfile();
        // Asegurar que is_staff esté incluido, priorizando el del login
        const userData = normalizeUser(profile);
        // Usar is_staff del login si está disponible, sino del perfil
        userData.is_staff = isStaffFromLogin || userData.is_staff || false;
        console.log('Login - User data:', userData); // Debug
        setUser(userData);
      } catch (profileError) {
        // Si falla getProfile, intentar con getMe
        try {
          const profile = await authService.getMe();
          // Asegurar que is_staff esté incluido
          const userData = normalizeUser(profile);
          // Usar is_staff del login si está disponible, sino del perfil
          userData.is_staff = isStaffFromLogin || userData.is_staff || false;
          console.log('Login (getMe) - User data:', userData); // Debug
          setUser(userData);
        } catch (meError) {
          console.error('Error obteniendo perfil:', meError);
          // Si también falla, usar la información del token
          if (response.user) {
            const userData = normalizeUser(response.user);
            userData.is_staff = isStaffFromLogin || userData.is_staff || false;
            console.log('Login (fallback) - User data:', userData); // Debug
            setUser(userData);
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
    setUser(normalizeUser(userData));
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
