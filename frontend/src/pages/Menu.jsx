import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Menu.css';

// Importar imágenes de hamburguesas
import hamburguesa1 from '../assets/ham1.png';
import hamburguesa2 from '../assets/ham2.png';
import hamburguesa3 from '../assets/ham3.png';
import hamburguesa4 from '../assets/ham4.png';
import hamburguesa5 from '../assets/ham5.png';
import hamburguesa6 from '../assets/ham6.png';
import hamburguesa7 from '../assets/ham7.png';
import hamburguesa8 from '../assets/ham8.png';

// Importar imágenes de pizzas
import pizza1 from '../assets/piz1.png';
import pizza2 from '../assets/piz2.png';
import pizza3 from '../assets/piz3.png';
import pizza4 from '../assets/piz4.png';
import pizza5 from '../assets/piz5.png';
import pizza6 from '../assets/piz6.png';
import pizza7 from '../assets/piz7.png';

// Importar imágenes de pollo
import pollo1 from '../assets/po1.png';
import pollo2 from '../assets/po2.png';
import pollo3 from '../assets/po3.png';
import pollo4 from '../assets/po4.png';
import pollo5 from '../assets/po5.png';
import pollo6 from '../assets/po6.png';

// Importar imágenes de perros
import perro1 from '../assets/pe1.png';
import perro2 from '../assets/pe2.png';
import perro3 from '../assets/pe1.png';
import perro4 from '../assets/pe2.png';

function Menu() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const categoriaUrl = searchParams.get('categoria');
  
  const [productos, setProductos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(categoriaUrl || 'todos');
  const [loading, setLoading] = useState(true);

  const categorias = [
    { id: 'todos', nombre: 'Todos', icon: '🍽️' },
    { id: 'hamburguesas', nombre: 'Hamburguesas', icon: '🍔' },
    { id: 'pizzas', nombre: 'Pizzas', icon: '🍕' },
    { id: 'pollo', nombre: 'Pollo', icon: '🍗' },
    { id: 'perros', nombre: 'Perros', icon: '🌭' },
    { id: 'postres', nombre: 'Postres', icon: '🧁' },
    { id: 'papas', nombre: 'Papas', icon: '🍟' },
    { id: 'bebidas', nombre: 'Bebidas', icon: '🥤' },
  ];

  // Datos de las hamburguesas con imágenes
  const hamburguesasData = [
    { id: 'ham-1', nombre: 'Hamburguesa Clásica', precio: 15900, imagen: hamburguesa1, descripcion: 'Hamburguesa tradicional' },
    { id: 'ham-2', nombre: 'Hamburguesa con Queso', precio: 18900, imagen: hamburguesa2, descripcion: 'Deliciosa hamburguesa con queso derretido' },
    { id: 'ham-3', nombre: 'Hamburguesa Deluxe', precio: 22900, imagen: hamburguesa3, descripcion: 'Hamburguesa premium' },
    { id: 'ham-4', nombre: 'BBQ Crispy', precio: 19900, imagen: hamburguesa4, descripcion: 'Hamburguesa con barbecue y crujiente' },
    { id: 'ham-5', nombre: 'Clásico Bacon', precio: 21900, imagen: hamburguesa5, descripcion: 'Hamburguesa con tocino crujiente' },
    { id: 'ham-6', nombre: 'Madurita Burger', precio: 17900, imagen: hamburguesa6, descripcion: 'Hamburguesa con ingredientes frescos' },
    { id: 'ham-7', nombre: 'BBQ Crunch Burger', precio: 24900, imagen: hamburguesa7, descripcion: 'Hamburguesa BBQ con ingredientes crujientes' },
    { id: 'ham-8', nombre: 'Double Smash', precio: 28900, imagen: hamburguesa8, descripcion: 'Doble hamburguesa jugosa' },
  ];

  // Datos de las pizzas con imágenes
  const pizzasData = [
    { id: 'pizza-1', nombre: 'Pizza Hawaiana', precio: 32000, imagen: pizza1, descripcion: 'Pizza con jamón y piña' },
    { id: 'pizza-2', nombre: 'Pizza de Queso', precio: 34900, imagen: pizza2, descripcion: 'Pizza con queso derretido' },
    { id: 'pizza-3', nombre: 'Pizza de Pepperoni', precio: 36900, imagen: pizza3, descripcion: 'Pizza con pepperoni' },
    { id: 'pizza-4', nombre: 'Pizza Aromática de Pepperoni', precio: 38000, imagen: pizza4, descripcion: 'Pizza de pepperoni con hierbas aromáticas' },
    { id: 'pizza-5', nombre: 'Pizza de Pollo y Champiñones', precio: 38000, imagen: pizza5, descripcion: 'Pizza con pollo y champiñones' },
    { id: 'pizza-6', nombre: 'Pepperoni Lovers', precio: 40900, imagen: pizza6, descripcion: 'Pizza cargada de pepperoni' },
    { id: 'pizza-7', nombre: 'Pizza Campesina', precio: 41500, imagen: pizza7, descripcion: 'Pizza con ingredientes del campo' },
  ];

  // Datos de pollo con imágenes
  const polloData = [
    { id: 'pollo-1', nombre: 'Alitas Simples', precio: 12000, imagen: pollo1, descripcion: 'Alitas de pollo tradicionales' },
    { id: 'pollo-2', nombre: 'Alitas Crocantes', precio: 12900, imagen: pollo2, descripcion: 'Alitas extra crujientes' },
    { id: 'pollo-3', nombre: 'Alitas BBQ', precio: 16000, imagen: pollo3, descripcion: 'Alitas con salsa BBQ' },
    { id: 'pollo-4', nombre: 'Alitas Teriyaki', precio: 16500, imagen: pollo4, descripcion: 'Alitas con salsa teriyaki' },
    { id: 'pollo-5', nombre: 'Alitas Ajo Parmesano', precio: 18000, imagen: pollo5, descripcion: 'Alitas con ajo y parmesano' },
    { id: 'pollo-6', nombre: 'Alitas Barbacoa', precio: 18000, imagen: pollo6, descripcion: 'Alitas con salsa barbacoa' },
  ];

  // Datos de perros calientes con imágenes
  const perrosData = [
    { id: 'perro-1', nombre: 'Perro Clásico', precio: 9000, imagen: perro1, descripcion: 'Perro caliente tradicional' },
    { id: 'perro-2', nombre: 'Perro Supremo', precio: 12000, imagen: perro2, descripcion: 'Perro caliente con ingredientes premium' },
    { id: 'perro-3', nombre: 'Perro Crocante', precio: 16000, imagen: perro3, descripcion: 'Perro caliente crujiente' },
    { id: 'perro-4', nombre: 'Alitas Teriyaki', precio: 16500, imagen: perro4, descripcion: 'Alitas con salsa teriyaki' },
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        console.log('🔄 Intentando cargar productos desde el backend...');
        
        const productosBackend = await productService.getAllProducts();
        
        console.log('✅ Productos cargados desde backend:', productosBackend.length);
        
        if (productosBackend.length > 0) {
          console.log('🍕 Ejemplo de producto del backend:', productosBackend[0]);
        } else {
          console.warn('⚠️ No hay productos en la base de datos');
        }
        
        setProductos(productosBackend);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error cargando productos del backend:', error);
        
        // En caso de error, usar productos de prueba para desarrollo
        console.log('💡 Usando productos de prueba locales...');
        const productosDemo = [
          { id: 1, nombre: 'Pizza Margarita', precio: 25000, categoria: 'pizzas', descripcion: 'Pizza clásica italiana', imagen: null },
          { id: 2, nombre: 'Pizza Pepperoni', precio: 28000, categoria: 'pizzas', descripcion: 'Pizza con pepperoni', imagen: null },
          { id: 3, nombre: 'Alitas BBQ', precio: 18000, categoria: 'pollo', descripcion: 'Alitas de pollo BBQ', imagen: null },
          { id: 4, nombre: 'Hot Dog Clásico', precio: 12000, categoria: 'perros', descripcion: 'Perro caliente tradicional', imagen: null },
          { id: 5, nombre: 'Brownie', precio: 8000, categoria: 'postres', descripcion: 'Brownie de chocolate', imagen: null },
          { id: 6, nombre: 'Papas Fritas', precio: 7000, categoria: 'papas', descripcion: 'Papas fritas crujientes', imagen: null },
          { id: 7, nombre: 'Coca Cola', precio: 5000, categoria: 'bebidas', descripcion: 'Bebida gaseosa', imagen: null },
        ];
        setProductos(productosDemo);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    if (categoriaUrl) {
      setCategoriaActual(categoriaUrl);
    }
  }, [categoriaUrl]);

  // Función mejorada para filtrar productos
  const productosFiltrados = () => {
    console.log('=== DEBUG FILTRADO ===');
    console.log('Categoría actual:', categoriaActual);
    console.log('Total productos disponibles:', productos.length);
    
    if (categoriaActual === 'todos') {
      console.log('Mostrando todos los productos');
      return productos;
    }
    
    if (categoriaActual === 'hamburguesas') {
      console.log('Categoría hamburguesas - usando array especial');
      return [];
    }
    
    if (categoriaActual === 'pizzas') {
      console.log('Categoría pizzas - usando array especial');
      return [];
    }
    
    if (categoriaActual === 'pollo') {
      console.log('Categoría pollo - usando array especial');
      return [];
    }
    
    if (categoriaActual === 'perros') {
      console.log('Categoría perros - usando array especial');
      return [];
    }
    
    // Mapeo de categorías para búsqueda más flexible
    const mapeoCategoria = {
      'pizzas': ['pizza', 'pizzas'],
      'pollo': ['pollo', 'chicken'],
      'perros': ['perro', 'perros', 'hot dog', 'hotdog'],
      'postres': ['postre', 'postres', 'dessert', 'dulce'],
      'papas': ['papa', 'papas', 'fries', 'french'],
      'bebidas': ['bebida', 'bebidas', 'drink', 'refresco', 'gaseosa', 'jugo']
    };
    
    const palabrasClave = mapeoCategoria[categoriaActual] || [categoriaActual];
    console.log('Palabras clave de búsqueda:', palabrasClave);
    
    // Filtrar productos de otras categorías
    const filtrados = productos.filter(p => {
      const nombreLower = (p.nombre || '').toLowerCase();
      const categoriaLower = (p.categoria || '').toLowerCase();
      const tipoLower = (p.tipo || '').toLowerCase();
      const descripcionLower = (p.descripcion || '').toLowerCase();
      
      // Buscar coincidencia con cualquier palabra clave
      const coincide = palabrasClave.some(palabra => {
        return nombreLower.includes(palabra) || 
               categoriaLower.includes(palabra) || 
               tipoLower.includes(palabra) ||
               descripcionLower.includes(palabra);
      });
      
      if (coincide) {
        console.log('Producto encontrado:', p.nombre);
      }
      
      return coincide;
    });
    
    console.log('Productos filtrados:', filtrados.length);
    console.log('===================');
    
    return filtrados;
  };

  const productosParaMostrar = productosFiltrados();

  // Obtener el nombre de la categoría actual para mostrar en el título
  const categoriaActualNombre = categorias.find(cat => cat.id === categoriaActual)?.nombre || 'Todos';

  // Funciones para manejar las hamburguesas
  const handleHamburguesaClick = (hamburguesa) => {
    navigate(`/personalizar/${hamburguesa.id}`);
  };

  const handleHamburguesaAddToCart = (e, hamburguesa) => {
    e.stopPropagation();
    const productoData = {
      id: hamburguesa.id,
      nombre: hamburguesa.nombre,
      precio: hamburguesa.precio,
      imagen: hamburguesa.imagen,
      es_personalizable: true
    };
    const message = addToCart(productoData);
    alert(message);
  };

  // Funciones para manejar pizzas
  const handlePizzaClick = (pizza) => {
    navigate(`/personalizar/${pizza.id}`);
  };

  const handlePizzaAddToCart = (e, pizza) => {
    e.stopPropagation();
    const productoData = {
      id: pizza.id,
      nombre: pizza.nombre,
      precio: pizza.precio,
      imagen: pizza.imagen,
      es_personalizable: true
    };
    const message = addToCart(productoData);
    alert(message);
  };

  // Funciones para manejar pollo
  const handlePolloClick = (pollo) => {
    navigate(`/personalizar/${pollo.id}`);
  };

  const handlePolloAddToCart = (e, pollo) => {
    e.stopPropagation();
    const productoData = {
      id: pollo.id,
      nombre: pollo.nombre,
      precio: pollo.precio,
      imagen: pollo.imagen,
      es_personalizable: true
    };
    const message = addToCart(productoData);
    alert(message);
  };

  // Funciones para manejar perros
  const handlePerroClick = (perro) => {
    navigate(`/personalizar/${perro.id}`);
  };

  const handlePerroAddToCart = (e, perro) => {
    e.stopPropagation();
    const productoData = {
      id: perro.id,
      nombre: perro.nombre,
      precio: perro.precio,
      imagen: perro.imagen,
      es_personalizable: true
    };
    const message = addToCart(productoData);
    alert(message);
  };

  const handleCategoriaChange = (categoriaId) => {
    console.log('Cambiando a categoría:', categoriaId);
    setCategoriaActual(categoriaId);
  };

  return (
    <div className="menu-page">
      {/* Filtros de categoría */}
      <section className="menu-categories">
        <div className="categories-filter">
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${categoriaActual === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoriaChange(cat.id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Título de la sección */}
      <section className="section-title-container">
        <h1 className="section-title">{categoriaActualNombre}</h1>
        <div className="section-underline"></div>
      </section>

      {/* Grid de productos */}
      <section className="menu-products">
        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : categoriaActual === 'hamburguesas' ? (
          // Mostrar hamburguesas especiales con imágenes
          <div className="hamburguesas-grid">
            {hamburguesasData.map(hamburguesa => (
              <div 
                key={hamburguesa.id} 
                className="hamburguesa-card"
                onClick={() => handleHamburguesaClick(hamburguesa)}
              >
                <div className="hamburguesa-image">
                  <img src={hamburguesa.imagen} alt={hamburguesa.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{hamburguesa.nombre}</h3>
                  <p className="hamburguesa-price">${hamburguesa.precio.toLocaleString('es-CO')}</p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handleHamburguesaAddToCart(e, hamburguesa)}
                  >
                    Agregar al carrito
                  </button>
                  <button 
                    className="btn-hamburguesa-customize"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHamburguesaClick(hamburguesa);
                    }}
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'pizzas' ? (
          // Mostrar pizzas especiales con imágenes
          <div className="hamburguesas-grid">
            {pizzasData.map(pizza => (
              <div 
                key={pizza.id} 
                className="hamburguesa-card"
                onClick={() => handlePizzaClick(pizza)}
              >
                <div className="hamburguesa-image">
                  <img src={pizza.imagen} alt={pizza.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{pizza.nombre}</h3>
                  <p className="hamburguesa-price">${pizza.precio.toLocaleString('es-CO')}</p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handlePizzaAddToCart(e, pizza)}
                  >
                    Agregar al carrito
                  </button>
                  <button 
                    className="btn-hamburguesa-customize"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePizzaClick(pizza);
                    }}
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'pollo' ? (
          // Mostrar pollo especial con imágenes
          <div className="hamburguesas-grid">
            {polloData.map(pollo => (
              <div 
                key={pollo.id} 
                className="hamburguesa-card"
                onClick={() => handlePolloClick(pollo)}
              >
                <div className="hamburguesa-image">
                  <img src={pollo.imagen} alt={pollo.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{pollo.nombre}</h3>
                  <p className="hamburguesa-price">${pollo.precio.toLocaleString('es-CO')}</p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handlePolloAddToCart(e, pollo)}
                  >
                    Agregar al carrito
                  </button>
                  <button 
                    className="btn-hamburguesa-customize"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePolloClick(pollo);
                    }}
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'perros' ? (
          // Mostrar perros especiales con imágenes
          <div className="hamburguesas-grid">
            {perrosData.map(perro => (
              <div 
                key={perro.id} 
                className="hamburguesa-card"
                onClick={() => handlePerroClick(perro)}
              >
                <div className="hamburguesa-image">
                  <img src={perro.imagen} alt={perro.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{perro.nombre}</h3>
                  <p className="hamburguesa-price">${perro.precio.toLocaleString('es-CO')}</p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handlePerroAddToCart(e, perro)}
                  >
                    Agregar al carrito
                  </button>
                  <button 
                    className="btn-hamburguesa-customize"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePerroClick(perro);
                    }}
                  >
                    Personalizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : productosParaMostrar.length > 0 ? (
          // Mostrar productos de otras categorías
          <div className="products-grid-menu">
            {productosParaMostrar.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No hay productos disponibles en esta categoría</p>
            <small>Categoría: {categoriaActual}</small>
            <small>Total productos en DB: {productos.length}</small>
            {productos.length > 0 && (
              <div style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: '20px auto' }}>
                <strong>Ejemplo de estructura de producto:</strong>
                <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px', overflow: 'auto' }}>
                  {JSON.stringify(productos[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Menu;