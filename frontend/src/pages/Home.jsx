import React from 'react';

// Importación de las secciones modulares que componen la página de inicio
import Hero from '../components/Hero';
import Ofertas from '../components/Ofertas';
import Beneficios from '../components/Beneficios';
import BannerFinal from '../components/BannerFinal';

/**
 * Componente principal de la página de Inicio (Landing Page).
 * Estructura la vista construyendo la interfaz a partir de componentes visuales.
 */
const Home = () => {
  return (
    <>
      {/* Sección principal de impacto visual (Banner/Video) */}
      <Hero />
      
      {/* Carrusel o listado destacado de ofertas importantes */}
      <div style={{ width: '100%', position: 'relative' }}>
        <Ofertas />
      </div>
      
      {/* Sección que destaca las ventajas de comprar en la tienda */}
      <Beneficios />
      
      {/* Llamado a la acción (Call to Action) al final de la página */}
      <BannerFinal />
    </>
  );
};

export default Home;