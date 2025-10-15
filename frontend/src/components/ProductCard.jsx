import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ producto }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/producto/${producto.id}`);
  };

  const handlePersonalizar = (e) => {
    e.stopPropagation();
    navigate(`/personalizar/${producto.id}`);
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
        {producto.descripcion && (
          <p className="product-description">{producto.descripcion}</p>
        )}
        <p className="product-price">
          ${producto.precio.toLocaleString('es-CO')}
        </p>
        
        <div className="product-actions">
          <button className="btn-add-cart">
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