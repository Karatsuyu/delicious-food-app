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
import CarritoItemDetalle from './pages/CarritoItemDetalle';
import ComboBBQCrispy from './pages/ComboBBQCrispy';
import ComboClasicoBacon from './pages/ComboClasicoBacon';
import ComboPepperoniLovers from './pages/ComboPepperoniLovers';
import ComboCrocanteDeluxe from './pages/ComboCrocanteDeluxe';
import Personalizador from './pages/Personalizador';
import Perfil from './pages/Perfil';
import CrearCombo from './pages/CrearCombo';
import ComboPersonalizadoDetalle from './pages/ComboPersonalizadoDetalle';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import CombosPublicos from './pages/CombosPublicos';
import ProductosPublicos from './pages/ProductosPublicos';
import PerfilPublico from './pages/PerfilPublico';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

function App() {
  return (
    <NotificationProvider>
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
                <Route path="/carrito/item/:id" element={<CarritoItemDetalle />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/success" element={<PaymentResult type="success" />} />
                <Route path="/failure" element={<PaymentResult type="failure" />} />
                <Route path="/pending" element={<PaymentResult type="pending" />} />
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
                <Route 
                  path="/crear-combo" 
                  element={
                    <ProtectedRoute>
                      <CrearCombo />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editar-combo/:id" 
                  element={
                    <ProtectedRoute>
                      <CrearCombo />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/mis-combos/:id" 
                  element={
                    <ProtectedRoute>
                      <ComboPersonalizadoDetalle />
                    </ProtectedRoute>
                  } 
                />
                {/* Rutas de administración */}
                <Route 
                  path="/admin/productos" 
                  element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                {/* Rutas públicas de combos, productos y perfiles */}
                <Route path="/combos-publicos" element={<CombosPublicos />} />
                <Route path="/productos-publicos" element={<ProductosPublicos />} />
                <Route path="/perfil/:userId" element={<PerfilPublico />} />
              </Routes>
            </main>
            <Footer />
            {/* Carrito como overlay global */}
            <Carrito />
          </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;