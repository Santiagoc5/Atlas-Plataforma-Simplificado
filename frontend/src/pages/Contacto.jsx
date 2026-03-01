import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contacto = () => {
  return (
    <div style={{ paddingTop: '120px', minHeight: '80vh', backgroundColor: '#fff' }}>
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '60px', padding: '0 5%' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1a1a1a', marginBottom: '10px' }}>
          CONTACTO <span style={{ color: '#e60000' }}>ATLAS</span>
        </h1>
        <div style={{ width: '80px', height: '5px', backgroundColor: '#e60000', margin: '0 auto 20px' }}></div>
        <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Contáctanos por nuestros canales oficiales.
        </p>
      </div>

      {/* Contenedor de Tarjetas de Información */}
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '30px',
        padding: '0 5%'
      }}>
        
        {/* Tarjeta 1: Ubicación */}
        <div style={estiloTarjeta}>
          <div style={estiloIcono}><MapPin size={30} color="white" /></div>
          <h3 style={estiloTitulo}>Nuestra Sede</h3>
          <p style={estiloTexto}>Cúcuta, Norte de Santander</p>
          <p style={estiloSubtexto}>Sector Automotriz</p>
        </div>

        {/* Tarjeta 2: Atención Directa */}
        <div style={estiloTarjeta}>
          <div style={estiloIcono}><Phone size={30} color="white" /></div>
          <h3 style={estiloTitulo}>Línea Directa</h3>
          <p style={estiloTexto}>+57 300 530 7606</p>
          <p style={estiloSubtexto}>WhatsApp disponible</p>
        </div>

        {/* Tarjeta 3: Horarios */}
        <div style={estiloTarjeta}>
          <div style={estiloIcono}><Clock size={30} color="white" /></div>
          <h3 style={estiloTitulo}>Horario</h3>
          <p style={estiloTexto}>Lun - Sáb</p>
          <p style={estiloSubtexto}>9:00 AM - 6:00 PM</p>
        </div>

      </div>

      {/* Sección de Redes Sociales / Email */}
      <div style={{ textAlign: 'center', marginTop: '80px', padding: '40px', backgroundColor: '#f8f8f8' }}>
        <p style={{ color: '#888', marginBottom: '20px' }}>O escríbenos a nuestro correo oficial</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <Mail size={20} color="#e60000" />
          <span style={{ fontWeight: '700', fontSize: '1.2rem', color: '#1a1a1a' }}>arciniegasraul00@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

// Estilos Reutilizables
const estiloTarjeta = {
  backgroundColor: '#1a1a1a',
  padding: '40px 20px',
  borderRadius: '20px',
  color: 'white',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
};

const estiloIcono = {
  backgroundColor: '#e60000',
  width: '60px',
  height: '60px',
  borderRadius: '15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 20px'
};

const estiloTitulo = {
  fontSize: '1.4rem',
  marginBottom: '10px'
};

const estiloTexto = {
  fontSize: '1.1rem',
  margin: '5px 0',
  fontWeight: '600'
};

const estiloSubtexto = {
  fontSize: '0.9rem',
  color: '#888'
};

export default Contacto;