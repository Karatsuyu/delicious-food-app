# Organización de Imágenes - Delicious Food App

## Estructura de Imágenes

### Ubicación Principal
Todas las imágenes están ubicadas en: `src/assets/`

### Categorías de Imágenes

#### 🍔 Hamburguesas
- `ham1.png` - Hamburguesa Clásica
- `ham2.png` - Hamburguesa con Queso  
- `ham3.png` - Hamburguesa Deluxe
- `ham4.png` - BBQ Crispy
- `ham5.png` - Clásico Bacon
- `ham6.png` - Madurita Burger
- `ham7.png` - BBQ Crunch Burger
- `ham8.png` - Double Smash

#### 🍕 Pizzas
- `pizza.png` - Imagen base para todas las pizzas
  - Pizza Hawaiana
  - Pizza de Queso
  - Pizza de Pepperoni
  - Pizza Aromática de Pepperoni
  - Pizza de Pollo y Champiñones
  - Pepperoni Lovers
  - Pizza Campesina

#### 🍗 Pollo
- `pollo.png` - Imagen base para todas las alitas
  - Alitas Simples
  - Alitas Crocantes
  - Alitas BBQ
  - Alitas Teriyaki
  - Alitas Ajo Parmesano
  - Alitas Barbacoa

#### 🌭 Perros Calientes
- `perro.png` - Imagen base para todos los perros
  - Perro Clásico
  - Perro Supremo
  - Perro Crocante
  - Alitas Teriyaki (en categoría perros)

#### 🧁 Postres
- `postre.png` - Imagen base para postres

#### 🍟 Papas
- `producto.png` - Imagen base para papas fritas

#### 🥤 Bebidas
- `producto.png` - Imagen base para bebidas

### Imágenes Generales
- `banner1.png`, `banner2.png`, `banner3.png`, `banner4.png` - Banners del carrusel
- `carrito.png` - Icono del carrito
- `combos.png` - Icono de combos
- `hamburguesa.png` - Icono general de hamburguesa
- `logo.png` - Logo de la aplicación
- `lupa.png` - Icono de búsqueda
- `react.svg` - Logo de React

## Recomendaciones para Mejoras

### 1. Imágenes Específicas por Producto
Para mejorar la experiencia del usuario, se recomienda crear imágenes específicas para cada producto:

```
src/assets/
├── hamburguesas/
│   ├── hamburguesa-clasica.png
│   ├── hamburguesa-queso.png
│   └── ...
├── pizzas/
│   ├── pizza-hawaiana.png
│   ├── pizza-pepperoni.png
│   └── ...
├── pollo/
│   ├── alitas-simples.png
│   ├── alitas-bbq.png
│   └── ...
└── perros/
    ├── perro-clasico.png
    ├── perro-supremo.png
    └── ...
```

### 2. Optimización de Imágenes
- Usar formatos WebP para mejor compresión
- Redimensionar imágenes a tamaños estándar (ej: 400x300px)
- Crear versiones @2x para pantallas de alta densidad

### 3. Naming Convention
Usar nombres descriptivos y consistentes:
- `categoria-producto-variante.png`
- Ejemplo: `pizza-hawaiana.png`, `alitas-bbq.png`

## Uso en el Código

Las imágenes se importan y usan así:

```javascript
// Importar imagen
import pizzaImage from '../assets/pizza.png';

// Usar en componente
<img src={pizzaImage} alt="Pizza" />
```

## Notas Técnicas

- Todas las imágenes deben tener alt text descriptivo
- Usar lazy loading para imágenes grandes
- Considerar usar un CDN para producción
- Mantener consistencia en dimensiones por categoría


