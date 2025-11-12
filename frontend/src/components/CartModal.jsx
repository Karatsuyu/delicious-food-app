// src/components/CartModal.jsx
import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CartModal.css';
import carrito1 from '../assets/carrito1.png';

const CartModal = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleExplorarMenu = () => {
    navigate('/menu?categoria=hamburguesas');
  };
  // Cuando el modal se abre, calcula la posición del botón del carrito
  useEffect(() => {
    if (isOpen) {
      const cartButton = document.querySelector('.cart-icon');
      if (cartButton) {
        const rect = cartButton.getBoundingClientRect();
        const top = rect.bottom + window.scrollY;
        const left = rect.right - 360; // Ajusta según el ancho del modal

        // Asegurar que no se salga de la pantalla
        const adjustedLeft = Math.max(0, left);

        setPosition({ top, left: adjustedLeft });
      }
    }
  }, [isOpen]);

  // Si no está autenticado, redirigir al login
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      onClose();
      navigate('/login');
    }
  }, [isOpen, isAuthenticated, navigate, onClose]);

  if (!isOpen || !isAuthenticated) return null;

  const handleExploreMenu = () => {
    onClose();
    navigate('/menu?categoria=hamburguesas');
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="cart-modal-content"
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)', // Centra horizontalmente respecto al botón
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="cart-modal-close" onClick={onClose}>
          ×
        </button>
        <div className="cart-modal-icon">
          <img src={carrito1} alt="Carrito" className="cart-modal-icon-img" />
        </div>
        <h2 className="cart-modal-title">Tu carrito está vacío</h2>
        <p className="cart-modal-message">¿Quieres empezar a ordenar?</p>
        <button className="cart-modal-button" onClick={handleExploreMenu}>
          EXPLORAR MENÚ
        </button>
      </div>
    </div>
  );
};

export default CartModal;