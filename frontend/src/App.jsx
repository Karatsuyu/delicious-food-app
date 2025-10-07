import { BrowserRouter as Router, Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './pages/Carrito';
import ProductoDetalle from './pages/ProductoDetalle';
import Personalizador from './pages/Personalizador';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/personalizar/:id" element={<Personalizador />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;