import React from 'react';
import Hero from '../components/Hero';
import Ofertas from './Ofertas';
import Beneficios from '../components/Beneficios';
import BannerFinal from '../components/BannerFinal';

const Home = () => {
  return (
    <>
      <Hero />
      <div style={{ width: '100%', position: 'relative' }}>
        <Ofertas />
      </div>
      <Beneficios />
      <BannerFinal />
    </>
  );
};

export default Home;