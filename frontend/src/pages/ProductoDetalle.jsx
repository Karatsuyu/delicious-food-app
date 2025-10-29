import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/api';
import { useCart } from '../context/CartContext';
import './ProductoDetalle.css';

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar obtener del backend primero
        try {
          const productoBackend = await productService.getProduct(id);
          setProducto(productoBackend);
        } catch (backendError) {
          console.log('Backend no disponible, usando datos locales...');
          
          // Si el backend no está disponible, usar datos locales
          const productosLocales = {
            'hamburguesa1': { id: 'hamburguesa1', nombre: 'Hamburguesa Clásica', precio: 15900, descripcion: 'Hamburguesa tradicional', categoria: 'hamburguesas', es_personalizable: true },
            'hamburguesa2': { id: 'hamburguesa2', nombre: 'Hamburguesa con Queso', precio: 18900, descripcion: 'Deliciosa hamburguesa con queso derretido', categoria: 'hamburguesas', es_personalizable: true },
            'pizza1': { id: 'pizza1', nombre: 'Pizza Hawaiana', precio: 32000, descripcion: 'Pizza con jamón y piña', categoria: 'pizzas', es_personalizable: true },
            'pollo1': { id: 'pollo1', nombre: 'Alitas Simples', precio: 12000, descripcion: 'Alitas de pollo tradicionales', categoria: 'pollo', es_personalizable: true },
            'perro1': { id: 'perro1', nombre: 'Perro Clásico', precio: 9000, descripcion: 'Perro caliente tradicional', categoria: 'perros', es_personalizable: true },
          };
          
          const productoLocal = productosLocales[id];
          if (productoLocal) {
            setProducto(productoLocal);
          } else {
            setError('Producto no encontrado');
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error cargando producto:', error);
        setError('Error cargando el producto');
        setLoading(false);
      }
    };

    if (id) {
      fetchProducto();
    }
  }, [id]);

  const handleAgregarAlCarrito = () => {
    if (producto) {
      const message = addToCart(producto);
      alert(message);
    }
  };

  const handlePersonalizar = () => {
    if (producto && producto.es_personalizable) {
      navigate(`/personalizar/${producto.id}`);
    } else {
      alert('Este producto no se puede personalizar');
    }
  };

  if (loading) {
    return (
      <div className="producto-detalle-loading">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="producto-detalle-error">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o no está disponible.</p>
        <button onClick={() => navigate('/menu')} className="btn-volver">
          Volver al Menú
        </button>
      </div>
    );
  }

  return (
    <div className="producto-detalle-container">
      <div className="producto-detalle-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="producto-titulo">{producto.nombre}</h1>
      </div>

      <div className="producto-detalle-content">
        <div className="producto-imagen">
          <img 
            src={producto.imagen || '/placeholder-food.jpg'} 
            alt={producto.nombre}
            onError={(e) => {
              e.target.src = '/placeholder-food.jpg';
            }}
          />
        </div>

        <div className="producto-info">
          <h2 className="producto-nombre">{producto.nombre}</h2>
          <p className="producto-descripcion">{producto.descripcion}</p>
          <p className="producto-categoria">Categoría: {producto.categoria}</p>
          
          <div className="producto-precio">
            <span className="precio-label">Precio:</span>
            <span className="precio-valor">${producto.precio.toLocaleString('es-CO')}</span>
          </div>

          <div className="producto-actions">
            <button 
              className="btn-agregar-carrito"
              onClick={handleAgregarAlCarrito}
            >
              🛒 Agregar al Carrito
            </button>
            
            {producto.es_personalizable && (
              <button 
                className="btn-personalizar"
                onClick={handlePersonalizar}
              >
                ⚙️ Personalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;