// Mapeo de IDs de productos a sus imágenes
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

// Mapeo de productos locales
export const productImageMap = {
  'hamburguesa1': { imagen: hamburguesa1, nombre: 'Hamburguesa Clásica' },
  'hamburguesa2': { imagen: hamburguesa2, nombre: 'Hamburguesa con Queso' },
  'hamburguesa3': { imagen: hamburguesa3, nombre: 'Hamburguesa Deluxe' },
  'hamburguesa4': { imagen: hamburguesa4, nombre: 'BBQ Crispy' },
  'hamburguesa5': { imagen: hamburguesa5, nombre: 'Clásico Bacon' },
  'hamburguesa6': { imagen: hamburguesa6, nombre: 'Madurita Burger' },
  'hamburguesa7': { imagen: hamburguesa7, nombre: 'BBQ Crunch Burger' },
  'hamburguesa8': { imagen: hamburguesa8, nombre: 'Double Smash' },

  'pizza1': { imagen: pizza1, nombre: 'Pizza Hawaiana' },
  'pizza2': { imagen: pizza2, nombre: 'Pizza de Queso' },
  'pizza3': { imagen: pizza3, nombre: 'Pizza de Pepperoni' },
  'pizza4': { imagen: pizza4, nombre: 'Pizza Aromática de Pepperoni' },
  'pizza5': { imagen: pizza5, nombre: 'Pizza de Pollo y Champiñones' },
  'pizza6': { imagen: pizza6, nombre: 'Pepperoni Lovers' },
  'pizza7': { imagen: pizza7, nombre: 'Pizza Campesina' },

  'pollo1': { imagen: pollo1, nombre: 'Alitas Simples' },
  'pollo2': { imagen: pollo2, nombre: 'Alitas Crocantes' },
  'pollo3': { imagen: pollo3, nombre: 'Alitas BBQ' },
  'pollo4': { imagen: pollo4, nombre: 'Alitas Teriyaki' },
  'pollo5': { imagen: pollo5, nombre: 'Alitas Ajo Parmesano' },
  'pollo6': { imagen: pollo6, nombre: 'Alitas Barbacoa' },

  'perro1': { imagen: perro1, nombre: 'Perro Clásico' },
  'perro2': { imagen: perro2, nombre: 'Perro Crocante' },
  'perro3': { imagen: perro3, nombre: 'Perro Supremo' },
  'perro4': { imagen: perro4, nombre: 'Perro Crunch' },
  'perro5': { imagen: perro5, nombre: 'Perro Fresh' },

  'postres1': { imagen: postres1, nombre: 'Cono de Vainilla' },
  'postres2': { imagen: postres2, nombre: 'Cono de Vainilla y Chocolate' },
  'postres3': { imagen: postres3, nombre: 'Cono de Fresa' },
  'postres4': { imagen: postres4, nombre: 'Cono de Chocolate' },
  'postres5': { imagen: postres5, nombre: 'Sundae de Arequipe' },
  'postres6': { imagen: postres6, nombre: 'Sundae de Fresa' },
  'postres7': { imagen: postres7, nombre: 'Sundae de Chocolate' },
  'postres8': { imagen: postres8, nombre: 'Sundae de Caramelo' },

  'papas1': { imagen: papas1, nombre: 'Papas Fritas' },
  'papas2': { imagen: papas2, nombre: 'Aros de Cebolla' },
  'papas3': { imagen: papas3, nombre: 'Nuggets de Pollo' },

  'bebida1': { imagen: bebida1, nombre: 'Coca-Cola Personal' },
  'bebida2': { imagen: bebida2, nombre: 'Coca-Cola En Lata' },
  'bebida3': { imagen: bebida3, nombre: 'Coca-Cola 3L' },
  'bebida4': { imagen: bebida4, nombre: 'Sprite Personal' },
  'bebida5': { imagen: bebida5, nombre: 'Sprite En Lata' },
  'bebida6': { imagen: bebida6, nombre: 'Sprite 3L' },
  'bebida7': { imagen: bebida7, nombre: 'Pepsi Personal' },
  'bebida8': { imagen: bebida8, nombre: 'Pepsi En Lata' },
  'bebida9': { imagen: bebida9, nombre: 'Pepsi 3L' }
};

/**
 * Obtiene la imagen y nombre del producto original basado en su ID
 * @param {string} productId - ID del producto original
 * @returns {object} - Objeto con imagen y nombre del producto
 */
export const getProductImageAndName = (productId) => {
  return productImageMap[productId] || { 
    imagen: null, 
    nombre: 'Producto no encontrado' 
  };
};

/**
 * Obtiene solo la imagen del producto original
 * @param {string} productId - ID del producto original  
 * @returns {string|null} - URL de la imagen o null
 */
export const getProductImage = (productId) => {
  return productImageMap[productId]?.imagen || null;
};

/**
 * Obtiene solo el nombre del producto original
 * @param {string} productId - ID del producto original
 * @returns {string} - Nombre del producto
 */
export const getProductName = (productId) => {
  return productImageMap[productId]?.nombre || 'Producto no encontrado';
};