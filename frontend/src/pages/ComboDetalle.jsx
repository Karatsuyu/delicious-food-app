import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Reutilizamos los mismos banners como imágenes de los combos
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';

// Reutilizamos estilos del detalle de producto para consistencia visual
import './ProductoDetalle.css';

const combos = {
  combo1: {
    id: 'combo1',
    nombre: 'Combo Doble Burger',
    descripcion: '2 hamburguesas clásicas + papas medianas + 2 bebidas personales.',
    precio: 34900,
    imagen: banner1,
    categoria: 'combos',
  },
  combo2: {
    id: 'combo2',
    nombre: 'Combo Pizza + Gaseosa',
    descripcion: 'Pizza mediana a elección + gaseosa 1.5L.',
    precio: 39900,
    imagen: banner2,
    categoria: 'combos',
  },
  combo3: {
    id: 'combo3',
    nombre: 'Combo Alitas & Papas',
    descripcion: '8 alitas BBQ + papas a la francesa + salsa de la casa.',
    precio: 26900,
    imagen: banner3,
    categoria: 'combos',
  },
  combo4: {
    id: 'combo4',
    nombre: 'Combo Familiar',
    descripcion: 'Pizza familiar + 2 perros + gaseosa 3L.',
    precio: 68900,
    imagen: banner4,
    categoria: 'combos',
  },
};

const ComboDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const combo = useMemo(() => combos[id], [id]);

  const handleVolver = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!combo) {
    return (
      <div className="producto-detalle-container">
        <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>
        <div className="error">Combo no encontrado</div>
      </div>
    );
  }

  const handleAgregar = () => {
    const item = {
      id: combo.id,
      nombre: combo.nombre,
      precio: combo.precio,
      imagen: combo.imagen,
      cantidad: 1,
      precioTotal: combo.precio,
      categoria: combo.categoria,
    };
    addToCart(item);
  };

  return (
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>← Regresar</button>

      <div className="detalle-content">
        <img src={combo.imagen} alt={combo.nombre} className="producto-imagen" />

        <div className="producto-info">
          <h1 className="producto-nombre">{combo.nombre}</h1>
          <p className="producto-descripcion">{combo.descripcion}</p>
          <p className="producto-precio">${combo.precio.toLocaleString('es-CO')}</p>

          <button className="agregar-carrito-btn" onClick={handleAgregar}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComboDetalle;
