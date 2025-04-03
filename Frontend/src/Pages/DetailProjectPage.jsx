import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjectDetails } from '../Api';
import { useNavigate } from 'react-router-dom';


const DetailProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await getProjectDetails(id);
        setProject(response.data);
      } catch (err) {
        setError('Projekt konnte nicht geladen werden.');
        console.error('Fehler:', err);
      }
    };

    fetchProjectDetails();
  }, [id]);

  

  const handleBack = () => {
  navigate(-1); // geht eine Seite im Verlauf zurück
};

  if (!project) {
    return <p>Projekt wird geladen...</p>;
  }

  return (
    <div className="main-content">
      <div className="card">
        <h2>{project.name}</h2>
        <p>Status: {project.status}</p>
        <p>Fälligkeitsdatum: {new Date(project.dueDate).toLocaleDateString()}</p>
        <p>Priorität: {project.priority}</p>
        <button className="nav-btn" onClick={handleBack}>Zurück</button>

        <h3>Aufgaben:</h3>
        <ul>
          {Array.isArray(project.tasks) && project.tasks.length > 0 ? (
            project.tasks.map((task) => (
              <li key={task._id} className="card">
                {task.name} – {task.status}
              </li>
              
            ))
            
          ) : (
            <p>Keine Aufgaben vorhanden</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DetailProjectPage;
