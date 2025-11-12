import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';
import CartModal from '../components/CartModal';
import logo from '../assets/logo.png';
import lupa from '../assets/lupa.png';
import carrito from '../assets/carrito.png';
import producto from '../assets/producto.png';
import combos from '../assets/combos.png';

  function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
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

            {/* 🛒 BOTÓN CARRITO */}
            <button className="icon-btn cart-icon" title="Carrito" onClick={handleCartClick}>
              <img src={carrito} alt="Carrito de Compras" className="carrito-image" />
            </button>

            {/* 👤 LOGIN / REGISTER / USER MENU */}
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/perfil" className="btn btn-user">
                  {user?.first_name || user?.username || 'Mi Cuenta'}
                </Link>
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
            <Link to="/menu" className="side-menu-link">
              <img src={producto} alt="Productos" className="producto-image" />
              Productos
            </Link>
            <li>
              <Link to="/combos destacados" className="side-menu-link">
                <img src={combos} alt="Combos" className="combos-image" />
                Combos Destacados
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
