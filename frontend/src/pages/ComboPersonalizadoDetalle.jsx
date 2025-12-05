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
import hamburguesa8 from '../assets/hamburguesa8.png';
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

// Mapeo de nombres de archivo a imágenes importadas
const IMAGE_MAP = {
  'hamburguesa.png': hamburguesa,
  'hamburguesa1.png': hamburguesa1,
  'hamburguesa2.png': hamburguesa2,
  'hamburguesa3.png': hamburguesa3,
  'hamburguesa4.png': hamburguesa4,
  'pizza.png': pizza,
  'pizza1.png': pizza1,
  'pizza2.png': pizza2,
  'pizza3.png': pizza3,
  'peperoni.png': peperoni,
  'perro.png': perro,
  'perro1.png': perro1,
  'perro2.png': perro2,
  'papas1.png': papas1,
  'papas2.png': papas2,
  'papas3.png': papas3,
  'bebida1.png': bebida1,
  'bebida2.png': bebida2,
  'bebida3.png': bebida3l,
  'bebida4.png': bebida4,
  'bebida5.png': bebida5,
  'pollo.png': pollo,
  'pollo1.png': pollo1,
  'pollo2.png': pollo2,
  'postres1.png': postres1,
  'postres2.png': postres2,
  'postres3.png': postres3,
};

// Función que usa las imágenes guardadas en la BD y las mapea correctamente
const getProductImage = (producto) => {
  // Priorizar la imagen_seleccionada guardada en la BD (desde el personalizador)
  if (producto.imagen_seleccionada) {
    const imagenImportada = IMAGE_MAP[producto.imagen_seleccionada];
    if (imagenImportada) {
      return imagenImportada;
    }
  }
  
  // Fallback a la imagen del producto si no hay imagen_seleccionada
  if (producto.imagen) {
    return absolutizeMediaUrl(producto.imagen);
  }
  
  // Fallback final - imagen por defecto según categoría
  const nombre = (producto.nombre || '').toLowerCase();
  // Correcciones específicas para coincidir con el personalizador
  if (nombre.includes('double') && nombre.includes('smash')) return hamburguesa8; // Double Smash => hamburguesa8.png
  if (nombre.includes('pizza') && nombre.includes('pepperoni')) return peperoni;  // Pepperoni => peperoni.png
  if (nombre.includes('alitas') && nombre.includes('simples')) return pollo1;    // Alitas simples => pollo1.png
  if (nombre.includes('hamburguesa') || nombre.includes('burger')) return hamburguesa;
  if (nombre.includes('pizza')) return pizza;
  if (nombre.includes('pollo') || nombre.includes('alita')) return pollo;
  if (nombre.includes('perro') || nombre.includes('hot')) return perro;
  if (nombre.includes('papa')) return papas1;
  if (nombre.includes('postre')) return postres1;
  
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
                  src={getProductImage(p)} 
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