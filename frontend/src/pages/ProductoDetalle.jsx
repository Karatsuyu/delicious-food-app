// src/components/ProductoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Importar imágenes
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
import hamburguesa5 from '../assets/hamburguesa5.png';
import hamburguesa6 from '../assets/hamburguesa6.png';
import hamburguesa7 from '../assets/hamburguesa7.png';
import hamburguesa8 from '../assets/hamburguesa8.png';

import pizza1 from '../assets/pizza1.png';
import pizza2 from '../assets/pizza2.png';
import pizza3 from '../assets/pizza3.png';
import pizza4 from '../assets/pizza4.png';
import pizza5 from '../assets/pizza5.png';
import pizza6 from '../assets/pizza6.png';
import pizza7 from '../assets/pizza7.png';

import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import pollo3 from '../assets/pollo3.png';
import pollo4 from '../assets/pollo4.png';
import pollo5 from '../assets/pollo5.png';
import pollo6 from '../assets/pollo6.png';

import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import perro3 from '../assets/perro3.png';
import perro4 from '../assets/perro4.png';
import perro5 from '../assets/perro5.png';

import postres1 from '../assets/postres1.png';
import postres2 from '../assets/postres2.png';
import postres3 from '../assets/postres3.png';
import postres4 from '../assets/postres4.png';
import postres5 from '../assets/postres5.png';
import postres6 from '../assets/postres6.png';
import postres7 from '../assets/postres7.png';
import postres8 from '../assets/postres8.png';

import papas1 from '../assets/papas1.png';
import papas2 from '../assets/papas2.png';
import papas3 from '../assets/papas3.png';

import bebida1 from '../assets/bebida1.png';
import bebida2 from '../assets/bebida2.png';
import bebida3 from '../assets/bebida3.png';
import bebida4 from '../assets/bebida4.png';
import bebida5 from '../assets/bebida5.png';
import bebida6 from '../assets/bebida6.png';
import bebida7 from '../assets/bebida7.png';
import bebida8 from '../assets/bebida8.png';
import bebida9 from '../assets/bebida9.png';

import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tamañoSeleccionado, setTamañoSeleccionado] = useState('pequeña');
  const [tipoPolloSeleccionado, setTipoPolloSeleccionado] = useState('alitas'); 
  const { addToCart } = useCart();

  // Definir tamaños de pizzas
  const tamaños = {
    'pizza1': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 15000 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 22000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 32000 }
    ],
    'pizza2': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 15000 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 24000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 34900 }
    ],
    'pizza3': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 17000 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 26000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 36900 }
    ],
    'pizza4': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 17000 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 26000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 38000 }
    ],
    'pizza5': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 17500 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 27000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 38000 }
    ],
    'pizza6': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 19000 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 28000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 40900 }
    ],
    'pizza7': [
      { id: 'pequeña', nombre: 'Pequeña 4 partes', precio: 20000 },
      { id: 'mediana', nombre: 'Mediana 6 partes', precio: 29000 },
      { id: 'familiar', nombre: 'Familiar 8 partes', precio: 41500 }
    ]
  };

  // Opciones para pollo (agrega esto después de las opciones de pizza)
const tiposPollo = {
  'pollo1': [
    { id: 'alitas1', nombre: '4 Partes', precio: 6000 },
    { id: 'alitas2', nombre: '6 Partes', precio: 9000 },
    { id: 'alitas3', nombre: '8 Partes', precio: 12000 },
  ],
  'pollo2': [
    { id: 'alitas4', nombre: '4 Partes', precio: 6500 },
    { id: 'alitas5', nombre: '6 Partes', precio: 9500 },
    { id: 'alitas6', nombre: '8 Partes', precio: 12900 },
  ],
  'pollo3': [
    { id: 'alitas7', nombre: '4 Partes', precio: 8000 },
    { id: 'alitas8', nombre: '6 Partes', precio: 12000},
    { id: 'alitas9', nombre: '8 Partes', precio: 16000},
  ],
  'pollo4': [
    { id: 'alitas10', nombre: '4 Partes', precio: 8200},
    { id: 'alitas11', nombre: '6 Partes', precio: 12300},
    { id: 'alitas12', nombre: '8 Partes', precio: 16500},
  ],
};
  

  useEffect(() => {
    const cargarProducto = () => {
      setLoading(true);

      const productosLocales = {
        'hamburguesa1': { 
          id: 'hamburguesa1', 
          nombre: 'Hamburguesa Clásica', 
          precio: 7900, 
          descripcion: 'Hamburguesa clásica de pan brioche con carne de res de 50gr, salsa de tomate.',
          categoria: 'hamburguesas',
          imagen: hamburguesa1
        },
        'hamburguesa2': { 
          id: 'hamburguesa2', 
          nombre: 'Hamburguesa con Queso', 
          precio: 8900, 
          descripcion: 'Hamburguesa de pan brioche con queso cheddar, carne de res de 50gr, salsa de tomate.',
          categoria: 'hamburguesas',
          imagen: hamburguesa2
        },
        'hamburguesa3': { 
          id: 'hamburguesa3', 
          nombre: 'Hamburguesa Deluxe', 
          precio: 10900, 
          descripcion: 'Hamburguesa deluxe de pan con ajonjolí, hoja de lechuga fresca, 2 rodajas de tomate, carne de res 50gr, queso cheddar, salsa de tomate y pepinillos',
          categoria: 'hamburguesas',
          imagen: hamburguesa3
        },
        'hamburguesa4': { 
          id: 'hamburguesa4', 
          nombre: 'BBQ Crispy', 
          precio: 18000, 
          descripcion: 'Hamburguesa de pan brioche con carne de res 50gr jugosa, queso cheddar, tocineta, aros de cebolla fritos, salsa BBQ y mayonesa.',
          categoria: 'hamburguesas',
          imagen: hamburguesa4
        },
        'hamburguesa5': { 
          id: 'hamburguesa5', 
          nombre: 'Clásico Bacon', 
          precio: 22500, 
          descripcion: 'Hamburguesa de pan brioche con carne de res 50gr, queso suizo, hoja de lechuga crespa, 2 tiras de tocineta, 2 rodajas de tomate, 2 rodajas de cebolla morada, 2 pepinillos en rodajas.',
          categoria: 'hamburguesas',
          imagen: hamburguesa5
        },
        'hamburguesa6': { 
          id: 'hamburguesa6', 
          nombre: 'Madurita Burger', 
          precio: 24500, 
          descripcion: 'Hamburguesa de pan brioche con carne de res de 50gr, queso cheddar, 2 tiras de tocineta, tajadas de platano frito y salsa de tomate',
          categoria: 'hamburguesas',
          imagen: hamburguesa6
        },
        'hamburguesa7': { 
          id: 'hamburguesa7', 
          nombre: 'BBQ Crunch Burger', 
          precio: 27000, 
          descripcion: 'Hamburguesa de pan brioche con carne de res 50gr, queso cheddar, tiras de tocineta, aros de cebolla apanadas y salsa de tomate',
          categoria: 'hamburguesas',
          imagen: hamburguesa7
        },
        'hamburguesa8': { 
          id: 'hamburguesa8', 
          nombre: 'Double Smash', 
          precio: 30000, 
          descripcion: 'Hamburguesa de pan brioche con doble carne de res de 50gr, doble queso cheddar, tocineta crujiente, cebolla crujiente, salsa BBQ y de tomate. ',
          categoria: 'hamburguesas',
          imagen: hamburguesa8
        },

        'pizza1': { 
          id: 'pizza1', 
          nombre: 'Pizza Hawaiana', 
          precio: 32000, 
          descripcion: 'Pizza Tradicional de jamón con trozos de piña jugosa y una capa de queso mozzarella derretida, salsa de tomate y masa tradicional.',
          categoria: 'pizzas',
          imagen: pizza1
        },
        'pizza2': { 
          id: 'pizza2', 
          nombre: 'Pizza de Queso', 
          precio: 34900, 
          descripcion: 'Pizza de queso mozzarella derretido con salsa de tomate tradicional',
          categoria: 'pizzas',
          imagen: pizza2
        },
        'pizza3': { 
          id: 'pizza3', 
          nombre: 'Pizza de Pepperoni', 
          precio: 36900, 
          descripcion: 'Pizza de pepperoni con queso mozzarella derretido con salsa de tomate tradicional',
          categoria: 'pizzas',
          imagen: pizza3
        },
        'pizza4': { 
          id: 'pizza4', 
          nombre: 'Pizza Aromática de Pepperoni', 
          precio: 38000, 
          descripcion: 'Pizza de pepperoni con queso mozzarella derretido con salsa de tomate tradicional y hierbas aromáticas',
          categoria: 'pizzas',
          imagen: pizza4
        },
        'pizza5': { 
          id: 'pizza5', 
          nombre: 'Pizza de Pollo y Champiñones', 
          precio: 38000, 
          descripcion: 'Pizza de pollo y champiñones, queso mozzarella derritido con salsa de tomate tradicional',
          categoria: 'pizzas',
          imagen: pizza5
        },
        'pizza6': { 
          id: 'pizza6', 
          nombre: 'Pepperoni Lovers', 
          precio: 40900, 
          descripcion: 'Pizza de pepperoni con champiñones, tiras de pimentones rojas y verdes, maicitos, queso mozzarella derritido con salsa de tomate tradicional',
          categoria: 'pizzas',
          imagen: pizza6
        },
        'pizza7': { 
          id: 'pizza7', 
          nombre: 'Pizza Campesina', 
          precio: 41500, 
          descripcion: 'Pizza campesina con pepperoni en rodajas, aceitunas negras en rodajas, champiñones, queso mozzarella, maiz tierno, pimentón rojo, aros de jalapeño y salsa de tomate italiana con especias',
          categoria: 'pizzas',
          imagen: pizza7
        },

        'pollo1': { 
          id: 'pollo1', 
          nombre: 'Alitas Simples', 
          precio: 12000, 
          descripcion: 'Alitas apanadas',
          categoria: 'pollo',
          imagen: pollo1
        },
        'pollo2': { 
          id: 'pollo2', 
          nombre: 'Alitas Crocantes', 
          precio: 12900, 
          descripcion: 'Alitas crujientes',
          categoria: 'pollo',
          imagen: pollo2
        },
        'pollo3': { 
          id: 'pollo3', 
          nombre: 'Alitas BBQ', 
          precio: 16000, 
          descripcion: 'Alitas apanadas con salsa BBQ',
          categoria: 'pollo',
          imagen: pollo3
        },
        'pollo4': { 
          id: 'pollo4', 
          nombre: 'Alitas Teriyaki', 
          precio: 16500, 
          descripcion: 'Alitas apanadas con salsa teriyaki',
          categoria: 'pollo',
          imagen: pollo4
        },
        'pollo5': { 
          id: 'pollo5', 
          nombre: 'Alitas Ajo Parmesano', 
          precio: 18000, 
          descripcion: 'Alitas apanadas con ajo y parmesano',
          categoria: 'pollo',
          imagen: pollo5
        },
        'pollo6': { 
          id: 'pollo6', 
          nombre: 'Alitas Barbacoa', 
          precio: 18000, 
          descripcion: 'Alitas apanadas con salsa barbacoa',
          categoria: 'pollo',
          imagen: pollo6
        },

        'perro1': { 
          id: 'perro1', 
          nombre: 'Perro Clásico', 
          precio: 7000, 
          descripcion: 'Perro Caliente Tradicional con salchicha, ensalada de repollo cremosa, salsa de tomate y mostaza',
          categoria: 'perros',
          imagen: perro1
        },
        'perro2': { 
          id: 'perro2', 
          nombre: 'Perro Crocante', 
          precio: 12000, 
          descripcion: 'Perro Caliente Crujiente con salchica, queso mozzarella derretido y trozos de tocineta',
          categoria: 'perros',
          imagen: perro2
        },
        'perro3': { 
          id: 'perro3', 
          nombre: 'Perro Supremo', 
          precio: 14000, 
          descripcion: 'Perro Crunch con salchicha, queso mozzarella rayado, salsa de tomate, maicitos, mostaza y cebolla gratinada',
          categoria: 'perros',
          imagen: perro3
        },
        'perro4': { 
          id: 'perro4', 
          nombre: 'Perro Crunch', 
          precio: 16000, 
          descripcion: 'Perro Crunch con salchicha, queso mozzarella derretido, salsa de tomate, trozos de tocineta, ripio de papas y trozos de jamón',
          categoria: 'perros',
          imagen: perro4
        },
        'perro5': { 
          id: 'perro5', 
          nombre: 'Perro Fresh', 
          precio: 18000, 
          descripcion: 'Perro Caliente con salchicha, ',
          categoria: 'perros',
          imagen: perro5
        },

        'postres1': { 
          id: 'postres1', 
          nombre: 'Cono de Vainilla', 
          precio: 4500, 
          descripcion: 'Cono sabor a Vainilla',
          categoria: 'postres',
          imagen: postres1
        },
        'postres2': { 
          id: 'postres2', 
          nombre: 'Cono de Vainilla y Chocolate', 
          precio: 4500, 
          descripcion: 'Cono sabor a Vainilla y Chocolate',
          categoria: 'postres',
          imagen: postres2
        },
        'postres3': { 
          id: 'postres3', 
          nombre: 'Cono de Fresa', 
          precio: 4500, 
          descripcion: 'Cono sabor a Fresa',
          categoria: 'postres',
          imagen: postres3
        },
        'postres4': { 
          id: 'postres4', 
          nombre: 'Cono de Chocolate', 
          precio: 4500, 
          descripcion: 'Cono sabor a Chocolate',
          categoria: 'postres',
          imagen: postres4
        },
        'postres5': { 
          id: 'postres5', 
          nombre: 'Sundae de Arequipe', 
          precio: 6000, 
          descripcion: 'Sundae sabor a Arequipe',
          categoria: 'postres',
          imagen: postres5
        },
        'postres6': { 
          id: 'postres6', 
          nombre: 'Sundae de Fresa', 
          precio: 6000, 
          descripcion: 'Sundae sabor a Fresa',
          categoria: 'postres',
          imagen: postres6
        },
        'postres7': { 
          id: 'postres7', 
          nombre: 'Sundae de Chocolate', 
          precio: 6000, 
          descripcion: 'Sundae sabor a Chocolate',
          categoria: 'postres',
          imagen: postres7
        },
        'postres8': { 
          id: 'postres8', 
          nombre: 'Sundae de Caramelo', 
          precio: 6000, 
          descripcion: 'Sundae sabor a Caramelo',
          categoria: 'postres',
          imagen: postres8
        },

        'papas1': { 
          id: 'papas1', 
          nombre: 'Papas Fritas', 
          precio: 3500, 
          descripcion: 'Papas Fritas Clásicas',
          categoria: 'papas',
          imagen: papas1
        },
        'papas2': { 
          id: 'papas2', 
          nombre: 'Aros de Cebolla', 
          precio: 3500, 
          descripcion: 'Aros de Cebolla Clásicos',
          categoria: 'papas',
          imagen: papas2
        },
        'papas3': { 
          id: 'papas3', 
          nombre: 'Nuggets de Pollo', 
          precio: 3500, 
          descripcion: 'Nuggets de Pollo Clásicos',
          categoria: 'papas',
          imagen: papas3
        },

        'bebida1': { 
          id: 'bebida1', 
          nombre: 'Coca-Cola Personal', 
          precio: 4000, 
          descripcion: 'Bebida Gaseosa CocaCola Personal',
          categoria: 'bebidas',
          imagen: bebida1
        },
        'bebida2': { 
          id: 'bebida2', 
          nombre: 'Coca-Cola En Lata', 
          precio: 4500, 
          descripcion: 'Bebida Gaseosa CocaCola En Lata',
          categoria: 'bebidas',
          imagen: bebida2
        },
        'bebida3': { 
          id: 'bebida3', 
          nombre: 'Coca-Cola 3L', 
          precio: 7500, 
          descripcion: 'Bebida Gaseosa CocaCola 3L',
          categoria: 'bebidas',
          imagen: bebida3
        },
        'bebida4': { 
          id: 'bebida4', 
          nombre: 'Sprite Personal', 
          precio: 4000, 
          descripcion: 'Bebida Gaseosa Sprite Personal',
          categoria: 'bebidas',
          imagen: bebida4
        },
        'bebida5': { 
          id: 'bebida5', 
          nombre: 'Sprite En Lata', 
          precio: 4500, 
          descripcion: 'Bebida Gaseosa Sprite En Lata',
          categoria: 'bebidas',
          imagen: bebida5
        },
        'bebida6': { 
          id: 'bebida6', 
          nombre: 'Sprite 3L', 
          precio: 7500, 
          descripcion: 'Bebida Gaseosa Sprite 3L',
          categoria: 'bebidas',
          imagen: bebida6
        },
        'bebida7': { 
          id: 'bebida7', 
          nombre: 'Pepsi Personal', 
          precio: 4000, 
          descripcion: 'Bebida Gaseosa Pepsi Personal',
          categoria: 'bebidas',
          imagen: bebida7
        },
        'bebida8': { 
          id: 'bebida8', 
          nombre: 'Pepsi En Lata', 
          precio: 4500, 
          descripcion: 'Bebida Gaseosa Pepsi En Lata',
          categoria: 'bebidas',
          imagen: bebida8
        },
        'bebida9': { 
          id: 'bebida9', 
          nombre: 'Pepsi 3L', 
          precio: 7500, 
          descripcion: 'Bebida Gaseosa Pepsi 3L',
          categoria: 'bebidas',
          imagen: bebida9
        }
      };

      const productoSeleccionado = productosLocales[id];
      if (productoSeleccionado) {
        setProducto(productoSeleccionado);
      } else {
        setProducto(null);
      }
      setLoading(false);
    };

    if (id) {
      cargarProducto();
    }
  }, [id]);

  // Resetear tamaño seleccionado cuando cambia el producto
  useEffect(() => {
    if (producto && producto.categoria === 'pizzas' && tamaños[producto.id]) {
      // Siempre resetear a 'pequeña' cuando cambia el producto
      setTamañoSeleccionado('pequeña');
    }
  }, [producto?.id]);


  useEffect(() => {
    if (producto && producto.categoria === 'pollos' && tamaños[producto.id]) {
      setTipoPolloSeleccionado('alitas1');
    }
  }, [producto?.id]);

  const categoria = producto?.categoria || '';

  const handleVolver = () => {
    const ultimaCategoria = sessionStorage.getItem('ultimaCategoria') || 'hamburguesas';
    navigate(`/menu?categoria=${ultimaCategoria}`);
  };

  const agregarAlCarrito = () => {
    if (!producto) return;

    const categoriaActual = producto.categoria || '';
    let precioFinal = producto.precio;
    let nombreProducto = producto.nombre;
    let tamañoNombre = null;
    let tipoPolloNombre = null;

    if (categoriaActual === 'pizzas') {
      const tamañoActual = tamaños[producto.id]?.find(t => t.id === tamañoSeleccionado);
      if (tamañoActual) {
        precioFinal = tamañoActual.precio;
        nombreProducto = `${producto.nombre} (${tamañoActual.nombre})`;
        tamañoNombre = tamañoActual.nombre;
      }
    }

    if (categoriaActual === 'pollo') {
      const tipoActual = tiposPollo[producto.id]?.find(t => t.id === tipoPolloSeleccionado);
      if (tipoActual) {
        precioFinal = tipoActual.precio;
        nombreProducto = `${producto.nombre} (${tipoActual.nombre})`;
        tipoPolloNombre = tipoActual.nombre;
      }
    }

    const detalles = {
      ...(tamañoNombre && { tamaño: tamañoNombre }),
      ...(tipoPolloNombre && { presentacion: tipoPolloNombre })
    };

    const productoParaCarrito = {
      id: producto.id,
      nombre: nombreProducto,
      precio: precioFinal,
      imagen: producto.imagen,
      cantidad: 1,
      precioTotal: precioFinal,
      categoria: categoriaActual,
      ...(Object.keys(detalles).length ? { detalles } : {})
    };

    addToCart(productoParaCarrito);
  };
  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  return ( 
    <div className="producto-detalle-container">
      <button className="regresar-btn" onClick={handleVolver}>
        ← Regresar
      </button>

      <div className="detalle-content">
        <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />

          <div className="producto-info">
            <h1 className="producto-nombre">{producto.nombre}</h1>
          <p className="producto-descripcion">{producto.descripcion}</p>
          
          <p className="producto-precio">
            {categoria === 'pizzas'
              ? `$${(tamaños[producto.id]?.find(t => t.id === tamañoSeleccionado)?.precio || producto.precio).toLocaleString('es-CO')}`
              : categoria === 'pollo'
              ? `$${(tiposPollo[producto.id]?.find(t => t.id === tipoPolloSeleccionado)?.precio || producto.precio).toLocaleString('es-CO')}`
              : `$${producto.precio.toLocaleString('es-CO')}`
            }
          </p>

          {categoria === 'pizzas' && (
            <div className="opciones-tamano">
              <h4>Selecciona el tamaño:</h4>
              {tamaños[producto.id]?.map(tamano => (
                <label key={tamano.id} className="opcion-tamano">
                  <input
                    type="radio"
                    name="tamano"
                    value={tamano.id}
                    checked={tamañoSeleccionado === tamano.id}
                    onChange={() => setTamañoSeleccionado(tamano.id)}
                  />
                  <span>{tamano.nombre} - ${tamano.precio.toLocaleString('es-CO')}</span>
                </label>
              ))}
            </div>
          )}
          {categoria === 'pollo' && (
            <div className="opciones-tamano">
              <h4>Selecciona la presentación:</h4>
              {tiposPollo[producto.id]?.map(tipo => (
                <label key={tipo.id} className="opcion-tamano">
                  <input
                    type="radio"
                    name="tipoPollo"
                    value={tipo.id}
                    checked={tipoPolloSeleccionado === tipo.id}
                    onChange={() => setTipoPolloSeleccionado(tipo.id)}
                  />
                  <span>{tipo.nombre} - ${tipo.precio.toLocaleString('es-CO')}</span>
                </label>
              ))}
            </div>
          )}

          <button className="agregar-carrito-btn" onClick={agregarAlCarrito}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;