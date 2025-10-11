import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const isLoggedIn = false; // Por ahora false

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <button className="menu-icon" onClick={toggleMenu}>
            ☰
          </button>
          <Link to="/" className="logo">
            <span className="logo-text">Delicious</span>
            <br />
            <span className="logo-sub">Food 🍔</span>
          </Link>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/menu" className="nav-link">Menú</Link>
          <Link to="/personalizar" className="nav-link">Personalizar</Link>
          <Link to="/promociones" className="nav-link">Promociones</Link>
        </nav>

        <div className="header-actions">
          <button className="icon-btn search-icon" title="Buscar">
            🔍
          </button>
          <button 
            className="icon-btn cart-icon" 
            onClick={() => navigate('/carrito')}
            title="Carrito"
          >
            🛒
          </button>
          
          {isLoggedIn ? (
            <div className="user-menu">
              <button className="btn btn-user">Mi Cuenta</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                onClick={handleLoginClick} 
                className="btn btn-signin"
              >
                Sign In
              </button>
              <button 
                onClick={handleRegisterClick} 
                className="btn btn-register"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;