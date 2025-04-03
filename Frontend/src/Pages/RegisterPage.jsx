import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../Api';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password });
      setSuccess('Registrierung erfolgreich! Bitte melden Sie sich an.');
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.status === 400
        ? 'Benutzername ist bereits vergeben.'
        : 'Ein Fehler ist aufgetreten.');
      setSuccess('');
    }
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2>Registrieren</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="nav-btn" type="submit">Registrieren</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default RegisterPage;
