import React, { useState, useEffect } from 'react';
import { Zap, ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import ModalProducto from '../components/ModalProducto';

const TodasLasOfertas = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [agregado, setAgregado] = useState({});
  const [productoModal, setProductoModal] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
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
      <div className="tlo-loader">
        <Loader2 className="tlo-spin" size={40} />
        <span>Cargando ofertas...</span>
      </div>
    );
  }

  return (
    <>
      <div className="tlo-page">

        {/* HERO HEADER */}
        <div className="tlo-hero">
          <div className="tlo-hero-inner">
            <button className="tlo-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Volver
            </button>
            <div className="tlo-hero-text">
              <div className="tlo-hero-icon">
                <Zap fill="white" size={24} />
              </div>
              <div>
                <h1 className="tlo-hero-title">Todas nuestras Ofertas</h1>
                <p className="tlo-hero-subtitle">
                  Aprovecha estos descuentos antes de que se agoten — {productos.length} productos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="tlo-container">
          {productos.length === 0 ? (
            <div className="tlo-empty">
              <Zap size={48} color="#ddd" />
              <p>No hay ofertas disponibles en este momento.</p>
            </div>
          ) : (
            <div className="tlo-grid">
              {productos.map((p) => (
                <div key={p.id_producto} className="tlo-card" onClick={() => setProductoModal(p)} style={{ cursor: 'pointer' }}>
                  <span className="tlo-descuento-badge">{p.porcentaje_descuento}</span>

                  <div className="tlo-card-imagen">
                    <img src={p.imagen} alt={p.nombre} />
                  </div>

                  <div className="tlo-card-contenido">
                    <h3 className="tlo-card-nombre">{p.nombre}</h3>
                    <p className="tlo-card-descripcion">{p.descripcion}</p>

                    <div className="tlo-card-precios">
                      <span className="tlo-precio-original">${Number(p.precio).toLocaleString('es-CO')}</span>
                      <span className="tlo-precio-oferta">${Number(p.precio_oferta).toLocaleString('es-CO')}</span>
                    </div>

                    <div className="tlo-card-stock">
                      <span style={{ color: p.stock < 5 ? '#ff4d4d' : '#22c55e' }}>
                        {p.stock < 5 ? `¡Solo ${p.stock} restantes!` : `${p.stock} en stock`}
                      </span>
                    </div>

                    <div className="tlo-card-acciones">
                      <button className="tlo-btn tlo-btn--outline" onClick={(e) => { e.stopPropagation(); setProductoModal(p); }}>
                        Detalles
                      </button>
                      <button
                        className={`tlo-btn ${agregado[p.id_producto] ? 'tlo-btn--agregado' : ''}`}
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
          )}
        </div>
      </div>

      <ModalProducto producto={productoModal} onClose={() => setProductoModal(null)} />

      <style>{`
        .tlo-loader { display:flex; align-items:center; justify-content:center; gap:12px; height:100vh; color:#e60000; font-weight:600; font-size:15px; }
        @keyframes tlo-spin { to { transform:rotate(360deg); } }
        .tlo-spin { animation:tlo-spin 1s linear infinite; }

        .tlo-page { min-height:100vh; background:#f4f4f5; }

        .tlo-hero { background:linear-gradient(135deg,#e60000 0%,#c00000 60%,#9a0000 100%); padding:40px 5% 48px; color:white; position:relative; overflow:hidden; }
        .tlo-hero::after { content:''; position:absolute; width:500px; height:500px; border-radius:50%; background:rgba(255,255,255,0.05); top:-180px; right:-120px; pointer-events:none; }
        .tlo-hero-inner { max-width:1200px; margin:0 auto; position:relative; }
        .tlo-back-btn { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); color:white; padding:8px 16px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; margin-bottom:28px; transition:background 0.2s; backdrop-filter:blur(6px); }
        .tlo-back-btn:hover { background:rgba(255,255,255,0.25); }
        .tlo-hero-text { display:flex; align-items:center; gap:18px; }
        .tlo-hero-icon { display:flex; align-items:center; justify-content:center; width:54px; height:54px; background:rgba(255,255,255,0.2); border-radius:16px; flex-shrink:0; backdrop-filter:blur(6px); }
        .tlo-hero-title { margin:0; font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:900; letter-spacing:-0.5px; line-height:1.1; }
        .tlo-hero-subtitle { margin:6px 0 0; opacity:0.85; font-size:0.9rem; }

        .tlo-container { max-width:1200px; margin:0 auto; padding:40px 5% 60px; }
        .tlo-empty { display:flex; flex-direction:column; align-items:center; gap:16px; padding:80px 20px; color:#aaa; font-size:15px; }

        .tlo-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }

        .tlo-card { position:relative; background:white; border-radius:20px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 4px 16px rgba(0,0,0,0.08); transition:transform 0.3s ease, box-shadow 0.3s ease; }
        .tlo-card:hover { transform:translateY(-6px); box-shadow:0 16px 36px rgba(0,0,0,0.15); }

        .tlo-descuento-badge { position:absolute; top:14px; right:14px; background:#fbbf24; color:#7c2d00; font-size:11.5px; font-weight:800; padding:4px 10px; border-radius:20px; z-index:2; box-shadow:0 2px 8px rgba(251,191,36,0.4); }

        .tlo-card-imagen { width:100%; aspect-ratio:4/3; background:#f0f0f0; overflow:hidden; border-bottom:1px solid #ebebeb; flex-shrink:0; }
        .tlo-card-imagen img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; transition:transform 0.35s ease; }
        .tlo-card:hover .tlo-card-imagen img { transform:scale(1.07); }

        .tlo-card-contenido { padding:16px 16px 18px; display:flex; flex-direction:column; flex:1; }
        .tlo-card-nombre { font-size:0.9rem; font-weight:700; line-height:1.35; margin:0 0 6px; color:#111; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.4em; }
        .tlo-card-descripcion { font-size:12px; color:#888; line-height:1.5; margin:0 0 12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.4em; }

        .tlo-card-precios { display:flex; align-items:baseline; gap:8px; margin-bottom:8px; }
        .tlo-precio-original { font-size:12px; color:#bbb; text-decoration:line-through; }
        .tlo-precio-oferta { font-size:1.45rem; font-weight:900; color:#e60000; letter-spacing:-0.5px; }

        .tlo-card-stock { font-size:11.5px; font-weight:700; margin-bottom:12px; }

        .tlo-card-acciones { display:grid; grid-template-columns:1fr 1.4fr; gap:8px; margin-top:auto; }
        .tlo-btn { display:flex; align-items:center; justify-content:center; gap:6px; padding:11px 0; border-radius:12px; font-size:12.5px; font-weight:800; cursor:pointer; transition:background 0.25s, transform 0.2s, border-color 0.2s; border:none; }
        .tlo-btn--outline { background:white; color:#1a1a1a; border:1.5px solid #ddd !important; }
        .tlo-btn--outline:hover { border-color:#e60000 !important; color:#e60000; }
        .tlo-btn:not(.tlo-btn--outline) { background:#e60000; color:white; }
        .tlo-btn:not(.tlo-btn--outline):hover { background:#bf0000; transform:translateY(-1px); }
        .tlo-btn:active { transform:scale(0.98); }
        .tlo-btn--agregado { background:#16a34a !important; }

        @media (max-width:1100px) { .tlo-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:768px) {
          .tlo-grid { grid-template-columns:repeat(2,1fr); gap:16px; }
          .tlo-hero { padding:28px 5% 36px; }
          .tlo-container { padding:28px 5% 48px; }
        }
        @media (max-width:480px) {
          .tlo-grid { grid-template-columns:1fr; }
          .tlo-hero-text { flex-direction:column; align-items:flex-start; gap:12px; }
          .tlo-hero-icon { width:44px; height:44px; }
        }
      `}</style>
    </>
  );
};

export default TodasLasOfertas;