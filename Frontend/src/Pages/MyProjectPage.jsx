import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthAndRedirect } from '../Komponenten/authUtils';
import { getMyProjects, deleteProject, deleteTask } from '../Api';
import AddTaskForm from '../Komponenten/AddTaskForm';
import CardWithRandomBackground from '../Komponenten/CardWithRandomBackground';

const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [visibleForms, setVisibleForms] = useState({});

  useEffect(() => {
    if (!checkAuthAndRedirect(navigate, 'Bitte vorher anmelden.')) return;

    const fetchMyProjects = async () => {
      try {
        const response = await getMyProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen deiner Projekte:', error.message);
        setErrorMessage('❌ Fehler beim Laden deiner Projekte.');
      }
    };

    fetchMyProjects();
  }, [navigate]);

  const handleDeleteClick = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((p) => p._id !== projectId));
      setSuccessMessage('✅ Projekt erfolgreich gelöscht.');
    } catch (error) {
      setErrorMessage('❌ Fehler beim Löschen des Projekts.');
    }
  };

  const toggleForm = (projectId) => {
    setVisibleForms((prev) => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleTaskAdded = (projectId, newTask) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project._id === projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );
    window.location.reload();
  };

  return (
    <div className="main-content">
      <h2>Meine Projekte</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <ul className="project-list">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <li key={project._id}>
              <CardWithRandomBackground>
                <h3>{project.name}</h3>
                <p>Status: {project.status}</p>
                <h4>Aufgaben:</h4>
                {Array.isArray(project.tasks) && project.tasks.length > 0 ? (
                  <ul>
                    {project.tasks.map((task) => (
                      <li key={task._id}>
                        {task.name} - {task.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Keine Aufgaben vorhanden</p>
                )}
                <button className="nav-btn" onClick={() => navigate(`/projects/${project._id}`)}>Details</button>
                <button className="nav-btn" onClick={() => navigate(`/edit-project/${project._id}`)}>Bearbeiten</button>
                <button className="nav-btn" onClick={() => handleDeleteClick(project._id)}>Projekt löschen</button>
                <button className="nav-btn" onClick={() => toggleForm(project._id)}>Aufgabe hinzufügen</button>
                {visibleForms[project._id] && (
                  <AddTaskForm
                    projectId={project._id}
                    onTaskAdded={(newTask) => handleTaskAdded(project._id, newTask)}
                  />
                )}
              </CardWithRandomBackground>
            </li>
          ))
        ) : (
          <p>⚠ Du hast noch keine Projekte erstellt.</p>
        )}
      </ul>
    </div>
  );
};

export default MyProjectsPage;
