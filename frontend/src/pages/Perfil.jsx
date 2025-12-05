import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService, absolutizeMediaUrl } from '../api/api';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';
import api from '../api/api';
import './Perfil.css';

function Perfil() {
  const { user, isAuthenticated, loading, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [combosPersonalizados, setCombosPersonalizados] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(true);
  const [productosPersonalizados, setProductosPersonalizados] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const loadStats = async () => {
    try {
      const statsData = await authService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadCombosPersonalizados = async () => {
    try {
      // Mostrar TODOS los combos personalizados del usuario (pagados y pendientes)
      const response = await api.get('combos-personalizados/');
      setCombosPersonalizados(response.data);
    } catch (error) {
      console.error('Error cargando combos personalizados:', error);
    } finally {
      setLoadingCombos(false);
    }
  };

  const loadProductosPersonalizados = async () => {
    try {
      // Mostrar TODOS los productos personalizados del usuario (pagados y pendientes)
      const response = await api.get('productos-personalizados/');
      setProductosPersonalizados(response.data);
    } catch (error) {
      console.error('Error cargando productos personalizados:', error);
    } finally {
      setLoadingProductos(false);
    }
  };

  const marcarTodosPagados = async () => {
    try {
      await api.post('combos-personalizados/marcar_todos_pagados/');
      await loadCombosPersonalizados();
      alert('Se marcaron como pagados los combos pendientes.');
    } catch (e) {
      console.error('No se pudo marcar como pagados:', e);
      alert('No se pudo marcar como pagados.');
    }
  };



  const cargarImagenPerfil = async () => {
    try {
      const profile = await authService.getProfile();
      if (profile?.profile_image) {
        setImagenPerfil(absolutizeMediaUrl(profile.profile_image));
      } else {
        setImagenPerfil(null);
      }
    } catch (error) {
      console.error("Error cargando la imagen del perfil:", error);
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
      loadCombosPersonalizados();
      loadProductosPersonalizados();
      cargarImagenPerfil();
    }
  }, [isAuthenticated]);

  const togglePublicar = async (comboId, publicado) => {
    try {
      const response = await api.patch(`combos-personalizados/${comboId}/`, {
        publicado: !publicado
      });
      // Actualizar el estado local
      setCombosPersonalizados(prevCombos =>
        prevCombos.map(combo =>
          combo.id === comboId ? { ...combo, publicado: !publicado } : combo
        )
      );
    } catch (error) {
      console.error('Error actualizando estado de publicación:', error);
      alert('Error al actualizar el estado de publicación');
    }
  };

  const togglePublicarProducto = async (productoId, publicado) => {
    try {
      const response = await api.patch(`productos-personalizados/${productoId}/`, {
        publicado: !publicado
      });
      // Actualizar el estado local
      setProductosPersonalizados(prevProductos =>
        prevProductos.map(producto =>
          producto.id === productoId ? { ...producto, publicado: !publicado } : producto
        )
      );
    } catch (error) {
      console.error('Error actualizando estado de publicación del producto:', error);
      alert('Error al actualizar el estado de publicación del producto');
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaImagen(file);
      setImagenPerfil(URL.createObjectURL(file)); // Vista previa
    }
  };

  const guardarImagenPerfil = async () => {
    if (!nuevaImagen) return;
    const formData = new FormData();
    formData.append("profile_image", nuevaImagen);

    try {
      const res = await authService.updateProfile(formData);
      // Respuesta del backend incluye { message, user }
      if (res?.user) {
        updateUser(res.user);
        setImagenPerfil(absolutizeMediaUrl(res.user.profile_image) || null);
      } else {
        // Fallback: recargar perfil
        const profile = await authService.getProfile();
        updateUser(profile);
        setImagenPerfil(absolutizeMediaUrl(profile?.profile_image) || null);
      }
      alert("✅ Imagen de perfil actualizada correctamente");
      setNuevaImagen(null);
    } catch (error) {
      console.error("Error guardando la imagen:", error);
      alert("❌ Hubo un problema al guardar la imagen");
    }
  };

  if (loading || (loadingStats && loadingCombos)) {
    return (
      <div className="perfil-loading">
        <div className="spinner">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <div className="perfil-header">
          <div className="perfil-foto">
            <img
              src={imagenPerfil || defaultAvatar}
              className="foto-perfil"
              alt="Foto de perfil"
            />
          </div>
          <div className="foto-container">
            <input
              id="input-foto"
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              style={{ display: "none" }}
            />
            <label htmlFor="input-foto" className="btn-subir-foto">
              {nuevaImagen ? "Cambiar Foto" : "Seleccionar Foto"}
            </label>
            {/* 👇 Este botón solo se muestra si hay una nueva imagen seleccionada */}
            {nuevaImagen && (
              <button onClick={guardarImagenPerfil} className="btn-guardar-foto">
                Guardar Imagen
              </button>
            )}
          </div>
          <h1> Mi Perfil</h1>
          <p>Gestiona tu cuenta y revisa tus estadísticas</p>
        </div>

        <div className="perfil-content">
          {/* Información del Usuario */}
          <div className="perfil-card">
            <div className="perfil-card-header">
              <h2>📋 Información Personal</h2>
            </div>
            <div className="perfil-card-body">
              <div className="info-row">
                <span className="info-label">Nombre:</span>
                <span className="info-value">
                  {user?.first_name || 'No especificado'} {user?.last_name || ''}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Usuario:</span>
                <span className="info-value">{user?.username || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email || 'N/A'}</span>
              </div>
              {user?.phone_number && (
                <div className="info-row">
                  <span className="info-label">Teléfono:</span>
                  <span className="info-value">{user.phone_number}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Miembro desde:</span>
                <span className="info-value">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('es-ES') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Puntos - Solo mostrar si NO es administrador */}
          {!user?.is_staff && (
            <div className="perfil-card puntos-card">
              <div className="perfil-card-header">
                <h2>⭐ Puntos Acumulados</h2>
              </div>
              <div className="perfil-card-body">
                <div className="puntos-display">
                  <div className="puntos-total">
                    <span className="puntos-number">{user?.points || 0}</span>
                    <span className="puntos-label">Puntos Totales</span>
                  </div>
                </div>
                {stats && stats.puntos_ganados_ventas > 0 && (
                  <div className="puntos-desglose">
                    <div className="puntos-item">
                      <span className="puntos-icon">💰</span>
                      <div className="puntos-info">
                        <span className="puntos-titulo">Puntos por Ventas</span>
                        <span className="puntos-valor">{stats.puntos_ganados_ventas} pts</span>
                      </div>
                    </div>
                    <p className="puntos-explicacion">
                      Has ganado puntos cuando otros usuarios compraron tus combos personalizados publicados
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}



          {/* Enlaces de administración - Solo para admins */}
          {user?.is_staff && (
            <div className="perfil-card admin-links-card">
              <div className="perfil-card-header">
                <h2>⚙️ Panel de Administración</h2>
              </div>
              <div className="perfil-card-body">
                <div className="admin-links-grid">
                  <Link to="/admin/productos" className="admin-link-btn">
                    <span className="admin-link-icon">📦</span>
                    <div className="admin-link-content">
                      <h3>Gestionar Productos</h3>
                      <p>Agregar, editar o eliminar productos</p>
                    </div>
                  </Link>
                  <Link to="/admin/dashboard" className="admin-link-btn">
                    <span className="admin-link-icon">📊</span>
                    <div className="admin-link-content">
                      <h3>Dashboard</h3>
                      <p>Ver estadísticas y productos más vendidos</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Combos Personalizados - Solo mostrar si NO es administrador */}
          {!user?.is_staff && (
            <div className="perfil-card combos-card">
              <div className="perfil-card-header">
                <h2>🍔 Mis Combos Personalizados</h2>
              </div>
            <div className="perfil-card-body">
              {loadingCombos ? (
                <div className="combos-loading">Cargando...</div>
              ) : combosPersonalizados.length === 0 ? (
                <div className="combos-empty">
                  <p>No has creado ningún combo personalizado aún.</p>
                  <button 
                    className="btn-crear-combo"
                    onClick={() => navigate('/crear-combo')}
                  >
                    Crear mi propio combo
                  </button>
                </div>
              ) : (
                <>
                  <div className="combos-list">
                    {combosPersonalizados.map((combo) => (
                      <div key={combo.id} className="combo-item">
                        <div className="combo-info">
                          <h3 className="combo-nombre">
                            {combo.nombre || `Combo #${combo.id}`}
                          </h3>
                        <div className="combo-details">
                          <span className="combo-precio">
                            ${parseFloat(combo.precio_total || 0).toLocaleString('es-CO')}
                          </span>
                          <span className="combo-fecha">
                            Creado: {new Date(combo.creado_en).toLocaleDateString('es-ES')}
                          </span>

                        </div>
                        <div className="combo-stats">
                          {combo.veces_comprado > 0 && (
                            <span className="combo-veces-comprado">
                              🛍️ Comprado {combo.veces_comprado} vez{combo.veces_comprado !== 1 ? 'es' : ''}
                            </span>
                          )}
                        </div>
                        </div>
                        <div className="combo-actions">
                          <button
                            className={`btn-publicar ${combo.publicado ? 'publicado' : 'no-publicado'}`}
                            onClick={() => togglePublicar(combo.id, combo.publicado)}
                          >
                            {combo.publicado ? (
                              <>
                                <span>✓</span> Publicado
                              </>
                            ) : (
                              <>
                                <span>📢</span> Publicar
                              </>
                            )}
                          </button>
                          <Link 
                            to={`/mis-combos/${combo.id}`}
                            className="btn-ver-detalle"
                          >
                            Ver Detalle
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="crear-combo-section">
                    <button 
                      className="btn-crear-combo-adicional"
                      onClick={() => navigate('/crear-combo')}
                    >
                      + Crear otro combo personalizado
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          )}

          {/* Productos Personalizados - Solo mostrar si NO es administrador */}
          {!user?.is_staff && (
            <div className="perfil-card productos-card">
              <div className="perfil-card-header">
                <h2>✨ Mis Productos Personalizados</h2>
              </div>
              <div className="perfil-card-body">
                {loadingProductos ? (
                  <div className="productos-loading">Cargando...</div>
                ) : productosPersonalizados.length === 0 ? (
                  <div className="productos-empty">
                    <p>No has creado ningún producto personalizado aún.</p>
                    <button 
                      className="btn-crear-producto"
                      onClick={() => navigate('/menu')}
                    >
                      Personalizar productos
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="productos-list">
                      {productosPersonalizados.map((producto) => (
                        <div key={producto.id} className="producto-item">
                          <div className="producto-info">
                            <h3 className="producto-nombre">
                              {producto.nombre_personalizado || `Producto #${producto.id}`}
                            </h3>
                            <div className="producto-details">
                              <span className="producto-base">
                                Basado en: {producto.producto_base_detalle?.nombre}
                              </span>
                              <span className="producto-precio">
                                ${parseFloat(producto.precio_total || 0).toLocaleString('es-CO')}
                              </span>
                              <span className="producto-fecha">
                                Creado: {new Date(producto.creado_en).toLocaleDateString('es-ES')}
                              </span>
                              {producto.ingredientes_detalle && producto.ingredientes_detalle.length > 0 && (
                                <div className="producto-ingredientes">
                                  <span className="ingredientes-label">Ingredientes:</span>
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
                            </div>
                            <div className="producto-stats">
                              {producto.veces_comprado > 0 && (
                                <span className="producto-veces-comprado">
                                  ❤️ Comprado {producto.veces_comprado} {producto.veces_comprado === 1 ? 'vez' : 'veces'}
                                </span>
                              )}
                              <span className="producto-estado">
                                {producto.is_paid ? (
                                  <span className="estado-pagado">✅ Pagado</span>
                                ) : (
                                  <span className="estado-pendiente">⏳ Pendiente de pago</span>
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="producto-actions">
                            <button
                              className={`btn-publicar ${producto.publicado ? 'publicado' : 'no-publicado'}`}
                              onClick={() => togglePublicarProducto(producto.id, producto.publicado)}
                              disabled={!producto.is_paid}
                              title={!producto.is_paid ? 'Debe estar pagado para publicar' : ''}
                            >
                              {producto.publicado ? (
                                <>
                                  <span>👁️</span> Despublicar
                                </>
                              ) : (
                                <>
                                  <span>📢</span> Publicar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="crear-producto-section">
                      <button 
                        className="btn-crear-producto-adicional"
                        onClick={() => navigate('/menu')}
                      >
                        + Personalizar otro producto
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Perfil;

