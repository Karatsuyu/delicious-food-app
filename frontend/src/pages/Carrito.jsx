import React from 'react';
import { useCart } from '../context/CartContext';
import './Carrito.css';

function Carrito() {
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

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart-backdrop" onClick={toggleCart}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>🛒 Carrito de Compras</h2>
          <button className="cart-close-btn" onClick={toggleCart}>
            ✕
          </button>
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
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    
                    <div className="item-details">
                      <h4 className="item-name">{item.nombre}</h4>
                      <p className="item-price">
                        ${item.precio.toLocaleString('es-CO')}
                      </p>
                      
                      {item.personalizacion && Object.keys(item.personalizacion).length > 0 && (
                        <div className="item-customizations">
                          {item.personalizacion.ingredientes && (
                            <p>
                              <strong>Ingredientes:</strong> {item.personalizacion.ingredientes.join(', ')}
                            </p>
                          )}
                          {item.personalizacion.precioExtras > 0 && (
                            <p>
                              <strong>Extras:</strong> +${item.personalizacion.precioExtras.toLocaleString('es-CO')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <span className="quantity">{item.cantidad}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="item-total">
                      ${item.precioTotal.toLocaleString('es-CO')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Total ({getTotalItems()} items):</span>
                  <span className="total-price">
                    ${getTotalPrice().toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              <div className="cart-actions">
                <button 
                  onClick={clearCart}
                  className="btn-clear-cart"
                >
                  🗑️ Limpiar Carrito
                </button>
                
                <button 
                  className="btn-checkout"
                  onClick={() => {
                    alert('¡Funcionalidad de checkout en desarrollo!');
                  }}
                >
                  💳 Proceder al Pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Carrito;