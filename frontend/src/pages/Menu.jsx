import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import './Menu.css';

// Importar imágenes de hamburguesas
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
import hamburguesa5 from '../assets/hamburguesa5.png';
import hamburguesa6 from '../assets/hamburguesa6.png';
import hamburguesa7 from '../assets/hamburguesa7.png';
import hamburguesa8 from '../assets/hamburguesa8.png';

// Importar imágenes de pizzas
import pizza1 from '../assets/pizza1.png';
import pizza2 from '../assets/pizza2.png';
import pizza3 from '../assets/pizza3.png';
import pizza4 from '../assets/pizza4.png';
import pizza5 from '../assets/pizza5.png';
import pizza6 from '../assets/pizza6.png';
import pizza7 from '../assets/pizza7.png';

// Importar imágenes de pollo
import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import pollo3 from '../assets/pollo3.png';
import pollo4 from '../assets/pollo4.png';
import pollo5 from '../assets/pollo5.png';
import pollo6 from '../assets/pollo6.png';

// Importar imágenes de perros
import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import perro3 from '../assets/perro3.png';
import perro4 from '../assets/perro4.png';
import perro5 from '../assets/perro5.png';

import postres1 from '../assets/postres1.png'
import postres2 from '../assets/postres2.png'
import postres3 from '../assets/postres3.png'
import postres4 from '../assets/postres4.png'
import postres5 from '../assets/postres5.png'
import postres6 from '../assets/postres6.png'
import postres7 from '../assets/postres7.png'
import postres8 from '../assets/postres8.png'

import papas1 from '../assets/papas1.png'
import papas2 from '../assets/papas2.png'
import papas3 from '../assets/papas3.png'

import bebida1 from '../assets/bebida1.png'
import bebida2 from '../assets/bebida2.png'
import bebida3 from '../assets/bebida3.png'
import bebida4 from '../assets/bebida4.png'
import bebida5 from '../assets/bebida5.png'
import bebida6 from '../assets/bebida6.png'
import bebida7 from '../assets/bebida7.png'
import bebida8 from '../assets/bebida8.png'
import bebida9 from '../assets/bebida9.png'

function Menu() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const categoriaUrl = searchParams.get('categoria');
  
  const [productos, setProductos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(categoriaUrl || 'todos');
  const [loading, setLoading] = useState(true);

  const categorias = [  
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
    { id: 'hamburguesa1', nombre: 'Hamburguesa Clásica', precio: 7900, imagen: hamburguesa1, descripcion: 'Hamburguesa tradicional' },
    { id: 'hamburguesa2', nombre: 'Hamburguesa con Queso', precio: 8900, imagen: hamburguesa2, descripcion: 'Deliciosa hamburguesa con queso derretido' },
    { id: 'hamburguesa3', nombre: 'Hamburguesa Deluxe', precio: 10900, imagen: hamburguesa3, descripcion: 'Hamburguesa premium' },
    { id: 'hamburguesa4', nombre: 'BBQ Crispy', precio: 18000, imagen: hamburguesa4, descripcion: 'Hamburguesa con barbecue y crujiente' },
    { id: 'hamburguesa5', nombre: 'Clásico Bacon', precio: 22500, imagen: hamburguesa5, descripcion: 'Hamburguesa con tocino crujiente' },
    { id: 'hamburguesa6', nombre: 'Madurita Burger', precio: 24500, imagen: hamburguesa6, descripcion: 'Hamburguesa con ingredientes frescos' },
    { id: 'hamburguesa7', nombre: 'BBQ Crunch Burger', precio: 27000, imagen: hamburguesa7, descripcion: 'Hamburguesa BBQ con ingredientes crujientes' },
    { id: 'hamburguesa8', nombre: 'Double Smash', precio: 30000, imagen: hamburguesa8, descripcion: 'Doble hamburguesa jugosa' },
  ];

  // Datos de las pizzas con imágenes
  const pizzasData = [
    { id: 'pizza1', nombre: 'Pizza Hawaiana', precio: 32000, imagen: pizza1, descripcion: 'Pizza con jamón y piña' },
    { id: 'pizza2', nombre: 'Pizza de Queso', precio: 34900, imagen: pizza2, descripcion: 'Pizza con queso derretido' },
    { id: 'pizza3', nombre: 'Pizza de Pepperoni', precio: 36900, imagen: pizza3, descripcion: 'Pizza con pepperoni' },
    { id: 'pizza4', nombre: 'Pizza Aromática de Pepperoni', precio: 38000, imagen: pizza4, descripcion: 'Pizza de pepperoni con hierbas aromáticas' },
    { id: 'pizza5', nombre: 'Pizza de Pollo y Champiñones', precio: 38000, imagen: pizza5, descripcion: 'Pizza con pollo y champiñones' },
    { id: 'pizza6', nombre: 'Pepperoni Lovers', precio: 40900, imagen: pizza6, descripcion: 'Pizza cargada de pepperoni' },
    { id: 'pizza7', nombre: 'Pizza Campesina', precio: 41500, imagen: pizza7, descripcion: 'Pizza con ingredientes del campo' },
  ];

  // Datos de pollo con imágenes
  const polloData = [
    { id: 'pollo1', nombre: 'Alitas Simples', precio: 12000, imagen: pollo1, descripcion: 'Alitas de pollo tradicionales' },
    { id: 'pollo2', nombre: 'Alitas Crocantes', precio: 12900, imagen: pollo2, descripcion: 'Alitas extra crujientes' },
    { id: 'pollo3', nombre: 'Alitas BBQ', precio: 16000, imagen: pollo3, descripcion: 'Alitas con salsa BBQ' },
    { id: 'pollo4', nombre: 'Alitas Teriyaki', precio: 16500, imagen: pollo4, descripcion: 'Alitas con salsa teriyaki' },
    { id: 'pollo5', nombre: 'Alitas Ajo Parmesano', precio: 18000, imagen: pollo5, descripcion: 'Alitas con ajo y parmesano' },
    { id: 'pollo6', nombre: 'Alitas Barbacoa', precio: 18000, imagen: pollo6, descripcion: 'Alitas con salsa barbacoa' },
  ];

  // Datos de perros calientes con imágenes
  const perrosData = [
    { id: 'perro1', nombre: 'Perro Clásico', precio: 7000, imagen: perro1, descripcion: 'Perro Caliente Tradicional' },
    { id: 'perro2', nombre: 'Perro Crocante', precio: 12000, imagen: perro2, descripcion: 'Perro Caliente Crujiente' },
    { id: 'perro3', nombre: 'Perro Supremo', precio: 14000, imagen: perro3, descripcion: 'Perro Caliente Supremo' },
    { id: 'perro4', nombre: 'Perro Crunch Teriyaki', precio: 16000, imagen: perro4, descripcion: 'Perro Crunch' },
    { id: 'perro5', nombre: 'Perro Fresh', precio: 18000, imagen: perro5, descripcion: 'Perro Caliente Fresh' }
  ];

  // Datos de postres con imágenes
  const postreData =[
    { id: 'postres1', nombre: 'Cono de Vainilla', precio: 4500, imagen: postres1, descripcion: 'Cono de Vainilla'},
    { id: 'postres2', nombre: 'Cono de Vainilla y Chocolate', precio: 4500, imagen: postres2, descripcion: 'Cono de Vainilla y Chocolate'},
    { id: 'postres3', nombre: 'Cono de Fresa', precio: 4500, imagen:postres3, descripcion: 'Cono de Fresa'},
    { id: 'postres4', nombre: 'Cono de Chocolate', precio: 4500, imagen: postres4, descripcion: 'Cono de Chocolate'},
    { id: 'postres5', nombre: 'Sundae de Arequipe', precio: 6000, imagen: postres5, descripcion: 'Sundae de Arequipe'},
    { id: 'postres6', nombre: 'Sundae de Fresa', precio: 6000, imagen: postres6, descripcion: 'Sundae de Fresa'},
    { id: 'postres7', nombre:'Sundae de Chocolate', precio: 6000, imagen: postres7, descripcion: 'Sundae de Chocolate'},
    { id: 'postres8', nombre: 'Sundae de Caramelo', precio: 6000, imagen: postres8, descripcion: 'Sundae de Caramelo'}
  ];

  const papasData =[
    { id: 'papas1', nombre: 'Papas Fritas', precio: 3500, imagen: papas1, descripcion: 'Papas Fritas'},
    { id: 'papas2', nombre: 'Aros de Cebolla', precio: 3500, imagen: papas2, descripcion: 'Aros de Cebolla'},
    { id: 'papas3', nombre: 'Nuggets de Pollo', precio: 3500, imagen: papas3, descripcion: 'Nuggets de Pollo'}
  ];

  const bebidasData =[
    { id: 'bebida1', nombre: 'Coca-Cola Personal', precio: 4000, imagen: bebida1, descripcion: 'Bebida Gaseosa CocaCola Personal'},
    { id: 'bebida2', nombre: 'Coca-Cola En Lata', precio: 4500, imagen: bebida2, descripcion: 'Bebida Gaseosa CocaCola En Lata'},
    { id: 'bebida3', nombre: 'Coca-Cola 3L', precio: 7500, imagen: bebida3, descripcion: 'Bebida Gaseosa CocaCola 3L'},
    { id: 'bebida4', nombre: 'Sprite Personal', precio: 4000, imagen: bebida4, descripcion: 'Bebida Gaseosa Sprite Personal'},
    { id: 'bebida5', nombre: 'Sprite En Lata', precio: 4500, imagen: bebida5, descripcion: 'Bebida Gaseosa Sprite En Lata'},
    { id: 'bebida6', nombre: 'Sprite 3L', precio: 7500, imagen: bebida6, descripcion: 'Bebida Gaseosa Sprite 3L'},
    { id: 'bebida7', nombre:'Pepsi Personal', precio: 4000, imagen: bebida7, descripcion: 'Bebida Gaseosa Pepsi Personal'},
    { id: 'bebida8', nombre: 'Pepsi En Lata', precio: 4500, imagen: bebida8, descripcion: 'Bebida Gaseosa Pepsi En Lata'},
    { id: 'bebida9', nombre: 'Pepsi 3L', precio: 7500, imagen: bebida9, descripcion: 'Bebida Gaseosa Pepsi 3L'}
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

    if (categoriaActual === 'postres') {
      console.log('Categoría postres - usando array especial');
      return [];
    }

    if (categoriaActual === 'papas') {
      console.log('Categoría papas - usando array especial');
      return [];
    }

    if (categoriaActual === 'bebidas') {
      console.log('Categoría bebidas - usando array especial');
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

  const handlePostresAddToCart = (e, postres) => {
    e.stopPropagation();
    const productoData = {
      id: postres.id,
      nombre: postres.nombre,
      precio: postres.precio,
      imagen: postres.imagen,
      es_personalizable: true
    };
    const message = addToCart(productoData);
    alert(message);
  };

  const handlePapasAddToCart = (e, papas) => {
    e.stopPropagation();
    const productoData = {
      id: papas.id,
      nombre: papas.nombre,
      precio: papas.precio,
      imagen: papas.imagen,
    };
    const message = addToCart(productoData);
    alert(message);
  };

  const handleBebidasAddToCart = (e, bebidas) => {
    e.stopPropagation();
    const productoData = {
      id: bebidas.id,
      nombre: bebidas.nombre,
      precio: bebidas.precio,
      imagen: bebidas.imagen,
    };
    const message = addToCart(productoData);
    alert(message);
  };

  const handleCategoriaChange = (categoriaId) => {
    // Cambia el estado y también actualiza la URL para que sea navegable (back/forward)
    setCategoriaActual(categoriaId);
    navigate(`/menu?categoria=${categoriaId}`);
  };
  

  const handleHamburguesaClick = (hamburguesa) => {
    sessionStorage.setItem('ultimaCategoria', 'hamburguesas');
    navigate(`/producto/${hamburguesa.id}`);
  };
  
  const handlePizzaClick = (pizza) => {
    sessionStorage.setItem('ultimaCategoria', 'pizzas');
    navigate(`/producto/${pizza.id}`);
  };
  
  const handlePolloClick = (pollo) => {
    sessionStorage.setItem('ultimaCategoria', 'pollo');
    navigate(`/producto/${pollo.id}`);
  };
  
  const handlePerroClick = (perro) => {
    sessionStorage.setItem('ultimaCategoria', 'perros');
    navigate(`/producto/${perro.id}`);
  };
  
  const handlePostresClick = (postre) => {
    sessionStorage.setItem('ultimaCategoria', 'postres');
    navigate(`/producto/${postre.id}`);
  };
  
  const handlePapasClick = (papas) => {
    sessionStorage.setItem('ultimaCategoria', 'papas');
    navigate(`/producto/${papas.id}`);
  };
  
  const handleBebidasClick = (bebida) => {
    sessionStorage.setItem('ultimaCategoria', 'bebidas');
    navigate(`/producto/${bebida.id}`);
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
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'perros' ? (
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
                  <p className="hamburguesa-price">
                    ${perro.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handlePerroAddToCart(e, perro)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'postres' ? (
          <div className="hamburguesas-grid">
            {postreData.map(postre => (
              <div 
                key={postre.id} 
                className="hamburguesa-card"
                onClick={() => handlePostresClick(postre)}
              >
                <div className="hamburguesa-image">
                  <img src={postre.imagen} alt={postre.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{postre.nombre}</h3>
                  <p className="hamburguesa-price">
                    ${postre.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
              onClick={(e) => handlePostresAddToCart(e, postre)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'papas' ? (
          <div className="hamburguesas-grid">
            {papasData.map(papas => (
              <div 
                key={papas.id} 
                className="hamburguesa-card"
                onClick={() => handlePapasClick(papas)}
              >
                <div className="hamburguesa-image">
                  <img src={papas.imagen} alt={papas.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{papas.nombre}</h3>
                  <p className="hamburguesa-price">
                    ${papas.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
              onClick={(e) => handlePapasAddToCart(e, papas)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : categoriaActual === 'bebidas' ? (
          <div className="hamburguesas-grid">
            {bebidasData.map(bebidas => (
              <div 
                key={bebidas.id} 
                className="hamburguesa-card"
                onClick={() => handleBebidasClick(bebidas)}
              >
                <div className="hamburguesa-image">
                  <img src={bebidas.imagen} alt={bebidas.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{bebidas.nombre}</h3>
                  <p className="hamburguesa-price">
                    ${bebidas.precio.toLocaleString('es-CO')}
                  </p>
                </div>
                <div className="hamburguesa-actions">
                  <button 
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handleBebidasAddToCart(e, bebidas)}
                  >
                    Agregar al carrito
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