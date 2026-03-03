import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ModalProducto = ({ producto, onClose }) => {
  const [indexFoto, setIndexFoto] = useState(0);
  const [agregado, setAgregado] = useState(false);
  const { addToCart } = useCart();
  const scrollRef = useRef(0);

  useEffect(() => { setIndexFoto(0); setAgregado(false); }, [producto]);

  // Bloquear scroll + clase para ocultar botón WhatsApp
  useEffect(() => {
    if (producto) {
      scrollRef.current = window.scrollY;
      document.body.classList.add('modal-open');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, scrollRef.current);
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [producto]);

  if (!producto) return null;

  const enOferta = producto.precio_oferta && Number(producto.precio_oferta) < Number(producto.precio);
  const precioFinal = enOferta ? Number(producto.precio_oferta) : Number(producto.precio);

  const todasLasFotos = [
    producto.imagen,
    ...(producto.imagenes_adicionales?.map(img => img.imagen) || [])
  ].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(producto);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <>
      <div className="mp-overlay" onClick={onClose}>
        <div className="mp-content" onClick={e => e.stopPropagation()}>

          <button className="mp-back-btn" onClick={onClose}>
            ← Volver a productos
          </button>

          <div className="mp-grid">

            {/* ── COLUMNA IZQUIERDA ── */}
            <div className="mp-left">
              <div className="mp-foto-principal">
                <img src={todasLasFotos[indexFoto]} alt={producto.nombre} />
                {todasLasFotos.length > 1 && (
                  <>
                    <button className="mp-arrow mp-arrow--left"
                      onClick={() => setIndexFoto(i => i === 0 ? todasLasFotos.length - 1 : i - 1)}>❮</button>
                    <button className="mp-arrow mp-arrow--right"
                      onClick={() => setIndexFoto(i => i === todasLasFotos.length - 1 ? 0 : i + 1)}>❯</button>
                  </>
                )}
                {enOferta && (
                  <span className="mp-foto-badge">{producto.porcentaje_descuento}</span>
                )}
              </div>

              {todasLasFotos.length > 1 && (
                <div className="mp-thumbnails">
                  {todasLasFotos.map((foto, idx) => (
                    <img key={idx} src={foto} alt={`miniatura ${idx}`}
                      onClick={() => setIndexFoto(idx)}
                      className={`mp-thumb ${indexFoto === idx ? 'mp-thumb--active' : ''}`}
                    />
                  ))}
                </div>
              )}

              <div className="mp-tags">
                <span className="mp-tag mp-tag--red">{producto.categoria_nombre || 'Accesorio'}</span>
                <span className="mp-tag mp-tag--blue">{producto.calidad || 'Importado'}</span>
              </div>
            </div>

            {/* ── COLUMNA DERECHA ── */}
            <div className="mp-right">
              <h2 className="mp-nombre">{producto.nombre}</h2>
              <p className="mp-descripcion">{producto.descripcion}</p>

              <div className="mp-precio-box">
                <div>
                  <span className="mp-precio-label">Precio</span>
                  {enOferta && (
                    <span className="mp-precio-antes">
                      ${Number(producto.precio).toLocaleString('es-CO')} COP
                    </span>
                  )}
                  <div className="mp-precio-valor">
                    ${precioFinal.toLocaleString('es-CO')}
                    <span className="mp-precio-cop"> COP</span>
                    {enOferta && (
                      <span className="mp-oferta-chip">{producto.porcentaje_descuento}</span>
                    )}
                  </div>
                </div>
                <div className="mp-stock-info">
                  <span style={{ color: producto.stock < 5 ? '#e60000' : '#16a34a' }}>
                    ✓ {producto.stock < 5 ? `¡Solo ${producto.stock} restantes!` : `${producto.stock} en stock`}
                  </span>
                </div>
              </div>

              {(producto.peso || producto.dimensiones) && (
                <div className="mp-specs">
                  {producto.peso && (
                    <div className="mp-spec-item">
                      <span className="mp-spec-label">Peso aprox.</span>
                      <span className="mp-spec-val">{producto.peso} kg</span>
                    </div>
                  )}
                  {producto.dimensiones && (
                    <div className="mp-spec-item">
                      <span className="mp-spec-label">Dimensiones</span>
                      <span className="mp-spec-val">{producto.dimensiones}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                className={`mp-btn-cart ${producto.stock <= 0 ? 'mp-btn-cart--agotado' : ''} ${agregado ? 'mp-btn-cart--agregado' : ''}`}
                onClick={handleAddToCart}
                disabled={producto.stock <= 0}
              >
                <ShoppingCart size={20} />
                {producto.stock <= 0 ? 'Agotado' : agregado ? '¡Agregado al carrito!' : 'Agregar al Carrito'}
              </button>

              {producto.caracteristicas ? (
                <div className="mp-section">
                  <h4 className="mp-section-title">Características</h4>
                  <ul className="mp-features">
                    {producto.caracteristicas.split(',').map((item, i) => (
                      <li key={i}><span className="mp-check">✓</span>{item.trim()}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mp-sin-data">Sin características registradas</p>
              )}

              {producto.vehiculos && producto.vehiculos.length > 0 ? (
                <div className="mp-section">
                  <h4 className="mp-section-title">Modelos Compatibles</h4>
                  <div className="mp-modelos">
                    {producto.vehiculos.map((v, i) => (
                      <div key={v.id_vehiculo || i} className="mp-modelo-chip">
                        {v.nombre_completo}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mp-sin-data">No hay modelos compatibles registrados</p>
              )}

              <a
                href={`https://wa.me/573005307606?text=Hola! Estoy interesado en el producto: ${producto.nombre}`}
                target="_blank"
                rel="noreferrer"
                className="mp-btn-wa"
              >
                Preguntar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mp-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000; padding: 20px;
          backdrop-filter: blur(4px);
          overflow-y: auto; box-sizing: border-box;
        }
        .mp-content {
          background: white; border-radius: 24px;
          max-width: 1000px; width: 100%; max-height: 90vh;
          overflow-y: auto; position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          margin: auto; box-sizing: border-box;
        }
        .mp-back-btn {
          position: absolute; top: 20px; left: 20px;
          border: none; background: transparent; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          color: #666; font-size: 14px; font-weight: 600; z-index: 10;
          padding: 6px 10px; border-radius: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .mp-back-btn:hover { background: #f4f4f5; color: #111; }
        .mp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px; padding: 64px 40px 40px;
        }
        .mp-foto-principal {
          position: relative; width: 100%;
          aspect-ratio: 1/1; border-radius: 16px;
          overflow: hidden; background: #f0f0f0; margin-bottom: 12px;
        }
        .mp-foto-principal img { width: 100%; height: 100%; object-fit: contain; }
        .mp-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.85); border: none;
          border-radius: 50%; width: 36px; height: 36px;
          cursor: pointer; font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: background 0.2s;
        }
        .mp-arrow:hover { background: white; }
        .mp-arrow--left { left: 10px; }
        .mp-arrow--right { right: 10px; }
        .mp-foto-badge {
          position: absolute; top: 12px; right: 12px;
          background: #fbbf24; color: #7c2d00;
          font-size: 12px; font-weight: 800;
          padding: 4px 12px; border-radius: 20px;
          box-shadow: 0 2px 8px rgba(251,191,36,0.5);
        }
        .mp-thumbnails { display: flex; gap: 10px; overflow-x: auto; padding: 4px 0; }
        .mp-thumb {
          width: 60px; height: 60px; object-fit: cover;
          border-radius: 8px; cursor: pointer; flex-shrink: 0;
          border: 2px solid transparent; transition: border-color 0.2s;
        }
        .mp-thumb--active { border-color: #e60000; }
        .mp-tags { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
        .mp-tag { padding: 5px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .mp-tag--red { background: #e60000; color: white; }
        .mp-tag--blue { background: #2563eb; color: white; }
        .mp-nombre { font-size: 28px; font-weight: 800; color: #111; margin: 0 0 10px; line-height: 1.2; }
        .mp-descripcion { font-size: 15px; color: #444; line-height: 1.65; margin: 0 0 20px; white-space: pre-line; }
        .mp-precio-box {
          background: #f9f9f9; border-radius: 14px;
          padding: 18px 20px; display: flex;
          justify-content: space-between; align-items: center;
          margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
        }
        .mp-precio-label { display: block; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
        .mp-precio-antes { display: block; font-size: 13px; color: #bbb; text-decoration: line-through; margin-bottom: 2px; }
        .mp-precio-valor { display: flex; align-items: baseline; gap: 6px; font-size: 28px; font-weight: 900; color: #e60000; flex-wrap: wrap; }
        .mp-precio-cop { font-size: 13px; font-weight: 500; color: #999; }
        .mp-oferta-chip { background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 20px; border: 1px solid #fde68a; }
        .mp-stock-info { font-size: 13px; font-weight: 700; text-align: right; }
        .mp-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; padding: 14px 16px; background: #f1f5f9; border-radius: 12px; border: 1px solid #e2e8f0; }
        .mp-spec-label { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 2px; }
        .mp-spec-val { font-size: 14px; font-weight: 600; color: #1e293b; }
        .mp-btn-cart {
          width: 100%; padding: 15px;
          background: #e60000; color: white;
          border: none; border-radius: 12px;
          font-size: 15px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer; margin-bottom: 24px;
          transition: background 0.25s, transform 0.2s;
        }
        .mp-btn-cart:hover:not(:disabled) { background: #bf0000; transform: translateY(-1px); }
        .mp-btn-cart:active:not(:disabled) { transform: scale(0.98); }
        .mp-btn-cart--agotado { background: #ccc !important; cursor: not-allowed; }
        .mp-btn-cart--agregado { background: #16a34a !important; }
        .mp-section { margin-bottom: 22px; }
        .mp-section-title { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 10px; }
        .mp-features { list-style: none; padding: 0; margin: 0; }
        .mp-features li { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 7px; color: #444; font-size: 13.5px; line-height: 1.5; }
        .mp-check { color: #e60000; font-weight: 800; flex-shrink: 0; }
        .mp-modelos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .mp-modelo-chip { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 7px 12px; border-radius: 10px; font-size: 12.5px; color: #475569; }
        .mp-sin-data { font-size: 13px; color: #999; font-style: italic; margin-bottom: 16px; }
        .mp-btn-wa {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 14px; border-radius: 12px;
          background: #25d366; color: white; font-weight: 800;
          text-decoration: none; font-size: 15px;
          transition: background 0.2s, transform 0.2s; box-sizing: border-box;
        }
        .mp-btn-wa:hover { background: #1db954; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .mp-overlay { padding: 10px; align-items: flex-start; padding-top: 16px; }
          .mp-content { border-radius: 20px; max-height: none; }
          .mp-grid { grid-template-columns: 1fr; gap: 20px; padding: 56px 16px 28px; }
          .mp-nombre { font-size: 22px; }
          .mp-modelos { grid-template-columns: 1fr; }
          .mp-specs { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .mp-overlay { padding: 6px; }
          .mp-grid { padding: 52px 12px 20px; }
          .mp-nombre { font-size: 20px; }
          .mp-precio-valor { font-size: 24px; }
        }
      `}</style>
    </>
  );
};

export default ModalProducto;