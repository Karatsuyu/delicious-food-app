import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './ProductCard.css';

function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.is_staff;

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  const handlePersonalizar = (e) => {
    e.stopPropagation();
    navigate(`/personalizar/${producto.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(producto);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        {producto.imagen ? (
          <img src={producto.imagen} alt={producto.nombre} />
        ) : (
          <div className="product-placeholder">🍔</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{producto.nombre}</h3>
        <p className="product-price">
          ${producto.precio.toLocaleString('es-CO')}
        </p>
        
        {!isAdmin && (
          <div className="product-actions">
            <button 
              className="btn-add-cart"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </button>
            {producto.es_personalizable && (
              <button 
                className="btn-customize"
                onClick={handlePersonalizar}
              >
                Personalizar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;