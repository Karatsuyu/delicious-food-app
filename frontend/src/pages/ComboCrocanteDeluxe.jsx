import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import comboImg4 from '../assets/Combo 4.png';
import './ProductoDetalle.css';

const ComboCrocanteDeluxe = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1); else navigate('/');
  };

  const handleAgregar = () => {
    addToCart({
      id: 'combo4',
      nombre: 'COMBO CROCANTE DELUXE',
      precio: 68900,
      imagen: comboImg4,
      cantidad: 1,
      precioTotal: 68900,
      categoria: 'combos'
    });
  };

  return (
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>
      <div className="detalle-content">
        <img src={comboImg4} alt="COMBO CROCANTE DELUXE" className="producto-imagen" />
        <div className="producto-info">
          <h1 className="producto-nombre">COMBO CROCANTE DELUXE</h1>
          <p className="producto-descripcion">2 hamburguesas especiales (Res o cerdo) + papas crujientes + 2 gaseosas personales.</p>
          <p className="producto-precio">$ { (68900).toLocaleString('es-CO') }</p>
          <button className="agregar-carrito-btn" onClick={handleAgregar}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ComboCrocanteDeluxe;