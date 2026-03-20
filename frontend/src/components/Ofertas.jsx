import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, Loader2, ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import ModalProducto from './ModalProducto';

const Ofertas = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [agregado, setAgregado] = useState({});
  const [productoModal, setProductoModal] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerOfertas = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/productos/ofertas/`);
        const data = await response.json();
        setProductos(Array.isArray(data) ? data : []);
      } catch {
      } finally {
        setCargando(false);
      }
    };
    obtenerOfertas();
  }, []);

  const handleAddToCart = (producto) => {
    addToCart(producto);
    setAgregado((prev) => ({ ...prev, [producto.id_producto]: true }));
    setTimeout(() => {
      setAgregado((prev) => ({ ...prev, [producto.id_producto]: false }));
    }, 1500);
  };

  if (cargando) {
    return (
      <div className="ofertas-loader">
        <Loader2 className="spin-icon" size={36} />
        <span>Cargando ofertas...</span>
      </div>
    );
  }

  if (productos.length < 3) return null;

  const productosLimitados = productos.slice(0, 3);

  return (
    <>
      <section className="ofertas-section">
        <div className="ofertas-bg-decoration" aria-hidden="true">
          <div className="deco-circle deco-1" />
          <div className="deco-circle deco-2" />
        </div>

        {/* HEADER */}
        <div className="ofertas-header">
          <div className="ofertas-title-group">
            <div className="ofertas-icon-wrap">
              <Zap fill="white" size={22} />
            </div>
            <div>
              <h2 className="ofertas-title">¡Ofertas Relámpago!</h2>
              <p className="ofertas-subtitle">Descuentos especiales por tiempo limitado</p>
            </div>
          </div>
          <div className="ofertas-badge">
            <Tag size={14} />
            <div>
              <span className="badge-label">Stock limitado</span>
              <strong className="badge-value">Aprovecha ahora</strong>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="ofertas-grid">
          {productosLimitados.map((p) => (
            <div key={p.id_producto} className="oferta-card" onClick={() => setProductoModal(p)} style={{ cursor: 'pointer' }}>
              <span className="descuento-badge">{p.porcentaje_descuento}</span>

              <div className="card-imagen">
                <img src={p.imagen} alt={p.nombre} />
              </div>

              <div className="card-contenido">
                <h3 className="card-nombre">{p.nombre}</h3>
                <p className="card-descripcion">{p.descripcion}</p>

                <div className="card-precios">
                  <span className="precio-original">${Number(p.precio).toLocaleString('es-CO')}</span>
                  <span className="precio-oferta">${Number(p.precio_oferta).toLocaleString('es-CO')}</span>
                </div>

                <div className="card-stock">
                  <span className="stock-texto" style={{ color: p.stock < 5 ? '#ff4d4d' : '#22c55e' }}>
                    {p.stock < 5 ? `¡Solo ${p.stock} restantes!` : `${p.stock} en stock`}
                  </span>
                </div>

                <div className="card-acciones">
                  <button className="card-btn card-btn--outline" onClick={(e) => { e.stopPropagation(); setProductoModal(p); }}>
                    Detalles
                  </button>
                  <button
                    className={`card-btn ${agregado[p.id_producto] ? 'card-btn--agregado' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }}
                  >
                    <ShoppingCart size={15} />
                    {agregado[p.id_producto] ? '¡Agregado!' : 'Agregar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {productos.length > 3 && (
          <div className="ofertas-footer">
            <button className="btn-ver-todas" onClick={() => navigate('/todas-las-ofertas')}>
              Ver todas las ofertas ({productos.length}) <ArrowRight size={18} />
            </button>
          </div>
        )}
      </section>

      <ModalProducto producto={productoModal} onClose={() => setProductoModal(null)} />

      <style>{`
        .ofertas-loader { display:flex; align-items:center; justify-content:center; gap:12px; padding:60px 20px; color:#e60000; font-weight:600; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }

        .ofertas-section {
          position:relative; overflow:hidden;
          background: linear-gradient(135deg, #e60000 0%, #c00000 60%, #9a0000 100%);
          border-radius:24px; padding:48px 40px; margin:48px auto;
          max-width:1200px; width:calc(100% - 48px); color:white;
          box-shadow: 0 20px 60px rgba(230,0,0,0.35), 0 4px 16px rgba(0,0,0,0.15);
        }
        .ofertas-bg-decoration { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
        .deco-circle { position:absolute; border-radius:50%; background:rgba(255,255,255,0.06); }
        .deco-1 { width:400px; height:400px; top:-120px; right:-100px; }
        .deco-2 { width:240px; height:240px; bottom:-80px; left:-60px; }

        .ofertas-header { position:relative; display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:40px; flex-wrap:wrap; }
        .ofertas-title-group { display:flex; align-items:center; gap:16px; }
        .ofertas-icon-wrap { display:flex; align-items:center; justify-content:center; width:48px; height:48px; background:rgba(255,255,255,0.2); border-radius:14px; flex-shrink:0; backdrop-filter:blur(6px); }
        .ofertas-title { margin:0; font-size:clamp(1.5rem,3vw,2.2rem); font-weight:800; letter-spacing:-0.5px; line-height:1.1; }
        .ofertas-subtitle { margin:4px 0 0; opacity:0.85; font-size:0.9rem; }
        .ofertas-badge { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); backdrop-filter:blur(8px); padding:12px 18px; border-radius:14px; flex-shrink:0; }
        .badge-label { display:block; font-size:10px; text-transform:uppercase; letter-spacing:1.5px; opacity:0.8; }
        .badge-value { display:block; font-size:1rem; font-weight:800; }

        .ofertas-grid { position:relative; display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }

        .oferta-card { position:relative; background:#fff; color:#1a1a1a; border-radius:20px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 8px 24px rgba(0,0,0,0.12); transition:transform 0.3s ease, box-shadow 0.3s ease; }
        .oferta-card:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(0,0,0,0.2); }

        .descuento-badge { position:absolute; top:14px; right:14px; background:#fbbf24; color:#7c2d00; font-size:12px; font-weight:800; padding:4px 10px; border-radius:20px; z-index:2; box-shadow:0 2px 8px rgba(251,191,36,0.4); }

        .card-imagen { width:100%; aspect-ratio:4/3; background:#f0f0f0; overflow:hidden; border-bottom:1px solid #ebebeb; flex-shrink:0; }
        .card-imagen img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; transition:transform 0.35s ease; }
        .oferta-card:hover .card-imagen img { transform:scale(1.07); }

        .card-contenido { padding:18px 18px 20px; display:flex; flex-direction:column; flex:1; }
        .card-nombre { font-size:0.95rem; font-weight:700; line-height:1.35; margin:0 0 8px; color:#111; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.7em; }
        .card-descripcion { font-size:12.5px; color:#777; line-height:1.5; margin:0 0 14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.8em; }

        .card-precios { display:flex; align-items:baseline; gap:10px; margin-bottom:10px; }
        .precio-original { font-size:12.5px; color:#bbb; text-decoration:line-through; }
        .precio-oferta { font-size:1.55rem; font-weight:900; color:#e60000; letter-spacing:-0.5px; }

        .card-stock { margin-bottom:14px; }
        .stock-texto { font-size:12px; font-weight:700; }

        .card-acciones { display:grid; grid-template-columns:1fr 1.4fr; gap:10px; margin-top:auto; }
        .card-btn { display:flex; align-items:center; justify-content:center; gap:7px; padding:12px 0; border-radius:12px; font-size:13px; font-weight:800; cursor:pointer; transition:background 0.25s, transform 0.2s, border-color 0.2s; border:none; }
        .card-btn--outline { background:white; color:#1a1a1a; border:1.5px solid #ddd !important; }
        .card-btn--outline:hover { border-color:#e60000 !important; color:#e60000; }
        .card-btn:not(.card-btn--outline) { background:#e60000; color:white; }
        .card-btn:not(.card-btn--outline):hover { background:#bf0000; transform:translateY(-1px); }
        .card-btn:active { transform:scale(0.98); }
        .card-btn--agregado { background:#16a34a !important; }

        .ofertas-footer { position:relative; display:flex; justify-content:center; margin-top:36px; }
        .btn-ver-todas { display:inline-flex; align-items:center; gap:10px; background:white; color:#e60000; border:none; padding:14px 32px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; transition:background 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow:0 4px 14px rgba(0,0,0,0.12); }
        .btn-ver-todas:hover { background:#fff5f5; transform:scale(1.04); box-shadow:0 8px 22px rgba(0,0,0,0.18); }

        @media (max-width:960px) {
          .ofertas-grid { grid-template-columns:repeat(2,1fr); }
          .oferta-card:nth-child(3) { grid-column: 1/-1; width: calc(50% - 12px); margin: 0 auto; }
        }
        @media (max-width:640px) {
          .ofertas-section { padding:32px 20px; border-radius:18px; width:calc(100% - 32px); margin:32px auto; }
          .ofertas-header { flex-direction:column; align-items:flex-start; gap:16px; margin-bottom:28px; }
          .ofertas-badge { width:100%; justify-content:space-between; }
          .ofertas-grid { grid-template-columns:1fr; gap:18px; }
          .oferta-card:nth-child(3) { grid-column:auto; width:100%; margin:0; }
        }
        @media (max-width:400px) {
          .ofertas-title { font-size:1.4rem; }
          .card-contenido { padding:14px; }
        }
      `}</style>
    </>
  );
};

export default Ofertas;