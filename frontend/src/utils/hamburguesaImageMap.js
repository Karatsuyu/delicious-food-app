// Mapeo centralizado de imágenes para ingredientes de hamburguesas
// Este mapeo solo se aplica a productos de categoría "hamburguesas"

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
import peperoniImg from '../assets/pepperoni.png';
import pretzelImg from '../assets/pretzel.png';
import resImg from '../assets/res.png';
import seitanImg from '../assets/seitan.png';
import sesamoImg from '../assets/sesamo.png';
import singlutenImg from '../assets/singluten.png';
import venadoImg from '../assets/venado.png';
import veganoImg from '../assets/vegano.png';
import hamburguesaImg from '../assets/hamburguesa.png';

/**
 * Mapeo de ingredientes a imágenes para hamburguesas
 * Solo se aplica cuando la categoría del producto es "hamburguesas"
 */
export const hamburguesaIngredientImagesMap = {
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

/**
 * Imagen base para hamburguesas (fallback)
 */
export const hamburguesaBaseImage = hamburguesaImg;

/**
 * Obtiene la imagen de un ingrediente para hamburguesas
 * @param {string} ingredienteId - ID o nombre del ingrediente
 * @param {string} categoria - Categoría del producto (debe ser "hamburguesas")
 * @returns {string} - Ruta de la imagen
 */
export const getHamburguesaIngredientImage = (ingredienteId, categoria = 'hamburguesas') => {
  // Solo aplicar el mapeo si es para hamburguesas
  if (categoria !== 'hamburguesas' && categoria !== 'hamburguesa') {
    return hamburguesaBaseImage;
  }

  // Buscar en el mapeo específico
  if (hamburguesaIngredientImagesMap[ingredienteId]) {
    return hamburguesaIngredientImagesMap[ingredienteId];
  }

  // Fallback a imagen base de hamburguesa
  return hamburguesaBaseImage;
};

