import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Api';
import { AuthContext } from '../App';

const LoginPage = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      const token = response.data.token;

      if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', response.data.user.username);
        sessionStorage.setItem('userId', response.data.userId);
        setIsLoggedIn(true);
        setError('');
        navigate('/home');
      }
    } catch (err) {
      setError('❌ Benutzername oder Passwort ist ungültig');
    }
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2>Login</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="nav-btn" type="submit">Anmelden</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
