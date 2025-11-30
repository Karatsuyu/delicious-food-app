import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!user || !user.is_staff) {
      navigate('/');
      return;
    }
    loadEstadisticas();
  }, [user, navigate]);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEstadisticas();
      setEstadisticas(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError('Error al cargar estadísticas. Verifica que seas administrador.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!estadisticas) {
    return <div className="dashboard-error">No hay estadísticas disponibles</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard de Administración</h1>
        <button onClick={loadEstadisticas} className="btn-refresh">
          🔄 Actualizar
        </button>
      </div>

      {/* Estadísticas Generales */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Productos</h3>
            <p className="stat-value">{estadisticas.estadisticas_generales.total_productos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pedidos</h3>
            <p className="stat-value">{estadisticas.estadisticas_generales.total_pedidos}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Ingresos</h3>
            <p className="stat-value">
              ${estadisticas.estadisticas_generales.total_ingresos.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="dashboard-section">
        <h2>🍔 Productos Más Vendidos</h2>
        {estadisticas.productos_mas_vendidos.length === 0 ? (
          <p className="no-data">No hay productos vendidos aún</p>
        ) : (
          <div className="top-products">
            {estadisticas.productos_mas_vendidos.map((producto, index) => (
              <div key={producto.id} className="top-product-card">
                <div className="product-rank">#{index + 1}</div>
                {producto.imagen && (
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="product-image-dashboard"
                  />
                )}
                <div className="product-details">
                  <h3>{producto.nombre}</h3>
                  <p className="product-category-dash">{producto.categoria}</p>
                  <div className="product-stats">
                    <div className="stat-item">
                      <span className="stat-label">Vendidos:</span>
                      <span className="stat-number">{producto.total_vendido}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Ingresos:</span>
                      <span className="stat-number">
                        ${producto.total_ingresos.toLocaleString('es-CO')}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Precio:</span>
                      <span className="stat-number">
                        ${producto.precio.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Productos por Categoría */}
      <div className="dashboard-section">
        <h2>📊 Productos por Categoría</h2>
        {estadisticas.productos_por_categoria.length === 0 ? (
          <p className="no-data">No hay categorías con productos</p>
        ) : (
          <div className="category-stats">
            {estadisticas.productos_por_categoria.map((cat) => (
              <div key={cat.categoria || 'sin-categoria'} className="category-card">
                <h3>{cat.categoria || 'Sin categoría'}</h3>
                <p className="category-count">{cat.cantidad} productos</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

