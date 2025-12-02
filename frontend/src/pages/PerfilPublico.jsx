
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService, productService, absolutizeMediaUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import './PerfilPublico.css';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';

// Importar imágenes para el mapeo exacto del personalizador
import hamburguesa from '../assets/hamburguesa.png';
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
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
  'hamburguesa8.png': hamburguesa8,
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
  if (producto.imagen_seleccionada && IMAGE_MAP[producto.imagen_seleccionada]) {
    return IMAGE_MAP[producto.imagen_seleccionada];
  }
  return absolutizeMediaUrl(producto.imagen);
};

function PerfilPublico() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      loadPerfilPublico();
    }
  }, [userId]);

  const loadPerfilPublico = async () => {
    try {
      setLoading(true);
      const response = await authService.getPerfilPublico(userId);
      setPerfil(response);
      setError(null);
    } catch (err) {
      console.error('Error cargando perfil público:', err);
      setError('Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (combo) => {
    // Usar la imagen del primer producto con la lógica de mapeo
    const primerProducto = combo.productos_detalle?.[0];
    const imagenCombo = primerProducto ? getProductImage(primerProducto) : null;
    
    const productoData = {
      id: `combo-personalizado-${combo.id}`,
      nombre: combo.nombre || `Combo de ${perfil?.usuario?.username || 'Usuario'}`,
      precio: parseFloat(combo.precio_total),
      imagen: imagenCombo,
      es_personalizable: false,
      combo_personalizado_id: combo.id
    };
    addToCart(productoData);
  };

  if (loading) {
    return <div className="perfil-loading">Cargando perfil...</div>;
  }

  if (error || !perfil) {
    return (
      <div className="perfil-error">
        {error || 'Perfil no encontrado'}
        <button onClick={() => navigate('/')} className="btn-volver">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="perfil-publico-page">
      <div className="perfil-publico-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Volver
        </button>
        <div className="perfil-publico-info">
          <img
            src={
              perfil.usuario?.profile_image
                ? absolutizeMediaUrl(perfil.usuario.profile_image)
                : defaultAvatar
            }
            alt={perfil.usuario?.username}
            className="perfil-publico-avatar"
          />
          <div className="perfil-publico-details">
            <h1>
              {perfil.usuario?.first_name && perfil.usuario?.last_name
                ? `${perfil.usuario.first_name} ${perfil.usuario.last_name}`
                : perfil.usuario?.username || 'Usuario'}
            </h1>
            <p className="perfil-username">@{perfil.usuario?.username}</p>
            {perfil.usuario?.date_joined && (
              <p className="perfil-fecha">
                Miembro desde {new Date(perfil.usuario.date_joined).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="perfil-publico-stats">
        <div className="stat-card-publico">
          <div className="stat-number">{perfil.estadisticas?.total_combos_creados || 0}</div>
          <div className="stat-label">Combos Creados</div>
        </div>
        <div className="stat-card-publico">
          <div className="stat-number">{perfil.estadisticas?.total_combos_publicados || 0}</div>
          <div className="stat-label">Combos Publicados</div>
        </div>
        <div className="stat-card-publico">
          <div className="stat-number">{perfil.estadisticas?.total_veces_comprados || 0}</div>
          <div className="stat-label">Veces Comprados</div>
        </div>
      </div>

      <div className="perfil-publico-combos">
        <h2>🍔 Combos Publicados</h2>
        {perfil.combos_publicados && perfil.combos_publicados.length > 0 ? (
          <div className="combos-grid-publico">
            {perfil.combos_publicados.map((combo) => (
              <div key={combo.id} className="combo-card-perfil">
                <h3 className="combo-nombre-perfil">
                  {combo.nombre || `Combo #${combo.id}`}
                </h3>
                
                {combo.productos_detalle && combo.productos_detalle.length > 0 && (
                  <div className="combo-productos-perfil">
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

                <div className="combo-info-perfil">
                  <div className="combo-precio-perfil">
                    ${parseFloat(combo.precio_total || 0).toLocaleString('es-CO')}
                  </div>
                  {combo.veces_comprado > 0 && (
                    <div className="combo-veces-comprado">
                      🛍️ {combo.veces_comprado} compra{combo.veces_comprado !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="combo-fecha-perfil">
                    {new Date(combo.creado_en).toLocaleDateString('es-ES')}
                  </div>
                </div>

                <button
                  className="btn-agregar-carrito-perfil"
                  onClick={() => handleAddToCart(combo)}
                >
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="combos-empty-perfil">
            <p>Este usuario aún no ha publicado ningún combo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilPublico;

