import { useLocation } from 'react-router-dom';

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function PaymentResult({ type }) {
  const q = useQuery();
  const status = q.get('status') || q.get('collection_status') || (type === 'success' ? 'approved' : type);
  const paymentId = q.get('payment_id') || q.get('collection_id') || '-';
  const preferenceId = q.get('preference_id') || '-';
  const externalRef = q.get('external_reference') || '-';

  const title = type === 'success' ? '¡Pago aprobado!' : type === 'failure' ? 'Pago rechazado' : 'Pago pendiente';
  const color = type === 'success' ? '#16a34a' : type === 'failure' ? '#b00020' : '#b45309';

  return (
    <div style={{ padding: '0 28px 18px', marginTop: 56 }}>
      <div style={{ background:'#fff', border:'2px solid #F28C1E', borderRadius:14, padding:16 }}>
        <h2 style={{ color: '#F28C1E', marginTop: 0 }}>{title}</h2>
        <p><strong>Estado:</strong> <span style={{ color }}>{status}</span></p>
        <p><strong>ID de pago:</strong> {paymentId}</p>
        <p><strong>ID de preferencia:</strong> {preferenceId}</p>
        <p><strong>Referencia externa:</strong> {externalRef}</p>
        <p>Te enviamos el comprobante al correo asociado al pago si aplica.</p>
      </div>
    </div>
  );
}
