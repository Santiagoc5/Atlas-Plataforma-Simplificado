import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import AdminPanel from "./admin/index.jsx";
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <ToastContainer
      position="bottom-right"
      autoClose={2500}
      hideProgressBar={false}
      closeButton={false}
      />
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white' }}>
        {!isAdmin && <Navbar />}
        {!isAdmin && <WhatsAppButton />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/todas-las-ofertas" element={<TodasLasOfertas />} />
          <Route path="/catalogo" element={<Catálogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
        {!isAdmin && <Footer />}
      </div>
    </CartProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;