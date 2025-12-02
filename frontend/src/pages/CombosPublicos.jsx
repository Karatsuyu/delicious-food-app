import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService, absolutizeMediaUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import './CombosPublicos.css';
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
import peperoni from '../assets/peperoni.png';
import perro from '../assets/perro.png';
import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import papas1 from '../assets/papas1.png';
import papas2 from '../assets/papas2.png';
import papas3 from '../assets/papas3.png';
import bebida1 from '../assets/bebida1.png';
import bebida2 from '../assets/bebida2.png';
import bebida3l from '../assets/bebida3.png';
import bebida4 from '../assets/bebida4.png';
import bebida5 from '../assets/bebida5.png';
import pollo from '../assets/pollo.png';
import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import postres1 from '../assets/postres1.png';
import postres2 from '../assets/postres2.png';
import postres3 from '../assets/postres3.png';

// Mapeo de nombres de archivo a imágenes importadas (igual al ComboPersonalizadoDetalle)
const IMAGE_MAP = {
  'hamburguesa.png': hamburguesa,
  'hamburguesa1.png': hamburguesa1,
  'hamburguesa2.png': hamburguesa2,
  'hamburguesa3.png': hamburguesa3,
  'hamburguesa4.png': hamburguesa4,
  'pizza.png': pizza,
  'pizza1.png': pizza1,
  'pizza2.png': pizza2,
  'pizza3.png': pizza3,
  'peperoni.png': peperoni,
  'perro.png': perro,
  'perro1.png': perro1,
  'perro2.png': perro2,
  'papas1.png': papas1,
  'papas2.png': papas2,
  'papas3.png': papas3,
  'bebida1.png': bebida1,
  'bebida2.png': bebida2,
  'bebida3.png': bebida3l,
  'bebida4.png': bebida4,
  'bebida5.png': bebida5,
  'pollo.png': pollo,
  'pollo1.png': pollo1,
  'pollo2.png': pollo2,
  'postres1.png': postres1,
  'postres2.png': postres2,
  'postres3.png': postres3,
};

// Función para obtener la imagen correcta del producto (igual al ComboPersonalizadoDetalle)
const getProductImage = (producto) => {
  // Priorizar la imagen_seleccionada guardada en la BD (desde el personalizador)
  if (producto.imagen_seleccionada) {
    const imagenImportada = IMAGE_MAP[producto.imagen_seleccionada];
    if (imagenImportada) {
      return imagenImportada;
    }
  }
  
  // Fallback a la imagen del producto si no hay imagen_seleccionada
  if (producto.imagen) {
    return absolutizeMediaUrl(producto.imagen);
  }
  
  // Fallback final - imagen por defecto según categoría
  const nombre = (producto.nombre || '').toLowerCase();
  if (nombre.includes('hamburguesa') || nombre.includes('burger')) return hamburguesa;
  if (nombre.includes('pizza')) return pizza;
  if (nombre.includes('pollo') || nombre.includes('alita')) return pollo;
  if (nombre.includes('perro') || nombre.includes('hot')) return perro;
  if (nombre.includes('papa')) return papas1;
  if (nombre.includes('postre')) return postres1;
  
  return hamburguesa; // Default final
};

function CombosPublicos() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCombosPublicos();
  }, []);

  const loadCombosPublicos = async () => {
    try {
      setLoading(true);
      const response = await productService.getCombosPublicos();
      setCombos(response);
      setError(null);
    } catch (err) {
      console.error('Error cargando combos públicos:', err);
      setError('Error al cargar los combos publicados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (combo) => {
    const productoData = {
      id: `combo-personalizado-${combo.id}`,
      nombre: combo.nombre || `Combo de ${combo.usuario_info?.username || 'Usuario'}`,
      precio: parseFloat(combo.precio_total),
      imagen: combo.productos_detalle?.[0]?.imagen || null,
      es_personalizable: false,
      combo_personalizado_id: combo.id
    };
    addToCart(productoData);
  };

  const handleVerPerfil = (usuarioId) => {
    navigate(`/perfil/${usuarioId}`);
  };

  if (loading) {
    return <div className="combos-loading">Cargando combos publicados...</div>;
  }

  if (error) {
    return <div className="combos-error">{error}</div>;
  }

  return (
    <div className="combos-publicos-page">
      <div className="combos-header">
        <h1>🍔 Combos Personalizados de la Comunidad</h1>
        <p>Descubre las creaciones de otros usuarios</p>
      </div>

      {combos.length === 0 ? (
        <div className="combos-empty">
          <p>No hay combos publicados aún. ¡Sé el primero en compartir tu creación!</p>
        </div>
      ) : (
        <div className="combos-grid">
          {combos.map((combo) => (
            <div key={combo.id} className="combo-card-publico">
              <div className="combo-header-publico">
                <div 
                  className="combo-creator"
                  onClick={() => handleVerPerfil(combo.usuario_info?.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={
                      combo.usuario_info?.profile_image
                        ? absolutizeMediaUrl(combo.usuario_info.profile_image)
                        : defaultAvatar
                    }
                    alt={combo.usuario_info?.username}
                    className="creator-avatar"
                  />
                  <div className="creator-info">
                    <span className="creator-name">
                      {combo.usuario_info?.first_name && combo.usuario_info?.last_name
                        ? `${combo.usuario_info.first_name} ${combo.usuario_info.last_name}`
                        : combo.usuario_info?.username || 'Usuario'}
                    </span>
                    <span className="creator-username">@{combo.usuario_info?.username}</span>
                  </div>
                </div>
                {combo.veces_comprado > 0 && (
                  <div className="combo-badge">
                    🛍️ {combo.veces_comprado} compra{combo.veces_comprado !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="combo-content">
                <h3 className="combo-nombre-publico">
                  {combo.nombre || `Combo #${combo.id}`}
                </h3>
                
                {combo.productos_detalle && combo.productos_detalle.length > 0 && (
                  <div className="combo-productos">
                    <p className="productos-label">Incluye:</p>
                    <div className="productos-list">
                      {combo.productos_detalle.map((prod, idx) => (
                        <div key={idx} className="producto-item">
                          <img
                            src={getProductImage(prod)}
                            alt={prod.nombre}
                            className="producto-mini-img"
                          />
                          <span>{prod.nombre} x{prod.cantidad}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="combo-precio-publico">
                  ${parseFloat(combo.precio_total || 0).toLocaleString('es-CO')}
                </div>

                <div className="combo-fecha">
                  Creado: {new Date(combo.creado_en).toLocaleDateString('es-ES')}
                </div>
              </div>

              <div className="combo-actions-publico">
                <button
                  className="btn-ver-perfil"
                  onClick={() => handleVerPerfil(combo.usuario_info?.id)}
                >
                  Ver Perfil
                </button>
                <button
                  className="btn-agregar-carrito"
                  onClick={() => handleAddToCart(combo)}
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

export default CombosPublicos;

