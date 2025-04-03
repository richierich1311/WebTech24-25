import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Komponenten/Header';
import Footer from './Komponenten/Footer';
import CreateProject from './Komponenten/CreateProject';
import HomePage from './Pages/HomePage';
import ProjectsPage from './Pages/ProjectsPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DetailProjectPage from './Pages/DetailProjectPage';
import LandingPage from './Pages/LandingPage';
import TaskListPage from './Pages/TaskListPage';
import EditProjectPage from './Pages/EditProjectPage';
import MyProjectsPage from './Pages/MyProjectPage';
import MyTasksPage from './Pages/MyTasksPage';
import Impressum from './Pages/Impressum';
import Kontakt from './Pages/Kontakt';

export const AuthContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('token'));

  useEffect(() => {
    // Token überwachen
    const checkLogin = () => {
      setIsLoggedIn(!!sessionStorage.getItem('token'));
    };
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <LandingPage />} />
          <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/projects" element={isLoggedIn ? <ProjectsPage /> : <Navigate to="/" />} />
          <Route path="/projects/new" element={isLoggedIn ? <CreateProject /> : <Navigate to="/" />} />
          <Route path="/projects/:id" element={isLoggedIn ? <DetailProjectPage /> : <Navigate to="/" />} />
          <Route path="/tasks" element={isLoggedIn ? <TaskListPage /> : <Navigate to="/" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/edit-project/:id" element={isLoggedIn ? <EditProjectPage /> : <Navigate to="/" />} />
          <Route path="/myprojects" element={isLoggedIn ? <MyProjectsPage /> : <Navigate to="/" />} />
          <Route path="/mytasks" element={isLoggedIn ? <MyTasksPage /> : <Navigate to="/" />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
