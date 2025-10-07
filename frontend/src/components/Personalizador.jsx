import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Personalizador.css';

function Personalizador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [ingredientes, setIngredientes] = useState([]);
  const [selectedIngredientes, setSelectedIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodResponse, ingResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/products/productos/${id}/`),
          axios.get('http://localhost:8000/api/products/ingredientes/')
        ]);
        
        setProducto(prodResponse.data);
        setIngredientes(ingResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleIngrediente = (ingrediente) => {
    setSelectedIngredientes(prev => {
      const exists = prev.find(i => i.id === ingrediente.id);
      if (exists) {
        return prev.filter(i => i.id !== ingrediente.id);
      } else {
        return [...prev, ingrediente];
      }
    });
  };

  const calcularPrecioTotal = () => {
    if (!producto) return 0;
    const precioBase = parseFloat(producto.precio);
    const precioExtras = selectedIngredientes.reduce(
      (sum, ing) => sum + parseFloat(ing.costos_extras),
      0
    );
    return precioBase + precioExtras;
  };

  const handleAgregarCarrito = () => {
    // Aquí implementarás la lógica del carrito
    alert('Producto personalizado agregado al carrito!');
    navigate('/carrito');
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  return (
    <div className="personalizador-container">
      <div className="personalizador-content">
        <div className="producto-preview">
          <h2>{producto.nombre}</h2>
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} />
          ) : (
            <div className="preview-placeholder">🍔</div>
          )}
          <div className="precio-info">
            <p className="precio-base">
              Precio base: ${parseFloat(producto.precio).toLocaleString('es-CO')}
            </p>
            <p className="precio-total">
              Total: ${calcularPrecioTotal().toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <div className="ingredientes-section">
          <h3>Personaliza tu {producto.nombre}</h3>
          <p className="instrucciones">
            Selecciona los ingredientes adicionales que desees:
          </p>

          <div className="ingredientes-grid">
            {ingredientes.map(ingrediente => (
              <div
                key={ingrediente.id}
                className={`ingrediente-item ${
                  selectedIngredientes.find(i => i.id === ingrediente.id)
                    ? 'selected'
                    : ''
                }`}
                onClick={() => toggleIngrediente(ingrediente)}
              >
                <div className="ingrediente-info">
                  <span className="ingrediente-nombre">{ingrediente.nombre}</span>
                  <span className="ingrediente-precio">
                    +${parseFloat(ingrediente.costos_extras).toLocaleString('es-CO')}
                  </span>
                </div>
                <div className="ingrediente-checkbox">
                  {selectedIngredientes.find(i => i.id === ingrediente.id) && '✓'}
                </div>
              </div>
            ))}
          </div>

          <div className="personalizador-actions">
            <button className="btn-cancelar" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button className="btn-agregar" onClick={handleAgregarCarrito}>
              Agregar al carrito - ${calcularPrecioTotal().toLocaleString('es-CO')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personalizador;