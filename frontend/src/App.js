import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importación de componentes principales
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Importación de páginas
import Home from './pages/Home';
import Contacto from './pages/Contacto';
import Catálogo from './pages/Catálogo';
import TodasLasOfertas from './pages/TodasLasOfertas';
import Checkout from './pages/Checkout';

// Contextos y Panel de Administración
import { CartProvider } from './context/CartContext';
import AdminPanel from "./admin/index.jsx";
import './App.css';

/**
 * Componente principal que contiene la estructura y las rutas de la aplicación.
 * Utiliza useLocation para determinar si el usuario se encuentra en el panel de administración
 * y así ocultar componentes visuales públicos (Navbar, Footer, WhatsAppButton).
 */
const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      {/* Contenedor global para las notificaciones emergentes (Toasts) */}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        closeButton={false}
      />
      
      {/* Contenedor principal de la aplicación */}
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: 'white' }}>
        {/* Renderizado condicional de componentes públicos si no estamos en admin */}
        {!isAdmin && <Navbar />}
        {!isAdmin && <WhatsAppButton />}
        
        {/* Definición de las rutas públicas y de administración */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/todas-las-ofertas" element={<TodasLasOfertas />} />
          <Route path="/catalogo" element={<Catálogo />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Todas las rutas que inician con /admin son manejadas por AdminPanel */}
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
        
        {/* Footer oculto en el panel de administración */}
        {!isAdmin && <Footer />}
      </div>
    </CartProvider>
  );
};

/**
 * Componente raíz que envuelve la aplicación en el BrowserRouter.
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;