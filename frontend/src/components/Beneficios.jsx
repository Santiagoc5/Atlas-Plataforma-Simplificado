import React from 'react';
import { ShieldCheck, Truck, CreditCard } from 'lucide-react';

const Beneficios = () => {
  const data = [
    {
      icono: <ShieldCheck size={35} color="white" />,
      titulo: "Garantía de Calidad",
      texto: "6 meses de garantía en todos nuestros accesorios importados y nacionales"
    },
    {
      icono: <Truck size={35} color="white" />,
      titulo: "Envío Nacional",
      texto: "Entregas a casi todo el país. Llega en 2-4 días hábiles"
    },
    {
      icono: <CreditCard size={35} color="white" />,
      titulo: "Pago Flexible",
      texto: "Múltiples métodos de pago: Transferencia y pago contra entrega"
    }
  ];

  return (
    <section style={{ padding: '80px 8%', backgroundColor: 'white', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px', color: '#1a1a1a' }}>
        ¿Por qué elegir Atlas Accesorios?
      </h2>
      <p style={{ color: '#666', marginBottom: '50px' }}>Compromiso con la calidad y satisfacción de nuestros clientes</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{
            padding: '40px 30px',
            borderRadius: '15px',
            border: '2px solid #e60000',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.3s ease'
          }}>
            {/* Contenedor del Icono Rojo */}
            <div style={{
              backgroundColor: '#e60000',
              width: '70px',
              height: '70px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(230,0,0,0.3)'
            }}>
              {item.icono}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '15px' }}>
              {item.titulo}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
              {item.texto}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Beneficios;