import { ArrowRight, Gem } from "lucide-react";
import { Link } from 'react-router-dom';
export default function Hero() {
  return (
    <section style={{
      height: '100vh',
      width: '100vw',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/imagen_fondo.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '0 8%',
      color: 'white',
      textAlign: 'left',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <div style={{
        backgroundColor: '#e60000',
        padding: '4px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        width: 'fit-content',
        marginBottom: '20px'
      }}>
        <Gem size={12} style={{ marginRight: '5px', verticalAlign: 'middle' }} /> ACCESORIOS PREMIUM
      </div>

      <h1 style={{ fontSize: '3.5rem', margin: '0', lineHeight: '1.2' }}>
        Transforma tu <br />
        <span style={{ color: '#e60000' }}>Camioneta</span> con Estilo
      </h1>

      <p style={{ fontSize: '1.2rem', color: '#ccc', marginTop: '15px', maxWidth: '500px' }}>
        Especialistas en lujos y accesorios para 4x4
      </p>

      {/* Sección de Beneficios (Checks) */}
<div style={{ 
  display: 'flex', 
  gap: '20px', 
  marginBottom: '30px',
  flexWrap: 'wrap' // Por si en celular no caben todos en una línea
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
    <span style={{ color: '#2ecc71' }}>✔</span> Garantía 6 meses
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
    <span style={{ color: '#2ecc71' }}>✔</span> Envíos en gran parte del país
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
    <span style={{ color: '#2ecc71' }}>✔</span> Pago contra entrega
  </div>
</div>

      <Link to="/catalogo" style={{
        backgroundColor: '#e60000',
        color: 'white',
        border: 'none',
        padding: '15px 30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        borderRadius: '5px',
        marginTop: '5px',
        cursor: 'pointer',
        width: 'fit-content',
        textDecoration: 'none',
      }}>
        Ver Catálogo Completo <ArrowRight size={18} style={{ marginLeft: '5px', verticalAlign: 'middle' }} />
      </Link>
    </section>
  );
}