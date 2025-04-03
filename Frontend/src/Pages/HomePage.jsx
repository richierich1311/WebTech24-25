import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div className="card">
        <h2>Willkommen bei ProTasker</h2>
        <p>Verwalte deine Projekte und Aufgaben einfach und effizient.</p>
        <button className="nav-btn" onClick={() => navigate('/projects/new')}>Neues Projekt erstellen</button>
        <button className="nav-btn" onClick={() => navigate('/projects')}>Alle Projekte anzeigen</button>
        <button className="nav-btn" onClick={() => navigate('/tasks')}>Alle Aufgaben anzeigen</button>
      </div>
    </div>
  );
};

export default HomePage;
