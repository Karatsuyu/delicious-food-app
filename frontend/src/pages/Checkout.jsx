import { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Checkout() {
  const { cartItems } = useCart();
  const [buyer, setBuyer] = useState({ nombre: '', apellidos: '', email: '', telefono: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const total = useMemo(() => itemsForSummary.reduce((acc, i) => acc + (i.subtotal || 0), 0), [itemsForSummary]);

  const onPay = async () => {
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

      console.log('[Checkout] Payload enviado a backend:', { items });
      const bodyPayload = customCombo ? { items, combo_personalizado_id: customCombo.comboPersonalizadoId } : { items };
      if (customCombo) {
        console.log('[Checkout] Enviando combo_personalizado_id:', customCombo.comboPersonalizadoId);
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

        <section className="checkout-card">
          <h3>Datos del comprador</h3>
          <div className="form-grid">
            <label>
              Nombre
              <input value={buyer.nombre} onChange={(e)=>setBuyer(b=>({...b, nombre:e.target.value}))} />
            </label>
            <label>
              Apellidos
              <input value={buyer.apellidos} onChange={(e)=>setBuyer(b=>({...b, apellidos:e.target.value}))} />
            </label>
            <label>
              Email
              <input type="email" value={buyer.email} onChange={(e)=>setBuyer(b=>({...b, email:e.target.value}))} />
            </label>
            <label>
              Teléfono
              <input value={buyer.telefono} onChange={(e)=>setBuyer(b=>({...b, telefono:e.target.value}))} />
            </label>
            <label className="wide">
              Dirección
              <input value={buyer.direccion} onChange={(e)=>setBuyer(b=>({...b, direccion:e.target.value}))} />
            </label>
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button className="btn-mp" onClick={onPay} disabled={loading || total<=0}>
            {loading ? 'Creando sesión…' : 'Pagar con tarjeta (Stripe)'}
          </button>
          <p className="note">Se abrirá el checkout seguro de Stripe.</p>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
