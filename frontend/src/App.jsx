import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './pages/Carrito';
import ProductoDetalle from './pages/ProductoDetalle';
import Personalizador from './pages/Personalizador';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header />
          <main className='main-content'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/personalizar/:id" element={<Personalizador />} />
            </Routes>
          </main>
          <Footer />
          {/* Carrito como overlay global */}
          <Carrito />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;