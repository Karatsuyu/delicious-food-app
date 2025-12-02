import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { productService, absolutizeMediaUrl } from '../api/api';
import './CrearCombo.css';
import { useCart } from '../context/CartContext';
import combosIcon from '../assets/combos.png';
// Imágenes por categoría (idénticas a las usadas en Menu.jsx) para sincronizar visual y precios
import hamburguesa1 from '../assets/hamburguesa1.png';
import hamburguesa2 from '../assets/hamburguesa2.png';
import hamburguesa3 from '../assets/hamburguesa3.png';
import hamburguesa4 from '../assets/hamburguesa4.png';
import hamburguesa5 from '../assets/hamburguesa5.png';
import hamburguesa6 from '../assets/hamburguesa6.png';
import hamburguesa7 from '../assets/hamburguesa7.png';
import hamburguesa8 from '../assets/hamburguesa8.png';

import pizza1 from '../assets/pizza1.png';
import pizza2 from '../assets/pizza2.png';
import pizza3 from '../assets/pizza3.png';
import pizza4 from '../assets/pizza4.png';
import pizza5 from '../assets/pizza5.png';
import pizza6 from '../assets/pizza6.png';
import pizza7 from '../assets/pizza7.png';

import pollo1 from '../assets/pollo1.png';
import pollo2 from '../assets/pollo2.png';
import pollo3 from '../assets/pollo3.png';
import pollo4 from '../assets/pollo4.png';
import pollo5 from '../assets/pollo5.png';
import pollo6 from '../assets/pollo6.png';

import perro1 from '../assets/perro1.png';
import perro2 from '../assets/perro2.png';
import perro3 from '../assets/perro3.png';
import perro4 from '../assets/perro4.png';
import perro5 from '../assets/perro5.png';

import postres1 from '../assets/postres1.png';
import postres2 from '../assets/postres2.png';
import postres3 from '../assets/postres3.png';
import postres4 from '../assets/postres4.png';
import postres5 from '../assets/postres5.png';
import postres6 from '../assets/postres6.png';
import postres7 from '../assets/postres7.png';
import postres8 from '../assets/postres8.png';

import papas1 from '../assets/papas1.png';
import papas2 from '../assets/papas2.png';
import papas3 from '../assets/papas3.png';

import bebida1 from '../assets/bebida1.png';
import bebida2 from '../assets/bebida2.png';
import bebida3 from '../assets/bebida3.png';
import bebida4 from '../assets/bebida4.png';
import bebida5 from '../assets/bebida5.png';
import bebida6 from '../assets/bebida6.png';
import bebida7 from '../assets/bebida7.png';
import bebida8 from '../assets/bebida8.png';
import bebida9 from '../assets/bebida9.png';

// Mapea categorías a títulos en el estilo de sección existente
const TITULOS = {
  hamburguesas: 'HAMBURGUESAS',
  pizzas: 'PIZZAS',
  pollo: 'POLLO',
  perros: 'PERROS',
  postres: 'POSTRES',
  papas: 'PAPAS',
  bebidas: 'BEBIDAS'
};

function CrearCombo() {
  const navigate = useNavigate();
  const { addToCart, cartItems, updateCartItem } = useCart();
  const { id: editId } = useParams();
  const [original, setOriginal] = useState({ nombre: '', seleccion: {} });
  const [originalList, setOriginalList] = useState([]); // snapshot directo de item.items si existe
  const [productos, setProductos] = useState([]);
  const [seleccion, setSeleccion] = useState({}); // { productoId: cantidad }
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nombreInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const all = await productService.getAllProducts();
        // Enriquecer con imágenes y precios fijos del catálogo visual
        const enriched = enrichWithFixedAssets(all || []);
        setProductos(enriched);
      } catch (e) {
        console.error('Error cargando productos:', e);
        setError('No se pudieron cargar los productos');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Al montar: cerrar cualquier modal del carrito y enfocar el input
  useEffect(() => {
    try { window.dispatchEvent(new CustomEvent('close-cart-modal')); } catch {}
    nombreInputRef.current?.focus();
  }, []);

  // Prefill en modo edición (cuando llegamos desde el carrito)
  useEffect(() => {
    if (!editId || !Array.isArray(cartItems) || cartItems.length === 0) return;
    const item = cartItems.find(ci => String(ci.id) === String(editId));
    if (!item) return;
    // Nombre del combo
    if (item.nombre) setNombre(item.nombre);
    // Selección basada en items [{id, cantidad}]
    if (Array.isArray(item.items) && item.items.length > 0) {
      const mapSel = {};
      item.items.forEach(sub => {
        const pid = Number(sub.id);
        if (!Number.isNaN(pid)) {
          mapSel[pid] = Number(sub.cantidad) || 1;
        }
      });
      setSeleccion(mapSel);
      // Guardar snapshot original (una sola vez por carga)
      setOriginal(prev => ({
        nombre: item.nombre || prev.nombre,
        seleccion: Object.keys(prev.seleccion || {}).length ? prev.seleccion : mapSel
      }));
      // Guardar lista original si viene detallada
      try {
        if (Array.isArray(item.items) && item.items.length > 0) {
          const snap = item.items.map(sub => ({
            id: Number(sub.id),
            nombre: sub.nombre,
            cantidad: Number(sub.cantidad) || 1,
            precio: Number(sub.precioUnitario) || 0,
            subtotal: (Number(sub.precioUnitario) || 0) * (Number(sub.cantidad) || 1)
          }));
          setOriginalList(snap);
        }
      } catch {}
    }
  }, [editId, cartItems]);

  // Catálogo fijo (nombre -> precio, imagen) para igualar a Menu.jsx
  const fixedCatalog = useMemo(() => {
    const byName = {};
    const add = (arr) => arr.forEach(p => { byName[p.nombre.toLowerCase()] = p; });
    add([
      { nombre: 'Hamburguesa Clásica', precio: 7900, imagen: hamburguesa1 },
      { nombre: 'Hamburguesa con Queso', precio: 8900, imagen: hamburguesa2 },
      { nombre: 'Hamburguesa Deluxe', precio: 10900, imagen: hamburguesa3 },
      { nombre: 'BBQ Crispy', precio: 18000, imagen: hamburguesa4 },
      { nombre: 'Clásico Bacon', precio: 22500, imagen: hamburguesa5 },
      { nombre: 'Madurita Burger', precio: 24500, imagen: hamburguesa6 },
      { nombre: 'BBQ Crunch Burger', precio: 27000, imagen: hamburguesa7 },
      { nombre: 'Double Smash', precio: 30000, imagen: hamburguesa8 },
      // Pizzas
      { nombre: 'Pizza Hawaiana', precio: 32000, imagen: pizza1 },
      { nombre: 'Pizza de Queso', precio: 34900, imagen: pizza2 },
      { nombre: 'Pizza de Pepperoni', precio: 36900, imagen: pizza3 },
      { nombre: 'Pizza Aromática de Pepperoni', precio: 38000, imagen: pizza4 },
      { nombre: 'Pizza de Pollo y Champiñones', precio: 38000, imagen: pizza5 },
      { nombre: 'Pepperoni Lovers', precio: 40900, imagen: pizza6 },
      { nombre: 'Pizza Campesina', precio: 41500, imagen: pizza7 },
      // Pollo
      { nombre: 'Alitas Simples', precio: 12000, imagen: pollo1 },
      { nombre: 'Alitas Crocantes', precio: 12900, imagen: pollo2 },
      { nombre: 'Alitas BBQ', precio: 16000, imagen: pollo3 },
      { nombre: 'Alitas Teriyaki', precio: 16500, imagen: pollo4 },
      { nombre: 'Alitas Ajo Parmesano', precio: 18000, imagen: pollo5 },
      { nombre: 'Alitas Barbacoa', precio: 18000, imagen: pollo6 },
      // Perros
      { nombre: 'Perro Clásico', precio: 7000, imagen: perro1 },
      { nombre: 'Perro Crocante', precio: 12000, imagen: perro2 },
      { nombre: 'Perro Supremo', precio: 14000, imagen: perro3 },
      { nombre: 'Perro Crunch Teriyaki', precio: 16000, imagen: perro4 },
      { nombre: 'Perro Fresh', precio: 18000, imagen: perro5 },
      // Postres
      { nombre: 'Cono de Vainilla', precio: 4500, imagen: postres1 },
      { nombre: 'Cono de Vainilla y Chocolate', precio: 4500, imagen: postres2 },
      { nombre: 'Cono de Fresa', precio: 4500, imagen: postres3 },
      { nombre: 'Cono de Chocolate', precio: 4500, imagen: postres4 },
      { nombre: 'Sundae de Arequipe', precio: 6000, imagen: postres5 },
      { nombre: 'Sundae de Fresa', precio: 6000, imagen: postres6 },
      { nombre: 'Sundae de Chocolate', precio: 6000, imagen: postres7 },
      { nombre: 'Sundae de Caramelo', precio: 6000, imagen: postres8 },
      // Papas / acompañamientos
      { nombre: 'Papas Fritas', precio: 3500, imagen: papas1 },
      { nombre: 'Aros de Cebolla', precio: 3500, imagen: papas2 },
      { nombre: 'Nuggets de Pollo', precio: 3500, imagen: papas3 },
      // Bebidas
      { nombre: 'Coca-Cola Personal', precio: 4000, imagen: bebida1 },
      { nombre: 'Coca-Cola En Lata', precio: 4500, imagen: bebida2 },
      { nombre: 'Coca-Cola 3L', precio: 7500, imagen: bebida3 },
      { nombre: 'Sprite Personal', precio: 4000, imagen: bebida4 },
      { nombre: 'Sprite En Lata', precio: 4500, imagen: bebida5 },
      { nombre: 'Sprite 3L', precio: 7500, imagen: bebida6 },
      { nombre: 'Pepsi Personal', precio: 4000, imagen: bebida7 },
      { nombre: 'Pepsi En Lata', precio: 4500, imagen: bebida8 },
      { nombre: 'Pepsi 3L', precio: 7500, imagen: bebida9 },
    ]);
    return byName;
  }, []);

  const enrichWithFixedAssets = (arr) => {
    return arr.map(p => {
      const key = (p.nombre || '').toLowerCase();
      const fixed = fixedCatalog[key];
      if (fixed) {
        return {
          ...p,
          precio: fixed.precio,
          imagen: fixed.imagen
        };
      }
      // Fallback: mantener precio backend y sin imagen (se mostrará placeholder)
      return p;
    });
  };

  const resolveImage = (img) => {
    if (!img) return null;
    const s = String(img);
    // Si es media del backend, absolutizar; si es asset del frontend o URL absoluta, dejar tal cual
    if (s.startsWith('/media/')) return absolutizeMediaUrl(s);
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    // Vite resuelve imports a /assets/... en el mismo host del frontend
    return s;
  };

  const productosPorCategoria = useMemo(() => {
    const groups = {};
    (productos || []).forEach(p => {
      const cat = (p.categoria || '').toLowerCase().trim();
      if (cat === 'demo') return; // excluir productos de categoria demo
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [productos]);

  // Lista de seleccionados para mostrar en el resumen
  const seleccionados = useMemo(() => {
    const list = [];
    for (const [idStr, qty] of Object.entries(seleccion)) {
      const qtyNum = Number(qty) || 0;
      if (qtyNum <= 0) continue;
      const id = Number(idStr);
      const prod = productos.find(p => p.id === id);
      if (!prod) continue;
      const precio = Number(prod.precio) || 0;
      list.push({
        id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        precio,
        cantidad: qtyNum,
        subtotal: precio * qtyNum,
        imagen: resolveImage(prod.imagen)
      });
    }
    // Ordenar por categoría y nombre para lectura rápida
    return list.sort((a,b) => String(a.categoria).localeCompare(String(b.categoria)) || String(a.nombre).localeCompare(String(b.nombre)));
  }, [seleccion, productos]);

  const total = useMemo(() => {
    let t = 0;
    for (const [id, qty] of Object.entries(seleccion)) {
      const prod = productos.find(p => p.id === Number(id));
      if (prod && qty > 0) t += Number(prod.precio) * qty;
    }
    return t;
  }, [seleccion, productos]);

  const seleccionOriginalLista = useMemo(() => {
    // Si disponemos de snapshot directo (desde el carrito), úsalo
    if (Array.isArray(originalList) && originalList.length > 0) {
      return originalList.map(it => ({
        id: it.id,
        nombre: it.nombre,
        categoria: productos.find(p => p.id === Number(it.id))?.categoria,
        precio: it.precio,
        cantidad: it.cantidad,
        subtotal: it.subtotal,
        imagen: resolveImage(productos.find(p => p.id === Number(it.id))?.imagen)
      })).sort((a,b) => String(a.categoria||'').localeCompare(String(b.categoria||'')) || String(a.nombre).localeCompare(String(b.nombre)));
    }
    // Si no, derivar desde el mapa original + catálogo
    const list = [];
    for (const [idStr, qty] of Object.entries(original.seleccion || {})) {
      const qtyNum = Number(qty) || 0;
      if (qtyNum <= 0) continue;
      const id = Number(idStr);
      const prod = productos.find(p => p.id === id);
      if (!prod) continue;
      const precio = Number(prod.precio) || 0;
      list.push({
        id,
        nombre: prod.nombre,
        categoria: prod.categoria,
        precio,
        cantidad: qtyNum,
        subtotal: precio * qtyNum,
        imagen: resolveImage(prod.imagen)
      });
    }
    return list.sort((a,b) => String(a.categoria).localeCompare(String(b.categoria)) || String(a.nombre).localeCompare(String(b.nombre)));
  }, [originalList, original.seleccion, productos]);

  const totalOriginal = useMemo(() => {
    return seleccionOriginalLista.reduce((acc, it) => acc + (Number(it.subtotal) || 0), 0);
  }, [seleccionOriginalLista]);

  const restoreOriginal = () => {
    if (!editId) return;
    if (original?.nombre) setNombre(original.nombre);
    if (original?.seleccion && Object.keys(original.seleccion).length > 0) {
      setSeleccion(original.seleccion);
    } else if (Array.isArray(originalList) && originalList.length > 0) {
      const mapSel = {};
      originalList.forEach(it => { mapSel[Number(it.id)] = Number(it.cantidad) || 1; });
      setSeleccion(mapSel);
    }
    try { window.dispatchEvent(new CustomEvent('open-cart-modal')); } catch {}
  };

  // Fallback: si no logramos guardar snapshot original, y ya hay selección cargada, usarla como original
  useEffect(() => {
    if (!editId) return;
    if (Array.isArray(originalList) && originalList.length > 0) return;
    if (Object.keys(original.seleccion || {}).length > 0) return;
    if (Object.keys(seleccion || {}).length === 0) return;
    setOriginal(prev => ({ nombre: prev.nombre || nombre, seleccion }));
  }, [editId, seleccion, original.seleccion, originalList, nombre]);

  const toggleProducto = (productoId) => {
    setSeleccion(prev => {
      const current = prev[productoId] || 0;
      const next = current > 0 ? 0 : 1;
      return { ...prev, [productoId]: next };
    });
  };

  const changeCantidad = (productoId, delta) => {
    setSeleccion(prev => {
      const current = prev[productoId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productoId]: next };
    });
  };

  const handleAgregarCombo = async () => {
    try {
      const productosPayload = Object.entries(seleccion)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ producto: Number(id), cantidad: qty }));
      if (productosPayload.length === 0) {
        setError('Selecciona al menos un producto');
        return;
      }
      setError('');

      // 1) Agregar/Actualizar en el carrito local como un único ítem
      const firstSelectedId = Number(Object.keys(seleccion).find(id => seleccion[id] > 0));
      const firstProd = productos.find(p => p.id === firstSelectedId);
  const imagen = firstProd?.imagen ? resolveImage(firstProd.imagen) : combosIcon;
      const comboNombre = (nombre?.trim() || 'Combo personalizado');

      // Construimos el desglose de items seleccionados
      const itemsDetalle = Object.entries(seleccion)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const prod = productos.find(p => p.id === Number(id));
          return {
            id: Number(id),
            nombre: prod?.nombre || `Producto ${id}`,
            cantidad: qty,
            precioUnitario: Number(prod?.precio) || 0
          };
        });

      let cartItemId;
      if (editId) {
        // Modo edición: actualizar el ítem existente en el carrito
        cartItemId = String(editId);
        updateCartItem(cartItemId, (prev) => ({
          nombre: comboNombre,
          precio: total,
          imagen,
          categoria: 'combos',
          isCustomCombo: true,
          items: itemsDetalle
        }));
        try { window.dispatchEvent(new CustomEvent('open-cart-modal')); } catch {}
      } else {
        // Modo creación: crear un nuevo ítem en el carrito
        cartItemId = `combo-${Date.now()}`;
        addToCart({
          id: cartItemId,
          nombre: comboNombre,
          precio: total, // precio unitario será el total, cantidad inicia en 1
          imagen,
          categoria: 'combos',
          isCustomCombo: true,
          items: itemsDetalle
        });
      }

      // 2) Persistir en backend y actualizar el item del carrito con comboPersonalizadoId
      try {
        const resp = await api.post('orders/add-custom-combo/', {
          nombre: comboNombre,
          productos: productosPayload
        });
        if (resp?.data?.combo_id) {
          updateCartItem(cartItemId, { comboPersonalizadoId: resp.data.combo_id });
          console.log('[CrearCombo] comboPersonalizadoId asignado:', resp.data.combo_id);
        }
      } catch (persistErr) {
        console.warn('No se pudo persistir el combo en backend, se mantiene en carrito local:', persistErr);
        setError('El combo se agregó al carrito, pero no pudo guardarse en tu perfil. Inténtalo nuevamente.');
      }

      // Reset básico del formulario
      if (!editId) {
        setNombre('');
        setSeleccion({});
      }
    } catch (e) {
      console.error('Error agregando combo:', e);
      setError('No se pudo agregar el combo al carrito');
    }
  };

  if (loading) return <div className="crearcombo-page">Cargando productos...</div>;

  return (
    <div className="crearcombo-page">
      <div className="crearcombo-header">
        <h2 className="section-title-custom">Crear mi propio combo</h2>
        <div className="crearcombo-nombre">
          <label htmlFor="combo-nombre" className="crearcombo-label">Nombre del combo</label>
          <input
            id="combo-nombre"
            type="text"
            autoComplete="off"
            inputMode="text"
            maxLength={40}
            className="crearcombo-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Antojo Deluxe"
            ref={nombreInputRef}
          />
        </div>
      </div>

      {error && <div className="crearcombo-error">{error}</div>}

      <div className="crearcombo-layout">
        <div className="crearcombo-contenido crearcombo-main">
          {(() => {
          const dynamicCats = Object.keys(productosPorCategoria).filter(c => c !== 'demo');
          const ordered = [
            ...Object.keys(TITULOS),
            ...dynamicCats.filter(c => !TITULOS[c])
          ];
          if (ordered.length === 0) {
            return <div className="crearcombo-empty">No hay productos disponibles. ¿Has ejecutado la carga de datos de ejemplo?</div>;
          }
          return ordered.map(catKey => {
            const lista = productosPorCategoria[catKey] || [];
            if (lista.length === 0) return null;
            const titulo = TITULOS[catKey] || catKey.toUpperCase();
            return (
              <section key={catKey} className="crearcombo-seccion">
                <h3 className="section-title-custom crearcombo-titulo">{titulo}</h3>
                <div className="crearcombo-grid">
                  {lista.map(p => {
                    const qty = seleccion[p.id] || 0;
                    return (
                      <div key={p.id} className={`crearcombo-item ${qty>0 ? 'seleccionado' : ''}`}
                           onClick={() => toggleProducto(p.id)}>
                        <div className="product-image">
                          {p.imagen ? <img src={resolveImage(p.imagen)} alt={p.nombre} /> : <div className="product-placeholder">🍔</div>}
                        </div>
                        <div className="product-info">
                          <h4 className="product-title">{p.nombre}</h4>
                          <p className="product-price">${Number(p.precio).toLocaleString('es-CO')}</p>
                          <div className="crearcombo-cant">
                            <button onClick={(e)=>{e.stopPropagation(); changeCantidad(p.id,-1);}}>-</button>
                            <span>{qty}</span>
                            <button onClick={(e)=>{e.stopPropagation(); changeCantidad(p.id,1);}}>+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          });
        })()}
        </div>

  {/* Resumen de selección a la derecha */}
        <aside className="crearcombo-resumen">
          <div className="resumen-card">
            <h3 className="resumen-title">Tu combo {editId ? '(editando)' : ''}</h3>
            {editId && (
              <div className="resumen-toolbar">
                <button className="mini ghost" onClick={restoreOriginal} title="Restaurar selección original">Restaurar original</button>
              </div>
            )}
            {seleccionados.length === 0 ? (
              <p className="resumen-empty">Aún no has seleccionado productos</p>
            ) : (
              <ul className="resumen-list">
                {seleccionados.map(item => (
                  <li key={item.id} className={`resumen-row ${editId && (original.seleccion?.[item.id] ?? 0) !== item.cantidad ? 'changed' : ''}`}>
                    <div className="resumen-info">
                      <div className="resumen-line">
                        {item.imagen && (
                          <img src={item.imagen} alt={item.nombre} className="resumen-thumb" />
                        )}
                        <span className="qty">{item.cantidad}×</span>
                        <span className="name" title={item.nombre}>{item.nombre}</span>
                        {editId && (original.seleccion?.[item.id] ?? 0) !== item.cantidad && (
                          <span className="badge-changed" title={`Antes: ${original.seleccion?.[item.id] ?? 0}`}>modificado</span>
                        )}
                      </div>
                      <div className="resumen-prices">
                        <span className="unit">${item.precio.toLocaleString('es-CO')}</span>
                        <span className="sub">${item.subtotal.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                    <div className="resumen-actions">
                      <button className="mini" onClick={(e)=>{e.preventDefault(); changeCantidad(item.id,-1);}}>-</button>
                      <button className="mini" onClick={(e)=>{e.preventDefault(); changeCantidad(item.id,1);}}>+</button>
                      <button className="mini danger" onClick={(e)=>{e.preventDefault(); setSeleccion(prev=>({ ...prev, [item.id]: 0 }));}}>×</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="resumen-total">
              <span>Total</span>
              <strong>${total.toLocaleString('es-CO')}</strong>
            </div>
          </div>

          {editId && (
            <div className="resumen-card resumen-original">
              <h3 className="resumen-title">Selección original</h3>
              {seleccionOriginalLista.length === 0 ? (
                <p className="resumen-empty">Sin contenido original. Es posible que este combo se haya creado antes de guardar su desglose. Vuelve a armarlo y al guardar quedará listo para futuras ediciones.</p>
              ) : (
                <ul className="resumen-list">
                  {seleccionOriginalLista.map(item => (
                    <li key={item.id} className="resumen-row">
                      <div className="resumen-info">
                        <div className="resumen-line">
                          {item.imagen && (
                            <img src={item.imagen} alt={item.nombre} className="resumen-thumb" />
                          )}
                          <span className="qty">{item.cantidad}×</span>
                          <span className="name" title={item.nombre}>{item.nombre}</span>
                        </div>
                        <div className="resumen-prices">
                          <span className="unit">${item.precio.toLocaleString('es-CO')}</span>
                          <span className="sub">${item.subtotal.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="resumen-total">
                <span>Total original</span>
                <strong>${totalOriginal.toLocaleString('es-CO')}</strong>
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="crearcombo-footer">
        <div className="crearcombo-total">Total: ${total.toLocaleString('es-CO')}</div>
        <button className="btn-agregar-combo" onClick={handleAgregarCombo} disabled={total<=0}>
          {editId ? 'Guardar cambios' : 'Agregar combo al carrito'}
        </button>
      </div>
    </div>
  );
}

export default CrearCombo;
