import React from 'react';
import ReactDOM from 'react-dom/client'; // Für React 18
import App from './App'; // Hauptkomponente
import './style.css'; // Globale CSS-Datei

// Verbinde React mit dem DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendere die App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
