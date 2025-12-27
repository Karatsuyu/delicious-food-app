import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import comboImg1 from '../assets/Combo 1.png';
import './ProductoDetalle.css';

const ComboBBQCrispy = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1); else navigate('/');
  };

  const handleAgregar = () => {
    addToCart({
      id: 'combo1',
      nombre: 'COMBO BBQ CRISPY',
      precio: 34900,
      imagen: comboImg1,
      cantidad: 1,
      precioTotal: 34900,
      categoria: 'combos'
    });
  };

  return (
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>
      <div className="detalle-content">
        <img src={comboImg1} alt="COMBO BBQ CRISPY" className="producto-imagen" />
        <div className="producto-info">
          <h1 className="producto-nombre">COMBO BBQ CRISPY</h1>
          <p className="producto-descripcion">2 hamburguesas clásicas + papas medianas + 2 bebidas personales.</p>
          <p className="producto-precio">$ { (34900).toLocaleString('es-CO') }</p>
          <button className="agregar-carrito-btn" onClick={handleAgregar}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ComboBBQCrispy;