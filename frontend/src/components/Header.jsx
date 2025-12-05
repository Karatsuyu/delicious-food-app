import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';
import CartModal from '../components/CartModal';
import logo from '../assets/logo.png';
import lupa from '../assets/lupa.png';
import carrito from '../assets/carrito.png';
import defaultAvatar from '../assets/icono-perfil-vacio-inicio.jpg';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim() !== '') {
        console.log('Buscando:', searchTerm);
        navigate(`/buscar?q=${searchTerm}`);
        setSearchTerm('');
        setIsSearchOpen(false);
      }
    };

    const handleCartClick = () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      setIsCartOpen(true);
    };

    useEffect(() => {
      const openHandler = () => setIsCartOpen(true);
      const closeHandler = () => setIsCartOpen(false);
      window.addEventListener('open-cart-modal', openHandler);
      window.addEventListener('close-cart-modal', closeHandler);
      return () => {
        window.removeEventListener('open-cart-modal', openHandler);
        window.removeEventListener('close-cart-modal', closeHandler);
      };
    }, []);

    // Cerrar modal del carrito automáticamente al cambiar de ruta
    useEffect(() => {
      if (isCartOpen) setIsCartOpen(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <button className="menu-icon" onClick={toggleMenu}>☰</button>
            <Link to="/" className="logo">
              <img src={logo} alt="Delicious Food Logo" className="logo-image" />
            </Link>
          </div>

          <div className="header-actions">
            {/* 🔍 BOTÓN Y BARRA DE BÚSQUEDA */}
            <div className="search-container">
              <button className="icon-btn search-icon" title="Buscar" onClick={toggleSearch}>
                <img src={lupa} alt="Buscar" className="lupa-image" />
              </button>

              {isSearchOpen && (
                <form className="search-bar" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="search-btn">
                    <img src={lupa} alt="Buscar" className="lupa-mini" />
                  </button>
                </form>
              )}
            </div>

            {/* 🛒 BOTÓN CARRITO - Solo mostrar si NO es administrador */}
            {!user?.is_staff && (
            <button className="icon-btn cart-icon" title="Carrito" onClick={handleCartClick}>
              <img src={carrito} alt="Carrito de Compras" className="carrito-image" />
            </button>
            )}

            {/* 👤 LOGIN / REGISTER / USER MENU */}
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/perfil" className="avatar-wrapper" title="Mi perfil" aria-label="Mi perfil">
                  <img
                    src={user?.profile_image || defaultAvatar}
                    alt="Foto de perfil"
                    className="avatar-image"
                  />
                </Link>
                {user?.is_staff && (
                  <div className="admin-links">
                    <Link to="/admin/dashboard" className="btn btn-admin">Dashboard</Link>
                    <Link to="/admin/productos" className="btn btn-admin">Productos</Link>
                  </div>
                )}
                <button onClick={handleLogout} className="btn btn-logout">Salir</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button onClick={handleLoginClick} className="btn btn-signin">Sign in</button>
                <button onClick={handleRegisterClick} className="btn btn-register">Register</button>
              </div>
            )}
          </div>
        </div>

        {/* MENÚ LATERAL */}
        <div className={`side-menu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={toggleMenu}></div>
        <aside className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="close-btn" onClick={toggleMenu}>✕</button>
          <ul className="side-menu-list">
            <Link to="/menu?categoria=hamburguesas" className="side-menu-link">
              <span className="menu-emoji">🍽️</span>
              Productos
            </Link>
            <li>
              <Link to="/combos-publicos" className="side-menu-link">
                <span className="menu-emoji">🍔🍟</span>
                Combos de la Comunidad
              </Link>
            </li>
            <li>
              <Link to="/productos-publicos" className="side-menu-link">
                <span className="menu-emoji">✨🍴</span>
                Productos de la Comunidad
              </Link>
            </li>
          </ul>

          <details>
            <summary>Sobre Nosotros</summary>
            <p>Conoce más sobre nuestra historia y misión.</p>
          </details>

          <details>
            <summary>Políticas de Privacidad</summary>
            <p>Consulta cómo protegemos tus datos.</p>
          </details>

          <details>
            <summary>Términos y Condiciones</summary>
            <p>Lee nuestras condiciones de uso.</p>
          </details>
        </aside>
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </header>
    );
  }

export default Header;
