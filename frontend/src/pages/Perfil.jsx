import { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService, absolutizeMediaUrl } from '../api/api';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';
import api from '../api/api';
import axios from 'axios';
import { getProductImageAndName } from '../utils/productImageMapper';
import './Perfil.css';

function Perfil() {
  const { user, isAuthenticated, loading, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mapeo de IDs locales a IDs de base de datos
  const productIdMapping = {
    'hamburguesa1': 1,
    'hamburguesa2': 13,
    'hamburguesa3': 14,
    'hamburguesa4': 15,
    'hamburguesa5': 16,
    'hamburguesa6': 17,
    'hamburguesa7': 18, // BBQ Crunch Burger
    'hamburguesa8': 19, // Double Smash
    'pizza1': 2,
    'pizza2': 6,
    'pizza3': 20,
    'pizza4': 21,
    'pizza5': 22,
    'pizza6': 23,
    'pizza7': 24, // Pepperoni Lovers
    'pizza8': 25, // Pizza Campesina
    'pollo1': 3,
    'pollo2': 26,
    'pollo3': 27,
    'pollo4': 28,
    'pollo5': 29,
    'pollo6': 30,
    'perro1': 4,
    'perro2': 31,
    'perro3': 32,
    'perro4': 42,
    'perro5': 43,
    'perro6': 63, // Perro Especial
    'postres1': 5,
    'postres2': 44,
    'postres3': 45,
    'postres4': 46,
    'postres5': 47,
    'postres6': 48,
    'postres7': 49,
    'postres8': 50,
    'postres9': 64, // Brownie de Chocolate
    'postres10': 65, // Cheesecake
    'postres11': 66, // Helado de Vainilla
    'papas1': 51,
    'papas2': 52,
    'papas3': 53,
    'bebida1': 54,
    'bebida2': 55,
    'bebida3': 56,
    'bebida4': 57,
    'bebida5': 58,
    'bebida6': 59,
    'bebida7': 60,
    'bebida8': 61,
    'bebida9': 62
  };
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [combosPersonalizados, setCombosPersonalizados] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(true);
  const [productosPersonalizados, setProductosPersonalizados] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  
  // Estados para edición de perfil
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [perfilEditado, setPerfilEditado] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone_number: ''
  });
  
  // Estados para historial de compras
  const [historialCompras, setHistorialCompras] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(true);
  
  // Estados para reseñas
  const [mostrandoModalResena, setMostrandoModalResena] = useState(false);
  const [productoAResenar, setProductoAResenar] = useState(null);
  const [calificacion, setCalificacion] = useState(5);
  const [textoResena, setTextoResena] = useState('');
  const [resenasUsuario, setResenasUsuario] = useState([]);
  const [loadingResenasUsuario, setLoadingResenasUsuario] = useState(true);

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

  const loadHistorialCompras = async () => {
    try {
      const response = await api.get('users/users/purchase_history/');
      setHistorialCompras(response.data);
    } catch (error) {
      console.error('Error cargando historial de compras:', error);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const loadResenasUsuario = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reviews/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      // Filtrar solo las reseñas del usuario actual
      const resenasDelUsuario = response.data.filter(resena => resena.usuario === user?.id);
      setResenasUsuario(resenasDelUsuario);
    } catch (error) {
      console.error('Error cargando reseñas del usuario:', error);
      setResenasUsuario([]);
    } finally {
      setLoadingResenasUsuario(false);
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

  // Funciones para reseñas
  const yaReseno = (productoId) => {
    return resenasUsuario.some(resena => resena.producto === productoId);
  };

  const abrirModalResena = (producto) => {
    setProductoAResenar(producto);
    setMostrandoModalResena(true);
    setCalificacion(5);
    setTextoResena('');
  };

  const cerrarModalResena = () => {
    setMostrandoModalResena(false);
    setProductoAResenar(null);
    setCalificacion(5);
    setTextoResena('');
  };

  const enviarResena = async () => {
    console.log('=== INICIANDO ENVÍO DE RESEÑA ===');
    console.log('Producto a reseñar:', productoAResenar);
    console.log('Usuario actual:', user);
    console.log('Token en localStorage:', localStorage.getItem('access_token'));
    
    if (!productoAResenar) return;
    
    // Validaciones
    if (!user) {
      alert('Debes iniciar sesión para enviar una reseña.');
      return;
    }
    
    if (!textoResena.trim()) {
      alert('Por favor escribe un comentario.');
      return;
    }
    
    if (calificacion < 1 || calificacion > 5) {
      alert('La calificación debe estar entre 1 y 5 estrellas.');
      return;
    }
    
    // Validar que tengamos un ID de producto válido
    if (!productoAResenar.original_product_id) {
      alert('Error: No se puede identificar el producto a reseñar.');
      console.error('original_product_id es null o undefined:', productoAResenar);
      return;
    }

    try {
      // Convertir ID local a ID de base de datos
      const productoIdBD = productIdMapping[productoAResenar.original_product_id] || parseInt(productoAResenar.original_product_id);
      
      if (!productoIdBD || isNaN(productoIdBD)) {
        alert('Error: No se pudo identificar el ID del producto en la base de datos.');
        console.error('No se pudo mapear el producto:', productoAResenar.original_product_id);
        return;
      }

      const requestData = {
        producto: productoIdBD,
        calificacion: parseInt(calificacion),
        texto: textoResena.trim()
      };
      
      console.log('Enviando reseña:', requestData);
      console.log('ID del producto original:', productoAResenar.original_product_id);
      console.log('ID del producto en BD:', productoIdBD);
      console.log('Producto completo:', productoAResenar);
      
      // Ya no necesitamos validar isNaN porque ya lo validamos arriba
      
      // Primero verificar si el producto existe
      try {
        const productCheck = await axios.get(`http://127.0.0.1:8000/api/productos/${productoIdBD}/`);
        console.log('Producto encontrado:', productCheck.data);
      } catch (checkError) {
        console.error('Producto no encontrado:', checkError);
        alert('Error: El producto no existe en la base de datos.');
        return;
      }
      
      // Usar axios directamente con URL completa para evitar duplicación
      const response = await axios.post('http://127.0.0.1:8000/api/reviews/', requestData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Reseña enviada exitosamente:', response.data);
      alert('¡Reseña enviada exitosamente!');
      cerrarModalResena();
      // Recargar datos para actualizar la UI
      loadHistorialCompras();
      loadResenasUsuario();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Status del error:', error.response?.status);
      console.error('Data del error:', error.response?.data);
      
      if (error.response?.status === 400) {
        // Error de validación - mostrar detalles específicos
        const errorData = error.response.data;
        if (errorData.producto) {
          alert(`Error en el campo producto: ${errorData.producto.join(', ')}`);
        } else if (errorData.calificacion) {
          alert(`Error en la calificación: ${errorData.calificacion.join(', ')}`);
        } else if (errorData.texto) {
          alert(`Error en el texto: ${errorData.texto.join(', ')}`);
        } else if (errorData.detail) {
          alert(`Error: ${errorData.detail}`);
        } else {
          alert(`Error de validación: ${JSON.stringify(errorData)}`);
        }
      } else if (error.response?.status === 401) {
        alert('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 403) {
        alert('No tienes permisos para realizar esta acción.');
      } else {
        alert('Error al enviar la reseña. Inténtalo nuevamente.');
      }
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
      loadHistorialCompras();
      loadResenasUsuario();
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

  const iniciarEdicionPerfil = () => {
    setPerfilEditado({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      phone_number: user?.phone_number || ''
    });
    setEditandoPerfil(true);
  };

  const cancelarEdicionPerfil = () => {
    setEditandoPerfil(false);
    setPerfilEditado({
      first_name: '',
      last_name: '',
      username: '',
      phone_number: ''
    });
  };

  const guardarCambiosPerfil = async () => {
    try {
      const response = await api.patch('users/users/update_profile/', perfilEditado);
      updateUser(response.data);
      setEditandoPerfil(false);
      alert("✅ Perfil actualizado correctamente");
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      if (error.response?.data) {
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        alert(`❌ Error actualizando perfil:\n${errors}`);
      } else {
        alert("❌ Hubo un problema al actualizar el perfil");
      }
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
              {!editandoPerfil ? (
                <button onClick={iniciarEdicionPerfil} className="btn-editar-perfil">
                  ✏️ Editar
                </button>
              ) : (
                <div className="botones-edicion">
                  <button onClick={guardarCambiosPerfil} className="btn-guardar">
                    ✅ Guardar
                  </button>
                  <button onClick={cancelarEdicionPerfil} className="btn-cancelar">
                    ❌ Cancelar
                  </button>
                </div>
              )}
            </div>
            <div className="perfil-card-body">
              {!editandoPerfil ? (
                <>
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
                </>
              ) : (
                <div className="formulario-edicion">
                  <div className="campo-edicion">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={perfilEditado.first_name}
                      onChange={(e) => setPerfilEditado({...perfilEditado, first_name: e.target.value})}
                      placeholder="Ingrese su nombre"
                    />
                  </div>
                  <div className="campo-edicion">
                    <label>Apellidos:</label>
                    <input
                      type="text"
                      value={perfilEditado.last_name}
                      onChange={(e) => setPerfilEditado({...perfilEditado, last_name: e.target.value})}
                      placeholder="Ingrese sus apellidos"
                    />
                  </div>
                  <div className="campo-edicion">
                    <label>Usuario:</label>
                    <input
                      type="text"
                      value={perfilEditado.username}
                      onChange={(e) => setPerfilEditado({...perfilEditado, username: e.target.value})}
                      placeholder="Nombre de usuario"
                    />
                  </div>
                  <div className="campo-edicion">
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      value={perfilEditado.phone_number}
                      onChange={(e) => setPerfilEditado({...perfilEditado, phone_number: e.target.value})}
                      placeholder="Número de teléfono (opcional)"
                    />
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user?.email || 'N/A'} (no editable)</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Miembro desde:</span>
                    <span className="info-value">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                </div>
              )}
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

          {/* Historial de Compras - Solo mostrar si NO es administrador */}
          {!user?.is_staff && (
            <div className="perfil-card historial-card">
              <div className="perfil-card-header">
                <h2>🛒 Historial de Compras</h2>
              </div>
              <div className="perfil-card-body">
                {loadingHistorial ? (
                  <div className="historial-loading">Cargando...</div>
                ) : historialCompras.length === 0 ? (
                  <div className="historial-empty">
                    <p>No tienes compras registradas aún.</p>
                    <p>¡Explora nuestros productos y haz tu primera compra!</p>
                  </div>
                ) : (
                  <div className="historial-list">
                    {historialCompras.map((compra) => (
                      <div key={compra.id} className="compra-item">
                        <div className="compra-header">
                          <div className="compra-fecha">
                            <span className="fecha-icono">📅</span>
                            <span>{new Date(compra.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <div className="compra-total">
                            <span className="total-label">Total:</span>
                            <span className="total-amount">${parseFloat(compra.total_amount).toLocaleString('es-CO')}</span>
                          </div>
                        </div>
                        
                        {compra.items && compra.items.length > 0 && (
                          <div className="compra-items">
                            <h4>Productos comprados:</h4>
                            {compra.items.map((item, index) => {
                              // Debug: log del item para verificar datos
                              console.log('Item del historial:', item);
                              
                              // Obtener información del producto original si está disponible
                              const productInfo = item.original_product_id ? 
                                getProductImageAndName(item.original_product_id) : 
                                { imagen: null, nombre: item.original_product_name || null };
                              
                              console.log('Product Info:', productInfo);
                              
                              return (
                                <div key={index} className="item-comprado">
                                  {/* Imagen del producto original */}
                                  {productInfo.imagen && (
                                    <div className="item-imagen">
                                      <img 
                                        src={productInfo.imagen} 
                                        alt={productInfo.nombre}
                                        className="producto-imagen-historial"
                                      />
                                    </div>
                                  )}
                                  
                                  <div className="item-detalles">
                                    <div className="item-info">
                                      <span className="item-nombre">{item.item_name}</span>
                                      <span className="item-tipo">
                                        {item.item_type === 'combo_personalizado' ? '🍔 Combo' : 
                                         item.item_type === 'producto_personalizado' ? '🍕 Producto' : '📦 Item'}
                                      </span>
                                      {/* Mostrar producto base si está disponible */}
                                      {(item.original_product_name || productInfo.nombre) && (
                                        <span className="item-producto-base">
                                          Basado en: <strong>{item.original_product_name || productInfo.nombre}</strong>
                                        </span>
                                      )}
                                    </div>
                                    <div className="item-precio">
                                      <span className="cantidad">x{item.quantity}</span>
                                      <span className="precio">${parseFloat(item.unit_price).toLocaleString('es-CO')}</span>
                                    </div>
                                    {item.creator_username && (
                                      <div className="item-creator">
                                        Creado por: <strong>{item.creator_username}</strong>
                                      </div>
                                    )}
                                    
                                    {/* Botón para dejar reseña solo en productos normales */}
                                    {item.original_product_id && item.item_type !== 'combo_personalizado' && item.item_type !== 'producto_personalizado' && (() => {
                                      const productoIdBD = productIdMapping[item.original_product_id] || parseInt(item.original_product_id);
                                      const yaResenado = resenasUsuario.some(resena => 
                                        resena.producto === productoIdBD
                                      );
                                      
                                      if (yaResenado) {
                                        return (
                                          <span className="ya-resenado">
                                            ✅ Ya reseñado
                                          </span>
                                        );
                                      }
                                      
                                      return (
                                        <button 
                                          className="btn-resena"
                                          onClick={() => abrirModalResena(item)}
                                        >
                                          ⭐ Dejar Reseña
                                        </button>
                                      );
                                    })()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        <div className="compra-footer">
                          {compra.points_used > 0 && (
                            <div className="puntos-usados">
                              <span className="puntos-icono">⭐</span>
                              <span>Puntos usados: {compra.points_used}</span>
                            </div>
                          )}
                          {compra.points_earned > 0 && (
                            <div className="puntos-ganados">
                              <span className="puntos-icono">💰</span>
                              <span>Puntos ganados: {compra.points_earned}</span>
                            </div>
                          )}
                          {compra.stripe_session_id && (
                            <div className="stripe-session">
                              <span className="session-label">ID de transacción:</span>
                              <span className="session-id">{compra.stripe_session_id.substring(0, 20)}...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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

      {/* Modal para escribir reseña */}
      {mostrandoModalResena && productoAResenar && (
        <div className="modal-overlay" onClick={cerrarModalResena}>
          <div className="modal-resena" onClick={(e) => e.stopPropagation()}>
            <h3>Dejar Reseña</h3>
            <p><strong>Producto:</strong> {productoAResenar.item_name}</p>
            
            <div className="calificacion-selector">
              <label>Calificación:</label>
              <div className="estrellas">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`estrella ${num <= calificacion ? 'activa' : ''}`}
                    onClick={() => setCalificacion(num)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            
            <div className="texto-resena">
              <label>Comentario:</label>
              <textarea
                value={textoResena}
                onChange={(e) => setTextoResena(e.target.value)}
                placeholder="Comparte tu experiencia con este producto..."
                rows={4}
              />
            </div>
            
            <div className="modal-acciones">
              <button onClick={cerrarModalResena} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={enviarResena} className="btn-enviar">
                Enviar Reseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;

