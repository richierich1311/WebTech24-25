import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import '../style.css';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = sessionStorage.getItem('username');
    setUsername(savedUsername || '');
  }, [isLoggedIn]);
  

  const handleLogout = (e) => {
    e.preventDefault(); // Verhindert Seitennavigation durch Link
    sessionStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">ProTasker</Link>
      </div>
      <nav>
        <ul className="nav-list">
          {isLoggedIn ? (
            <>
              <li><Link to="/myprojects" className="nav-btn">Meine Projekte</Link></li>
              <li><Link to="/mytasks" className="nav-btn">Meine Aufgaben</Link></li>
              <li>
                <Link to="/" className="nav-btn" onClick={handleLogout}>Logout</Link>
              </li>
              {username && (
                <li className="user-info">👤 {username}</li>
              )}
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-btn">Login</Link></li>
              <li><Link to="/register" className="nav-btn">Registrieren</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
