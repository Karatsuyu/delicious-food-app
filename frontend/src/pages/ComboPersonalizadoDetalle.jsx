import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { absolutizeMediaUrl } from '../api/api';
import './ComboPersonalizadoDetalle.css';

// Mapeo de imágenes locales exactas del personalizador
import hamburguesa from '../assets/hamburguesa.png';
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
import pizza from '../assets/pizza.png';
import pizza1 from '../assets/pizza1.png';
import pizza2 from '../assets/pizza2.png';
import pizza3 from '../assets/pizza3.png';
import peperoni from '../assets/peperoni.png';
import perro from '../assets/perro.png';
import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import papas1 from '../assets/papas1.png';
import papas2 from '../assets/papas2.png';
import papas3 from '../assets/papas3.png';
import bebida3l from '../assets/bebida3.png';
import bebida1 from '../assets/bebida1.png';
import bebida2 from '../assets/bebida2.png';
import bebida4 from '../assets/bebida4.png';
import bebida5 from '../assets/bebida5.png';
import pollo from '../assets/pollo.png';
import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import postres1 from '../assets/postres1.png';
import postres2 from '../assets/postres2.png';
import postres3 from '../assets/postres3.png';

const getAssetForProduct = (name = '') => {
  if (!name) return hamburguesa;
  
  const key = name.trim().toLowerCase();
  
  // Mapeo exacto IDÉNTICO al personalizador
  const NAME_MAP = {
    // Mapeo exacto para los productos que aparecen en el combo JEGT
    'double smash': hamburguesa1,           // EXACTA del personalizador
    'pizza de pepperoni': peperoni,         // EXACTA: usa peperoni.png no pizza2.png
    'alitas simples': pollo1,               // EXACTA del personalizador
    
    // Hamburguesas - mapeo completo del personalizador
    'hamburguesa clásica': hamburguesa,
    'hamburguesa bbq': hamburguesa1,
    'hamburguesa pollo crispy': hamburguesa2,
    'hamburguesa vegetariana': hamburguesa3,
    'big mac': hamburguesa1,
    'whopper': hamburguesa2,
    'quarter pounder': hamburguesa3,
    'cheeseburger': hamburguesa4,
    
    // Pizzas - mapeo exacto del personalizador
    'pizza margherita': pizza,
    'pizza pepperoni': peperoni,            // Siempre peperoni.png para pepperoni
    'pizza hawaiana': pizza1,
    'pizza cuatro quesos': pizza2,
    'pizza vegetariana': pizza3,
    'pizza suprema': pizza1,
    'pizza bbq': pizza2,
    
    // Pollo - mapeo exacto del personalizador
    'alitas simples': pollo1,
    'alitas bbq': pollo2,
    'nuggets de pollo': pollo,
    'pollo crispy': pollo1,
    'pollo asado': pollo2,
    'pollo empanizado': pollo,
    
    // Perros - mapeo exacto del personalizador
    'perro especial': perro1,
    'perro clásico': perro,
    'hot dog americano': perro2,
    'perro colombiano': perro1,
    'perro gourmet': perro2,
    
    // Papas - mapeo exacto del personalizador
    'papas fritas medianas': papas1,
    'papas fritas grandes': papas2,
    'papas con queso': papas3,
    'papas curly': papas2,
    'papas rústicas': papas3,
    'papas pequeñas': papas1,
    
    // Bebidas - mapeo exacto del personalizador
    'coca-cola': bebida1,
    'pepsi': bebida2,
    'sprite': bebida3l,
    'fanta': bebida4,
    'agua mineral': bebida5,
    'jugo de naranja': bebida1,
    'té helado': bebida2,
    'malteada': bebida4,
    'gaseosa': bebida3l,
    
    // Postres - mapeo exacto del personalizador
    'brownie de chocolate': postres1,
    'cheesecake': postres2,
    'helado de vainilla': postres3,
    'tiramisu': postres1,
    'flan casero': postres2,
    'torta de chocolate': postres3
  };
  
  // Buscar coincidencia exacta primero
  if (NAME_MAP[key]) {
    return NAME_MAP[key];
  }
  
  // Búsqueda por palabras clave EXACTAS del personalizador
  if (key.includes('double') && key.includes('smash')) return hamburguesa1;
  if (key.includes('alitas') && key.includes('simples')) return pollo1;
  if (key.includes('pizza') && key.includes('pepperoni')) return peperoni;  // MUY IMPORTANTE: peperoni.png
  if (key.includes('pepperoni')) return peperoni;  // SIEMPRE peperoni.png para pepperoni
  if (key.includes('pizza') && !key.includes('pepperoni')) return pizza;
  if (key.includes('hamburguesa') || key.includes('burger')) return hamburguesa;
  if (key.includes('perro') || key.includes('hot') || key.includes('dog')) return perro;
  if (key.includes('papas') || key.includes('fries')) return papas1;
  if (key.includes('pollo') || key.includes('chicken') || key.includes('alitas')) return pollo1;
  if (key.includes('coca')) return bebida1;
  if (key.includes('pepsi')) return bebida2;
  if (key.includes('sprite')) return bebida3l;
  if (key.includes('fanta')) return bebida4;
  if (key.includes('agua')) return bebida5;
  if (key.includes('bebida') || key.includes('jugo')) return bebida1;
  if (key.includes('brownie')) return postres1;
  if (key.includes('cheese') || key.includes('cake')) return postres2;
  if (key.includes('helado')) return postres3;
  if (key.includes('postre')) return postres1;
  
  return hamburguesa; // Default final
};

export default function ComboPersonalizadoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`combos-personalizados/${id}/`);
        setCombo(data);
      } catch (e) {
        setError(String(e?.response?.data?.detail || e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="page" style={{padding:24}}>Cargando combo…</div>;
  if (error) return (
    <div className="page" style={{padding:24}}>
      <p style={{color:'#b00020'}}>No se pudo cargar el combo: {error}</p>
      <button onClick={() => navigate('/perfil')} className="btn">Volver a mi perfil</button>
    </div>
  );
  if (!combo) return null;

  const productos = combo.productos_detalle || [];

  const onBack = () => {
    try {
      if (window.history && window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/perfil');
      }
    } catch {
      navigate('/perfil');
    }
  };

  return (
    <div className="combodetalle-page">
      <div className="combodetalle-header">
        <button className="btn-back" onClick={onBack}>← Volver</button>
        <h2>🍔 {combo.nombre || `Combo #${combo.id}`}</h2>
        <div className="meta">
          <span className="precio">${Number(combo.precio_total || 0).toLocaleString('es-CO')}</span>
          <span className="fecha">Creado: {new Date(combo.creado_en).toLocaleDateString('es-ES')}</span>
          <span className={`combo-estado ${combo.is_paid ? 'pagado' : 'pendiente'}`}>
            {combo.is_paid ? '✅ Pagado' : '⏳ Pendiente de pago'}
          </span>
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="combodetalle-empty">Este combo no tiene detalle de productos guardado.</div>
      ) : (
        <div className="combodetalle-grid">
          {productos.map(p => (
            <div key={p.id} className="combodetalle-item">
              <div className="img">
                <img 
                  src={p.imagen ? absolutizeMediaUrl(p.imagen) : getAssetForProduct(p.nombre)} 
                  alt={p.nombre} 
                />
              </div>
              <div className="info">
                <div className="row">
                  <div className="title">{p.nombre}</div>
                  <div className="unit">${Number(p.precio || 0).toLocaleString('es-CO')}</div>
                </div>
                <div className="sub">Cantidad: {p.cantidad}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}