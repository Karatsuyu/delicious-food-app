import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/api';
import './Checkout.css';

const MP_PUBLIC_KEY = import.meta?.env?.VITE_MP_PUBLIC_KEY || 'TEST-PUBLIC-KEY-REPLACE';

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
      const payload = {
        items: itemsForSummary.map(i => ({ title: i.title, quantity: i.quantity, unit_price: i.unit_price })),
        payer: { name: buyer.nombre, surname: buyer.apellidos, email: buyer.email, phone: buyer.telefono, address: buyer.direccion },
        success_url: window.location.origin + '/success',
        failure_url: window.location.origin + '/failure',
        pending_url: window.location.origin + '/pending',
      };
      const { data } = await api.post('payments/create_preference/', payload);
      // Si el backend devuelve init_point, redirigimos; si no, mostramos botón alternativo (id)
      if (data?.init_point) {
        window.location.href = data.init_point;
        return;
      }
      alert('Preferencia creada. ID: ' + data?.id + '\nInstala el SDK de Mercado Pago o habilita init_point para continuar.');
    } catch (e) {
      console.error(e);
      setError('No se pudo iniciar el pago. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo referencia para futuras mejoras con el SDK de React o CDN
    void MP_PUBLIC_KEY;
  }, []);

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
            {loading ? 'Creando orden…' : 'Pagar con Mercado Pago'}
          </button>
          <p className="note">Se abrirá el checkout seguro de Mercado Pago.</p>
        </section>
      </div>
    </div>
  );
}

export default Checkout;
