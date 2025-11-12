import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../api/api';
import api from '../api/api';
import './Perfil.css';

function Perfil() {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [combosPersonalizados, setCombosPersonalizados] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(true);
  const [imagenPerfil, setImagenPerfil] = useState("ruta/de/tu/foto.png");
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
      const response = await api.get('combos-personalizados/');
      setCombosPersonalizados(response.data);
    } catch (error) {
      console.error('Error cargando combos personalizados:', error);
    } finally {
      setLoadingCombos(false);
    }
  };

  const cargarImagenPerfil = async () => {
    try {
      const response = await api.get("perfil/1/"); // O el perfil del usuario actual
      if (response.data.imagen) {
        setImagenPerfil(response.data.imagen);
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
    formData.append("imagen", nuevaImagen);

    try {
      await api.put(`perfil/${user.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
              src={imagenPerfil || "/static/img/default-avatar.png"}
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

          {/* Puntos */}
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

          {/* Estadísticas */}
          {stats && (
            <div className="perfil-card">
              <div className="perfil-card-header">
                <h2>📊 Estadísticas</h2>
              </div>
              <div className="perfil-card-body">
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-icon">🛒</span>
                    <span className="stat-value">{stats.total_pedidos || 0}</span>
                    <span className="stat-label">Pedidos Realizados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💵</span>
                    <span className="stat-value">${(stats.total_gastado || 0).toLocaleString('es-CO')}</span>
                    <span className="stat-label">Total Gastado</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🍔</span>
                    <span className="stat-value">{stats.combos_personalizados_creados || 0}</span>
                    <span className="stat-label">Combos Creados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📢</span>
                    <span className="stat-value">{stats.combos_publicados || 0}</span>
                    <span className="stat-label">Combos Publicados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🛍️</span>
                    <span className="stat-value">{stats.total_veces_comprados || 0}</span>
                    <span className="stat-label">Veces Comprados</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-value">{stats.total_reviews || 0}</span>
                    <span className="stat-label">Reseñas Escritas</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Combos Personalizados */}
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
                    onClick={() => navigate('/menu')}
                  >
                    Crear mi primer combo
                  </button>
                </div>
              ) : (
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;

