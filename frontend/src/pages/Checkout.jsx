import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { MapPin, Phone, User, Send, Info, Building2, Smartphone, Package, ShieldCheck, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { cart, totalPrecio } = useCart();

  const [tipoEnvio, setTipoEnvio] = useState('domicilio');
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: '',
    municipio: '',
    ciudad: '',
  });

  const [errores, setErrores] = useState({});

  const validar = () => {
    const e = {};
    if (!formData.nombre.trim())   e.nombre   = 'Requerido';
    if (!formData.cedula.trim())   e.cedula   = 'Requerido';
    if (!formData.telefono.trim()) e.telefono = 'Requerido';
    if (!formData.direccion.trim() && tipoEnvio === 'domicilio') e.direccion = 'Requerido';
    if (!formData.municipio.trim()) e.municipio = 'Requerido';
    if (!formData.ciudad.trim())    e.ciudad    = 'Requerido';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleRealizarEnvio = () => {
    if (!validar()) return;
    const numeroDuenio = "573005307606";

    const listaProductos = cart.map(item => `- ${item.nombre} (x${item.cantidad})`).join('\n');
    const total = totalPrecio;

    let lugarEntrega;
    if (tipoEnvio === 'domicilio') {
      const partes = [formData.direccion, formData.municipio, formData.ciudad].filter(Boolean);
      lugarEntrega = partes.join(', ');
    } else {
      const partes = [formData.municipio, formData.ciudad].filter(Boolean);
      lugarEntrega = partes.length > 0
        ? `OFICINA INTERRAPIDÍSIMO - ${partes.join(', ')}`
        : 'OFICINA PRINCIPAL INTERRAPIDÍSIMO';
    }

    const mensaje =
  `🛒✨ *Nuevo Pedido - Atlas* ✨🛒\n\n` +
  `👤 *Nombre:* ${formData.nombre}\n` +
  `📱 Teléfono: ${formData.telefono}\n` +
  `🪪 Cédula: ${formData.cedula}\n` +
  `📍 Entrega: ${lugarEntrega}\n\n` +
  `🧾 Productos:\n${listaProductos}\n\n` +
  `💵 Total: $${total.toLocaleString('es-CO')}`;
    window.open(`https://wa.me/${numeroDuenio}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="co-page">
      <div className="co-noise" />

      <div className="co-container">

        {/* Resumen del pedido */}
        <aside className="co-summary">
          <div className="co-summary-inner">
            <div className="co-summary-header">
              <Package size={14} />
              <span>Resumen del pedido</span>
            </div>

            <div className="co-items">
              {cart.length === 0 ? (
                <p className="co-empty">Tu carrito está vacío</p>
              ) : cart.map(item => (
                <div key={item.id_producto} className="co-item">
                  <div className="co-item-img-wrap">
                    <img src={item.imagen} alt={item.nombre} className="co-item-img" />
                    <span className="co-item-qty">{item.cantidad}</span>
                  </div>
                  <div className="co-item-info">
                    <span className="co-item-name">{item.nombre}</span>
                    <span className="co-item-price">${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/catalogo" className="co-btn-catalog">
              <ShoppingBag size={13} />
              Agregar más productos
            </Link>

            <div className="co-divider" />

            <div className="co-total-row">
              <span>Total</span>
              <span className="co-total-amount">${totalPrecio.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </aside>

        {/* Formulario */}
        <main className="co-form-area">
          <div className="co-form-header">
            <h1 className="co-title">Datos de <span className="co-accent">envío</span></h1>
            <p className="co-subtitle">Confirma que tu información es correcta antes de continuar</p>
          </div>

          <div className="co-section">
            <p className="co-section-label">Información personal</p>

            <div className="co-field">
              <label><User size={13} /> Nombre completo de quien recibe</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={e => { setFormData({ ...formData, nombre: e.target.value }); setErrores(p => ({...p, nombre: ''})); }}
                placeholder="Ej. Juan Pérez"
                style={errores.nombre ? {borderColor:'#e60000'} : {}}
              />
              {errores.nombre && <span className="co-error">Este campo es obligatorio</span>}
            </div>

            <div className="co-row">
              <div className="co-field">
                <label><Smartphone size={13} /> Cédula</label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={e => { setFormData({ ...formData, cedula: e.target.value }); setErrores(p => ({...p, cedula: ''})); }}
                  placeholder="123456789"
                  style={errores.cedula ? {borderColor:'#e60000'} : {}}
                />
                {errores.cedula && <span className="co-error">Este campo es obligatorio</span>}
              </div>
              <div className="co-field">
                <label><Phone size={13} /> Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={e => { setFormData({ ...formData, telefono: e.target.value }); setErrores(p => ({...p, telefono: ''})); }}
                  placeholder="300 000 0000"
                  style={errores.telefono ? {borderColor:'#e60000'} : {}}
                />
                {errores.telefono && <span className="co-error">Este campo es obligatorio</span>}
              </div>
            </div>
          </div>

          <div className="co-section">
            <p className="co-section-label">Método de entrega</p>

            <div className="co-shipping-grid">
              <button
                className={`co-ship-card ${tipoEnvio === 'domicilio' ? 'active' : ''}`}
                onClick={() => setTipoEnvio('domicilio')}
                type="button"
              >
                <div className="co-ship-icon"><MapPin size={19} /></div>
                <div>
                  <div className="co-ship-title">Mi dirección</div>
                  <div className="co-ship-desc">Envío a domicilio</div>
                </div>
                {tipoEnvio === 'domicilio' && <div className="co-ship-dot" />}
              </button>

              <button
                className={`co-ship-card ${tipoEnvio === 'oficina' ? 'active' : ''}`}
                onClick={() => setTipoEnvio('oficina')}
                type="button"
              >
                <div className="co-ship-icon"><Building2 size={19} /></div>
                <div>
                  <div className="co-ship-title">Oficina principal</div>
                  <div className="co-ship-desc">Interrapidísimo</div>
                </div>
                {tipoEnvio === 'oficina' && <div className="co-ship-dot" />}
              </button>
            </div>

            {tipoEnvio === 'domicilio' && (
              <div className="co-animate">
                <div className="co-field">
                  <label><MapPin size={13} /> Dirección (barrio y calle)</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={e => { setFormData({ ...formData, direccion: e.target.value }); setErrores(p => ({...p, direccion: ''})); }}
                    placeholder="Calle 123 # 45-67, Barrio Centro"
                    style={errores.direccion ? {borderColor:'#e60000'} : {}}
                  />
                  {errores.direccion && <span className="co-error">Este campo es obligatorio</span>}
                </div>
                <div className="co-row">
                  <div className="co-field">
                    <label><MapPin size={13} /> Municipio / Ciudad</label>
                    <input
                      type="text"
                      value={formData.municipio}
                      onChange={e => { setFormData({ ...formData, municipio: e.target.value }); setErrores(p => ({...p, municipio: ''})); }}
                      placeholder="Ej. Medellín"
                      style={errores.municipio ? {borderColor:'#e60000'} : {}}
                    />
                    {errores.municipio && <span className="co-error">Este campo es obligatorio</span>}
                  </div>
                  <div className="co-field">
                    <label><MapPin size={13} /> Departamento</label>
                    <input
                      type="text"
                      value={formData.ciudad}
                      onChange={e => { setFormData({ ...formData, ciudad: e.target.value }); setErrores(p => ({...p, ciudad: ''})); }}
                      placeholder="Ej. Antioquia"
                      style={errores.ciudad ? {borderColor:'#e60000'} : {}}
                    />
                    {errores.ciudad && <span className="co-error">Este campo es obligatorio</span>}
                  </div>
                </div>
              </div>
            )}

            {tipoEnvio === 'oficina' && (
              <div className="co-animate">
                <div className="co-office-alert">
                  <Info size={17} className="co-info-icon" />
                  <p>Recogerás tu pedido en la <b>oficina de Interrapidísimo</b> más cercana a tu ciudad.</p>
                </div>
                <div className="co-row">
                  <div className="co-field">
                    <label><MapPin size={13} /> Municipio / Ciudad</label>
                    <input
                      type="text"
                      value={formData.municipio}
                      onChange={e => { setFormData({ ...formData, municipio: e.target.value }); setErrores(p => ({...p, municipio: ''})); }}
                      placeholder="Ej. Medellín"
                      style={errores.municipio ? {borderColor:'#e60000'} : {}}
                    />
                    {errores.municipio && <span className="co-error">Este campo es obligatorio</span>}
                  </div>
                  <div className="co-field">
                    <label><MapPin size={13} /> Departamento</label>
                    <input
                      type="text"
                      value={formData.ciudad}
                      onChange={e => { setFormData({ ...formData, ciudad: e.target.value }); setErrores(p => ({...p, ciudad: ''})); }}
                      placeholder="Ej. Antioquia"
                      style={errores.ciudad ? {borderColor:'#e60000'} : {}}
                    />
                    {errores.ciudad && <span className="co-error">Este campo es obligatorio</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="co-contra-block">
            <div className="co-contra-top">
              <div className="co-contra-pulse" />
              <ShieldCheck size={20} className="co-contra-icon" />
              <div className="co-contra-label">
                <span className="co-contra-title">PAGO CONTRAENTREGA</span>
                <span className="co-contra-sub">Pagas al recibir tu pedido</span>
              </div>
            </div>
            <p className="co-contra-desc">
              Nuestros paquetes los enviamos a <b>oficina principal de Interrapidísimo</b> para que tengan la facilidad de reclamar sus productos.
            </p>
          </div>

          <button
            className="co-btn-whatsapp"
            onClick={handleRealizarEnvio}
            disabled={cart.length === 0}
            style={cart.length === 0 ? { opacity: 0.4, cursor: 'not-allowed', transform: 'none', boxShadow: 'none' } : {}}
          >
            <Send size={17} />
            Realizar el envío por WhatsApp
          </button>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        html, body { max-width: 100%; overflow-x: hidden; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .co-page {
          min-height: 100vh;
          width: 100%;
          max-width: 100vw;
          background: #080808;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 100px 20px 60px;
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }

        .co-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
        }

        .co-container {
          position: relative; z-index: 1;
          width: 100%; max-width: 1020px;
          min-width: 0;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          align-items: start;
        }

        .co-summary { position: sticky; min-width: 0; }

        .co-summary-inner {
          background: #0d0d0d;
          border: 1px solid #1c1c1c;
          border-radius: 18px;
          padding: 24px;
          min-width: 0;
        }

        .co-summary-header {
          display: flex; align-items: center; gap: 7px;
          color: #444; font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.09em;
          margin-bottom: 20px;
        }

        .co-items { display: flex; flex-direction: column; gap: 13px; margin-bottom: 16px; }
        .co-empty { color: #3a3a3a; font-size: 13px; text-align: center; padding: 16px 0; }

        .co-item { display: flex; align-items: center; gap: 11px; }

        .co-item-img-wrap { position: relative; flex-shrink: 0; }
        .co-item-img { width: 48px; height: 48px; border-radius: 9px; object-fit: cover; border: 1px solid #1c1c1c; }
        .co-item-qty {
          position: absolute; top: -5px; right: -5px;
          background: #e60000; color: white; font-size: 9px; font-weight: 800;
          border-radius: 50%; width: 17px; height: 17px;
          display: flex; align-items: center; justify-content: center;
        }

        .co-item-info { flex: 1; min-width: 0; }
        .co-item-name { display: block; color: #bbb; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
        .co-item-price { color: #555; font-size: 11px; }

        .co-btn-catalog {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          width: 100%;
          background: transparent;
          border: 1px solid #1e1e1e;
          border-radius: 9px;
          padding: 10px;
          color: #555;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 14px;
        }
        .co-btn-catalog:hover {
          border-color: #2e2e2e;
          color: #888;
          background: #111;
        }

        .co-divider { height: 1px; background: #181818; margin: 18px 0; }

        .co-total-row { display: flex; justify-content: space-between; align-items: baseline; }
        .co-total-row > span:first-child { font-size: 12px; color: #555; }
        .co-total-amount { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; color: white; }

        .co-form-area {
          background: #0d0d0d;
          border: 1px solid #1c1c1c;
          border-radius: 18px;
          padding: 36px;
          min-width: 0;
          width: 100%;
        }

        .co-form-header { margin-bottom: 32px; }

        .co-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 30px; font-weight: 800;
          color: white; line-height: 1.1;
          margin-bottom: 7px;
        }
        .co-accent { color: #e60000; }
        .co-subtitle { color: #444; font-size: 13px; }

        .co-section { margin-bottom: 28px; }

        .co-section-label {
          font-size: 10px; font-weight: 700; color: #383838;
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 14px;
          padding-bottom: 9px;
          border-bottom: 1px solid #161616;
        }

        .co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .co-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
        .co-field:last-child { margin-bottom: 0; }

        .co-field label {
          display: flex; align-items: center; gap: 5px;
          font-size: 10px; font-weight: 700; color: #e60000;
          text-transform: uppercase; letter-spacing: 0.06em;
        }

        .co-field input {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 11px; padding: 13px 15px;
          color: white; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; width: 100%;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
        }
        .co-field input::placeholder { color: #2e2e2e; }
        .co-field input:focus { border-color: rgba(230,0,0,0.5); background: #131313; }

        .co-shipping-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }

        .co-ship-card {
          position: relative;
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 13px; padding: 15px;
          display: flex; align-items: center; gap: 11px;
          cursor: pointer; color: #555;
          transition: all 0.2s; text-align: left;
        }
        .co-ship-card:hover { border-color: #2a2a2a; color: #777; }
        .co-ship-card.active { border-color: #e60000; background: rgba(230,0,0,0.03); color: white; }

        .co-ship-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: #181818;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: background 0.2s;
        }
        .co-ship-card.active .co-ship-icon { background: rgba(230,0,0,0.12); color: #e60000; }

        .co-ship-title { font-size: 12px; font-weight: 600; }
        .co-ship-desc { font-size: 10px; color: #444; margin-top: 2px; }
        .co-ship-card.active .co-ship-desc { color: #666; }

        .co-ship-dot {
          position: absolute; top: 10px; right: 10px;
          width: 7px; height: 7px;
          background: #e60000; border-radius: 50%;
          box-shadow: 0 0 8px rgba(230,0,0,0.7);
        }

        .co-office-alert {
          display: flex; align-items: flex-start; gap: 11px;
          background: rgba(230,0,0,0.03);
          border: 1px solid rgba(230,0,0,0.12);
          border-radius: 11px; padding: 14px;
          margin-bottom: 14px;
        }
        .co-info-icon { color: #c44; flex-shrink: 0; margin-top: 1px; }
        .co-office-alert p { color: #666; font-size: 12px; line-height: 1.55; }
        .co-office-alert b { color: #aaa; }

        .co-btn-whatsapp {
          width: 100%;
          background: #25D366; color: white; border: none;
          padding: 17px 24px; border-radius: 13px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 14px; letter-spacing: 0.03em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: all 0.22s;
          box-shadow: 0 6px 20px rgba(37,211,102,0.12);
        }
        .co-btn-whatsapp:hover:not(:disabled) {
          background: #1fba5a;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(37,211,102,0.22);
        }
        .co-btn-whatsapp:active:not(:disabled) { transform: translateY(0); }

        .co-animate { animation: coUp 0.3s ease; }
        @keyframes coUp {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .co-contra-block {
          border: 1px solid rgba(230,0,0,0.25);
          border-radius: 14px;
          background: rgba(230,0,0,0.04);
          padding: 18px 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .co-contra-block::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px;
          background: radial-gradient(ellipse at top left, rgba(230,0,0,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .co-contra-top {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 12px; position: relative;
        }

        .co-contra-pulse {
          position: absolute; left: -2px; top: 50%;
          transform: translateY(-50%);
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 1.5px solid rgba(230,0,0,0.45);
          animation: coPulseRing 2.2s ease-out infinite;
          pointer-events: none;
        }

        .co-contra-icon {
          color: #e60000; flex-shrink: 0;
          filter: drop-shadow(0 0 8px rgba(230,0,0,0.55));
          animation: coBobble 3s ease-in-out infinite;
        }

        .co-contra-label { display: flex; flex-direction: column; gap: 1px; }
        .co-contra-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 800; color: white; letter-spacing: 0.07em;
        }
        .co-contra-sub { font-size: 11px; color: #777; }

        .co-contra-desc {
          font-size: 12.5px; color: #666; line-height: 1.6;
          border-top: 1px solid rgba(230,0,0,0.1); padding-top: 12px;
        }
        .co-contra-desc b { color: #bbb; font-weight: 600; }

        @keyframes coBobble {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }
        @keyframes coPulseRing {
          0%   { opacity: 0.7; transform: translateY(-50%) scale(1); }
          100% { opacity: 0; transform: translateY(-50%) scale(2); }
        }

        @media (max-width: 820px) {
          .co-container {
            grid-template-columns: 1fr !important;
            gap: 16px;
            width: 100%;
          }
          .co-summary { position: static; order: 2; width: 100%; }
          .co-form-area { order: 1; width: 100%; }
          .co-items { flex-direction: column; gap: 10px; }
          .co-item { width: 100%; }
        }

        @media (max-width: 560px) {
          .co-page { padding: 90px 12px 40px; }
          .co-form-area { padding: 20px 14px; border-radius: 14px; }
          .co-summary-inner { padding: 16px; border-radius: 14px; }
          .co-title { font-size: 24px; }
          .co-row { grid-template-columns: 1fr !important; gap: 0; }
          .co-field input { font-size: 16px; }
          .co-shipping-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .co-ship-card { padding: 12px 10px; gap: 8px; }
          .co-ship-title { font-size: 11px; }
          .co-ship-desc { font-size: 9px; }
          .co-ship-icon { width: 30px; height: 30px; }
          .co-summary-header { margin-bottom: 14px; }
          .co-total-amount { font-size: 18px; }
          .co-contra-block { padding: 14px; }
          .co-contra-title { font-size: 12px; }
        }

        @media (max-width: 340px) {
          .co-shipping-grid { grid-template-columns: 1fr; }
          .co-page { padding: 70px 8px 40px; }
        }

        .co-error {
          color: #e60000;
          font-size: 10px;
          font-weight: 600;
          margin-top: -4px;
        }
      `}</style>
    </div>
  );
};

export default Checkout;