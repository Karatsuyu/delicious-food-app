import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/api';
import { useCart } from '../context/CartContext';
import './Personalizador.css';

const Personalizador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [personalizacion, setPersonalizacion] = useState({
    tamaño: 'mediano',
    ingredientes: [],
    extras: [],
    cantidad: 1,
    observaciones: ''
  });

  // Cargar producto desde la API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        
        // Intentar obtener del backend primero
        try {
          const productoBackend = await productService.getProduct(id);
          setProducto(productoBackend);
        } catch (backendError) {
          console.log('Backend no disponible, usando datos locales...');
          
          // Si el backend no está disponible, usar datos locales
          const productosLocales = {
            'ham-1': { id: 'ham-1', nombre: 'Hamburguesa Clásica', precio: 15900, descripcion: 'Hamburguesa tradicional', categoria: 'hamburguesas', es_personalizable: true },
            'ham-2': { id: 'ham-2', nombre: 'Hamburguesa con Queso', precio: 18900, descripcion: 'Deliciosa hamburguesa con queso derretido', categoria: 'hamburguesas', es_personalizable: true },
            'ham-3': { id: 'ham-3', nombre: 'Hamburguesa Deluxe', precio: 22900, descripcion: 'Hamburguesa premium con ingredientes especiales', categoria: 'hamburguesas', es_personalizable: true },
            'ham-4': { id: 'ham-4', nombre: 'BBQ Crispy', precio: 19900, descripcion: 'Hamburguesa con barbecue y crujiente', categoria: 'hamburguesas', es_personalizable: true },
            'ham-5': { id: 'ham-5', nombre: 'Clásico Bacon', precio: 21900, descripcion: 'Hamburguesa con tocino crujiente', categoria: 'hamburguesas', es_personalizable: true },
            'ham-6': { id: 'ham-6', nombre: 'Madurita Burger', precio: 17900, descripcion: 'Hamburguesa con ingredientes frescos', categoria: 'hamburguesas', es_personalizable: true },
            'ham-7': { id: 'ham-7', nombre: 'BBQ Crunch Burger', precio: 24900, descripcion: 'Hamburguesa BBQ con ingredientes crujientes', categoria: 'hamburguesas', es_personalizable: true },
            'ham-8': { id: 'ham-8', nombre: 'Double Smash', precio: 28900, descripcion: 'Doble hamburguesa jugosa', categoria: 'hamburguesas', es_personalizable: true }, 
            'pizza-1': { id: 'pizza-1', nombre: 'Pizza Hawaiana', precio: 32000, descripcion: 'Pizza con jamón y piña', categoria: 'pizzas', es_personalizable: true },
            'pizza-2': { id: 'pizza-2', nombre: 'Pizza de Queso', precio: 34900, descripcion: 'Pizza con queso derretido', categoria: 'pizzas', es_personalizable: true },
            'pizza-3': { id: 'pizza-3', nombre: 'Pizza de Pepperoni', precio: 36900, descripcion: 'Pizza con pepperoni', categoria: 'pizzas', es_personalizable: true },
            'pizza-4': { id: 'pizza-4', nombre: 'Pizza Aromática de Pepperoni', precio: 38000, descripcion: 'Pizza de pepperoni con hierbas aromáticas', categoria: 'pizzas', es_personalizable: true },
            'pizza-5': { id: 'pizza-5', nombre: 'Pizza de Pollo y Champiñones', precio: 38000, descripcion: 'Pizza con pollo y champiñones', categoria: 'pizzas', es_personalizable: true },
            'pizza-6': { id: 'pizza-6', nombre: 'Pepperoni Lovers', precio: 40900, descripcion: 'Pizza cargada de pepperoni', categoria: 'pizzas', es_personalizable: true },
            'pizza-7': { id: 'pizza-7', nombre: 'Pizza Campesina', precio: 41500, descripcion: 'Pizza con ingredientes del campo', categoria: 'pizzas', es_personalizable: true },
            'pollo-1': { id: 'pollo-1', nombre: 'Alitas Simples', precio: 12000, descripcion: 'Alitas de pollo tradicionales', categoria: 'pollo', es_personalizable: true },
            'pollo-2': { id: 'pollo-2', nombre: 'Alitas Crocantes', precio: 12900, descripcion: 'Alitas extra crujientes', categoria: 'pollo', es_personalizable: true },
            'pollo-3': { id: 'pollo-3', nombre: 'Alitas BBQ', precio: 16000, descripcion: 'Alitas con salsa BBQ', categoria: 'pollo', es_personalizable: true },
            'pollo-4': { id: 'pollo-4', nombre: 'Alitas Teriyaki', precio: 16500, descripcion: 'Alitas con salsa teriyaki', categoria: 'pollo', es_personalizable: true },
            'pollo-5': { id: 'pollo-5', nombre: 'Alitas Ajo Parmesano', precio: 18000, descripcion: 'Alitas con ajo y parmesano', categoria: 'pollo', es_personalizable: true },
            'pollo-6': { id: 'pollo-6', nombre: 'Alitas Barbacoa', precio: 18000, descripcion: 'Alitas con salsa barbacoa', categoria: 'pollo', es_personalizable: true },
            'perro-1': { id: 'perro-1', nombre: 'Perro Clásico', precio: 9000, descripcion: 'Perro caliente tradicional', categoria: 'perros', es_personalizable: true },
            'perro-2': { id: 'perro-2', nombre: 'Perro Supremo', precio: 12000, descripcion: 'Perro caliente con ingredientes especiales', categoria: 'perros', es_personalizable: true },
            'perro-3': { id: 'perro-3', nombre: 'Perro Crocante', precio: 16000, descripcion: 'Perro caliente extra crujiente', categoria: 'perros', es_personalizable: true },
            'perro-4': { id: 'perro-4', nombre: 'Alitas Teriyaki', precio: 16500, descripcion: 'Alitas con salsa teriyaki', categoria: 'perros', es_personalizable: true },
          };
          
          const productoLocal = productosLocales[id];
          if (productoLocal) {
            setProducto(productoLocal);
          } else {
            console.error('Producto no encontrado en datos locales');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error cargando producto:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);
  
  const tamaños = [
    { id: 'pequeño', nombre: 'Pequeño', precio: 0 },
    { id: 'mediano', nombre: 'Mediano', precio: 5000 },
    { id: 'grande', nombre: 'Grande', precio: 9000 }
  ];

  const ingredientesDisponibles = [
    { id: 'queso', nombre: 'Queso Extra', precio: 1.500 },
    { id: 'tomate', nombre: 'Tomate', precio: 500 },
    { id: 'lechuga', nombre: 'Lechuga', precio: 500 },
    { id: 'cebolla', nombre: 'Cebolla', precio: 500 },
    { id: 'pepperoni', nombre: 'Pepperoni', precio: 2000 },
    { id: 'champiñones', nombre: 'Champiñones', precio: 1000 }
  ];

  const extrasDisponibles = [
    { id: 'bebida', nombre: 'Bebida', precio: 2000 },
    { id: 'papas', nombre: 'Papas Fritas', precio: 3000 },
    { id: 'postre', nombre: 'Postre', precio: 4000 }
  ];

  
  const calcularPrecio = () => {
    if (!producto) return 0;
    
    let precioBase = parseFloat(producto.precio) || 15; 
    let precioTamaño = tamaños.find(t => t.id === personalizacion.tamaño)?.precio || 0;
    let precioIngredientes = personalizacion.ingredientes.reduce((total, ing) => {
      const ingrediente = ingredientesDisponibles.find(i => i.id === ing);
      return total + (ingrediente?.precio || 0);
    }, 0);
    let precioExtras = personalizacion.extras.reduce((total, extra) => {
      const extraItem = extrasDisponibles.find(e => e.id === extra);
      return total + (extraItem?.precio || 0);
    }, 0);
    
    const precioExtrasTotal = precioTamaño + precioIngredientes + precioExtras;
    return (precioBase + precioExtrasTotal) * personalizacion.cantidad;
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
    if (!producto) return;
    
    // Calcular precio de extras
    let precioTamaño = tamaños.find(t => t.id === personalizacion.tamaño)?.precio || 0;
    let precioIngredientes = personalizacion.ingredientes.reduce((total, ing) => {
      const ingrediente = ingredientesDisponibles.find(i => i.id === ing);
      return total + (ingrediente?.precio || 0);
    }, 0);
    let precioExtras = personalizacion.extras.reduce((total, extra) => {
      const extraItem = extrasDisponibles.find(e => e.id === extra);
      return total + (extraItem?.precio || 0);
    }, 0);
    
    const precioExtrasTotal = precioTamaño + precioIngredientes + precioExtras;
    
    const customizations = {
      ...personalizacion,
      precioExtras: precioExtrasTotal
    };
    
    const message = addToCart(producto, customizations);
    alert(message);
    // No navegar al carrito ya que es un overlay
  };

  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  return (
    <div className="personalizador-container">
      <div className="personalizador-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="personalizador-title">Personaliza tu Pedido</h1>
        <p className="producto-nombre">{producto.nombre}</p>
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

