import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Menu.css';

function Menu() {
  const [searchParams] = useSearchParams();
  const categoriaUrl = searchParams.get('categoria');
  
  const [productos, setProductos] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(categoriaUrl || 'todos');
  const [loading, setLoading] = useState(true);

  const categorias = [
    { id: 'todos', nombre: 'Todos', icon: '🍽️' },
    { id: 'hamburguesas', nombre: 'Hamburguesas', icon: '🍔' },
    { id: 'pizzas', nombre: 'Pizzas', icon: '🍕' },
    { id: 'pollo', nombre: 'Pollo', icon: '🍗' },
    { id: 'perros', nombre: 'Perros', icon: '🌭' },
    { id: 'postres', nombre: 'Postres', icon: '🧁' },
    { id: 'papas', nombre: 'Papas', icon: '🍟' },
    { id: 'bebidas', nombre: 'Bebidas', icon: '🥤' },
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/products/productos/');
        setProductos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    if (categoriaUrl) {
      setCategoriaActual(categoriaUrl);
    }
  }, [categoriaUrl]);

  const productosFiltrados = categoriaActual === 'todos' 
    ? productos 
    : productos.filter(p => 
        p.nombre.toLowerCase().includes(categoriaActual.toLowerCase())
      );

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Nuestro Menú</h1>
        <p>Explora nuestra deliciosa variedad de productos</p>
      </div>

      {/* Filtros de categoría */}
      <section className="menu-categories">
        <div className="categories-filter">
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${categoriaActual === cat.id ? 'active' : ''}`}
              onClick={() => setCategoriaActual(cat.id)}
            >
              <span className="filter-icon">{cat.icon}</span>
              <span>{cat.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid de productos */}
      <section className="menu-products">
        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : productosFiltrados.length > 0 ? (
          <div className="products-grid-menu">
            {productosFiltrados.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No hay productos disponibles en esta categoría</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Menu;