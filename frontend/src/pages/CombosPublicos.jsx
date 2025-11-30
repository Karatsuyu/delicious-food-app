import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService, absolutizeMediaUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import './CombosPublicos.css';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';

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
                          {prod.imagen && (
                            <img
                              src={absolutizeMediaUrl(prod.imagen)}
                              alt={prod.nombre}
                              className="producto-mini-img"
                            />
                          )}
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

