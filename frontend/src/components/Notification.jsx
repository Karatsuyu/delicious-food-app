import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ notification, onClose }) {
  useEffect(() => {
    if (notification.autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <div className="notification-message">
          <strong>{notification.title}</strong>
          {notification.message && <p>{notification.message}</p>}
        </div>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default Notification;

