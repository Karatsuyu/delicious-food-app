import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Personalizador.css';

const Personalizador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  
  const [personalizacion, setPersonalizacion] = useState({
    tamaño: 'mediano',
    ingredientes: [],
    extras: [],
    cantidad: 1,
    observaciones: ''
  });

  
  const tamaños = [
    { id: 'pequeño', nombre: 'Pequeño', precio: 0 },
    { id: 'mediano', nombre: 'Mediano', precio: 2 },
    { id: 'grande', nombre: 'Grande', precio: 4 }
  ];

  const ingredientesDisponibles = [
    { id: 'queso', nombre: 'Queso Extra', precio: 1.5 },
    { id: 'tomate', nombre: 'Tomate', precio: 0.5 },
    { id: 'lechuga', nombre: 'Lechuga', precio: 0.5 },
    { id: 'cebolla', nombre: 'Cebolla', precio: 0.5 },
    { id: 'pepperoni', nombre: 'Pepperoni', precio: 2 },
    { id: 'champiñones', nombre: 'Champiñones', precio: 1 }
  ];

  const extrasDisponibles = [
    { id: 'bebida', nombre: 'Bebida', precio: 2 },
    { id: 'papas', nombre: 'Papas Fritas', precio: 3 },
    { id: 'postre', nombre: 'Postre', precio: 4 }
  ];

  
  const calcularPrecio = () => {
    let precioBase = 15; 
    let precioTamaño = tamaños.find(t => t.id === personalizacion.tamaño)?.precio || 0;
    let precioIngredientes = personalizacion.ingredientes.reduce((total, ing) => {
      const ingrediente = ingredientesDisponibles.find(i => i.id === ing);
      return total + (ingrediente?.precio || 0);
    }, 0);
    let precioExtras = personalizacion.extras.reduce((total, extra) => {
      const extraItem = extrasDisponibles.find(e => e.id === extra);
      return total + (extraItem?.precio || 0);
    }, 0);
    
    return (precioBase + precioTamaño + precioIngredientes + precioExtras) * personalizacion.cantidad;
  };

  const handleTamañoChange = (tamaño) => {
    setPersonalizacion(prev => ({ ...prev, tamaño }));
  };

  const handleIngredienteToggle = (ingredienteId) => {
    setPersonalizacion(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.includes(ingredienteId)
        ? prev.ingredientes.filter(id => id !== ingredienteId)
        : [...prev.ingredientes, ingredienteId]
    }));
  };

  const handleExtraToggle = (extraId) => {
    setPersonalizacion(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }));
  };

  const handleCantidadChange = (cantidad) => {
    setPersonalizacion(prev => ({ ...prev, cantidad: Math.max(1, cantidad) }));
  };

  const handleObservacionesChange = (e) => {
    setPersonalizacion(prev => ({ ...prev, observaciones: e.target.value }));
  };

  const agregarAlCarrito = () => {
    
    console.log('Agregando al carrito:', personalizacion);
    alert('¡Producto agregado al carrito!');
    navigate('/carrito');
  };

  return (
    <div className="personalizador-container">
      <div className="personalizador-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="personalizador-title">Personaliza tu Pedido</h1>
        <p className="producto-id">Producto ID: {id}</p>
      </div>

      <div className="personalizador-content">
        <div className="personalizador-options">
          {/* Selección de Tamaño */}
          <div className="option-section">
            <h3 className="section-title">Tamaño</h3>
            <div className="tamaño-options">
              {tamaños.map(tamaño => (
                <label key={tamaño.id} className="tamaño-option">
                  <input
                    type="radio"
                    name="tamaño"
                    value={tamaño.id}
                    checked={personalizacion.tamaño === tamaño.id}
                    onChange={() => handleTamañoChange(tamaño.id)}
                  />
                  <span className="tamaño-info">
                    <span className="tamaño-nombre">{tamaño.nombre}</span>
                    <span className="tamaño-precio">
                      {tamaño.precio > 0 ? `+$${tamaño.precio}` : 'Incluido'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Ingredientes */}
          <div className="option-section">
            <h3 className="section-title">Ingredientes Adicionales</h3>
            <div className="ingredientes-grid">
              {ingredientesDisponibles.map(ingrediente => (
                <label key={ingrediente.id} className="ingrediente-option">
                  <input
                    type="checkbox"
                    checked={personalizacion.ingredientes.includes(ingrediente.id)}
                    onChange={() => handleIngredienteToggle(ingrediente.id)}
                  />
                  <span className="ingrediente-info">
                    <span className="ingrediente-nombre">{ingrediente.nombre}</span>
                    <span className="ingrediente-precio">+${ingrediente.precio}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="option-section">
            <h3 className="section-title">Extras</h3>
            <div className="extras-grid">
              {extrasDisponibles.map(extra => (
                <label key={extra.id} className="extra-option">
                  <input
                    type="checkbox"
                    checked={personalizacion.extras.includes(extra.id)}
                    onChange={() => handleExtraToggle(extra.id)}
                  />
                  <span className="extra-info">
                    <span className="extra-nombre">{extra.nombre}</span>
                    <span className="extra-precio">+${extra.precio}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Cantidad */}
          <div className="option-section">
            <h3 className="section-title">Cantidad</h3>
            <div className="cantidad-controls">
              <button 
                className="cantidad-btn"
                onClick={() => handleCantidadChange(personalizacion.cantidad - 1)}
                disabled={personalizacion.cantidad <= 1}
              >
                -
              </button>
              <span className="cantidad-display">{personalizacion.cantidad}</span>
              <button 
                className="cantidad-btn"
                onClick={() => handleCantidadChange(personalizacion.cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Observaciones */}
          <div className="option-section">
            <h3 className="section-title">Observaciones Especiales</h3>
            <textarea
              className="observaciones-input"
              placeholder="Ej: Sin cebolla, bien cocido, etc."
              value={personalizacion.observaciones}
              onChange={handleObservacionesChange}
              rows={3}
            />
          </div>
        </div>

        {/* Resumen y Precio */}
        <div className="personalizador-summary">
          <div className="summary-card">
            <h3 className="summary-title">Resumen del Pedido</h3>
            
            <div className="summary-details">
              <div className="summary-item">
                <span>Tamaño:</span>
                <span>{tamaños.find(t => t.id === personalizacion.tamaño)?.nombre}</span>
              </div>
              
              {personalizacion.ingredientes.length > 0 && (
                <div className="summary-item">
                  <span>Ingredientes:</span>
                  <span>{personalizacion.ingredientes.map(id => 
                    ingredientesDisponibles.find(i => i.id === id)?.nombre
                  ).join(', ')}</span>
                </div>
              )}
              
              {personalizacion.extras.length > 0 && (
                <div className="summary-item">
                  <span>Extras:</span>
                  <span>{personalizacion.extras.map(id => 
                    extrasDisponibles.find(e => e.id === id)?.nombre
                  ).join(', ')}</span>
                </div>
              )}
              
              <div className="summary-item">
                <span>Cantidad:</span>
                <span>{personalizacion.cantidad}</span>
              </div>
            </div>

            <div className="precio-total">
              <span className="precio-label">Total:</span>
              <span className="precio-valor">${calcularPrecio().toFixed(2)}</span>
            </div>

            <button className="agregar-carrito-btn" onClick={agregarAlCarrito}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personalizador;
