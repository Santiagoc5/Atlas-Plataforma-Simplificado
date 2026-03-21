import { ArrowRight, Gem } from "lucide-react";
import { Link } from 'react-router-dom';

/**
 * Componente Hero principal de la Landing Page.
 * Da la primera impresión visual (título y llamado a la acción principal).
 */
export default function Hero() {
  return (
    <>
      <style>{`
        .hero-section {
          min-height: 100vh;
          width: 100vw;
          background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/imagen_fondo.jpeg');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 80px 8% 0;
          color: white;
          text-align: left;
          box-sizing: border-box;
          position: relative;
        }
        .hero-badge {
          background-color: #e60000;
          padding: 5px 14px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          width: fit-content;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        .hero-title {
          font-size: 3.5rem;
          margin: 0;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          color: #ccc;
          margin-top: 15px;
          max-width: 500px;
        }
        .hero-benefits {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .hero-benefits-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
        }
        .hero-cta {
          background-color: #e60000;
          color: white;
          border: none;
          padding: 15px 32px;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          width: fit-content;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: transform 0.2s, background-color 0.2s;
          box-shadow: 0 8px 20px rgba(230,0,0,0.3);
        }
        .hero-cta:hover {
          transform: translateY(-2px);
          background-color: #ff1a1a;
        }
        
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }
        }
        @media (max-width: 768px) {
          .hero-section {
            padding: 70px 6% 0;
          }
          .hero-title {
            font-size: 2.3rem;
          }
          .hero-subtitle {
            font-size: 1.05rem;
            max-width: 100%;
          }
          .hero-benefits {
            gap: 12px;
            margin-bottom: 25px;
            flex-direction: column;
          }
        }
        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.9rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .hero-benefits-item {
            font-size: 0.85rem;
          }
          .hero-cta {
            padding: 12px 24px;
            font-size: 0.95rem;
          }
        }
      `}</style>
      <section className="hero-section">
        {/* Etiqueta flotante decorativa */}
        <div className="hero-badge">
          <Gem size={13} style={{ marginRight: '6px' }} /> ACCESORIOS PREMIUM
        </div>

        <h1 className="hero-title">
          Transforma tu <br />
          <span style={{ color: '#e60000' }}>Camioneta</span> con Estilo
        </h1>

        <p className="hero-subtitle">
          Especialistas en lujos y accesorios para 4x4
        </p>

        {/* Sección de Beneficios Cortos (Checks) */}
        <div className="hero-benefits">
          <div className="hero-benefits-item">
            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✔</span> Garantía 6 meses
          </div>
          <div className="hero-benefits-item">
            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✔</span> Envíos en gran parte del país
          </div>
          <div className="hero-benefits-item">
            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>✔</span> Pago contra entrega
          </div>
        </div>

        {/* Llamado a la Acción (CTA) */}
        <Link to="/catalogo" className="hero-cta">
          Ver Catálogo Completo <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </Link>
      </section>
    </>
  );
}