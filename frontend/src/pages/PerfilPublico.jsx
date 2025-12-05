
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

// Mapeo de nombres de archivo a imágenes importadas (igual al resto de componentes)
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

// Función para obtener la imagen correcta del producto (igual al resto de componentes)
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
    const productoData = {
      id: `combo-personalizado-${combo.id}`,
      nombre: combo.nombre || `Combo de ${perfil?.usuario?.username || 'Usuario'}`,
      precio: parseFloat(combo.precio_total),
      imagen: combo.productos_detalle?.[0]?.imagen || null,
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

