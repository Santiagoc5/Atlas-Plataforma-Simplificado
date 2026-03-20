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
      texto: "Envíos en gran parte del país. Recíbelo en 2 a 3 días hábiles en ciudades principales."
    },
    {
      icono: <CreditCard size={35} color="white" />,
      titulo: "Opciones de pago",
      texto: "Aceptamos transferencia bancaria y pago contra entrega."
    }
  ];

  return (
    <>
      <section className="beneficios-section">
        <h2 className="beneficios-titulo">¿Por qué elegir Atlas Accesorios?</h2>
        <p className="beneficios-subtitulo">Compromiso con la calidad y satisfacción de nuestros clientes</p>

        <div className="beneficios-grid">
          {data.map((item, index) => (
            <div key={index} className="beneficio-card">
              <div className="beneficio-icono">
                {item.icono}
              </div>
              <h3 className="beneficio-card-titulo">{item.titulo}</h3>
              <p className="beneficio-card-texto">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .beneficios-section {
          padding: 80px 8%;
          background-color: white;
          text-align: center;
        }
        .beneficios-titulo {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: #1a1a1a;
        }
        .beneficios-subtitulo {
          color: #666;
          margin-bottom: 50px;
        }
        .beneficios-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .beneficio-card {
          padding: 40px 30px;
          border-radius: 15px;
          border: 2px solid #e60000;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease;
        }
        .beneficio-icono {
          background-color: #e60000;
          width: 70px;
          height: 70px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(230,0,0,0.3);
        }
        .beneficio-card-titulo {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .beneficio-card-texto {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 960px) {
          .beneficios-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .beneficio-card:nth-child(3) {
            grid-column: 1/-1;
            width: calc(50% - 15px);
            margin: 0 auto;
          }
        }

        @media (max-width: 640px) {
          .beneficios-grid {
            grid-template-columns: 1fr;
          }
          .beneficio-card:nth-child(3) {
            grid-column: auto;
            width: 100%;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Beneficios;