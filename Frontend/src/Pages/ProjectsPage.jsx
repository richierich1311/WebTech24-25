import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkAuthAndRedirect } from '../Komponenten/authUtils';
import { deleteProject, getProjects } from '../Api';
import CardWithRandomBackground from '../Komponenten/CardWithRandomBackground';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!checkAuthAndRedirect(navigate, 'Bitte vorher anmelden.')) return;

    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Projekte:', error.message);
      }
    };

    fetchProjects();

    if (location.state?.newProject) {
      setProjects((prevProjects) => {
        const isDuplicate = prevProjects.some((project) => project._id === location.state.newProject._id);
        if (!isDuplicate) return [...prevProjects, location.state.newProject];
        return prevProjects;
      });
      navigate('/projects', { replace: true });
    }
  }, [navigate, location.state]);

  const findProjectById = (projectId) => projects.find((p) => p._id === projectId);
  const handleDetailsClick = (projectId) => navigate(`/projects/${projectId}`);

  const handleEditClick = (projectId) => {
    const userId = sessionStorage.getItem('userId');
    const foundproject = findProjectById(projectId);

    if (!foundproject) return setErrorMessage('Projekt nicht gefunden.');
    if (!foundproject.owner || String(foundproject.owner._id) !== String(userId)) {
      return setErrorMessage('❌ Nur der Ersteller kann ein Projekt bearbeiten.');
    }

    navigate(`/edit-project/${projectId}`);
  };

  const handleDeleteClick = async (projectId) => {
    const userId = sessionStorage.getItem('userId');
    const project = findProjectById(projectId);

    if (!project) return setErrorMessage('Projekt nicht gefunden.');
    if (!project.owner || String(project.owner._id) !== String(userId)) {
      return setErrorMessage('❌ Nur der Ersteller kann ein Projekt löschen.');
    }

    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p._id !== projectId));
      setSuccessMessage("✅ Projekt erfolgreich gelöscht");
    } catch (error) {
      setErrorMessage('❌ Fehler beim Löschen des Projekts.');
      console.error('Fehler beim Löschen:', error);
    }
  };

  return (
    <div className="main-content">
      <h2>Alle Projekte</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ul className="project-list">
        {projects.map((project) => (
          <CardWithRandomBackground key={project._id}>
            <h3>{project.name}</h3>
            <p><strong>Erstellt von:</strong> {project.owner?.username || 'Unbekannt'}</p>
            <p>Status: {project.status}</p>
            <h4>Aufgaben:</h4>
            {Array.isArray(project.tasks) && project.tasks.length > 0 ? (
              <ul>
                {project.tasks.map((task) => (
                  <li key={task._id}>
                    {task.name} - {task.status} - Fällig: {new Date(task.dueDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Aufgaben vorhanden</p>
            )}
            <button className="nav-btn" onClick={() => handleDetailsClick(project._id)}>Details</button>
            <button className="nav-btn" onClick={() => handleEditClick(project._id)}>Bearbeiten</button>
            <button className="nav-btn" onClick={() => handleDeleteClick(project._id)}>Löschen</button>
          </CardWithRandomBackground>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;
