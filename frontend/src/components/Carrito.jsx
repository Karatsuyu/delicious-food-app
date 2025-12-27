import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Carrito.css';

function Carrito() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.is_staff;
  const {
    cartItems,
    isOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    toggleCart
  } = useCart();

  // Redirigir al login si abre el carrito sin autenticación
  // Ocultar carrito si es administrador
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      toggleCart();
      navigate('/login');
    }
    // Cerrar carrito automáticamente si es admin
    if (isOpen && isAdmin) {
      toggleCart();
    }
  }, [isOpen, isAuthenticated, isAdmin, navigate, toggleCart]);

  if (!isOpen || !isAuthenticated || isAdmin) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-backdrop" onClick={toggleCart}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>🛒 Carrito de Compras</h2>
          <button className="cart-close-btn" onClick={toggleCart}>×</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos productos deliciosos</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="cart-item"
                    onClick={() => {
                      const prefixMap = {
                        hamburguesa: 'hamburguesas',
                        pizza: 'pizzas',
                        pollo: 'pollo',
                        perro: 'perros',
                        postres: 'postres',
                        papas: 'papas',
                        bebida: 'bebidas'
                      };
                      const foundKey = Object.keys(prefixMap).find(k => item.id.startsWith(k));
                      if (foundKey) {
                        sessionStorage.setItem('ultimaCategoria', prefixMap[foundKey]);
                      }
                      navigate(`/producto/${item.id}`);
                      toggleCart();
                    }}
                    role="button"
                    aria-label={`Ver detalle de ${item.nombre}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="item-image" onClick={e => e.stopPropagation()}>
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.nombre}</h4>
                      <p className="item-price">${item.precio.toLocaleString('es-CO')}</p>
                      {item.personalizacion && Object.keys(item.personalizacion).length > 0 && (
                        <div className="item-customizations">
                          {item.personalizacion.ingredientes && (
                            <p><strong>Ingredientes:</strong> {item.personalizacion.ingredientes.join(', ')}</p>
                          )}
                          {item.personalizacion.precioExtras > 0 && (
                            <p><strong>Extras:</strong> +${item.personalizacion.precioExtras.toLocaleString('es-CO')}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="item-controls" onClick={e => e.stopPropagation()}>
                      <div className="quantity-controls">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.cantidad - 1); }}
                          className="quantity-btn"
                          disabled={item.cantidad <= 1}
                        >−</button>
                        <span className="quantity" onClick={e => e.stopPropagation()}>{item.cantidad}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.cantidad + 1); }}
                          className="quantity-btn"
                        >+</button>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                        className="remove-btn"
                        aria-label={`Eliminar ${item.nombre}`}
                      >🗑️</button>
                    </div>
                    <div className="item-total">${item.precioTotal.toLocaleString('es-CO')}</div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Total ({getTotalItems()} items):</span>
                  <span className="total-price">${getTotalPrice().toLocaleString('es-CO')}</span>
                </div>
              </div>
              <div className="cart-actions">
                <button
                  onClick={clearCart}
                  className="btn-clear-cart"
                >🗑️ Limpiar Carrito</button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-checkout"
                >💳 Finalizar Compra</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;