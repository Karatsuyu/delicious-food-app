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
import logo from '../assets/logo.png';
import api from '../api/api';
import { useRef } from 'react';

function Home() {
  const [productos, setProductos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [reviews, setReviews] = useState([]);

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

  // Obtener reseñas desde el backend (no quemadas)
  useEffect(() => {
    let mounted = true;
    const fetchReviews = async () => {
      try {
        const resp = await api.get('reviews/');
        if (!mounted) return;
        // Resp puede ser lista de objetos {id, usuario, texto, calificacion, creado}
        setReviews(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        console.error('Error cargando reseñas:', err);
        setReviews([]);
      }
    };
    fetchReviews();
    return () => { mounted = false; };
  }, []);

  const scrollReviews = (direction = 'next') => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector('.review-card');
    if (!card) return;
    const style = window.getComputedStyle(card);
    const gap = parseInt(style.marginRight || 20, 10) || 20;
    const width = card.offsetWidth + gap;
    const delta = direction === 'next' ? width : -width;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

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

      {/* Reseñas (Marquee infinito estilo solicitado) */}
      <section className="reviews-section">
        <h2 className="section-title-custom reviews-title-inline">Reseñas</h2>
        {reviews && reviews.length > 0 ? (
          <div
            className="reviews-marquee"
            style={{ '--reviews-duration': `${Math.max(24, reviews.length * 4)}s` }}
          >
            <div className="reviews-marquee-group">
              {reviews.map((r) => {
                const rating = r.calificacion || r.rating || 5;
                const text = r.texto || r.comment || '';
                const uid = r.usuario || (r.user && r.user.id) || Math.floor(Math.random() * 1000);
                const avatar = r.usuario_profile_image || r.profile_image || `https://i.pravatar.cc/80?img=${(uid % 70) + 1}`;
                return (
                  <article key={`g1-${r.id}`} className="review-card">
                    <img className="review-avatar" src={avatar} alt="Foto de perfil" />
                    <div className="review-body">
                      <div className="review-header">
                        <div className="review-stars" aria-label={`${rating} estrellas`}>
                          {Array.from({ length: rating }).map(() => '★').join('')}
                          {Array.from({ length: 5 - rating }).map(() => '☆').join('')}
                        </div>
                      </div>
                      <p className="review-text">{text}</p>
                      <div className="review-underline" />
                    </div>
                    <img className="review-logo" src={logo} alt="Logo Delicious Food" />
                  </article>
                );
              })}
            </div>
            {/* Segunda copia para efecto infinito */}
            <div className="reviews-marquee-group" aria-hidden="true">
              {reviews.map((r) => {
                const rating = r.calificacion || r.rating || 5;
                const text = r.texto || r.comment || '';
                const uid = r.usuario || (r.user && r.user.id) || Math.floor(Math.random() * 1000);
                const avatar = r.usuario_profile_image || r.profile_image || `https://i.pravatar.cc/80?img=${(uid % 70) + 1}`;
                return (
                  <article key={`g2-${r.id}`} className="review-card">
                    <img className="review-avatar" src={avatar} alt="Foto de perfil" />
                    <div className="review-body">
                      <div className="review-header">
                        <div className="review-stars" aria-label={`${rating} estrellas`}>
                          {Array.from({ length: rating }).map(() => '★').join('')}
                          {Array.from({ length: 5 - rating }).map(() => '☆').join('')}
                        </div>
                      </div>
                      <p className="review-text">{text}</p>
                      <div className="review-underline" />
                    </div>
                    <img className="review-logo" src={logo} alt="Logo Delicious Food" />
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <p style={{ padding: '12px', color: '#666' }}>No hay reseñas disponibles todavía.</p>
        )}
      </section>

    </div>
  );
}

export default Home;