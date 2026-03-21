import React from 'react';
import { Crown, MessageCircle } from 'lucide-react';

/**
 * Banner de llamado a la acción final (CTA) en el Home.
 * Dirige al cliente al WhatsApp de ventas.
 */
const BannerFinal = () => {
  return (
    <section style={{
      padding: '100px 8%',
      backgroundColor: '#1a1a1a', // Fondo oscuro para contraste
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '0px',
    }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(230, 0, 0, 0.1)',
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Crown size={50} color="#e60000" style={{ marginBottom: '20px' }} />
        
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '900', 
          color: 'white', 
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          ¿Listo para transformar <span style={{ color: '#e60000' }}>tu camioneta?</span>
        </h2>
        
        <p style={{ 
          color: '#bbb', 
          fontSize: '1.1rem', 
          maxWidth: '600px', 
          margin: '0 auto 40px auto',
          lineHeight: '1.6'
        }}>
          No te conformes con lo estándar. Dale a tu vehículo la protección y el estilo 
          Premium que se merece con nuestros accesorios exclusivos.
        </p>

        <a href='https://wa.me/573005307606?text=Hola%20Atlas,%20estoy%20interesado%20en%20accesorios%20para%20mi%20camioneta' 
        target="_blank"
        rel='noopener noreferrer'         
        style={{
          backgroundColor: '#e60000',
          color: 'white',
          padding: '18px 40px',
          fontSize: '1.1rem',
          fontWeight: '700',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'transform 0.2s, background-color 0.2s',
          boxShadow: '0 10px 20px rgba(230, 0, 0, 0.3)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <MessageCircle size={22} />
          Cotizar por WhatsApp ahora
        </a>
      </div>
    </section>
  );
};

export default BannerFinal;