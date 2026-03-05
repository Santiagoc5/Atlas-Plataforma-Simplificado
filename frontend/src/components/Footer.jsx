import React from 'react';
import { Facebook, Instagram, MessageCircle, Mail, MapPin, Phone, Medal, Truck, ShieldCheck } from 'lucide-react';

const Footer = () => {
  // Estilo común para los contenedores de iconos
  const iconContainerStyle = {
    backgroundColor: 'rgba(230, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // Evita que el icono se aplaste si el texto es largo
    boxSizing: 'border-box',
  };

  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '60px 8% 20px 8%',
      borderTop: '3px solid #e60000',
      marginTop: '0px'
    }}>
      {/* CONTENEDOR PRINCIPAL CON FLEX PARA ALINEACIÓN SUPERIOR */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Alinea los componentes arriba
        flexWrap: 'wrap',
        gap: '40px',
        marginBottom: '40px'
      }}>
        
        {/* Columna 1: Marca y Eslogan */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h2 style={{ color: '#e60000', margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
            ATLAS ACCESORIOS
          </h2>
          <p style={{ fontSize: '14px', color: '#bbb', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Especialistas en equipamiento premium para camionetas. 
            Llevamos tu aventura al siguiente nivel con los mejores 
            accesorios del mercado nacional e internacional.
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="https://www.instagram.com/atlas_accesorios_?igsh=MWQwZXEweG5kODVpeg==" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} color="#bbb" />
            </a>
            <a href="https://www.facebook.com/share/1ZwDXbUMLz/" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} color="#bbb" />
            </a>
            <a href="https://wa.me/573005307606" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={20} color="#bbb" />
            </a>
          </div>
        </div>

        {/* Columna 2: Compromiso Atlas */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h4 style={{ 
            color: '#e60000', 
            margin: '0 0 25px 0', // Margen superior 0 para alinear
            fontSize: '18px', 
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            Compromiso Atlas
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={iconContainerStyle}><Medal size={22} color="#e60000" /></div>
              <div>
                <span style={{ color: 'white', display: 'block', fontSize: '14px', fontWeight: '600' }}>Calidad Premium</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Productos seleccionados</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={iconContainerStyle}><Truck size={22} color="#e60000" /></div>
              <div>
                <span style={{ color: 'white', display: 'block', fontSize: '14px', fontWeight: '600' }}>Envíos Nacionales</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Cobertura en toda Colombia</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={iconContainerStyle}><ShieldCheck size={22} color="#e60000" /></div>
              <div>
                <span style={{ color: 'white', display: 'block', fontSize: '14px', fontWeight: '600' }}>Compra Segura</span>
                <span style={{ color: '#888', fontSize: '12px' }}>Respaldo total en tu pedido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3: Contacto Directo */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h4 style={{ 
            color: '#e60000', 
            margin: '0 0 25px 0', // Mismo margen que la col anterior
            fontSize: '18px', 
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            Contacto
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={iconContainerStyle}><MapPin size={22} color="#e60000" /></div>
              <span style={{ fontSize: '14px', color: '#bbb' }}>Cúcuta, Norte de Santander</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={iconContainerStyle}><Phone size={22} color="#e60000" /></div>
              <span style={{ fontSize: '14px', color: '#bbb' }}>+57 300 530 7606</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={iconContainerStyle}><Mail size={22} color="#e60000" /></div>
              <span style={{ fontSize: '14px', color: '#bbb', wordBreak: 'break-all' }}>arciniegasraul00@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#777' }}>
        © 2026 Atlas Accesorios. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;