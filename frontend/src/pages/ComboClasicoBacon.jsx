import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import comboImg2 from '../assets/Combo 2.png';
import './ProductoDetalle.css';

const ComboClasicoBacon = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1); else navigate('/');
  };

  const handleAgregar = () => {
    addToCart({
      id: 'combo2',
      nombre: 'COMBO CLASICO BACON',
      precio: 39900,
      imagen: comboImg2,
      cantidad: 1,
      precioTotal: 39900,
      categoria: 'combos'
    });
  };

  return (
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>
      <div className="detalle-content">
        <img src={comboImg2} alt="COMBO CLASICO BACON" className="producto-imagen" />
        <div className="producto-info">
          <h1 className="producto-nombre">COMBO CLASICO BACON</h1>
          <p className="producto-descripcion">Pizza mediana a elección + gaseosa 1.5L.</p>
          <p className="producto-precio">$ { (39900).toLocaleString('es-CO') }</p>
          <button className="agregar-carrito-btn" onClick={handleAgregar}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ComboClasicoBacon;