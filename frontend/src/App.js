import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Catálogo from './pages/Catálogo';
import WhatsAppButton from './components/WhatsAppButton';
import TodasLasOfertas from './pages/TodasLasOfertas';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white' }}>
          <Navbar />
          <WhatsAppButton />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/todas-las-ofertas" element={<TodasLasOfertas />} />
            <Route path="/catalogo" element={<Catálogo />} />
            <Route path="/Contacto" element={<Contacto />} />
          </Routes>

          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;