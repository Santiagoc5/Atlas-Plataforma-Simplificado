import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Creación del nodo raíz donde se montará la aplicación React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizado de la aplicación envolviendo el componente principal <App />
// en React.StrictMode para advertencias adicionales en desarrollo.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Función para medir el rendimiento de la aplicación (opcional)
reportWebVitals();
