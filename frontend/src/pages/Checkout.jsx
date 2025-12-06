import { useMemo, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/api';

// Solo cargar Stripe si hay una clave válida configurada
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_KEY && STRIPE_KEY !== 'undefined' ? loadStripe(STRIPE_KEY) : null;

function Checkout() {
  const { cartItems } = useCart();
  const [buyer, setBuyer] = useState({ nombre: '', apellidos: '', email: '', telefono: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [showPointsSection, setShowPointsSection] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Función para verificar si todos los campos están válidos
  const todosLosCamposValidos = () => {
    const camposRequeridos = ['nombre', 'apellidos', 'email', 'telefono', 'direccion'];
    
    // Verificar que todos los campos tengan valores
    const camposCompletos = camposRequeridos.every(campo => buyer[campo]?.trim());
    
    // Verificar que no haya errores
    const sinErrores = camposRequeridos.every(campo => !fieldErrors[campo]);
    
    return camposCompletos && sinErrores;
  };

  const itemsForSummary = useMemo(() => {
    return (cartItems || []).map(it => {
      // Para combos personalizados, usar precio ya total por cantidad 1
      const qty = Number(it.cantidad || 1);
      const unitPrice = Number(it.precio || 0);
      return {
        id: it.id,
        title: it.nombre,
        image: it.imagen,
        quantity: qty,
        unit_price: unitPrice,
        subtotal: unitPrice * qty,
      };
    });
  }, [cartItems]);

  const subtotal = useMemo(() => itemsForSummary.reduce((acc, i) => acc + (i.subtotal || 0), 0), [itemsForSummary]);
  const pointsDiscount = pointsToUse;
  const total = Math.max(0, subtotal - pointsDiscount);

  // Cargar puntos del usuario
  useEffect(() => {
    const loadUserPoints = async () => {
      try {
        const response = await api.get('/users/users/points_balance/');
        const points = response.data.points || 0;
        setUserPoints(points);
        // Mostrar sección de puntos si el usuario tiene puntos
        setShowPointsSection(points > 0);
      } catch (error) {
        console.error('Error cargando puntos:', error);
      }
    };
    loadUserPoints();
  }, []);

  const validarCampos = () => {
    const errores = [];

    // Validar campos obligatorios
    if (!buyer.nombre?.trim()) {
      errores.push('El nombre es obligatorio');
    }

    if (!buyer.apellidos?.trim()) {
      errores.push('Los apellidos son obligatorios');
    }

    if (!buyer.email?.trim()) {
      errores.push('El email es obligatorio');
    } else {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(buyer.email)) {
        errores.push('El formato del email no es válido');
      }
    }

    if (!buyer.telefono?.trim()) {
      errores.push('El teléfono es obligatorio');
    } else {
      // Validar que el teléfono tenga al menos 7 dígitos
      const telefonoLimpio = buyer.telefono.replace(/[^0-9]/g, '');
      if (telefonoLimpio.length < 7) {
        errores.push('El teléfono debe tener al menos 7 dígitos');
      }
    }

    if (!buyer.direccion?.trim()) {
      errores.push('La dirección es obligatoria');
    }

    return errores;
  };

  const validarCampo = (campo, valor) => {
    let error = '';
    
    switch (campo) {
      case 'nombre':
        if (!valor?.trim()) error = 'El nombre es obligatorio';
        break;
      case 'apellidos':
        if (!valor?.trim()) error = 'Los apellidos son obligatorios';
        break;
      case 'email':
        if (!valor?.trim()) {
          error = 'El email es obligatorio';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(valor)) {
            error = 'El formato del email no es válido';
          }
        }
        break;
      case 'telefono':
        if (!valor?.trim()) {
          error = 'El teléfono es obligatorio';
        } else {
          const telefonoLimpio = valor.replace(/[^0-9]/g, '');
          if (telefonoLimpio.length < 7) {
            error = 'El teléfono debe tener al menos 7 dígitos';
          }
        }
        break;
      case 'direccion':
        if (!valor?.trim()) error = 'La dirección es obligatoria';
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [campo]: error
    }));
    
    return error;
  };

  const handleInputChange = (campo, valor) => {
    setBuyer(prev => ({ ...prev, [campo]: valor }));
    // Validar el campo cuando el usuario deja de escribir
    setTimeout(() => validarCampo(campo, valor), 300);
  };

  const onPay = async () => {
    // Validar campos obligatorios primero
    const errores = validarCampos();
    if (errores.length > 0) {
      setError(`Por favor completa los siguientes campos:\n• ${errores.join('\n• ')}`);
      return;
    }

    // Verificar si Stripe está configurado
    if (!stripePromise) {
      setError('Stripe no está configurado correctamente. Contacta al administrador.');
      return;
    }

    // Mostrar información sobre claves de prueba si aplica
    if (STRIPE_KEY && STRIPE_KEY.startsWith('pk_test_')) {
      console.log('🔧 Usando claves de prueba de Stripe para desarrollo');
    }

    try {
      setLoading(true);
      setError('');
      // Stripe espera amounts en centavos (integer). Convertimos COP a centavos
      // Teniendo en cuenta que en nuestra UI los precios pueden venir como strings con separadores ("39.900").
      const toPesosInteger = (value) => {
        if (typeof value === 'string') {
          // Remover separadores de miles y espacios: "39.900" -> "39900"; "216.900" -> "216900"
          const digits = value.replace(/[^0-9]/g, '');
          return digits ? parseInt(digits, 10) : 0;
        }
        if (typeof value === 'number') {
          // Si llegó como número con decimales por parseo de string (ej: 39.9), asumimos que representa miles mal parseados.
          // Redondeamos a entero de pesos.
          return Math.round(value);
        }
        return 0;
      };

      const items = itemsForSummary.map(i => {
        const pesos = toPesosInteger(i.unit_price); // en pesos (COP)
        const cents = pesos * 100; // en centavos
        const line = {
          name: i.title,
          quantity: Number(i.quantity) || 1,
          unit_amount: cents,
        };
        return line;
      });
      // Detectar combo personalizado propio para pasar su ID al backend (solo uno por sesión)
      const customCombo = (cartItems || []).find(ci => ci.isCustomCombo && ci.comboPersonalizadoId);
      
      // Detectar producto personalizado propio para pasar su ID al backend (solo uno por sesión)
      const customProducto = (cartItems || []).find(ci => ci.es_producto_personalizado && ci.producto_personalizado_id);

      // Detectar TODOS los productos personalizados (propios y de otros usuarios)
      const productosPersonalizados = (cartItems || []).filter(ci => ci.es_producto_personalizado && ci.producto_personalizado_id);
      
      console.log('[Checkout] Payload enviado a backend:', { items });
      console.log('[Checkout] Productos personalizados detectados:', productosPersonalizados.length);
      
      // Determinar qué metadata enviar (combo o producto personalizado)
      let bodyPayload = { items };
      
      if (customCombo) {
        bodyPayload.combo_personalizado_id = customCombo.comboPersonalizadoId;
        console.log('[Checkout] Enviando combo_personalizado_id:', customCombo.comboPersonalizadoId);
      } else if (customProducto && productosPersonalizados.length === 1) {
        // Solo un producto personalizado (lógica original)
        bodyPayload.producto_personalizado_id = customProducto.producto_personalizado_id;
        console.log('[Checkout] Enviando producto_personalizado_id:', customProducto.producto_personalizado_id);
      } else if (productosPersonalizados.length > 0) {
        // Múltiples productos personalizados - enviar lista en metadata
        bodyPayload.productos_personalizados = productosPersonalizados.map(p => ({
          producto_personalizado_id: p.producto_personalizado_id,
          creator_user_id: p.creator_user_id,
          creator_username: p.creator_username,
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad || 1
        }));
        console.log('[Checkout] Enviando productos_personalizados:', bodyPayload.productos_personalizados);
      }

      // Incluir puntos utilizados si hay alguno
      if (pointsToUse > 0) {
        bodyPayload.points_used = pointsToUse;
        console.log('[Checkout] Enviando points_used:', pointsToUse);
      }
      // Usar el cliente API con JWT para que el backend pueda validar al usuario y asociar el combo
      const { data } = await api.post('payments/create-checkout-session/', bodyPayload);
      console.log('[Checkout] Respuesta backend:', data);
      if (data.error) {
        setError(`Stripe: ${data.error}`);
        return;
      }

      // Stripe.js reciente ha desaprobado redirectToCheckout; usa la URL devuelta
      if (data.url) {
        window.location.href = data.url;
      } else if (data.id) {
        // Fallback legacy: si existe session id pero no URL, intenta con redirectToCheckout si está disponible
        const stripe = await stripePromise;
        if (stripe && typeof stripe.redirectToCheckout === 'function') {
          const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
          if (error) throw error;
        } else {
          setError('Stripe: no se pudo redirigir. Usa la URL de sesión devuelta por el backend.');
        }
      } else {
        setError('Stripe: respuesta sin id ni url.');
      }
    } catch (e) {
      console.error(e);
      setError('No se pudo iniciar el pago con Stripe. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Finalizar compra</h2>

      <div className="checkout-layout">
        <section className="checkout-card">
          <h3>Tu carrito</h3>
          {itemsForSummary.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <table className="checkout-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {itemsForSummary.map((i) => (
                  <tr key={i.id}>
                    <td className="prod">
                      {i.image ? <img src={i.image} alt={i.title} /> : null}
                      <span>{i.title}</span>
                    </td>
                    <td>{i.quantity}</td>
                    <td>${i.unit_price.toLocaleString('es-CO')}</td>
                    <td className="strong">${i.subtotal.toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="total-label">Total</td>
                  <td className="strong">${total.toLocaleString('es-CO')}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </section>

        {showPointsSection && userPoints > 0 && (
          <section className="checkout-card">
            <h3>Usar Puntos como Descuento</h3>
            <div className="points-section">
              <p>Tienes <strong>{userPoints} puntos</strong> disponibles. Cada punto equivale a $1 COP de descuento.</p>
              <label>
                Puntos a usar (máximo {Math.min(userPoints, subtotal)}):
                <input 
                  type="number" 
                  min="0" 
                  max={Math.min(userPoints, subtotal)}
                  value={pointsToUse}
                  onChange={(e) => {
                    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), Math.min(userPoints, subtotal));
                    setPointsToUse(value);
                  }}
                />
              </label>
              {pointsToUse > 0 && (
                <div className="points-discount">
                  <p>Descuento aplicado: <strong>-${pointsToUse.toLocaleString('es-CO')}</strong></p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="checkout-card">
          <h3>Datos del comprador</h3>
          <p className="campos-obligatorios">Los campos marcados con * son obligatorios</p>
          <div className="form-grid">
            <label>
              Nombre *
              <input 
                value={buyer.nombre} 
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className={fieldErrors.nombre ? 'input-error' : ''}
                placeholder="Ingresa tu nombre"
              />
              {fieldErrors.nombre && <span className="error-message">{fieldErrors.nombre}</span>}
            </label>
            <label>
              Apellidos *
              <input 
                value={buyer.apellidos} 
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                className={fieldErrors.apellidos ? 'input-error' : ''}
                placeholder="Ingresa tus apellidos"
              />
              {fieldErrors.apellidos && <span className="error-message">{fieldErrors.apellidos}</span>}
            </label>
            <label>
              Email *
              <input 
                type="email" 
                value={buyer.email} 
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={fieldErrors.email ? 'input-error' : ''}
                placeholder="ejemplo@correo.com"
              />
              {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
            </label>
            <label>
              Teléfono *
              <input 
                value={buyer.telefono} 
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className={fieldErrors.telefono ? 'input-error' : ''}
                placeholder="Ej: 3001234567"
              />
              {fieldErrors.telefono && <span className="error-message">{fieldErrors.telefono}</span>}
            </label>
            <label className="wide">
              Dirección *
              <input 
                value={buyer.direccion} 
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                className={fieldErrors.direccion ? 'input-error' : ''}
                placeholder="Dirección completa de entrega"
              />
              {fieldErrors.direccion && <span className="error-message">{fieldErrors.direccion}</span>}
            </label>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button 
            className="btn-mp" 
            onClick={onPay} 
            disabled={loading || total<=0 || !todosLosCamposValidos()}
          >
            {loading ? 'Creando sesión…' : 
             !todosLosCamposValidos() ? 'Completa todos los campos' :
             'Pagar con tarjeta (Stripe)'}
          </button>
          <p className="note">Se abrirá el checkout seguro de Stripe.</p>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
