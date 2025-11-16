import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Buscar from './pages/Buscar';
import Login from './pages/Login';
import Register from './pages/Register';
import Carrito from './components/Carrito';
import ProductoDetalle from './pages/ProductoDetalle';
import ComboDetalle from './pages/ComboDetalle';
import ComboBBQCrispy from './pages/ComboBBQCrispy';
import ComboClasicoBacon from './pages/ComboClasicoBacon';
import ComboPepperoniLovers from './pages/ComboPepperoniLovers';
import ComboCrocanteDeluxe from './pages/ComboCrocanteDeluxe';
import Personalizador from './pages/Personalizador';
import Perfil from './pages/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <main className='main-content'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/buscar" element={<Buscar />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/producto/:id" element={<ProductoDetalle />} />
                {/* Rutas nuevas: 4 pantallas independientes para cada combo */}
                <Route path="/combo-bbq-crispy" element={<ComboBBQCrispy />} />
                <Route path="/combo-clasico-bacon" element={<ComboClasicoBacon />} />
                <Route path="/combo-pepperoni-lovers" element={<ComboPepperoniLovers />} />
                <Route path="/combo-crocante-deluxe" element={<ComboCrocanteDeluxe />} />
                {/* Ruta dinámica previa se mantiene (opcional) */}
                <Route path="/combo/:id" element={<ComboDetalle />} />
                <Route path="/personalizador/:categoria" element={<Personalizador />} />
                <Route 
                  path="/perfil" 
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
            {/* Carrito como overlay global */}
            <Carrito />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;