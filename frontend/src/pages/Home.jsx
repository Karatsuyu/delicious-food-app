import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import hamburguesa from '../assets/hamburguesa.png';
import pizza from '../assets/pizza.png';
import pollo from '../assets/pollo.png';
import perro from '../assets/perro.png';
import postre from '../assets/postre.png';
import './Home.css';

function Home() {
  const [productos, setProductos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Mapear cada banner a un combo específico
  const banners = [
    { path: '/combo-bbq-crispy', img: banner1, titulo: 'COMBO BBQ CRISPY' },
    { path: '/combo-clasico-bacon', img: banner2, titulo: 'COMBO CLASICO BACON' },
    { path: '/combo-pepperoni-lovers', img: banner3, titulo: 'COMBO PEPPERONI LOVERS' },
    { path: '/combo-crocante-deluxe', img: banner4, titulo: 'COMBO CROCANTE DELUXE' },
  ];

  // 🔹 Cambio automático del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
  setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000); // cada 4 segundos
    return () => clearInterval(interval);
  }, [banners.length]);

  // 🔹 Controles manuales
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="home">

      {/* Banner principal */}
      <section className="banner-section">
        <div className="banner-container" onClick={() => navigate(banners[currentSlide].path)} style={{cursor:'pointer'}}>
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              role="button"
              aria-label={`Ver ${banner.titulo}`}
              style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
            >
              <img
                src={banner.img}
                alt={`Banner ${index + 1}`}
                className="banner-image"
              />
            </div>
          ))}

          <button className="banner-arrow left" onClick={(e)=>{e.stopPropagation(); prevSlide();}}>‹</button>
          <button className="banner-arrow right" onClick={(e)=>{e.stopPropagation(); nextSlide();}}>›</button>

          <div className="banner-dots">
            {banners.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={(e)=>{e.stopPropagation(); goToSlide(index);}}
              ></span>
            ))}
          </div>
        </div>
      </section>

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

      {/* Personaliza tu pedido */}
      <section className="customize-section">
        <h2 className="section-title-custom">Personaliza tu pedido!</h2>
        <div className="categories-container1">
          <Link to="/personalizador/hamburguesas" className="category-item1">
              <img src={hamburguesa}  alt="Hamburguesa" className="hamburguesa-img" />
              <p>HAMBURGUESAS</p>
          </Link>
          <Link to="/personalizador/pizzas" className="category-item2">
              <img src={pizza}  alt="Pizza" className="pizza-img" />
              <p>PIZZAS</p>
            </Link>
            <Link to="/personalizador/pollo" className="category-item3">
              <img src={pollo}  alt="Pollo" className="pollo-img" />
              <p>POLLO</p>
            </Link>
            <Link to="/personalizador/perro" className="category-item4">
              <img src={perro}  alt="Perro" className="perro-img" />
              <p>PERROS</p>
            </Link>
            <Link to="/personalizador/postre" className="category-item5">
              <img src={postre}  alt="Postre" className="postre-img" />
              <p>POSTRES</p>
          </Link> 
        </div>
     </section>

    </div>
  );
}

export default Home;