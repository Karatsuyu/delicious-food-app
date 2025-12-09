import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { productService } from '../api/api';
import { useCart } from '../context/CartContext';
import './Personalizador.css';
import { useNotification } from '../context/NotificationContext';
// Importar imágenes para el mapeo de hamburguesas
import aceitunasImg from '../assets/aceitunas.png';
import baconImg from '../assets/bacon.png';
import briocheImg from '../assets/brioche.png';
import cebollaImg from '../assets/cebolla.png';
import quesoImg from '../assets/queso.png';
import carneBisonteImg from '../assets/carne de bisonte.png';
import tomateImg from '../assets/tomate.png';
import cerdoImg from '../assets/cerdo.png';
import champiñonImg from '../assets/champiñon.png';
import corderoImg from '../assets/cordero.png';
import garbanzosImg from '../assets/garbanzos.png';
import lechugaImg from '../assets/lechuga.png';
import lentejasImg from '../assets/lentejas.png';
import pepinoImg from '../assets/pepino.png';
import madreImg from '../assets/madre.png';
import moradaImg from '../assets/morada.png';
import muffinImg from '../assets/muffin.png';
import multigranoImg from '../assets/multigrano.png';
import papaImg from '../assets/papa.png';
import pavoImg from '../assets/pavo.png';
import peperoniImg from '../assets/peperoni.png';
import pretzelImg from '../assets/pretzel.png';
import resImg from '../assets/res.png';
import seitanImg from '../assets/seitan.png';
import sesamoImg from '../assets/sesamo.png';
import singlutenImg from '../assets/sin gluten.png';
import venadoImg from '../assets/venado.png';
import veganoImg from '../assets/vegano.png';
import hamburguesaImg from '../assets/hamburguesa.png';
import pizza1Img from '../assets/pizza1.png';
import perroImg from '../assets/perro.png';
import polloImg from '../assets/pollo.png';
import postresImg from '../assets/postres1.png';








// Mapeo de ingredientes a imágenes (solo para hamburguesas)
const ingredientImagesMap = {
  // Panes
  'pan brioche': briocheImg,
  'pan clasico': sesamoImg,
  'pan de papa': papaImg,
  'pan pretzel': pretzelImg,
  'pan masa madre': madreImg,
  'pan multigrano': multigranoImg,
  'pan muffin': muffinImg,
  'pan sin gluten': singlutenImg,
  'pan vegano': veganoImg,

  // Carnes
  'carne de res': resImg,
  'carne de bisonte': carneBisonteImg,
  'carne de pavo': pavoImg,
  'carne de cordero': corderoImg,
  'carne de venado': venadoImg,
  'carne de cerdo': cerdoImg,
  'carne de garbanzos vegana': garbanzosImg,
  'carne de lentejas vegana': lentejasImg,
  'carne de seitan': seitanImg,

  // Ingredientes
  'queso': quesoImg,
  'tomate': tomateImg,
  'lechuga': lechugaImg,
  'cebolla': cebollaImg,
  'pepperoni': peperoniImg,
  'champiñones': champiñonImg,
  'pepino': pepinoImg,
  'bacon': baconImg,
  'cebolla morada': moradaImg,
  'aceitunas': aceitunasImg,
};

// Función helper para obtener la imagen de un ingrediente
// Solo aplica el mapeo si la categoría es "hamburguesas"
const getIngredientImage = (ingredienteId, categoria) => {
  // Solo aplicar el mapeo si es para hamburguesas
  if (categoria === 'hamburguesas' || categoria === 'hamburguesa') {
    // Buscar en el mapeo específico
    if (ingredientImagesMap[ingredienteId]) {
      return ingredientImagesMap[ingredienteId];
    }
    // Fallback a imagen base de hamburguesa
    return hamburguesaImg;
  }
  
  // Para otras categorías, retornar imagen base de hamburguesa como fallback
  return hamburguesaImg;
};

// Función para obtener la imagen de la categoría para el carrito
const getCategoryImage = (categoria) => {
  const cat = categoria?.toLowerCase();
  
  // Usar imágenes representativas según la categoría
  switch (cat) {
    case 'hamburguesas':
    case 'hamburguesa':
      return hamburguesaImg;
    case 'pizzas':
    case 'pizza':
      return pizza1Img;
    case 'perros':
    case 'perro':
      return perroImg;
    case 'pollo':
    case 'alitas':
      return polloImg;
    case 'postres':
    case 'postre':
      return postresImg;
    default:
      return hamburguesaImg;
  }
};

const Personalizador = () => {
  const { categoria: categoriaParam } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showSuccess } = useNotification();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Normalizar la categoría (perro -> perros, postre -> postres)
  const categoria = categoriaParam === 'perro' ? 'perros' : 
                    categoriaParam === 'postre' ? 'postres' : 
                    categoriaParam;
  
  // ✅ Estado actualizado: añadimos "pan", "masa" y "nombrePersonalizado"
  const [personalizacion, setPersonalizacion] = useState({
    tamaño: '',
    pan: '',
    masa: '',
    carnes: [],
    ingredientes: [],
    extras: [],
    cantidad: 1,
    observaciones: '',
    nombrePersonalizado: ''
  });

  // Estado para animaciones de ingredientes (imágenes cayendo)
  const [animatingIngredients, setAnimatingIngredients] = useState([]);

  // Referencia al visualizador del producto
  const productViewerRef = useRef(null);

  // Estado para los ingredientes ya colocados en la hamburguesa
  const [stackedIngredients, setStackedIngredients] = useState([]);
  // Contador para el orden z-index de los ingredientes
  const [zIndexCounter, setZIndexCounter] = useState(0);

  // Función para obtener la posición del visualizador
  const getViewerPosition = () => {
    if (productViewerRef.current) {
      const rect = productViewerRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  };

  // Función para animar un ingrediente al caer
  const animateIngredient = (ingredient) => {
    const viewerPos = getViewerPosition();
    const newZIndex = zIndexCounter + 1;

    // Asignar zIndex y posición para la animación
    const animatedIngredient = {
      ...ingredient,
      id: `${ingredient.id}-${Date.now()}`,
      zIndex: newZIndex,
      style: {
        '--target-x': `${viewerPos.x}px`,
        '--target-y': `${viewerPos.y}px`,
      },
    };

    // Agregar a los ingredientes animados
    setAnimatingIngredients((prev) => [...prev, animatedIngredient]);
    setZIndexCounter(newZIndex);

    // Después de duración de la animación, remover de animating y agregar a stacked
    setTimeout(() => {
      setAnimatingIngredients((prev) =>
        prev.filter((ing) => ing.id !== animatedIngredient.id)
      );
      setStackedIngredients((prev) => [...prev, animatedIngredient]);
    }, 4000);
  };

  
  // Cargar producto desde la API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);

        // Intentar cargar desde la API
        try {
          const productos = await productService.getAllProducts();
          const productoEncontrado = productos.find(
            (p) =>
              p.id === categoria ||
              p.categoria === categoria ||
              p.id === categoriaParam ||
              p.categoria === categoriaParam
          );
          if (productoEncontrado) {
            setProducto(productoEncontrado);
          } else {
            // Si no se encuentra, usar datos locales como fallback
            const productosLocales = {
              hamburguesas: {
                id: 'hamburguesa1',
                nombre: 'Hamburguesa Clásica',
                precio: 0,
                descripcion: 'Hamburguesa tradicional',
                categoria: 'hamburguesas',
              },
              pizzas: {
                id: 'pizza1',
                nombre: 'Pizza Hawaiana',
                precio: 32000,
                descripcion: 'Pizza con jamón y piña',
                categoria: 'pizzas',
              },
              pollo: {
                id: 'pollo1',
                nombre: 'Alitas Simples',
                precio: 12000,
                descripcion: 'Alitas de pollo tradicionales',
                categoria: 'pollo',
              },
              perros: {
                id: 'perro1',
                nombre: 'Perro Clásico',
                precio: 9000,
                descripcion: 'Perro caliente tradicional',
                categoria: 'perros',
              },
              perro: {
                id: 'perro1',
                nombre: 'Perro Clásico',
                precio: 9000,
                descripcion: 'Perro caliente tradicional',
                categoria: 'perros',
              },
              postres: {
                id: 'postre1',
                nombre: 'Brownie Clásico',
                precio: 8000,
                descripcion: 'Delicioso brownie casero',
                categoria: 'postres',
              },
              postre: {
                id: 'postre1',
                nombre: 'Brownie Clásico',
                precio: 8000,
                descripcion: 'Delicioso brownie casero',
                categoria: 'postres',
              },
            };
            const productoSeleccionado =
              productosLocales[categoria] || productosLocales[categoriaParam];
            if (productoSeleccionado) {
              setProducto(productoSeleccionado);
            } else {
              setProducto(null);
            }
          }
        } catch (apiError) {
          console.error('Error cargando desde API:', apiError);
          // Fallback a datos locales
          const productosLocales = {
            hamburguesas: {
              id: 'hamburguesa1',
              nombre: 'Hamburguesa Clásica',
              precio: 0,
              descripcion: 'Hamburguesa tradicional',
              categoria: 'hamburguesas',
            },
            pizzas: {
              id: 'pizza1',
              nombre: 'Pizza Hawaiana',
              precio: 0,
              descripcion: 'Pizza con jamón y piña',
              categoria: 'pizzas',
            },
            pollo: {
              id: 'pollo1',
              nombre: 'Alitas Simples',
              precio: 0,
              descripcion: 'Alitas de pollo tradicionales',
              categoria: 'pollo',
            },
            perros: {
              id: 'perro1',
              nombre: 'Perro Clásico',
              precio: 0,
              descripcion: 'Perro caliente tradicional',
              categoria: 'perros',
            },
            perro: {
              id: 'perro1',
              nombre: 'Perro Clásico',
              precio: 0,
              descripcion: 'Perro caliente tradicional',
              categoria: 'perros',
            },
            postres: {
              id: 'postre1',
              nombre: 'Brownie Clásico',
              precio: 0,
              descripcion: 'Delicioso brownie casero',
              categoria: 'postres',
            },
          };
          const productoSeleccionado =
            productosLocales[categoria] || productosLocales[categoriaParam];
          if (productoSeleccionado) {
            setProducto(productoSeleccionado);
          } else {
            setProducto(null);
          }
        }
      } catch (error) {
        console.error('Error general:', error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    if (categoria || categoriaParam) {
      fetchProducto();
    }
  }, [categoria, categoriaParam]);

  const pan = [
    { id: 'pan brioche', nombre: 'Pan brioche francés', precio: 1200 },
    { id: 'pan clasico', nombre: 'Pan clasico con semillas sésamo', precio: 1000 },
    { id: 'pan de papa', nombre: 'Pan de papa suave', precio: 1000 },
    { id: 'pan pretzel', nombre: 'Pan pretzel', precio: 1300 },
    { id: 'pan masa madre', nombre: 'Pan de masa madre', precio: 1400 },
    { id: 'pan multigrano', nombre: 'Pan multigrano', precio: 1300 },
    { id: 'pan muffin', nombre: 'Pan ingles Muffin', precio: 1200 },
    { id: 'pan sin gluten', nombre: 'Pan sin gluten', precio: 1500 },
    { id: 'pan vegano', nombre: 'Pan Vegano', precio: 1400 },
  ];

  const carnes = [
    { id: 'carne de res', nombre: 'Carne de Res', precio: 1800},
    { id: 'carne de pavo', nombre: 'Carne de Pavo', precio: 2800},
    { id: 'carne de bisonte', nombre: 'Carne de Bisonte', precio: 3200},
    { id: 'carne de cordero', nombre: 'Carne de Cordero', precio: 2500},
    { id: 'carne de venado', nombre: 'Carne de Venado', precio: 2800},
    { id: 'carne de cerdo', nombre: 'Carne de Cerdo', precio: 2000},
    { id: 'carne vegana', nombre: 'Carne de Garbanzos Vegana', precio: 900},
    { id: 'carne vegana1', nombre: 'Carne de Lentejas Vegana', precio: 900},
    { id: 'carne de seitan', nombre: 'Carne de Seitán', precio: 1500}
  ];


  // === PIZZAS ===
  const masasPizza = [
    { id: 'tradicional', nombre: 'Masa Tradicional', precio: 800 },
    { id: 'fina', nombre: 'Masa Fina', precio:1000},
    { id: 'gruesa', nombre: 'Masa Gruesa', precio: 1200 },
    { id: 'sin_gluten', nombre: 'Masa Sin Gluten', precio: 1500 },
    { id: 'integral', nombre: 'Masa Integral', precio: 1800 },
  ];

  const tamaños = [
    { id: 'pequeño', nombre: 'Pequeño', precio: 3000},
    { id: 'mediano', nombre: 'Mediano', precio: 3500 },
    { id: 'grande', nombre: 'Grande', precio: 5000 }
  ];

  const quesosPizza = [
    { id: 'mozzarella', nombre: 'Mozzarella', precio: 500 },
    { id: 'cheddar', nombre: 'Cheddar', precio: 800 },
    { id: 'parmesano', nombre: 'Parmesano', precio: 900 },
    { id: 'vegano', nombre: 'Queso Vegano', precio: 1200 },
  ];

  const carnesPizza = [
    { id: 'pepperoni', nombre: 'Pepperoni', precio: 2000 },
    { id: 'jamón', nombre: 'Jamón', precio: 2000 },
    { id: 'pollo', nombre: 'Pollo', precio: 2000 },
    { id: 'salami', nombre: 'Salami', precio: 2000 },
    { id: 'vegetal', nombre: 'Proteína Vegetal', precio: 2000 },
  ];

  // === POLLO ===
  const tiposPollo = [
    { id: 'alitas', nombre: 'Alitas', precio: 1500 },
    { id: 'muslos', nombre: 'Muslos', precio: 1700 },
    { id: 'pechuga', nombre: 'Pechuga a la parrilla', precio: 2000 },
    { id: 'nuggets', nombre: 'Nuggets', precio: 1200 },
  ];

  const salsasPollo = [
    { id: 'bbq', nombre: 'BBQ', precio: 500 },
    { id: 'ajo', nombre: 'Ajo y perejil', precio: 500 },
    { id: 'picante', nombre: 'Picante', precio: 500 },
    { id: 'miel_mostaza', nombre: 'Miel y mostaza', precio: 500 },
    { id: 'ranch', nombre: 'Ranch', precio: 500 },
  ];

  // === PERROS CALIENTES ===
  const tiposPerro = [
    { id: 'clasico', nombre: 'Clásico', precio: 1000 },
    { id: 'ranchero', nombre: 'Ranchero', precio: 1200 },
    { id: 'hawaiano', nombre: 'Hawaiano', precio: 1400 },
    { id: 'tocineta', nombre: 'Con tocineta', precio: 1600 },
    { id: 'vegetariano', nombre: 'Vegetariano', precio: 1900 },
  ];

  const complementosPerro = [
    { id: 'queso', nombre: 'Queso derretido', precio: 1000 },
    { id: 'tocineta', nombre: 'Tocineta crujiente', precio: 1000 },
    { id: 'piña', nombre: 'Piña', precio: 500 },
    { id: 'champiñones', nombre: 'Champiñones', precio: 500 },
    { id: 'cebolla morada', nombre: 'Cebolla morada', precio: 500 },
    { id: 'aceitunas', nombre: 'Aceitunas', precio: 500 },
    { id: 'cebolla', nombre: 'Cebolla Gratinada', precio: 500 },
  ];

  const salsasPerros = [
    { id: 'bbq', nombre: 'BBQ', precio: 500 },
    { id: 'ajo', nombre: 'Ajo', precio: 500 },
    { id: 'picante', nombre: 'Picante', precio: 500 },
    { id: 'miel_mostaza', nombre: 'Miel y mostaza', precio: 500 },
    { id: 'ranch', nombre: 'Ranch', precio: 500 },
    { id: 'rosada', nombre: 'Rosada', precio: 500 },
    { id: 'chimichurri', nombre: 'Chimichurri', precio: 500 },
    { id: 'barbacoa', nombre: 'Barbacoa', precio: 500 },
    { id: 'tomate', nombre: 'Tomate', precio: 500 },
  ];

  // === POSTRES ===
  const tiposPostre = [
    { id: 'Conos con bolas', nombre: 'Helado 2 bolas', precio: 4500 },
    { id: 'Sundae de arequipe', nombre: 'Sundae sabor a arequipe', precio: 6000 },
    { id: 'Sundae de fresa', nombre: 'Sundae sabor a fresa', precio: 6000 },
    { id: 'Sundae de chocolate', nombre: 'Sundae sabor a chocolate', precio: 6000 },
    { id: 'Sundae de caramelo', nombre: 'Sundae sabor a caramelo', precio: 6000 },
  ];

  const agregadosPostre = [
    { id: 'crema', nombre: 'Crema batida', precio: 500 },
    { id: 'frutas', nombre: 'Frutas frescas', precio: 1000 },
    { id: 'chocolate', nombre: 'Salsa de chocolate', precio: 500 },
    { id: 'caramelo', nombre: 'Salsa de caramelo', precio: 500 },
    { id: 'mora', nombre: 'Salsa de mora', precio: 500 },
    { id: 'frutos rojos', nombre: 'Frutos rojos', precio: 1000 },
    { id: 'frutos secos', nombre: 'Frutos secos', precio: 1000 },
    { id: 'Mani', nombre: 'Mani', precio: 500 },
  ];

  const ingredientesDisponibles = [
    { id: 'queso', nombre: 'Queso', precio: 1500 },
    { id: 'tomate', nombre: 'Tomate', precio: 500 },
    { id: 'lechuga', nombre: 'Lechuga', precio: 500 },
    { id: 'cebolla', nombre: 'Cebolla', precio: 500 },
    { id: 'pepperoni', nombre: 'Pepperoni', precio: 2000 },
    { id: 'champiñones', nombre: 'Champiñones', precio: 1000 },
    { id: 'pepino', nombre: 'Pepino', precio: 500},
    { id: 'bacon', nombre: 'Bacon', precio: 2000},
    { id: 'cebolla morada', nombre: 'Cebolla Morada', precio: 500},
    { id: 'aceitunas', nombre: 'Aceitunas', precio: 500},
  ];

  const extrasDisponibles = [
    { id: 'kétchup', nombre: 'Kétchup', precio: 500 },
    { id: 'mayonesa', nombre: 'Mayonesa', precio: 500},
    { id: 'mostaza', nombre: 'Mostaza', precio: 500},
    { id: 'bbq', nombre: 'BBQ', precio: 500},
    { id: 'rosada', nombre: 'Rosada', precio: 500},
    { id: 'chimichurri', nombre: 'Chimichurri', precio: 500},
    { id: 'ajo', nombre: 'Ajo', precio: 500}
  ];

  
  // Función para construir las capas del producto visualmente
  const construirCapasProducto = () => {
    const capas = [];
    
    if (categoria === 'hamburguesas' || categoria === 'hamburguesa') {
      // Orden: pan inferior, carne, ingredientes, extras, pan superior
      if (personalizacion.pan) {
        const panNombre = pan.find(p => p.id === personalizacion.pan);
        capas.push({ 
          tipo: 'pan-inferior', 
          nombre: panNombre?.nombre || 'Pan',
          imagen: getIngredientImage(personalizacion.pan, categoria),
          zIndex: 1
        });
      }
      
      if (personalizacion.carnes) {
        const carne = carnes.find(c => c.id === personalizacion.carnes);
        if (carne) {
          capas.push({ 
            tipo: 'carne', 
            nombre: carne.nombre,
            imagen: getIngredientImage(personalizacion.carnes, categoria),
            zIndex: 2
          });
        }
      }
      
      personalizacion.ingredientes.forEach((ingId, index) => {
        const ing = ingredientesDisponibles.find(i => i.id === ingId);
        if (ing) {
          capas.push({ 
            tipo: 'ingrediente', 
            nombre: ing.nombre,
            imagen: getIngredientImage(ingId, categoria),
            zIndex: 3 + index
          });
        }
      });
      

      
      if (personalizacion.pan) {
        const panNombre = pan.find(p => p.id === personalizacion.pan);
        capas.push({ 
          tipo: 'pan-superior', 
          nombre: panNombre?.nombre || 'Pan',
          imagen: getIngredientImage(personalizacion.pan, categoria),
          zIndex: 5 + personalizacion.ingredientes.length + personalizacion.extras.length
        });
      }
    } else if (categoria === 'pizzas') {
      if (personalizacion.masa) {
        capas.push({ 
          tipo: 'masa', 
          nombre: masasPizza.find(m => m.id === personalizacion.masa)?.nombre || 'Masa',
          imagen: getIngredientImage(personalizacion.masa, categoria),
          zIndex: 1
        });
      }
      
      if (personalizacion.ingredientes[0]) {
        const queso = quesosPizza.find(q => q.id === personalizacion.ingredientes[0]);
        if (queso) {
          capas.push({ 
            tipo: 'queso', 
            nombre: queso.nombre,
            imagen: getIngredientImage(personalizacion.ingredientes[0], categoria),
            zIndex: 2
          });
        }
      }
      
      personalizacion.carnes.forEach((carneId, index) => {
        const carne = carnesPizza.find(c => c.id === carneId);
        if (carne) {
          capas.push({ 
            tipo: 'carne', 
            nombre: carne.nombre,
            imagen: getIngredientImage(carneId, categoria),
            zIndex: 3 + index
          });
        }
      });
    } else if (categoria === 'pollo') {
      if (personalizacion.carnes) {
        const tipo = tiposPollo.find(t => t.id === personalizacion.carnes);
        if (tipo) {
          capas.push({ 
            tipo: 'pollo', 
            nombre: tipo.nombre,
            imagen: getIngredientImage(personalizacion.carnes, categoria),
            zIndex: 1
          });
        }
      }
      
      personalizacion.extras.forEach((salsaId, index) => {
        const salsa = salsasPollo.find(s => s.id === salsaId);
        if (salsa) {
          capas.push({ 
            tipo: 'salsa', 
            nombre: salsa.nombre,
            imagen: getIngredientImage(salsaId, categoria),
            zIndex: 2 + index
          });
        }
      });
    } else if (categoria === 'perros') {
      if (personalizacion.carnes) {
        const tipo = tiposPerro.find(t => t.id === personalizacion.carnes);
        if (tipo) {
          capas.push({ 
            tipo: 'perro-base', 
            nombre: tipo.nombre,
            imagen: getIngredientImage(personalizacion.carnes, categoria),
            zIndex: 1
          });
        }
      }
      
      personalizacion.extras.forEach((extraId, index) => {
        const comp = complementosPerro.find(c => c.id === extraId) || salsasPerros.find(s => s.id === extraId);
        if (comp) {
          capas.push({ 
            tipo: 'complemento', 
            nombre: comp.nombre,
            imagen: getIngredientImage(extraId, categoria),
            zIndex: 2 + index
          });
        }
      });
    } else if (categoria === 'postres') {
      if (personalizacion.carnes) {
        const tipo = tiposPostre.find(t => t.id === personalizacion.carnes);
        if (tipo) {
          capas.push({ 
            tipo: 'postre-base', 
            nombre: tipo.nombre,
            imagen: getIngredientImage(personalizacion.carnes, categoria),
            zIndex: 1
          });
        }
      }
      
      personalizacion.extras.forEach((agregadoId, index) => {
        const agregado = agregadosPostre.find(a => a.id === agregadoId);
        if (agregado) {
          capas.push({ 
            tipo: 'agregado', 
            nombre: agregado.nombre,
            imagen: getIngredientImage(agregadoId, categoria),
            zIndex: 2 + index
          });
        }
      });
    }
    
    return capas;
  };

  const calcularPrecio = () => {
    if (!producto) {
      console.log('producto no encontrado');
      return 0;
    }

    // Para productos personalizados, no incluimos el precio base del producto
    // Solo contamos los precios de los ingredientes, tamaños y extras seleccionados
    const precioBase = 0; // Cambiado: era parseFloat(producto.precio) || 0;
    const precioTamaño = tamaños.find((t) => t.id === personalizacion.tamaño)
      ?.precio || 0;

    let precioExtrasTotal = 0;

    if (categoria === 'pizzas') {
      const precioMasa =
        masasPizza.find((m) => m.id === personalizacion.masa)?.precio || 0;
      const precioQueso =
        quesosPizza.find((q) => q.id === personalizacion.ingredientes[0])
          ?.precio || 0;
      const precioCarne = Array.isArray(personalizacion.carnes)
        ? personalizacion.carnes.reduce((sum, cId) => {
            const c = carnes.find((carne) => carne.id === cId);
            return sum + (c?.precio || 0);
          }, 0)
        : 0;
      precioExtrasTotal = precioMasa + precioQueso + precioCarne;
    } else if (categoria === 'pollo') {
      const precioSalsas = personalizacion.extras.reduce((sum, eId) => {
        const s = salsasPollo.find((s) => s.id === eId);
        return sum + (s?.precio || 0);
      }, 0);
      precioExtrasTotal = precioSalsas;
    } else if (categoria === 'perros') {
      const precioSalsas = personalizacion.extras.reduce((sum, eId) => {
        const c = salsasPerros.find((c) => c.id === eId);
        return sum + (c?.precio || 0);
      }, 0);
      precioExtrasTotal = precioSalsas;
    } else if (categoria === 'postres') {
      const precioAgregados = personalizacion.extras.reduce((sum, eId) => {
        const a = agregadosPostre.find((a) => a.id === eId);
        return sum + (a?.precio || 0);
      }, 0);
      precioExtrasTotal = precioAgregados;
    } else {
      // hamburguesas
      const precioPan = pan.find((p) => p.id === personalizacion.pan)?.precio || 0;
      const precioCarne = Array.isArray(personalizacion.carnes)
        ? personalizacion.carnes.reduce((sum, cId) => {
            const c = carnes.find((carne) => carne.id === cId);
            return sum + (c?.precio || 0);
          }, 0)
        : personalizacion.carnes
        ? carnes.find((carne) => carne.id === personalizacion.carnes)?.precio || 0
        : 0;
      const precioIngredientes = personalizacion.ingredientes.reduce(
        (sum, iId) => {
          const i = ingredientesDisponibles.find((ing) => ing.id === iId);
          return sum + (i?.precio || 0);
        },
        0
      );
      const precioExtras = personalizacion.extras.reduce((sum, eId) => {
        const e = extrasDisponibles.find((extra) => extra.id === eId);
        return sum + (e?.precio || 0);
      }, 0);
      precioExtrasTotal = precioPan + precioCarne + precioIngredientes + precioExtras;
    }

    return (precioBase + precioTamaño + precioExtrasTotal) * personalizacion.cantidad;
  };

  const handlepanChange = (panId) => {
    setPersonalizacion((prev) => ({ ...prev, pan: panId }));

    // Animar pan cayendo
    const panSeleccionado = pan.find((p) => p.id === panId);
    if (panSeleccionado) {
      animateIngredient({
        id: panId,
        tipo: 'pan-inferior',
        nombre: panSeleccionado.nombre,
        imagen: getIngredientImage(panId, categoria),
      });
    }
  };

  const handleTamañoChange = (tamaño) => {
    setPersonalizacion(prev => ({ ...prev, tamaño }));
  };

  const handleCarnesChange = (carneId) => {
    const isAdding =
      categoria === 'hamburguesas' || categoria === 'hamburguesa'
        ? !personalizacion.carnes || personalizacion.carnes !== carneId
        : !personalizacion.carnes || (Array.isArray(personalizacion.carnes) ? !personalizacion.carnes.includes(carneId) : true);

    setPersonalizacion((prev) => {
      if (categoria === 'hamburguesas' || categoria === 'hamburguesa') {
        // Para hamburguesas, solo una carne (radio button)
        return { ...prev, carnes: carneId };
      } else {
        // Para pizzas, múltiples carnes (checkbox)
        const carnesActuales = Array.isArray(prev.carnes) ? prev.carnes : [];
        const yaSeleccionada = carnesActuales.includes(carneId);

        let nuevasCarnes;
        if (yaSeleccionada) {
          nuevasCarnes = carnesActuales.filter((id) => id !== carneId);
        } else {
          nuevasCarnes = [...carnesActuales, carneId];
        }

        return { ...prev, carnes: nuevasCarnes };
      }
    });

    // Animar carne cayendo solo para hamburguesas
    if ((categoria === 'hamburguesas' || categoria === 'hamburguesa') && isAdding) {
      const carneSeleccionada = carnes.find((c) => c.id === carneId);
      if (carneSeleccionada) {
        animateIngredient({
          id: carneId,
          tipo: 'carne',
          nombre: carneSeleccionada.nombre,
          imagen: getIngredientImage(carneId, categoria),
        });
      }
    }
  };

  const handleIngredienteToggle = (ingredienteId) => {
    const isAdding = !personalizacion.ingredientes.includes(ingredienteId);
    
    setPersonalizacion(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.includes(ingredienteId)
        ? prev.ingredientes.filter(id => id !== ingredienteId)
        : [...prev.ingredientes, ingredienteId]
    }));

    // Activar animación solo cuando se agrega un ingrediente
    if (isAdding) {
      const ingrediente = ingredientesDisponibles.find(i => i.id === ingredienteId);
      if (ingrediente) {
        const animationId = `ing-${ingredienteId}-${Date.now()}`;
        setAnimatingIngredients(prev => [...prev, { 
          id: animationId, 
          nombre: ingrediente.nombre, 
          tipo: 'ingrediente',
          imagen: getIngredientImage(ingredienteId, categoria)
        }]);
        
        // Remover la animación después de que termine
        setTimeout(() => {
          setAnimatingIngredients(prev => prev.filter(anim => anim.id !== animationId));
        }, 4000);
      }
    }
  };

  const handleExtraToggle = (extraId) => {
    const isAdding = !personalizacion.extras.includes(extraId);
    
    setPersonalizacion(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }));

    // Animación removida para extras de hamburguesas
  };

  const handleCantidadChange = (cantidad) => {
    setPersonalizacion(prev => ({ ...prev, cantidad: Math.max(1, cantidad) }));
  };

  const handleObservacionesChange = (e) => {
    setPersonalizacion(prev => ({ ...prev, observaciones: e.target.value }));
  };

  // PIZZA
  const handleMasaChange = (masaId) => {
    setPersonalizacion(prev => ({ ...prev, masa: masaId }));
    // Animación removida
  };

  const handleQuesoChange = (quesoId) => {
    setPersonalizacion(prev => ({ ...prev, ingredientes: [quesoId] }));
    // Animación removida
  };

  // POLLO
  const handleTipoPolloChange = (tipoId) => {
    setPersonalizacion(prev => ({ ...prev, carnes: tipoId }));
    // Animación removida
  };

  const handleSalsaPolloToggle = (salsaId) => {
    setPersonalizacion(prev => ({
      ...prev,
      extras: prev.extras.includes(salsaId)
        ? prev.extras.filter(id => id !== salsaId)
        : [...prev.extras, salsaId]
    }));
    // Animación removida
  };

  // PERROS
  const handleTipoPerroChange = (tipoId) => {
    setPersonalizacion(prev => ({ ...prev, carnes: tipoId }));
    // Animación removida
  };

  const handleComplementoPerroToggle = (compId) => {
    setPersonalizacion(prev => ({
      ...prev,
      extras: prev.extras.includes(compId)
        ? prev.extras.filter(id => id !== compId)
        : [...prev.extras, compId]
    }));
    // Animación removida
  };

  const handleSalsaPerroToggle = (salsaId) => {
    setPersonalizacion(prev => ({
      ...prev,
      extras: prev.extras.includes(salsaId)
        ? prev.extras.filter(id => id !== salsaId)
        : [...prev.extras, salsaId]
    }));
    // Animación removida
  };

  // POSTRES
  const handleTipoPostreChange = (tipoId) => {
    setPersonalizacion(prev => ({ ...prev, carnes: tipoId }));
    // Animación removida
  };

  const handleAgregadoPostreToggle = (agregadoId) => {
    setPersonalizacion(prev => ({
      ...prev,
      extras: prev.extras.includes(agregadoId)
        ? prev.extras.filter(id => id !== agregadoId)
        : [...prev.extras, agregadoId]
    }));
    // Animación removida
  };
  
  const handleVolver = () => {
    // Intento estándar de retroceder: si existe historial suficiente usa -1, si no redirige a inicio.
    // window.history.length es más confiable que window.history.state.idx en algunos navegadores/Vite.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Función para reiniciar personalizador
  const reiniciarPersonalizador = () => {
    // Reiniciar el estado del personalizador a sus valores iniciales
    setPersonalizacion({
      tamaño: '',
      masa: '',
      pan: '',
      carnes: [],
      ingredientes: [],
      extras: [],
      cantidad: 1,
      observaciones: '',
      nombrePersonalizado: ''
    });
    
    // Reiniciar ingredientes apilados y animaciones
    setStackedIngredients([]);
    setAnimatingIngredients([]);
    setZIndexCounter(0);
  };

  // ✅ Actualizado: crea ProductoPersonalizado y usa calcularPrecio()
  const agregarAlCarrito = async () => {
    if (!producto) return;

    try {
      // 1. Crear ProductoPersonalizado en el backend
      const ingredientesSeleccionados = [
        ...personalizacion.ingredientes,
        ...personalizacion.extras,
        ...(personalizacion.carnes ? (Array.isArray(personalizacion.carnes) ? personalizacion.carnes : [personalizacion.carnes]) : [])
      ].filter(Boolean);

      const productoPersonalizadoData = {
        nombre_personalizado: personalizacion.nombrePersonalizado || `${producto.nombre} personalizado`,
        producto_base: producto.id,
        ingredientes: ingredientesSeleccionados,
        precio_total: calcularPrecio()
      };

      const response = await api.post('productos-personalizados/', productoPersonalizadoData);
      const productoPersonalizadoCreado = response.data;

      // 2. Construir detalle legible para mostrar en el carrito
      const detalles = {
        ...(personalizacion.nombrePersonalizado && { nombrePersonalizado: personalizacion.nombrePersonalizado }),
        ...(personalizacion.tamaño && { tamaño: tamaños.find(t => t.id === personalizacion.tamaño)?.nombre || personalizacion.tamaño }),
        ...(personalizacion.pan && { pan: personalizacion.pan }),
        ...(personalizacion.masa && { masa: personalizacion.masa }),
        ...(Array.isArray(personalizacion.carnes) && personalizacion.carnes.length > 0
          ? { carnes: personalizacion.carnes }
          : (personalizacion.carnes && typeof personalizacion.carnes === 'string'
              ? { carnes: [personalizacion.carnes] }
              : {})),
        ...(Array.isArray(personalizacion.ingredientes) && personalizacion.ingredientes.length > 0 && { ingredientes: personalizacion.ingredientes }),
        ...(Array.isArray(personalizacion.extras) && personalizacion.extras.length > 0 && { extras: personalizacion.extras }),
        ...(personalizacion.observaciones && { observaciones: personalizacion.observaciones })
      };

      // 3. Agregar al carrito con el ID del producto personalizado
      const productoParaCarrito = {
        id: `producto-personalizado-${productoPersonalizadoCreado.id}`,
        nombre: personalizacion.nombrePersonalizado || producto.nombre,
        precio: calcularPrecio(),
        imagen: getCategoryImage(categoria),
        cantidad: 1,
        precioTotal: calcularPrecio(),
        categoria: producto.categoria,
        detalles,
        // IMPORTANTE: Agregar el ID para el flujo de pago
        producto_personalizado_id: productoPersonalizadoCreado.id,
        es_producto_personalizado: true
      };

      addToCart(productoParaCarrito);
      
      // ✅ Notificar y reiniciar personalizador
      if (showSuccess) {
        showSuccess('Agregado al carrito', 'Tu producto personalizado fue agregado.');
      }
      reiniciarPersonalizador();
      
    } catch (error) {
      console.error('Error creando producto personalizado:', error);
      alert('Error al agregar el producto personalizado. Inténtalo de nuevo.');
    }
  };

  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  // Actualizar capas cuando cambie la personalización
  const capasProducto = construirCapasProducto();

  return (
    <div className="personalizador-container">
      {/* Contenedor para animaciones de ingredientes */}
      <div className="ingredient-animation-container">
        {animatingIngredients.map(anim => {
          const viewerPos = getViewerPosition();
          return (
            <div 
              key={anim.id} 
              className="ingredient-falling"
              style={{
                '--target-x': `${viewerPos.x}px`,
                '--target-y': `${viewerPos.y}px`
              }}
            >
              <img 
                src={anim.imagen} 
                alt={anim.nombre}
                className="ingredient-falling-image"
              />
              <div className="ingredient-falling-label">{anim.nombre}</div>
            </div>
          );
        })}
      </div>

      <div className="personalizador-header">
        <button className="back-button" onClick={handleVolver}>
          ← Volver
        </button>
        <h1 className="personalizador-title">Personaliza tu Pedido</h1>
      </div>

      <div className="personalizador-content">
        {/* ✅ Reemplazado: bloque condicional completo */}
        <div className="personalizador-options">
          {categoria === 'pizzas' ? (
            <>
              {/* Tamaño (solo pizzas) */}
              <div className="option-section">
                <h3 className="section-title">Tamaño</h3>
                <div className="panhamburguesa-grid">
                  {tamaños.map(tamaño => (
                    <label key={tamaño.id} className="pan-option">
                      <input
                        type="radio"
                        name="tamaño"
                        value={tamaño.id}
                        checked={personalizacion.tamaño === tamaño.id}
                        onChange={() => handleTamañoChange(tamaño.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{tamaño.nombre}</span>
                        <span className="pan-precio">
                          {tamaño.precio > 0 ? `+$${tamaño.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Masa</h3>
                <div className="panhamburguesa-grid">
                  {masasPizza.map(masa => (
                    <label key={masa.id} className="pan-option">
                      <input
                        type="radio"
                        name="masa"
                        value={masa.id}
                        checked={personalizacion.masa === masa.id}
                        onChange={() => handleMasaChange(masa.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{masa.nombre}</span>
                        <span className="pan-precio">
                          {masa.precio > 0 ? `+$${masa.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Queso</h3>
                <div className="panhamburguesa-grid">
                  {quesosPizza.map(queso => (
                    <label key={queso.id} className="pan-option">
                      <input
                        type="radio"
                        name="queso"
                        value={queso.id}
                        checked={personalizacion.ingredientes[0] === queso.id}
                        onChange={() => handleQuesoChange(queso.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{queso.nombre}</span>
                        <span className="pan-precio">
                          {queso.precio > 0 ? `+$${queso.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Carne</h3>
                <div className="panhamburguesa-grid">
                  {carnesPizza.map(carne => (
                    <label key={carne.id} className="pan-option">
                      <input
                        type="checkbox"
                        name="carne"
                        value={carne.id}
                        checked={personalizacion.carnes.includes(carne.id)}
                        onChange={() => handleCarnesChange(carne.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{carne.nombre}</span>
                        <span className="pan-precio">
                          {carne.precio > 0 ? `+$${carne.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : categoria === 'pollo' ? (
            <>
              <div className="option-section">
                <h3 className="section-title">Tipo de Pollo</h3>
                <div className="panhamburguesa-grid">
                  {tiposPollo.map(tipo => (
                    <label key={tipo.id} className="pan-option">
                      <input
                        type="radio"
                        name="tipo"
                        value={tipo.id}
                        checked={personalizacion.carnes === tipo.id}
                        onChange={() => handleTipoPolloChange(tipo.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{tipo.nombre}</span>
                        <span className="pan-precio">
                          {tipo.precio > 0 ? `+$${tipo.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Salsas</h3>
                <div className="ingredientes-grid">
                  {salsasPollo.map(salsa => (
                    <label key={salsa.id} className="ingrediente-option">
                      <input
                        type="checkbox"
                        checked={personalizacion.extras.includes(salsa.id)}
                        onChange={() => handleSalsaPolloToggle(salsa.id)}
                      />
                      <span className="ingrediente-info">
                        <span className="ingrediente-nombre">{salsa.nombre}</span>
                        <span className="ingrediente-precio">+${salsa.precio}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : categoria === 'perros' ? (
            <>
              <div className="option-section">
                <h3 className="section-title">Tipo de Perro</h3>
                <div className="panhamburguesa-grid">
                  {tiposPerro.map(tipo => (
                    <label key={tipo.id} className="pan-option">
                      <input
                        type="radio"
                        name="tipo"
                        value={tipo.id}
                        checked={personalizacion.carnes === tipo.id}
                        onChange={() => handleTipoPerroChange(tipo.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{tipo.nombre}</span>
                        <span className="pan-precio">
                          {tipo.precio > 0 ? `+$${tipo.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="option-section">
                <h3 className="section-title">Salsas</h3>
                <div className="ingredientes-grid">
                  {salsasPerros.map(salsa => (
                    <label key={salsa.id} className="ingrediente-option">
                      <input
                        type="checkbox"
                        checked={personalizacion.extras.includes(salsa.id)}
                        onChange={() => handleSalsaPerroToggle(salsa.id)}
                      />
                      <span className="ingrediente-info">
                        <span className="ingrediente-nombre">{salsa.nombre}</span>
                        <span className="ingrediente-precio">+${salsa.precio}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Complementos</h3>
                <div className="ingredientes-grid">
                  {complementosPerro.map(comp => (
                    <label key={comp.id} className="ingrediente-option">
                      <input
                        type="checkbox"
                        checked={personalizacion.extras.includes(comp.id)}
                        onChange={() => handleComplementoPerroToggle(comp.id)}
                      />
                      <span className="ingrediente-info">
                        <span className="ingrediente-nombre">{comp.nombre}</span>
                        <span className="ingrediente-precio">+${comp.precio}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : categoria === 'postres' ? (
            <>
              <div className="option-section">
                <h3 className="section-title">Tipo de Postre</h3>
                <div className="panhamburguesa-grid">
                  {tiposPostre.map(tipo => (
                    <label key={tipo.id} className="pan-option">
                      <input
                        type="radio"
                        name="tipo"
                        value={tipo.id}
                        checked={personalizacion.carnes === tipo.id}
                        onChange={() => handleTipoPostreChange(tipo.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{tipo.nombre}</span>
                        <span className="pan-precio">
                          {tipo.precio > 0 ? `+$${tipo.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Agregados</h3>
                <div className="ingredientes-grid">
                  {agregadosPostre.map(agregado => (
                    <label key={agregado.id} className="ingrediente-option">
                      <input
                        type="checkbox"
                        checked={personalizacion.extras.includes(agregado.id)}
                        onChange={() => handleAgregadoPostreToggle(agregado.id)}
                      />
                      <span className="ingrediente-info">
                        <span className="ingrediente-nombre">{agregado.nombre}</span>
                        <span className="ingrediente-precio">+${agregado.precio}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // === HAMBURGUESAS ===
            <>
              <div className="option-section">
                <h3 className="section-title">Tipo de pan</h3>
                <div className="panhamburguesa-grid">
                  {pan.map(panOption => (
                    <label key={panOption.id} className="pan-option">
                      <input
                        type="radio"
                        name="pan"
                        value={panOption.id}
                        checked={personalizacion.pan === panOption.id}
                        onChange={() => handlepanChange(panOption.id)}
                      />
                      <span className="pan-info">
                        <span className="pan-nombre">{panOption.nombre}</span>
                        <span className="pan-precio">
                          {panOption.precio > 0 ? `+$${panOption.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Tipo de carnes</h3>
                <div className="carnes-grid">
                  {carnes.map(carne => (
                    <label key={carne.id} className="carnes-option">
                      <input
                        type="radio"
                        name="carnes"
                        value={carne.id}
                        checked={personalizacion.carnes === carne.id}
                        onChange={() => handleCarnesChange(carne.id)}
                      />
                      <span className="carnes-info">
                        <span className="carnes-nombre">{carne.nombre}</span>
                        <span className="carnes-precio">
                          {carne.precio > 0 ? `+$${carne.precio}` : '+'}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Ingredientes</h3>
                <div className="ingredientes-grid">
                  {ingredientesDisponibles.map(ingrediente => (
                    <label key={ingrediente.id} className="ingrediente-option">
                      <input
                        type="checkbox"
                        checked={personalizacion.ingredientes.includes(ingrediente.id)}
                        onChange={() => handleIngredienteToggle(ingrediente.id)}
                      />
                      <span className="ingrediente-info">
                        <span className="ingrediente-nombre">{ingrediente.nombre}</span>
                        <span className="ingrediente-precio">+${ingrediente.precio}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="option-section">
                <h3 className="section-title">Extras</h3>
                <div className="extras-grid">
                  {extrasDisponibles.map(extra => (
                    <label key={extra.id} className="extra-option">
                      <input
                        type="checkbox"
                        checked={personalizacion.extras.includes(extra.id)}
                        onChange={() => handleExtraToggle(extra.id)}
                      />
                      <span className="extra-info">
                        <span className="extra-nombre">{extra.nombre}</span>
                        <span className="extra-precio">+${extra.precio}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Cantidad y observaciones (comunes a todos) */}
          <div className="option-section">
            <h3 className="section-title">Cantidad</h3>
            <div className="cantidad-controls">
              <button 
                className="cantidad-btn"
                onClick={() => handleCantidadChange(personalizacion.cantidad - 1)}
                disabled={personalizacion.cantidad <= 1}
              >
                -
              </button>
              <span className="cantidad-display">{personalizacion.cantidad}</span>
              <button 
                className="cantidad-btn"
                onClick={() => handleCantidadChange(personalizacion.cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="option-section">
            <h3 className="section-title">Observaciones Especiales</h3>
            <textarea
              className="observaciones-input"
              placeholder="Ej: Sin cebolla, bien cocido, etc."
              value={personalizacion.observaciones}
              onChange={handleObservacionesChange}
              rows={3}
            />
          </div>
        </div>

        {/* Resumen y Precio */}
        <div className="personalizador-summary">
          <div className="summary-card">
            <h3 className="summary-title">Resumen del Pedido</h3>
            
            <div className="summary-details">
              <div className="summary-item">
                <span>Tamaño:</span>
                <span>{tamaños.find(t => t.id === personalizacion.tamaño)?.nombre}</span>
              </div>
              
              {personalizacion.ingredientes.length > 0 && (
                <div className="summary-item">
                  <span>Ingredientes:</span>
                  <span>{personalizacion.ingredientes.map(id => 
                    (categoria === 'pizzas' 
                      ? quesosPizza.find(i => i.id === id)
                      : ingredientesDisponibles.find(i => i.id === id)
                    )?.nombre
                  ).filter(Boolean).join(', ')}</span>
                </div>
              )}
              
              {personalizacion.extras.length > 0 && (
                <div className="summary-item">
                  <span>Extras:</span>
                  <span>{personalizacion.extras.map(id => {
                    if (categoria === 'pollo') return salsasPollo.find(e => e.id === id)?.nombre;
                    if (categoria === 'perros') return complementosPerro.find(e => e.id === id)?.nombre;
                    if (categoria === 'postres') return agregadosPostre.find(e => e.id === id)?.nombre;
                    return extrasDisponibles.find(e => e.id === id)?.nombre;
                  }).filter(Boolean).join(', ')}</span>
                </div>
                
              )}
              
              <div className="summary-item">
                <span>Cantidad:</span>
                <span>{personalizacion.cantidad}</span>
              </div>
            </div>

            <div className="precio-total">
              <span className="precio-label">Total:</span>
              <span className="precio-valor">${calcularPrecio().toFixed(0)}</span>
            </div>

            {/* Campo para nombre personalizado */}
            <div className="nombre-personalizado-container">
              <label htmlFor="nombrePersonalizado" className="nombre-label">
                Nombre de tu creación:
              </label>
              <input
                type="text"
                id="nombrePersonalizado"
                value={personalizacion.nombrePersonalizado}
                onChange={(e) => setPersonalizacion({
                  ...personalizacion,
                  nombrePersonalizado: e.target.value
                })}
                placeholder="Ej: Mi Hamburguesa Especial"
                className="nombre-input"
                maxLength={50}
              />
            </div>

            <button className="agregar-carrito-btn" onClick={agregarAlCarrito}>
              Agregar al Carrito
            </button>
          </div>

          {/* Visualizador del Producto */}
          {/* Eliminado el visualizador del producto para solo mostrar animación de caída */}
          {/* <div className="product-viewer-container" ref={productViewerRef}>
            <h3 className="viewer-title">Tu Producto</h3>
            <div className="product-viewer">
              {capasProducto.length === 0 ? (
                <div className="product-placeholder">
                  <p>Selecciona ingredientes para ver tu producto</p>
                </div>
              ) : (
                <div className="product-layers">
                  {capasProducto.map((capa, index) => (
                    <div 
                      key={`${capa.tipo}-${index}`}
                      className="product-layer"
                      style={{ zIndex: capa.zIndex }}
                    >
                      <img 
                        src={capa.imagen} 
                        alt={capa.nombre}
                        className="layer-image"
                      />
                      <div className="layer-label">{capa.nombre}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Personalizador;