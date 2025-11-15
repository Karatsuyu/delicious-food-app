import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Menu.css';

// Reutilizamos el mismo estilo y estructura de tarjetas de Menu.jsx
// Cargamos los mismos productos fijos por categoría para buscar sobre ellos

// Hamburguesas
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
import hamburguesa5 from '../assets/hamburguesa5.png';
import hamburguesa6 from '../assets/hamburguesa6.png';
import hamburguesa7 from '../assets/hamburguesa7.png';
import hamburguesa8 from '../assets/hamburguesa8.png';

// Pizzas
import pizza1 from '../assets/pizza1.png';
import pizza2 from '../assets/pizza2.png';
import pizza3 from '../assets/pizza3.png';
import pizza4 from '../assets/pizza4.png';
import pizza5 from '../assets/pizza5.png';
import pizza6 from '../assets/pizza6.png';
import pizza7 from '../assets/pizza7.png';

// Pollo
import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import pollo3 from '../assets/pollo3.png';
import pollo4 from '../assets/pollo4.png';
import pollo5 from '../assets/pollo5.png';
import pollo6 from '../assets/pollo6.png';

// Perros
import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import perro3 from '../assets/perro3.png';
import perro4 from '../assets/perro4.png';
import perro5 from '../assets/perro5.png';

// Postres
import postres1 from '../assets/postres1.png';
import postres2 from '../assets/postres2.png';
import postres3 from '../assets/postres3.png';
import postres4 from '../assets/postres4.png';
import postres5 from '../assets/postres5.png';
import postres6 from '../assets/postres6.png';
import postres7 from '../assets/postres7.png';
import postres8 from '../assets/postres8.png';

// Papas
import papas1 from '../assets/papas1.png';
import papas2 from '../assets/papas2.png';
import papas3 from '../assets/papas3.png';

// Bebidas
import bebida1 from '../assets/bebida1.png';
import bebida2 from '../assets/bebida2.png';
import bebida3 from '../assets/bebida3.png';
import bebida4 from '../assets/bebida4.png';
import bebida5 from '../assets/bebida5.png';
import bebida6 from '../assets/bebida6.png';
import bebida7 from '../assets/bebida7.png';
import bebida8 from '../assets/bebida8.png';
import bebida9 from '../assets/bebida9.png';

function Buscar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const q = (searchParams.get('q') || '').trim();

  // Catálogo fijo combinado (igual que en Menu.jsx pero con campo categoria)
  const catalogo = useMemo(() => {
    const hamburguesas = [
      { id: 'hamburguesa1', nombre: 'Hamburguesa Clásica', precio: 7900, imagen: hamburguesa1, descripcion: 'Hamburguesa tradicional', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa2', nombre: 'Hamburguesa con Queso', precio: 8900, imagen: hamburguesa2, descripcion: 'Deliciosa hamburguesa con queso derretido', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa3', nombre: 'Hamburguesa Deluxe', precio: 10900, imagen: hamburguesa3, descripcion: 'Hamburguesa premium', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa4', nombre: 'BBQ Crispy', precio: 18000, imagen: hamburguesa4, descripcion: 'Hamburguesa con barbecue y crujiente', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa5', nombre: 'Clásico Bacon', precio: 22500, imagen: hamburguesa5, descripcion: 'Hamburguesa con tocino crujiente', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa6', nombre: 'Madurita Burger', precio: 24500, imagen: hamburguesa6, descripcion: 'Hamburguesa con ingredientes frescos', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa7', nombre: 'BBQ Crunch Burger', precio: 27000, imagen: hamburguesa7, descripcion: 'Hamburguesa BBQ con ingredientes crujientes', categoria: 'hamburguesas', es_personalizable: true },
      { id: 'hamburguesa8', nombre: 'Double Smash', precio: 30000, imagen: hamburguesa8, descripcion: 'Doble hamburguesa jugosa', categoria: 'hamburguesas', es_personalizable: true },
    ];

    const pizzas = [
      { id: 'pizza1', nombre: 'Pizza Hawaiana', precio: 32000, imagen: pizza1, descripcion: 'Pizza con jamón y piña', categoria: 'pizzas', es_personalizable: true },
      { id: 'pizza2', nombre: 'Pizza de Queso', precio: 34900, imagen: pizza2, descripcion: 'Pizza con queso derretido', categoria: 'pizzas', es_personalizable: true },
      { id: 'pizza3', nombre: 'Pizza de Pepperoni', precio: 36900, imagen: pizza3, descripcion: 'Pizza con pepperoni', categoria: 'pizzas', es_personalizable: true },
      { id: 'pizza4', nombre: 'Pizza Aromática de Pepperoni', precio: 38000, imagen: pizza4, descripcion: 'Pizza de pepperoni con hierbas aromáticas', categoria: 'pizzas', es_personalizable: true },
      { id: 'pizza5', nombre: 'Pizza de Pollo y Champiñones', precio: 38000, imagen: pizza5, descripcion: 'Pizza con pollo y champiñones', categoria: 'pizzas', es_personalizable: true },
      { id: 'pizza6', nombre: 'Pepperoni Lovers', precio: 40900, imagen: pizza6, descripcion: 'Pizza cargada de pepperoni', categoria: 'pizzas', es_personalizable: true },
      { id: 'pizza7', nombre: 'Pizza Campesina', precio: 41500, imagen: pizza7, descripcion: 'Pizza con ingredientes del campo', categoria: 'pizzas', es_personalizable: true },
    ];

    const pollo = [
      { id: 'pollo1', nombre: 'Alitas Simples', precio: 12000, imagen: pollo1, descripcion: 'Alitas de pollo tradicionales', categoria: 'pollo', es_personalizable: true },
      { id: 'pollo2', nombre: 'Alitas Crocantes', precio: 12900, imagen: pollo2, descripcion: 'Alitas extra crujientes', categoria: 'pollo', es_personalizable: true },
      { id: 'pollo3', nombre: 'Alitas BBQ', precio: 16000, imagen: pollo3, descripcion: 'Alitas con salsa BBQ', categoria: 'pollo', es_personalizable: true },
      { id: 'pollo4', nombre: 'Alitas Teriyaki', precio: 16500, imagen: pollo4, descripcion: 'Alitas con salsa teriyaki', categoria: 'pollo', es_personalizable: true },
      { id: 'pollo5', nombre: 'Alitas Ajo Parmesano', precio: 18000, imagen: pollo5, descripcion: 'Alitas con ajo y parmesano', categoria: 'pollo', es_personalizable: true },
      { id: 'pollo6', nombre: 'Alitas Barbacoa', precio: 18000, imagen: pollo6, descripcion: 'Alitas con salsa barbacoa', categoria: 'pollo', es_personalizable: true },
    ];

    const perros = [
      { id: 'perro1', nombre: 'Perro Clásico', precio: 7000, imagen: perro1, descripcion: 'Perro Caliente Tradicional', categoria: 'perros', es_personalizable: true },
      { id: 'perro2', nombre: 'Perro Crocante', precio: 12000, imagen: perro2, descripcion: 'Perro Caliente Crujiente', categoria: 'perros', es_personalizable: true },
      { id: 'perro3', nombre: 'Perro Supremo', precio: 14000, imagen: perro3, descripcion: 'Perro Caliente Supremo', categoria: 'perros', es_personalizable: true },
      { id: 'perro4', nombre: 'Perro Crunch Teriyaki', precio: 16000, imagen: perro4, descripcion: 'Perro Crunch', categoria: 'perros', es_personalizable: true },
      { id: 'perro5', nombre: 'Perro Fresh', precio: 18000, imagen: perro5, descripcion: 'Perro Caliente Fresh', categoria: 'perros', es_personalizable: true },
    ];

    const postres = [
      { id: 'postres1', nombre: 'Cono de Vainilla', precio: 4500, imagen: postres1, descripcion: 'Cono de Vainilla', categoria: 'postres', es_personalizable: true },
      { id: 'postres2', nombre: 'Cono de Vainilla y Chocolate', precio: 4500, imagen: postres2, descripcion: 'Cono de Vainilla y Chocolate', categoria: 'postres', es_personalizable: true },
      { id: 'postres3', nombre: 'Cono de Fresa', precio: 4500, imagen: postres3, descripcion: 'Cono de Fresa', categoria: 'postres', es_personalizable: true },
      { id: 'postres4', nombre: 'Cono de Chocolate', precio: 4500, imagen: postres4, descripcion: 'Cono de Chocolate', categoria: 'postres', es_personalizable: true },
      { id: 'postres5', nombre: 'Sundae de Arequipe', precio: 6000, imagen: postres5, descripcion: 'Sundae de Arequipe', categoria: 'postres', es_personalizable: true },
      { id: 'postres6', nombre: 'Sundae de Fresa', precio: 6000, imagen: postres6, descripcion: 'Sundae de Fresa', categoria: 'postres', es_personalizable: true },
      { id: 'postres7', nombre: 'Sundae de Chocolate', precio: 6000, imagen: postres7, descripcion: 'Sundae de Chocolate', categoria: 'postres', es_personalizable: true },
      { id: 'postres8', nombre: 'Sundae de Caramelo', precio: 6000, imagen: postres8, descripcion: 'Sundae de Caramelo', categoria: 'postres', es_personalizable: true },
    ];

    const papas = [
      { id: 'papas1', nombre: 'Papas Fritas', precio: 3500, imagen: papas1, descripcion: 'Papas Fritas', categoria: 'papas' },
      { id: 'papas2', nombre: 'Aros de Cebolla', precio: 3500, imagen: papas2, descripcion: 'Aros de Cebolla', categoria: 'papas' },
      { id: 'papas3', nombre: 'Nuggets de Pollo', precio: 3500, imagen: papas3, descripcion: 'Nuggets de Pollo', categoria: 'papas' },
    ];

    const bebidas = [
      { id: 'bebida1', nombre: 'Coca-Cola Personal', precio: 4000, imagen: bebida1, descripcion: 'Bebida Gaseosa CocaCola Personal', categoria: 'bebidas' },
      { id: 'bebida2', nombre: 'Coca-Cola En Lata', precio: 4500, imagen: bebida2, descripcion: 'Bebida Gaseosa CocaCola En Lata', categoria: 'bebidas' },
      { id: 'bebida3', nombre: 'Coca-Cola 3L', precio: 7500, imagen: bebida3, descripcion: 'Bebida Gaseosa CocaCola 3L', categoria: 'bebidas' },
      { id: 'bebida4', nombre: 'Sprite Personal', precio: 4000, imagen: bebida4, descripcion: 'Bebida Gaseosa Sprite Personal', categoria: 'bebidas' },
      { id: 'bebida5', nombre: 'Sprite En Lata', precio: 4500, imagen: bebida5, descripcion: 'Bebida Gaseosa Sprite En Lata', categoria: 'bebidas' },
      { id: 'bebida6', nombre: 'Sprite 3L', precio: 7500, imagen: bebida6, descripcion: 'Bebida Gaseosa Sprite 3L', categoria: 'bebidas' },
      { id: 'bebida7', nombre: 'Pepsi Personal', precio: 4000, imagen: bebida7, descripcion: 'Bebida Gaseosa Pepsi Personal', categoria: 'bebidas' },
      { id: 'bebida8', nombre: 'Pepsi En Lata', precio: 4500, imagen: bebida8, descripcion: 'Bebida Gaseosa Pepsi En Lata', categoria: 'bebidas' },
      { id: 'bebida9', nombre: 'Pepsi 3L', precio: 7500, imagen: bebida9, descripcion: 'Bebida Gaseosa Pepsi 3L', categoria: 'bebidas' },
    ];

    return [...hamburguesas, ...pizzas, ...pollo, ...perros, ...postres, ...papas, ...bebidas];
  }, []);

  const resultados = useMemo(() => {
    if (!q) return [];
    const texto = q.toLowerCase();
    return catalogo.filter(p =>
      (p.nombre || '').toLowerCase().includes(texto) ||
      (p.descripcion || '').toLowerCase().includes(texto) ||
      (p.categoria || '').toLowerCase().includes(texto)
    );
  }, [q, catalogo]);

  const handleCardClick = (item) => {
    // Conservamos el comportamiento de ir al detalle
    sessionStorage.setItem('ultimaCategoria', item.categoria);
    navigate(`/producto/${item.id}`);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    const productoData = {
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      imagen: item.imagen,
      es_personalizable: Boolean(item.es_personalizable),
    };
    const message = addToCart(productoData);
    alert(message);
  };

  return (
    <div className="menu-page">
      <section className="section-title-container">
        {q ? (
          <>
            <h1 className="section-title">Resultados para: "{q}"</h1>
            <div className="section-underline"></div>
          </>
        ) : (
          <>
            <h1 className="section-title">Buscar productos</h1>
            <div className="section-underline"></div>
          </>
        )}
      </section>

      <section className="menu-products">
        {!q ? (
          <div className="no-products">Escribe algo en la barra de búsqueda</div>
        ) : resultados.length === 0 ? (
          <div className="no-products">No se encontraron productos para "{q}"</div>
        ) : (
          <div className="hamburguesas-grid">
            {resultados.map((item) => (
              <div
                key={`${item.categoria}-${item.id}`}
                className="hamburguesa-card"
                onClick={() => handleCardClick(item)}
              >
                <div className="hamburguesa-image">
                  <img src={item.imagen} alt={item.nombre} />
                </div>
                <div className="hamburguesa-info">
                  <h3 className="hamburguesa-title">{item.nombre}</h3>
                  <p className="hamburguesa-price">${item.precio.toLocaleString('es-CO')}</p>
                </div>
                <div className="hamburguesa-actions">
                  <button
                    className="btn-hamburguesa-cart"
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Buscar;
