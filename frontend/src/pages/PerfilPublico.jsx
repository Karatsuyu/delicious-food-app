
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService, productService, absolutizeMediaUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import './PerfilPublico.css';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';

// Importar imágenes para categorías
import hamburguesa from '../assets/hamburguesa.png';
import pizza1 from '../assets/pizza1.png';
import perro from '../assets/perro.png';
import pollo from '../assets/pollo.png';
import postres1 from '../assets/postres1.png';

// Función para obtener la imagen de la categoría para el carrito
const getCategoryImage = (categoria) => {
  const cat = categoria?.toLowerCase();
  
  // Usar imágenes representativas según la categoría
  switch (cat) {
    case 'hamburguesas':
    case 'hamburguesa':
      return hamburguesa;
    case 'pizzas':
    case 'pizza':
      return pizza1;
    case 'perros':
    case 'perro':
      return perro;
    case 'pollo':
    case 'alitas':
      return pollo;
    case 'postres':
    case 'postre':
      return postres1;
    default:
      return hamburguesa;
  }
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

  const handleAddProductoToCart = (producto) => {
    const productoData = {
      id: `producto-personalizado-${producto.id}`,
      nombre: producto.nombre_personalizado || `Producto de ${perfil?.usuario?.username || 'Usuario'}`,
      precio: parseFloat(producto.precio_total),
      imagen: getCategoryImage(producto.producto_base?.categoria) || producto.producto_base?.imagen,
      es_personalizable: false,
      producto_personalizado_id: producto.id
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
                            src={prod.imagen ? absolutizeMediaUrl(prod.imagen) : getCategoryImage(prod.categoria)}
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

      {/* Sección de Productos Personalizados Publicados */}
      <div className="seccion-productos-perfil">
        <h2 className="seccion-titulo">Productos Personalizados Publicados</h2>
        
        {perfil.productos_personalizados_publicados && perfil.productos_personalizados_publicados.length > 0 ? (
          <div className="productos-grid-publico">
            {perfil.productos_personalizados_publicados.map((producto) => (
              <div key={producto.id} className="combo-card-perfil">
                <h3 className="combo-nombre-perfil">
                  {producto.nombre_personalizado}
                </h3>
                
                <div className="producto-base-info">
                  <p className="producto-base-label">Basado en:</p>
                  <div className="producto-base-item">
                    <img
                      src={getCategoryImage(producto.producto_base?.categoria) || producto.producto_base?.imagen || defaultAvatar}
                      alt={producto.producto_base?.nombre}
                      className="producto-mini-img"
                    />
                    <span>{producto.producto_base?.nombre}</span>
                  </div>
                </div>

                {producto.ingredientes_detalle && producto.ingredientes_detalle.length > 0 && (
                  <div className="combo-productos-perfil">
                    <p className="productos-label">Ingredientes personalizados:</p>
                    <div className="productos-list">
                      {producto.ingredientes_detalle.map((ingrediente, idx) => (
                        <div key={idx} className="producto-item">
                          <span>• {ingrediente.nombre}</span>
                          {ingrediente.precio_extra > 0 && (
                            <span className="precio-extra">
                              (+${parseFloat(ingrediente.precio_extra).toLocaleString('es-CO')})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="combo-info-perfil">
                  <div className="combo-precio-perfil">
                    ${parseFloat(producto.precio_total || 0).toLocaleString('es-CO')}
                  </div>
                  {producto.veces_comprado > 0 && (
                    <div className="combo-veces-comprado">
                      🛍️ {producto.veces_comprado} compra{producto.veces_comprado !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="combo-fecha-perfil">
                    {new Date(producto.creado_en).toLocaleDateString('es-ES')}
                  </div>
                </div>

                <button
                  className="btn-agregar-carrito-perfil"
                  onClick={() => handleAddProductoToCart(producto)}
                >
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="combos-empty-perfil">
            <p>Este usuario aún no ha publicado ningún producto personalizado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilPublico;

