import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { API_BASE } from '../config';

/**
 * Componente Navbar para la navegación principal del usuario.
 * Contiene un input de búsqueda predictiva, carrito y menú dinámico 
 * que se ajusta y oculta en tamaños de dispositivos móviles.
 */
const Navbar = () => {
  // Estados para el responsive y los menús desplegables
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogOpenMobile, setCatalogOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Estado para el control del carrito
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Variables del carrito y la ruta actual
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isCatalogoActive = location.pathname.startsWith('/catalogo');

  // Estados relacionados con la búsqueda predictiva de productos
  const [searchTerm, setSearchTerm] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Efecto principal que gestiona la solicitud de datos de la búsqueda inteligente (Debounce simple)
  useEffect(() => {
    const buscar = async () => {
      // Solo busca si hay más de 1 caracter
      if (searchTerm.length > 1) {
        try {
          const res = await fetch(`${API_BASE}/api/predictivo/?q=${searchTerm}`);
          const data = await res.json();
          setSugerencias(data);
          setShowDropdown(true);
        } catch (e) { console.error("Error buscando"); }
      } else {
        setSugerencias([]);
        setShowDropdown(false);
      }
    };
    const t = setTimeout(buscar, 300); // Retraso de 300ms a la petición para no saturar al tipear
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Cerrar search dropdown al click fuera
  useEffect(() => {
    const handler = () => setShowDropdown(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  // Cerrar búsqueda móvil al hacer scroll
useEffect(() => {
  const handler = () => {
    if (mobileSearchOpen) setMobileSearchOpen(false);
  };
  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}, [mobileSearchOpen]);

// Cerrar búsqueda móvil al click afuera
useEffect(() => {
  if (!mobileSearchOpen) return;
  const handler = (e) => {
    if (!e.target.closest('.mobile-search-bar')) {
      setMobileSearchOpen(false);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };
  document.addEventListener('mousedown', handler);
  return () => document.removeEventListener('mousedown', handler);
}, [mobileSearchOpen]);

  // Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) { setMobileMenuOpen(false); setMobileSearchOpen(false); }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Body lock cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      const y = window.scrollY;
      document.body.style.cssText = `position:fixed;top:-${y}px;left:0;right:0;overflow:hidden`;
    } else {
      const top = document.body.style.top;
      document.body.style.cssText = '';
      if (top) window.scrollTo(0, -parseInt(top));
    }
    return () => { document.body.style.cssText = ''; };
  }, [mobileMenuOpen]);

  const categorias = [
    { nombre: "Todos los Productos" },
    { nombre: "Estribos" },
    { nombre: "Carpas Planas" },
    { nombre: "Antivuelcos" },
    { nombre: "Persianas" },
    { nombre: "Stops" },
  ];

  const generarRuta = (n) => n === "Todos los Productos"
    ? "/catalogo"
    : `/catalogo#${n.toLowerCase().replace(/\s+/g, '-')}`;

  const handleSearchSubmit = (term) => {
    if (!term.trim()) return;
    navigate(`/catalogo?search=${encodeURIComponent(term)}`);
    setShowDropdown(false); setSearchTerm(''); setMobileSearchOpen(false);
  };

  return (
    <>
      <style>{`
        .nav-link {
          color: white; font-weight: 500; font-size: 13px;
          text-decoration: none; position: relative; padding-bottom: 3px;
          transition: color 0.2s ease; outline: none;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0%; height: 2px; background-color: #e60000;
          border-radius: 2px; transition: width 0.25s ease;
        }
        .nav-link:hover, .nav-link:focus-visible, .nav-link.active { color: #e60000; }
        .nav-link:hover::after, .nav-link:focus-visible::after, .nav-link.active::after { width: 100%; }

        .catalog-trigger {
          display: flex; align-items: center; gap: 5px;
          color: white; font-weight: 500; font-size: 13px;
          position: relative; padding-bottom: 3px;
          transition: color 0.2s ease; cursor: pointer;
        }
        .catalog-trigger::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0%; height: 2px; background-color: #e60000;
          border-radius: 2px; transition: width 0.25s ease;
        }
        .catalog-trigger:hover, .catalog-trigger.active { color: #e60000; }
        .catalog-trigger:hover::after, .catalog-trigger.active::after { width: 100%; }

        .catalog-dropdown {
          position: absolute; top: calc(100% + 1px); left: 50%;
          transform: translateX(-50%); background: #111;
          border: 1px solid rgba(255,255,255,0.07); border-top: 2px solid #e60000;
          border-radius: 0 0 12px 12px; width: 290px;
          box-shadow: 0 24px 50px rgba(0,0,0,0.75); overflow: hidden;
          animation: dropdownIn 0.18s ease;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .catalog-dropdown-header {
          padding: 10px 16px 8px; font-size: 9px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.22); border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .catalog-item {
          display: flex; align-items: center; gap: 12px; padding: 10px 16px;
          text-decoration: none; color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s ease, color 0.15s ease, padding-left 0.15s ease;
          outline: none;
        }
        .catalog-item:last-child { border-bottom: none; }
        .catalog-item:hover, .catalog-item:focus-visible {
          background: rgba(230,0,0,0.09); color: white; padding-left: 20px;
        }
        .catalog-item.todos { color: #e60000; }

        .mobile-link {
          display: block; color: white; text-decoration: none;
          font-size: 18px; padding: 15px 0; border-bottom: 1px solid #333;
          outline: none; transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .mobile-link:hover, .mobile-link:focus-visible, .mobile-link.active {
          color: #e60000; padding-left: 8px;
        }
        .mobile-sublink {
          display: block; padding: 12px 0; font-size: 16px; color: #ccc;
          text-decoration: none; outline: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }
        .mobile-sublink:hover, .mobile-sublink:focus-visible { color: #e60000; padding-left: 6px; }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        height: isMobile ? '70px' : '80px',
        display: 'flex', alignItems: 'center',
        padding: '0 6%', backgroundColor: 'black', borderBottom: '1px solid #e60000',
        zIndex: 1000, boxSizing: 'border-box', color: 'white', gap: '24px'
      }}>

        {/* Logo — izquierda */}
        <div style={{ flexShrink: 0 }}>
          <img src="/logo.png" alt="Logo Atlas" style={{ height: isMobile ? '45px' : '55px', width: 'auto', display: 'block' }} />
        </div>

        {/* Búsqueda — centro (solo desktop) */}
        {!isMobile && (
          <div onClick={e => e.stopPropagation()} style={{ flex: 1, maxWidth: '420px', margin: '0 auto', position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: searchFocused ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${searchFocused ? '#e60000' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '8px', padding: '0 14px', height: '42px',
              boxShadow: searchFocused ? '0 0 0 3px rgba(230,0,0,0.14)' : 'none',
              transition: 'all 0.2s'
            }}>
              <Search size={16} style={{ color: searchFocused ? '#e60000' : 'rgba(255,255,255,0.35)', flexShrink: 0, transition: 'color 0.2s' }} />
              <input
                type="text" placeholder="Buscar accesorios..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => { setSearchFocused(true); if (searchTerm.length > 1) setShowDropdown(true); }}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={e => e.key === 'Enter' && handleSearchSubmit(searchTerm)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '13px', minWidth: 0 }}
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); setSugerencias([]); setShowDropdown(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0, display: 'flex' }}>
                  <X size={14} />
                </button>
              )}
            </div>
            {showDropdown && sugerencias.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%', background: '#161616', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', zIndex: 1001 }}>
                <div style={{ padding: '9px 16px 5px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Sugerencias</div>
                {sugerencias.map(prod => (
                  <div key={prod.id_producto}
                    onClick={() => { navigate(`/catalogo?search=${encodeURIComponent(prod.nombre)}`); setShowDropdown(false); setSearchTerm(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(230,0,0,0.07)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={`${API_BASE}${prod.imagen}`} alt={prod.nombre} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)' }} />
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.nombre}</span>
                    <Search size={13} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Links + Carrito — derecha (solo desktop) */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0, marginLeft: 'auto' }}>
            <NavLink to="/" end className="nav-link">Inicio</NavLink>
            <NavLink to="/contacto" className="nav-link">Contacto</NavLink>

            {/* Catálogo dropdown */}
            <div
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '80px' }}
            >
              <span className={`catalog-trigger${isCatalogoActive ? ' active' : ''}`}>
                Catálogo
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
              {isOpen && (
                <div className="catalog-dropdown">
                  {categorias.map((cat, i) => (
                    <Link key={i} to={generarRuta(cat.nombre)} className={`catalog-item${i === 0 ? ' todos' : ''}`}>
                      {cat.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Separador */}
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)' }} />

            {/* Carrito */}
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#e60000', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>
                  {totalItems}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Iconos móvil */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginLeft: 'auto' }}>
            <button onClick={() => setMobileSearchOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'white' }}>
              {mobileSearchOpen ? <X size={22} color="white" /> : <Search size={22} color="white" />}
            </button>
            <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', display: 'flex' }}>
              <ShoppingCart size={22} color="white" />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-7px', right: '-9px', backgroundColor: '#e60000', color: 'white', fontSize: '10px', padding: '2px 5px', borderRadius: '50%', fontWeight: 'bold', lineHeight: 1 }}>
                  {totalItems}
                </span>
              )}
            </div>
            <div style={{ paddingLeft: '10px', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
              <button onClick={() => setMobileMenuOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                {mobileMenuOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Búsqueda expandida móvil */}
      {isMobile && mobileSearchOpen && (
        <div className='mobile-search-bar' style={{ position: 'fixed', top: '70px', left: 0, width: '100%', background: '#0d0d0d', borderBottom: '1px solid #e60000', zIndex: 998 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px' }}>
            <Search size={16} style={{ color: '#777', flexShrink: 0 }} />
            <input
              type="text" placeholder="Buscar accesorios..." value={searchTerm} autoFocus
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearchSubmit(searchTerm)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', padding: '9px 14px', outline: 'none', minWidth: 0 }}
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(''); setSugerencias([]); setShowDropdown(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
                <X size={16} />
              </button>
            )}
            <button onClick={() => { setMobileSearchOpen(false); setSearchTerm(''); setShowDropdown(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e60000', fontSize: '13px', fontWeight: '600', flexShrink: 0 }}>
              Cancelar
            </button>
          </div>
          {showDropdown && sugerencias.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', maxHeight: '260px', overflowY: 'auto' }}>
              {sugerencias.map(prod => (
                <div key={prod.id_producto}
                  onClick={() => { navigate(`/catalogo?search=${encodeURIComponent(prod.nombre)}`); setShowDropdown(false); setSearchTerm(''); setMobileSearchOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(230,0,0,0.07)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img src={`${API_BASE}${prod.imagen}`} alt={prod.nombre} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }} />
                  <span>{prod.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Menú móvil */}
      {isMobile && mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '70px', left: 0, width: '100%', height: 'calc(100vh - 70px)', backgroundColor: 'black', color: 'white', zIndex: 999, padding: '20px', boxSizing: 'border-box', overflowY: 'auto', borderTop: '1px solid #e60000' }}>
          <NavLink to="/" end className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/contacto" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Contacto</NavLink>
          <div style={{ borderBottom: '1px solid #333' }}>
            <div onClick={() => setCatalogOpenMobile(p => !p)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', cursor: 'pointer' }}>
              <span style={{ fontSize: '18px', color: isCatalogoActive ? '#e60000' : 'white', transition: 'color 0.2s' }}>Catálogo</span>
              {catalogOpenMobile ? <ChevronUp size={20} color="#e60000" /> : <ChevronDown size={20} color={isCatalogoActive ? '#e60000' : 'white'} />}
            </div>
            {catalogOpenMobile && (
              <div style={{ paddingLeft: '15px' }}>
                {categorias.map((cat, i) => (
                  <Link
                    key={i}
                    to={generarRuta(cat.nombre)}
                    className="mobile-sublink"
                    style={{ borderBottom: i === categorias.length - 1 ? 'none' : '1px solid #222' }}
                    onClick={() => { setMobileMenuOpen(false); setCatalogOpenMobile(false); }}
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;