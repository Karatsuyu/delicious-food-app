import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  const handlePersonalizar = (e) => {
    e.stopPropagation();
    navigate(`/personalizar/${producto.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const message = addToCart(producto);
    alert(message);
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
      </div>
    </div>
  );
}

export default ProductCard;