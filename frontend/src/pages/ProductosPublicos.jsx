import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService, absolutizeMediaUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import './ProductosPublicos.css';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';

// Importar imágenes para el mapeo exacto del personalizador
import hamburguesa from '../assets/hamburguesa.png';
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
import hamburguesa5 from '../assets/hamburguesa5.png';
import hamburguesa6 from '../assets/hamburguesa6.png';
import hamburguesa7 from '../assets/hamburguesa7.png';
import hamburguesa8 from '../assets/hamburguesa8.png';
import pizza from '../assets/pizza.png';
import pizza1 from '../assets/pizza1.png';
import pizza2 from '../assets/pizza2.png';
import pizza3 from '../assets/pizza3.png';
import pizza4 from '../assets/pizza4.png';
import pizza5 from '../assets/pizza5.png';
import pizza6 from '../assets/pizza6.png';
import pizza7 from '../assets/pizza7.png';
import peperoni from '../assets/peperoni.png';
import perro from '../assets/perro.png';
import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import perro3 from '../assets/perro3.png';
import perro4 from '../assets/perro4.png';
import perro5 from '../assets/perro5.png';
import papas1 from '../assets/papas1.png';
import papas2 from '../assets/papas2.png';
import papas3 from '../assets/papas3.png';
import bebida1 from '../assets/bebida1.png';
import bebida2 from '../assets/bebida2.png';
import bebida3l from '../assets/bebida3.png';
import bebida4 from '../assets/bebida4.png';
import bebida5 from '../assets/bebida5.png';
import bebida6 from '../assets/bebida6.png';
import bebida7 from '../assets/bebida7.png';
import bebida8 from '../assets/bebida8.png';
import bebida9 from '../assets/bebida9.png';
import pollo from '../assets/pollo.png';
import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import pollo3 from '../assets/pollo3.png';
import pollo4 from '../assets/pollo4.png';
import pollo5 from '../assets/pollo5.png';
import pollo6 from '../assets/pollo6.png';
import postres1 from '../assets/postres1.png';
import postres2 from '../assets/postres2.png';
import postres3 from '../assets/postres3.png';
import postres4 from '../assets/postres4.png';
import postres5 from '../assets/postres5.png';
import postres6 from '../assets/postres6.png';
import postres7 from '../assets/postres7.png';
import postres8 from '../assets/postres8.png';

// Mapeo de nombres de archivo a imágenes importadas
const IMAGE_MAP = {
  'hamburguesa.png': hamburguesa,
  'hamburguesa1.png': hamburguesa1,
  'hamburguesa2.png': hamburguesa2,
  'hamburguesa3.png': hamburguesa3,
  'hamburguesa4.png': hamburguesa4,
  'hamburguesa5.png': hamburguesa5,
  'hamburguesa6.png': hamburguesa6,
  'hamburguesa7.png': hamburguesa7,
  'hamburguesa8.png': hamburguesa8,
  'pizza.png': pizza,
  'pizza1.png': pizza1,
  'pizza2.png': pizza2,
  'pizza3.png': pizza3,
  'pizza4.png': pizza4,
  'pizza5.png': pizza5,
  'pizza6.png': pizza6,
  'pizza7.png': pizza7,
  'peperoni.png': peperoni,
  'perro.png': perro,
  'perro1.png': perro1,
  'perro2.png': perro2,
  'perro3.png': perro3,
  'perro4.png': perro4,
  'perro5.png': perro5,
  'papas1.png': papas1,
  'papas2.png': papas2,
  'papas3.png': papas3,
  'bebida1.png': bebida1,
  'bebida2.png': bebida2,
  'bebida3.png': bebida3l,
  'bebida4.png': bebida4,
  'bebida5.png': bebida5,
  'bebida6.png': bebida6,
  'bebida7.png': bebida7,
  'bebida8.png': bebida8,
  'bebida9.png': bebida9,
  'pollo.png': pollo,
  'pollo1.png': pollo1,
  'pollo2.png': pollo2,
  'pollo3.png': pollo3,
  'pollo4.png': pollo4,
  'pollo5.png': pollo5,
  'pollo6.png': pollo6,
  'postres1.png': postres1,
  'postres2.png': postres2,
  'postres3.png': postres3,
  'postres4.png': postres4,
  'postres5.png': postres5,
  'postres6.png': postres6,
  'postres7.png': postres7,
  'postres8.png': postres8,
};

// Función para obtener la imagen correcta del producto base
const getProductImage = (producto) => {
  // Si hay producto_base_detalle, usar su imagen
  if (producto.producto_base_detalle && producto.producto_base_detalle.imagen) {
    return absolutizeMediaUrl(producto.producto_base_detalle.imagen);
  }
  
  // Fallback a imagen por defecto según la categoría del producto base
  const nombre = (producto.producto_base_detalle?.nombre || producto.nombre_personalizado || '').toLowerCase();
  
  if (nombre.includes('double') && nombre.includes('smash')) return hamburguesa8;
  if (nombre.includes('pizza') && nombre.includes('pepperoni')) return peperoni;
  if (nombre.includes('alitas') && nombre.includes('simples')) return pollo1;
  if (nombre.includes('hamburguesa') || nombre.includes('burger')) return hamburguesa;
  if (nombre.includes('pizza')) return pizza;
  if (nombre.includes('pollo') || nombre.includes('alita')) return pollo;
  if (nombre.includes('perro') || nombre.includes('hot')) return perro;
  if (nombre.includes('papa')) return papas1;
  if (nombre.includes('postre')) return postres1;
  
  return hamburguesa; // Default final
};

function ProductosPublicos() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductosPublicos();
  }, []);

  const loadProductosPublicos = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductosPersonalizadosPublicos();
      setProductos(response);
      setError(null);
    } catch (err) {
      console.error('Error cargando productos públicos:', err);
      setError('Error al cargar los productos personalizados publicados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    const productImage = getProductImage(producto);

    const productoData = {
      id: `producto-personalizado-${producto.id}`,
      nombre: producto.nombre_personalizado || `Producto de ${producto.usuario_info?.username || 'Usuario'}`,
      precio: parseFloat(producto.precio_total),
      imagen: productImage,
      es_personalizable: false,
      es_producto_personalizado: true, // ¡AGREGADO! Para que el checkout lo detecte
      producto_personalizado_id: producto.id,
      creator_user_id: producto.usuario_info?.id, // ID del creador para otorgar puntos
      creator_username: producto.usuario_info?.username // Nombre del creador
    };
    addToCart(productoData);
  };

  const handleVerPerfil = (usuarioId) => {
    navigate(`/perfil/${usuarioId}`);
  };

  if (loading) {
    return <div className="productos-loading">Cargando productos publicados...</div>;
  }

  if (error) {
    return <div className="productos-error">{error}</div>;
  }

  return (
    <div className="productos-publicos-container">
      <div className="productos-header">
        <h1 className="productos-title">Productos de la Comunidad</h1>
        <p className="productos-subtitle">
          Descubre las creaciones únicas de nuestra comunidad
        </p>
        <div className="productos-cta">
          <Link to="/personalizador/hamburguesas" className="cta-agrega-tuyo">
            Agrega el tuyo
          </Link>
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="no-productos">
          <div className="no-productos-content">
            <h3>¡Sé el primero!</h3>
            <p>Aún no hay productos personalizados publicados.</p>
            <p>¡Crea y comparte tu primera creación!</p>
            <Link to="/personalizador/hamburguesas" className="cta-agrega-tuyo">
              Agrega el tuyo
            </Link>
          </div>
        </div>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <div className="producto-image-container">
                <img
                  src={getProductImage(producto)}
                  alt={producto.nombre_personalizado}
                  className="producto-image"
                />
              </div>

              <div className="producto-info">
                <h3 className="producto-nombre">
                  {producto.nombre_personalizado}
                </h3>
                
                <div className="producto-base">
                  <span>Basado en: {producto.producto_base_detalle?.nombre}</span>
                </div>

                {producto.ingredientes_detalle && producto.ingredientes_detalle.length > 0 && (
                  <div className="producto-ingredientes">
                    <span className="ingredientes-label">Con:</span>
                    <div className="ingredientes-tags">
                      {producto.ingredientes_detalle.slice(0, 3).map((ing, index) => (
                        <span key={index} className="ingrediente-tag">
                          {ing.nombre}
                        </span>
                      ))}
                      {producto.ingredientes_detalle.length > 3 && (
                        <span className="ingredientes-mas">
                          +{producto.ingredientes_detalle.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="producto-creator">
                  <img 
                    src={producto.usuario_info?.profile?.imagen_perfil 
                      ? absolutizeMediaUrl(producto.usuario_info.profile.imagen_perfil) 
                      : defaultAvatar
                    }
                    alt="Avatar"
                    className="creator-avatar"
                  />
                  <span className="creator-name">
                    {producto.usuario_info?.username || 'Usuario'}
                  </span>
                  <button
                    onClick={() => handleVerPerfil(producto.usuario_info?.id)}
                    className="ver-perfil-btn"
                  >
                    Ver perfil
                  </button>
                </div>

                <div className="producto-stats">
                  <span className="veces-comprado">
                    ❤️ {producto.veces_comprado || 0} compras
                  </span>
                </div>
              </div>

              <div className="producto-actions">
                <div className="precio-display">
                  <span className="precio-valor">${parseFloat(producto.precio_total).toFixed(0)}</span>
                </div>
                <button
                  onClick={() => handleAddToCart(producto)}
                  className="add-to-cart-btn"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductosPublicos;