import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import comboImg3 from '../assets/Combo 3.png';
import './ProductoDetalle.css';

const ComboPepperoniLovers = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleVolver = () => {
    if (window.history.length > 1) navigate(-1); else navigate('/');
  };

  const handleAgregar = () => {
    addToCart({
      id: 'combo3',
      nombre: 'COMBO PEPPERONI LOVERS',
      precio: 26900,
      imagen: comboImg3,
      cantidad: 1,
      precioTotal: 26900,
      categoria: 'combos'
    });
  };

  return (
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>
      <div className="detalle-content">
        <img src={comboImg3} alt="COMBO PEPPERONI LOVERS" className="producto-imagen" />
        <div className="producto-info">
          <h1 className="producto-nombre">COMBO PEPPERONI LOVERS</h1>
          <p className="producto-descripcion">8 alitas BBQ + papas a la francesa + salsa de la casa.</p>
          <p className="producto-precio">$ { (26900).toLocaleString('es-CO') }</p>
          <button className="agregar-carrito-btn" onClick={handleAgregar}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
};

export default ComboPepperoniLovers;