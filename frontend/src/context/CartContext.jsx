import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch (e) {
      console.warn('No se pudo leer el carrito de localStorage:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('No se pudo guardar el carrito en localStorage:', e);
    }
  }, [cartItems, hydrated]);

  const addToCart = (producto) => {
    let message;
    setCartItems(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        message = `Cantidad de ${existe.nombre} actualizada`;
        return prev.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                precioTotal: item.precio * (item.cantidad + 1)
              }
            : item
        );
      } else {
        message = `${producto.nombre} agregado al carrito`;
        return [
          ...prev,
          {
            ...producto,
            cantidad: 1,
            precioTotal: producto.precio
          }
        ];
      }
    });
    // Abrir el popup del carrito (no el lateral) al agregar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart-modal'));
    }
    return message || 'Producto agregado al carrito';
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { 
              ...item, 
              cantidad: nuevaCantidad,
              precioTotal: item.precio * nuevaCantidad
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.precioTotal, 0);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Ejemplo de estructura de un item en el carrito
  const ejemploItem = {
    id: 'hamburguesa1',
    nombre: 'Hamburguesa Clásica',
    precio: 7900,
    imagen: 'ruta/imagen.png',
    cantidad: 1,
    precioTotal: 7900,
    categoria: 'hamburguesas',
    // Para pizzas:
    tamaño: 'Mediana 6 partes' // opcional
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};