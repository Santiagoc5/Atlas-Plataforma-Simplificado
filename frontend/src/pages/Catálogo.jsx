import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, ChevronDown, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ModalProducto from '../components/ModalProducto';
import { API_BASE } from '../config';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const location = useLocation();
  const { hash } = location;
  const { addToCart } = useCart();

  const [filtros, setFiltros] = useState({ precioMax: 3000000, modelo: '', calidad: '' });
  const [modeloOpen, setModeloOpen] = useState(false);
  const [modeloBusqueda, setModeloBusqueda] = useState('');
  const modeloRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (modeloRef.current && !modeloRef.current.contains(e.target)) {
        setModeloOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Carga de datos
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search')?.toLowerCase();

    fetch(`${API_BASE}/api/productos/`)
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        if (searchTerm) {
          const encontrado = data.find(p =>
            p.nombre.toLowerCase().includes(searchTerm) ||
            String(p.id_producto) === searchTerm
          );
          if (encontrado) setProductoSeleccionado(encontrado);
        }
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, [location.search]);

  // Scroll automático por hash
  useEffect(() => {
    if (!cargando && hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [hash, cargando, productos]);

  // Agrupación por categoría
  const agruparProductos = (lista) => {
    if (!lista || !Array.isArray(lista)) return [];
    const secciones = {};
    lista.forEach(prod => {
      const nombreCat = prod.categoria_nombre || (prod.id_categoria ? `${prod.id_categoria}` : 'General');
      const idCat = String(nombreCat).toLowerCase().trim().replace(/\s+/g, '-');
      if (!secciones[idCat]) secciones[idCat] = { id: idCat, titulo: nombreCat, items: [] };
      secciones[idCat].items.push(prod);
    });
    return Object.values(secciones).sort((a, b) => a.titulo.localeCompare(b.titulo));
  };

  // Vehículos únicos desde producto.vehiculos (relación en BD)
  const vehiculosUnicos = (() => {
    const mapa = new Map();
    productos.forEach(p => {
      if (!p.vehiculos || !Array.isArray(p.vehiculos)) return;
      p.vehiculos.forEach(v => {
        if (v.id_vehiculo && v.nombre_completo) {
          mapa.set(v.id_vehiculo, v.nombre_completo);
        }
      });
    });
    return [...mapa.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
  })();

  const vehiculosFiltrados = vehiculosUnicos.filter(v =>
    v.nombre.toLowerCase().includes(modeloBusqueda.toLowerCase())
  );

  // Filtrado
  const productosFiltrados = productos.filter(prod => {
    const precioEfectivo = prod.precio_oferta && Number(prod.precio_oferta) < Number(prod.precio)
      ? Number(prod.precio_oferta) : Number(prod.precio);
    const cumplePrecio = precioEfectivo <= (filtros.precioMax || 5000000);
    const cumpleModelo = !filtros.modelo || (
      Array.isArray(prod.vehiculos) && prod.vehiculos.some(v => v.nombre_completo === filtros.modelo)
    );
    const cumpleCalidad = !filtros.calidad || prod.calidad === filtros.calidad;
    return cumplePrecio && cumpleModelo && cumpleCalidad;
  });

  const seccionesArray = agruparProductos(productosFiltrados);
  const hayFiltrosActivos = filtros.modelo || filtros.calidad || filtros.precioMax < 5000000;

  if (cargando) return <div style={{ padding: '150px', textAlign: 'center' }}>Cargando Catálogo Atlas...</div>;

  return (
    <div className="catalogo-container">

      <div className="catalogo-header">
        <h1>Catálogo de Productos</h1>
      </div>

      {/* ─── BARRA DE FILTROS ─── */}
      <div className="filtros-wrapper">
        <div className="filtros-bar">

          {/* Título */}
          <div className="filtros-titulo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span>Filtros</span>
          </div>

          <div className="filtros-sep" />

          {/* ── Filtro Vehículo (dropdown) ── */}
          <div className="filtro-grupo" ref={modeloRef} style={{ position: 'relative' }}>
            <label className="filtro-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Vehículo
            </label>
            <button
              className="modelo-trigger"
              onClick={() => { setModeloOpen(o => !o); setModeloBusqueda(''); }}
            >
              <span className={filtros.modelo ? 'modelo-trigger__val' : 'modelo-trigger__placeholder'}>
                {filtros.modelo || 'Seleccionar...'}
              </span>
              <ChevronDown size={13} style={{ flexShrink: 0, transform: modeloOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#9ca3af' }} />
            </button>

            {/* Panel — renderizado fuera del overflow con position fixed */}
            {modeloOpen && (() => {
              const rect = modeloRef.current?.getBoundingClientRect();
              return (
                <div
                  className="modelo-panel"
                  style={{
                    position: 'fixed',
                    top: rect ? rect.bottom + 8 : 0,
                    left: rect ? rect.left : 0,
                    width: 240,
                    zIndex: 9999,
                  }}
                >
                  <div className="modelo-panel__search">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Buscar modelo..."
                      value={modeloBusqueda}
                      onChange={e => setModeloBusqueda(e.target.value)}
                    />
                  </div>
                  <button
                    className={`modelo-opcion ${filtros.modelo === '' ? 'modelo-opcion--active' : ''}`}
                    onClick={() => { setFiltros({ ...filtros, modelo: '' }); setModeloOpen(false); }}
                  >
                    Todos los vehículos
                    {filtros.modelo === '' && <Check size={13} />}
                  </button>
                  <div className="modelo-lista">
                    {vehiculosFiltrados.length === 0
                      ? <p className="modelo-vacio">Sin resultados</p>
                      : vehiculosFiltrados.map(v => (
                        <button
                          key={v.id}
                          className={`modelo-opcion ${filtros.modelo === v.nombre ? 'modelo-opcion--active' : ''}`}
                          onClick={() => { setFiltros({ ...filtros, modelo: v.nombre }); setModeloOpen(false); setModeloBusqueda(''); }}
                        >
                          {v.nombre}
                          {filtros.modelo === v.nombre && <Check size={13} />}
                        </button>
                      ))
                    }
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="filtros-sep" />

          {/* ── Filtro Precio ── */}
          <div className="filtro-grupo filtro-grupo--precio">
            <label className="filtro-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Precio máximo
            </label>
            <div className="filtro-precio-input-wrap">
                <span className="filtro-precio-signo">$</span>
                <input
                  type="number"
                  className="filtro-precio-input"
                  placeholder="Ej: 500000"
                  value={filtros.precioMax === 5000000 ? '' : filtros.precioMax}
                  min="0"
                  onChange={e => {
                    const val = e.target.value === '' ? 5000000 : Math.max(0, Number(e.target.value) || 0);
                    setFiltros({ ...filtros, precioMax: val });
                  }}
                />
              </div>
          </div>

          <div className="filtros-sep" />

          {/* ── Filtro Calidad ── */}
          <div className="filtro-grupo">
            <label className="filtro-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Calidad
            </label>
            <div className="filtro-chips">
              {[{ val: '', label: 'Todas' }, { val: 'Importado', label: 'Importado' }, { val: 'Nacional', label: 'Nacional' }].map(({ val, label }) => (
                <button key={val} className={`filtro-chip ${filtros.calidad === val ? 'filtro-chip--active' : ''}`}
                  onClick={() => setFiltros({ ...filtros, calidad: val })}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Limpiar ── */}
          {hayFiltrosActivos && (
            <>
              <div className="filtros-sep" />
              <button className="filtro-limpiar" onClick={() => setFiltros({ precioMax: 5000000, modelo: '', calidad: '' })}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Limpiar
              </button>
            </>
          )}
        </div>

        <div className="filtros-resultado">
          <span className="filtros-resultado-num">{productosFiltrados.length}</span>
          &nbsp;producto{productosFiltrados.length !== 1 ? 's' : ''}
          {hayFiltrosActivos && <span className="filtros-resultado-tag"> · filtrado{productosFiltrados.length !== 1 ? 's' : ''}</span>}
        </div>
      </div>

      {/* ─── SECCIONES ─── */}
      {seccionesArray.map(seccion => (
        <section key={seccion.id} id={seccion.id} className="catalogo-seccion">
          <h2 className="seccion-titulo">{seccion.titulo}</h2>
          <div className="catalogo-grid">
            {seccion.items.map(prod => {
              const enOferta = prod.precio_oferta && Number(prod.precio_oferta) < Number(prod.precio);
              const precioMostrar = enOferta ? Number(prod.precio_oferta) : Number(prod.precio);
              return (
                <div key={prod.id_producto} className="producto-card" onClick={() => setProductoSeleccionado(prod)} style={{ cursor: 'pointer' }}>
                  <div className="producto-imagen">
                    <img
                      src={!prod.imagen ? '/placeholder.jpg' : prod.imagen.startsWith('http') ? prod.imagen : `http://localhost:8000${prod.imagen}`}
                      alt={prod.nombre}
                    />
                    {prod.calidad && (
                      <span className={`prod-badge prod-badge--calidad ${prod.calidad.toLowerCase() === 'importado' ? 'prod-badge--red' : 'prod-badge--blue'}`}>
                        {prod.calidad}
                      </span>
                    )}
                    {enOferta && (
                      <span className="prod-badge prod-badge--descuento">
                        {prod.porcentaje_descuento}
                      </span>
                    )}
                  </div>
                  <div className="producto-body">
                    <h3 className="producto-nombre">{prod.nombre}</h3>
                    <p className="producto-desc">{prod.descripcion}</p>
                    <div className="producto-precio-row">
                      <div>
                        {enOferta && (
                          <span className="producto-precio-antes">${Number(prod.precio).toLocaleString('es-CO')}</span>
                        )}
                        <span className="producto-precio">${precioMostrar.toLocaleString('es-CO')}</span>
                      </div>
                      <div className="producto-stock">
                        <Package size={13} />
                        {prod.stock} disp.
                      </div>
                    </div>
                    <div className="producto-acciones">
                      <button className="btn-detalles" onClick={(e) => { e.stopPropagation(); setProductoSeleccionado(prod); }}>Detalles</button>
                      <button
                        className="btn-agregar"
                        onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                        disabled={prod.stock <= 0}
                        style={{ backgroundColor: prod.stock > 0 ? '#e60000' : '#ccc', cursor: prod.stock > 0 ? 'pointer' : 'not-allowed' }}
                      >
                        {prod.stock > 0 ? 'Agregar' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <ModalProducto producto={productoSeleccionado} onClose={() => setProductoSeleccionado(null)} />

      <style>{`
        body { overflow-x: hidden; }

        .catalogo-container { background: #f4f4f6; min-height: 100vh; padding-top: 100px; padding-bottom: 50px; font-family: sans-serif; }
        .catalogo-header { padding: 0 6%; margin-bottom: 30px; }
        .catalogo-header h1 { font-size: 26px; font-weight: 800; }

        /* ── FILTROS ── */
        .filtros-wrapper { padding: 0 6%; margin-bottom: 28px; }

        .filtros-bar {
          display: flex; align-items: center; flex-wrap: wrap;
          background: #fff; border: 1px solid #e4e4e7; border-radius: 14px;
          padding: 0 4px;
          /* SIN overflow:hidden — necesario para que el dropdown sea visible */
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .filtros-titulo { display:flex; align-items:center; gap:7px; padding:14px 18px; font-size:12px; font-weight:700; color:#111; letter-spacing:0.06em; text-transform:uppercase; white-space:nowrap; flex-shrink:0; }
        .filtros-sep { width:1px; height:32px; background:#e4e4e7; flex-shrink:0; margin:0 2px; }
        .filtro-grupo { display:flex; flex-direction:column; gap:4px; padding:10px 16px; min-width:0; }
        .filtro-grupo--precio { min-width: 200px; }
        .filtro-label { display:flex; align-items:center; gap:5px; font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.07em; white-space:nowrap; }

        /* Trigger vehículo */
        .modelo-trigger {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; width: 160px; padding: 0;
          border: none; background: transparent; cursor: pointer; font-size: 13px;
        }
        .modelo-trigger__placeholder { color: #c0c0c8; font-weight: 400; }
        .modelo-trigger__val { color: #111; font-weight: 600; }

        /* Panel dropdown — usa position:fixed para escapar overflow */
        .modelo-panel {
          background: white; border: 1px solid #e4e4e7;
          border-radius: 14px; box-shadow: 0 8px 28px rgba(0,0,0,0.14);
          overflow: hidden;
        }
        .modelo-panel__search {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; border-bottom: 1px solid #f0f0f0;
        }
        .modelo-panel__search input {
          border: none; outline: none; font-size: 13px;
          color: #111; background: transparent; width: 100%;
        }
        .modelo-panel__search input::placeholder { color: #c0c0c8; }
        .modelo-lista { max-height: 220px; overflow-y: auto; }
        .modelo-lista::-webkit-scrollbar { width: 4px; }
        .modelo-lista::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 99px; }
        .modelo-opcion {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 10px 14px; border: none; background: transparent;
          font-size: 13px; font-weight: 500; color: #374151; cursor: pointer; text-align: left;
          transition: background 0.12s;
        }
        .modelo-opcion:hover { background: #f9f9f9; }
        .modelo-opcion--active { background: #fff1f1; color: #e60000; font-weight: 700; }
        .modelo-opcion--active:hover { background: #ffe4e4; }
        .modelo-vacio { padding: 12px 14px; font-size: 12px; color: #aaa; margin: 0; }

        /* Precio */
        .filtro-precio-row { display:flex; align-items:center; gap:10px; }
        .filtro-range { -webkit-appearance:none; appearance:none; width:130px; height:4px; background:linear-gradient(to right,#e60000 0%,#e60000 60%,#e4e4e7 60%,#e4e4e7 100%); border-radius:99px; outline:none; cursor:pointer; }
        .filtro-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:#e60000; box-shadow:0 0 0 3px #fff,0 0 0 4px #e60000; cursor:pointer; }
        .filtro-range::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:#e60000; border:3px solid #fff; box-shadow:0 0 0 1px #e60000; cursor:pointer; }
        .filtro-precio-badge { font-size:12px; font-weight:700; color:#e60000; background:#fff1f1; padding:3px 9px; border-radius:20px; white-space:nowrap; border:1px solid #fecaca; }
        .filtro-precio-input-wrap {
          display: flex; align-items: center;
          background: #fff1f1; border: 1px solid #fecaca;
          border-radius: 20px; padding: 3px 10px; gap: 2px;
          transition: border-color 0.2s;
        }
        .filtro-precio-input-wrap:focus-within {
          border-color: #e60000; box-shadow: 0 0 0 2px rgba(230,0,0,0.1);
        }
        .filtro-precio-signo { font-size:12px; font-weight:700; color:#e60000; }
        .filtro-precio-input {
          border: none; outline: none; background: transparent;
          font-size: 12px; font-weight: 700; color: #e60000;
          width: 72px; padding: 0;
          -moz-appearance: textfield;
        }
        .filtro-precio-input::-webkit-outer-spin-button,
        .filtro-precio-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

        /* Calidad chips */
        .filtro-chips { display:flex; gap:6px; padding:2px 0; }
        .filtro-chip { font-size:12px; font-weight:600; padding:4px 12px; border-radius:20px; border:1.5px solid #e4e4e7; background:transparent; color:#6b7280; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
        .filtro-chip:hover { border-color:#e60000; color:#e60000; }
        .filtro-chip--active { background:#e60000; border-color:#e60000; color:#fff; }

        /* Limpiar */
        .filtro-limpiar { display:flex; align-items:center; gap:6px; margin:0 8px; padding:6px 14px; font-size:12px; font-weight:600; color:#6b7280; background:transparent; border:1.5px solid #e4e4e7; border-radius:20px; cursor:pointer; transition:all 0.15s; white-space:nowrap; flex-shrink:0; }
        .filtro-limpiar:hover { background:#fef2f2; border-color:#e60000; color:#e60000; }

        /* Resultado */
        .filtros-resultado { margin-top:10px; padding:0 4px; font-size:13px; color:#9ca3af; font-weight:500; }
        .filtros-resultado-num { font-weight:800; color:#111; font-size:15px; }
        .filtros-resultado-tag { color:#e60000; font-weight:600; }

        /* ── CATÁLOGO ── */
        .catalogo-seccion { padding: 0 6%; margin-bottom: 50px; scroll-margin-top: 120px; }
        .seccion-titulo { font-size:22px; font-weight:700; border-left:5px solid #e60000; padding-left:15px; margin-bottom:25px; color:#1a1a1a; }
        .catalogo-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px,1fr)); gap:20px; }

        /* ── CARD ── */
        .producto-card { background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.06); display:flex; flex-direction:column; border:1px solid #eee; transition: transform 0.2s, box-shadow 0.2s; }
        .producto-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,0,0,0.11); }

        .producto-imagen { position:relative; aspect-ratio:4/3; overflow:hidden; }
        .producto-imagen img { width:100%; height:100%; object-fit:cover; transition:transform 0.35s; }
        .producto-card:hover .producto-imagen img { transform: scale(1.05); }

        .prod-badge { position:absolute; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:700; }
        .prod-badge--calidad { top:12px; left:12px; }
        .prod-badge--red { background:#e60000; color:white; }
        .prod-badge--blue { background:#1a365d; color:white; }
        .prod-badge--descuento { top:12px; right:12px; background:#fbbf24; color:#7c2d00; box-shadow:0 2px 8px rgba(251,191,36,0.4); }

        .producto-body { padding:16px; display:flex; flex-direction:column; flex:1; }
        .producto-nombre { font-size:15px; font-weight:700; margin:0 0 6px; color:#111; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .producto-desc { font-size:13px; color:#666; margin:0 0 14px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.55; min-height:2.6em; }

        .producto-precio-row { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px; }
        .producto-precio-antes { display:block; font-size:12px; color:#bbb; text-decoration:line-through; line-height:1.2; }
        .producto-precio { display:block; color:#c40000; font-size:20px; font-weight:800; line-height:1.2; }
        .producto-stock { display:flex; align-items:center; gap:4px; color:#999; font-size:12px; }

        .producto-acciones { display:grid; grid-template-columns:1fr 1.3fr; gap:10px; margin-top:auto; }
        .btn-detalles { padding:10px 0; border-radius:8px; border:1px solid #ddd; background:white; font-size:13px; font-weight:600; cursor:pointer; transition:border-color 0.2s, color 0.2s; color:#111; }
        .btn-detalles:hover { border-color:#e60000; color:#e60000; }
        .btn-agregar { padding:10px 0; border-radius:8px; border:none; color:white; font-size:13px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:6px; transition:opacity 0.2s; }
        .btn-agregar:hover:not(:disabled) { opacity: 0.88; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .filtros-bar { flex-wrap:wrap; padding:8px; gap:4px; }
          .filtros-sep { display:none; }
          .filtro-grupo { padding:8px 10px; }
        }
        @media (max-width: 768px) {
          .catalogo-container { padding-top:80px !important; }
          .catalogo-header { padding:0 4%; margin-bottom:20px; }
          .catalogo-header h1 { font-size:22px; }
          .filtros-wrapper { padding:0 4%; }
          .filtros-bar { padding:6px; }
          .filtros-titulo { padding:10px 12px; font-size:11px; }
          .filtro-grupo { flex:1 1 auto; min-width:140px; }
          .filtro-grupo--precio { min-width:180px; }
          .filtro-range { width:100px; }
          .modelo-trigger { width:120px; }
          .catalogo-seccion { padding:0 4%; margin-bottom:40px; }
          .seccion-titulo { font-size:18px; padding-left:12px; }
          .catalogo-grid { grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:15px; }
          .producto-acciones { grid-template-columns:1fr; }
          .producto-acciones button { padding:8px 0; font-size:12px; }
        }
        @media (max-width: 480px) {
          .catalogo-grid { grid-template-columns:1fr; }
          .filtro-chips { gap:4px; }
          .filtro-chip { font-size:11px; padding:3px 10px; }
        }
      `}</style>
    </div>
  );
};

export default Catalogo;