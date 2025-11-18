import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductoDetalle.css';

const CarritoItemDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const item = useMemo(() => {
    return cartItems.find(ci => String(ci.id) === String(id));
  }, [cartItems, id]);

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  if (!item) {
    return (
      <div className="producto-detalle-container">
        <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>
        <div className="error">No se encontró el ítem en tu carrito</div>
      </div>
    );
  }

  const tieneItems = Array.isArray(item.items) && item.items.length > 0;
  const tieneDetalles = item.detalles && typeof item.detalles === 'object' && Object.keys(item.detalles).length > 0;

  return (
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>

      <div className="detalle-content">
        {item.imagen && (
          <img src={item.imagen} alt={item.nombre} className="producto-imagen" />
        )}

        <div className="producto-info">
          <h1 className="producto-nombre">{item.nombre}</h1>
          <p className="producto-precio">${(item.precio ?? item.precioTotal ?? 0).toLocaleString('es-CO')}</p>

          {tieneItems && (
            <div className="opciones-tamano" style={{ marginTop: 12 }}>
              <h4>Este combo incluye:</h4>
              <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
                {item.items.map((sub, idx) => (
                  <li key={idx} style={{ margin: '4px 0' }}>
                    {(sub.cantidad ?? 1)} x {sub.nombre || sub.id}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tieneDetalles && (
            <div className="opciones-tamano" style={{ marginTop: 12 }}>
              <h4>Detalle de personalización:</h4>
              <ul style={{ paddingLeft: 18, margin: '8px 0' }}>
                {Object.entries(item.detalles).map(([k, v]) => (
                  <li key={k} style={{ margin: '4px 0' }}>
                    <strong>{(k.charAt(0).toUpperCase() + k.slice(1)).replace(/_/g, ' ')}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoItemDetalle;
