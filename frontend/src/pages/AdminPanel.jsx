import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    es_personalizable: false,
    imagen: null
  });
  const [imagenPreview, setImagenPreview] = useState(null);

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!user || !user.is_staff) {
      navigate('/');
      return;
    }
    loadProductos();
  }, [user, navigate]);

  // Efecto separado para manejar la edición desde URL
  useEffect(() => {
    if (productos.length > 0 && !editingProduct) {
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('edit');
      if (editId) {
        // Verificar que el ID sea numérico
        const numericId = parseInt(editId);
        if (isNaN(numericId)) {
          console.warn('⚠️ ID de producto no válido para editar (debe ser numérico):', editId);
          alert('Solo se pueden editar productos que están guardados en el backend (con ID numérico)');
          window.history.replaceState({}, '', '/admin/productos');
          return;
        }
        
        const producto = productos.find(p => p.id === numericId);
        if (producto) {
          console.log('✅ Producto encontrado en lista, editando:', producto);
          handleEdit(producto);
          window.history.replaceState({}, '', '/admin/productos');
        } else {
          // Si no está en la lista, intentar cargarlo directamente
          console.log('🔍 Producto no en lista, cargando desde backend:', numericId);
          adminService.getProduct(numericId).then(producto => {
            console.log('✅ Producto cargado desde backend:', producto);
            handleEdit(producto);
            window.history.replaceState({}, '', '/admin/productos');
          }).catch(err => {
            console.error('❌ Error cargando producto para editar:', err);
            alert('No se pudo cargar el producto para editar. El producto puede no existir en el backend.');
            window.history.replaceState({}, '', '/admin/productos');
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, editingProduct]);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllProducts();
      setProductos(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError('Error al cargar productos. Verifica que seas administrador.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0] || null;
      setFormData({ ...formData, imagen: file });
      // Crear vista previa
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagenPreview(null);
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.nombre.trim()) {
      alert('Por favor ingresa un nombre para el producto');
      return;
    }
    
    if (!formData.precio || isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0');
      return;
    }
    
    if (!formData.categoria || formData.categoria.trim() === '') {
      alert('Por favor selecciona una categoría');
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append('nombre', formData.nombre.trim());
      dataToSend.append('descripcion', (formData.descripcion || '').trim());
      
      // Asegurar que el precio sea un número válido
      const precioNumero = parseFloat(formData.precio);
      if (isNaN(precioNumero) || precioNumero <= 0) {
        alert('El precio debe ser un número mayor a 0');
        return;
      }
      dataToSend.append('precio', precioNumero.toString());
      
      dataToSend.append('categoria', formData.categoria);
      dataToSend.append('es_personalizable', formData.es_personalizable);
      
      // Solo agregar imagen si hay una nueva imagen seleccionada
      if (formData.imagen && formData.imagen instanceof File) {
        dataToSend.append('imagen', formData.imagen);
      }

      console.log('📤 Enviando datos:', {
        nombre: formData.nombre.trim(),
        descripcion: (formData.descripcion || '').trim(),
        precio: precioNumero,
        categoria: formData.categoria,
        es_personalizable: formData.es_personalizable,
        tieneImagen: formData.imagen instanceof File
      });

      if (editingProduct) {
        console.log('✏️ Actualizando producto ID:', editingProduct.id);
        const response = await adminService.updateProduct(editingProduct.id, dataToSend);
        console.log('✅ Producto actualizado:', response);
        alert('Producto actualizado exitosamente');
      } else {
        console.log('➕ Creando nuevo producto');
        const response = await adminService.createProduct(dataToSend);
        console.log('✅ Producto creado:', response);
        alert('Producto creado exitosamente');
      }

      resetForm();
      await loadProductos();
    } catch (err) {
      console.error('❌ Error completo:', err);
      console.error('📋 Response data:', err.response?.data);
      console.error('📊 Response status:', err.response?.status);
      console.error('🔗 Response headers:', err.response?.headers);
      
      let errorMessage = 'Error al guardar el producto.';
      
      if (err.response) {
        const data = err.response.data;
        if (data) {
          if (data.detail) {
            errorMessage = `Error: ${data.detail}`;
          } else if (data.message) {
            errorMessage = `Error: ${data.message}`;
          } else if (typeof data === 'string') {
            errorMessage = `Error: ${data}`;
          } else {
            // Mostrar errores de campos específicos
            const fieldErrors = Object.entries(data)
              .map(([field, errors]) => {
                const errorMsg = Array.isArray(errors) ? errors.join(', ') : String(errors);
                return `${field}: ${errorMsg}`;
              })
              .join('\n');
            errorMessage = `Error en los datos:\n${fieldErrors}`;
          }
        } else {
          errorMessage = `Error del servidor: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.';
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      
      alert(errorMessage);
    }
  };

  const handleEdit = (producto) => {
    console.log('Editando producto:', producto);
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      categoria: producto.categoria || '',
      es_personalizable: producto.es_personalizable || false,
      imagen: null // Siempre empezar con null para la nueva imagen
    });
    // Mostrar imagen actual si existe
    if (producto.imagen) {
      setImagenPreview(producto.imagen);
    } else {
      setImagenPreview(null);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await adminService.deleteProduct(id);
      alert('Producto eliminado exitosamente');
      loadProductos();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      alert('Error al eliminar el producto');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      es_personalizable: false,
      imagen: null
    });
    setImagenPreview(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const categorias = [
    'hamburguesas',
    'pizzas',
    'pollo',
    'perros',
    'postres',
    'papas',
    'bebidas'
  ];

  if (loading) {
    return <div className="admin-loading">Cargando productos...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <button 
          type="button"
          className="btn-new-product"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔵 Botón clickeado! showForm:', showForm);
            if (showForm) {
              console.log('🔴 Cerrando formulario');
              resetForm();
            } else {
              console.log('🟢 Abriendo formulario');
              resetForm();
              setShowForm(true);
            }
          }}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            position: 'relative',
            zIndex: 10000
          }}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {showForm && (
        <div className="admin-form-container">
          <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Categoría:</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="es_personalizable"
                  checked={formData.es_personalizable}
                  onChange={handleInputChange}
                />
                Es personalizable
              </label>
            </div>

            <div className="form-group">
              <label>Imagen:</label>
              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleInputChange}
              />
              {imagenPreview && (
                <div className="image-preview-container">
                  <p>Vista previa:</p>
                  <img 
                    src={imagenPreview} 
                    alt="Vista previa"
                    className="image-preview"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setImagenPreview(null);
                      setFormData({ ...formData, imagen: null });
                    }}
                    className="btn-remove-image"
                  >
                    Eliminar imagen
                  </button>
                </div>
              )}
              {!imagenPreview && editingProduct && editingProduct.imagen && (
                <div className="current-image">
                  <p>Imagen actual:</p>
                  <img 
                    src={editingProduct.imagen} 
                    alt={editingProduct.nombre}
                    className="current-image-preview"
                  />
                  <p className="image-note">Selecciona una nueva imagen para reemplazarla</p>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingProduct ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-products-list">
        <h2>Productos ({productos.length})</h2>
        {productos.length === 0 ? (
          <p>No hay productos registrados</p>
        ) : (
          <div className="products-grid">
            {productos.map(producto => (
              <div key={producto.id} className="product-card-admin">
                {producto.imagen ? (
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="product-image-admin"
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <span>📷</span>
                    <p>Sin imagen</p>
                  </div>
                )}
                <div className="product-info-admin">
                  <h3>{producto.nombre}</h3>
                  <p className="product-category">{producto.categoria}</p>
                  <p className="product-price">${parseFloat(producto.precio).toLocaleString('es-CO')}</p>
                  <p className="product-description">{producto.descripcion}</p>
                  {producto.es_personalizable && (
                    <span className="badge-personalizable">Personalizable</span>
                  )}
                </div>
                <div className="product-actions-admin">
                  <button 
                    onClick={() => handleEdit(producto)}
                    className="btn-edit"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(producto.id)}
                    className="btn-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;

