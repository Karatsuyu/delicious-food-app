import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

function Home() {
  const [combos, setCombos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos de ejemplo para el carrusel mientras configuras el backend
        const combosEjemplo = [
          {
            id: 1,
            nombre: "Combo Familiar",
            descripcion: "Hamburguesa doble, papas grandes, 2 bebidas y postre",
            precio_total: 25.99
          },
          {
            id: 2,
            nombre: "Combo Deluxe",
            descripcion: "Pizza mediana, papas, bebida y ensalada",
            precio_total: 18.50
          },
          {
            id: 3,
            nombre: "Combo Express",
            descripcion: "Perro caliente especial, papas pequeñas y bebida",
            precio_total: 12.99
          }
        ];

        const productosEjemplo = [
          { 
            id: 1, 
            nombre: "Hamburguesa Clásica", 
            precio: 8.99, 
            imagen: null,
            descripcion: "Carne jugosa con lechuga, tomate y queso",
            es_personalizable: true
          },
          { 
            id: 2, 
            nombre: "Pizza Margherita", 
            precio: 15.99, 
            imagen: null,
            descripcion: "Mozzarella fresca, tomate y albahaca",
            es_personalizable: true
          },
          { 
            id: 3, 
            nombre: "Pollo Frito", 
            precio: 11.99, 
            imagen: null,
            descripcion: "Crujiente por fuera, jugoso por dentro",
            es_personalizable: false
          },
          { 
            id: 4, 
            nombre: "Perro Caliente", 
            precio: 6.99, 
            imagen: null,
            descripcion: "Salchicha premium con todos los ingredientes",
            es_personalizable: true
          },
          { 
            id: 5, 
            nombre: "Papas Fritas", 
            precio: 4.99, 
            imagen: null,
            descripcion: "Doradas y crujientes, perfectas para acompañar",
            es_personalizable: false
          },
          { 
            id: 6, 
            nombre: "Bebida Refrescante", 
            precio: 2.99, 
            imagen: null,
            descripcion: "Refrescante bebida de tu elección",
            es_personalizable: false
          }
        ];
        
        setCombos(combosEjemplo);
        setProductos(productosEjemplo);
        setLoading(false);

        // Comentado: código original para cuando tengas el backend funcionando
        /*
        const [combosRes, productosRes] = await Promise.all([
          axios.get('http://localhost:8000/api/products/combos/'),
          axios.get('http://localhost:8000/api/products/productos/')
        ]);
        
        setCombos(combosRes.data);
        setProductos(productosRes.data.slice(0, 6));
        setLoading(false);
        */
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (combos.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % combos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [combos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % combos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + combos.length) % combos.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home">
      {/* Carrusel de Combos */}
      {combos.length > 0 && (
        <section className="carousel-section">
          <div className="carousel-container">
            {combos.map((combo, index) => (
              <div
                key={combo.id}
                className={`carousel-slide ${
                  index === currentSlide ? 'active' : ''
                }`}
              >
                <div className="carousel-content">
                  <h1 className="combo-title">{combo.nombre}</h1>
                  <p className="combo-description">{combo.descripcion}</p>
                  <p className="combo-price">
                    ${parseFloat(combo.precio_total).toLocaleString('es-CO')}
                  </p>
                  <Link to={`/combo/${combo.id}`} className="btn-ver-combo">
                    Ver más
                  </Link>
                </div>
              </div>
            ))}

            <button className="carousel-arrow left" onClick={prevSlide}>
              ‹
            </button>
            <button className="carousel-arrow right" onClick={nextSlide}>
              ›
            </button>

            <div className="carousel-dots">
              {combos.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categorías */}
      <section className="categories-section">
        <div className="categories-container">
          <Link to="/menu?categoria=hamburguesas" className="category-item">
            <span className="category-icon">🍔</span>
            <p>Hamburguesas</p>
          </Link>
          <Link to="/menu?categoria=pizzas" className="category-item">
            <span className="category-icon">🍕</span>
            <p>Pizzas</p>
          </Link>
          <Link to="/menu?categoria=pollo" className="category-item">
            <span className="category-icon">🍗</span>
            <p>Pollo</p>
          </Link>
          <Link to="/menu?categoria=perros" className="category-item">
            <span className="category-icon">🌭</span>
            <p>Perros</p>
          </Link>
          <Link to="/menu?categoria=postres" className="category-item">
            <span className="category-icon">🧁</span>
            <p>Postres</p>
          </Link>
          <Link to="/menu?categoria=papas" className="category-item">
            <span className="category-icon">🍟</span>
            <p>Papas</p>
          </Link>
          <Link to="/menu?categoria=bebidas" className="category-item">
            <span className="category-icon">🥤</span>
            <p>Bebidas</p>
          </Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-section">
        <h2 className="section-title">Productos Destacados</h2>
        <div className="products-grid">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
        <div className="view-all-container">
          <Link to="/menu" className="btn-view-all">
            Ver todo el menú
          </Link>
        </div>
      </section>

      {/* Personaliza tu pedido */}
      <section className="customize-section">
        <h2 className="section-title-custom">¡Personaliza tu pedido!</h2>
        <p className="customize-description">
          Crea tu producto ideal eligiendo cada ingrediente
        </p>
        <Link to="/menu" className="btn-customize-main">
          Empezar a personalizar
        </Link>
      </section>
    </div>
  );
}

export default Home;