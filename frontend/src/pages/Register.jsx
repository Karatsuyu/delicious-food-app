import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      alert(result.data?.message || '¡Registro exitoso! Por favor inicia sesión');
      navigate('/login');
    } else {
      setError(result.message || 'Error al registrarse');
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          {/* Header del formulario */}
          <div className="register-header">
            <div className="register-icon">🍔</div>
            <h1>Crear Cuenta</h1>
            <p>Únete a Delicious Food y disfruta de beneficios exclusivos</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Usuario */}
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ej: juan_perez"
                required
                autoComplete="username"
              />
              <small className="input-hint">Tu nombre de usuario único</small>
            </div>

            {/* Nombre y Apellido */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">
                  <span className="label-icon">📝</span>
                  Nombre
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">
                  <span className="label-icon">📝</span>
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="phone_number">
                <span className="label-icon">📱</span>
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="3001234567"
                autoComplete="tel"
              />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                required
                autoComplete="new-password"
              />
              <small className="input-hint">Usa al menos 8 caracteres con letras y números</small>
            </div>

            {/* Confirmar Contraseña */}
            <div className="form-group">
              <label htmlFor="password_confirm">
                <span className="label-icon">🔒</span>
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Botón de envío */}
            <button 
              type="submit" 
              className="btn-register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registrando...
                </>
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </div>

          {/* Beneficios */}
          <div className="benefits-section">
            <h3>🎁 Beneficios de registrarte</h3>
            <ul>
              <li>✅ Personaliza tus productos favoritos</li>
              <li>✅ Acumula puntos en cada compra</li>
              <li>✅ Accede a promociones exclusivas</li>
              <li>✅ Historial de pedidos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;