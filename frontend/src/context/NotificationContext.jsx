import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || 'Notificación',
      message: notification.message || '',
      duration: notification.duration || 5000,
      autoClose: notification.autoClose !== false,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Métodos de conveniencia
  const showSuccess = useCallback((title, message, options = {}) => {
    return showNotification({ type: 'success', title, message, ...options });
  }, [showNotification]);

  const showError = useCallback((title, message, options = {}) => {
    return showNotification({ type: 'error', title, message, ...options });
  }, [showNotification]);

  const showWarning = useCallback((title, message, options = {}) => {
    return showNotification({ type: 'warning', title, message, ...options });
  }, [showNotification]);

  const showInfo = useCallback((title, message, options = {}) => {
    return showNotification({ type: 'info', title, message, ...options });
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification
      }}
    >
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

