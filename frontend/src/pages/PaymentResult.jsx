import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/api';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function PaymentResult({ type }) {
  const q = useQuery();
  const [info, setInfo] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const sessionId = q.get('session_id');
    if (!sessionId) return;

    // Confirmar la sesión en backend (autenticado) para marcar combo pagado si corresponde
    (async () => {
      try {
        const { data } = await api.post('payments/confirm-session/', { session_id: sessionId });
        setInfo(data);

        // Si el pago está completo, limpiar carrito en backend y frontend
        if (data.payment_status === 'paid' || data.status === 'complete') {
          try { await api.post('orders/cart/clear/'); } catch (_) {}
          try { window.dispatchEvent(new CustomEvent('clear-local-cart')); } catch (_) {}
        }
      } catch (e) {
        setErr(String(e?.response?.data?.error || e.message || e));
      }
    })();
  }, [q]);

  const title = type === 'success' ? '¡Pago aprobado!' : type === 'failure' ? 'Pago rechazado' : 'Pago pendiente';
  const color = type === 'success' ? '#16a34a' : type === 'failure' ? '#b00020' : '#b45309';

  return (
    <div style={{ padding: '0 28px 18px', marginTop: 56 }}>
      <div style={{ background:'#fff', border:'2px solid #F28C1E', borderRadius:14, padding:16 }}>
        <h2 style={{ color: '#F28C1E', marginTop: 0 }}>{title}</h2>
        {info ? (
          <>
            <p><strong>Estado:</strong> <span style={{ color }}>{info.payment_status}</span></p>
            <p><strong>Total:</strong> {info.amount_total}</p>
            <p><strong>Moneda:</strong> {info.currency}</p>
            <p><strong>Session:</strong> {info.id}</p>
          </>
        ) : (
          <p>Cargando detalles del pago…</p>
        )}
        {err && <p style={{ color:'#b00020' }}>Error: {err}</p>}
      </div>
    </div>
  );
}
