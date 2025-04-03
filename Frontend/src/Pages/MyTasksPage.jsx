import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthAndRedirect } from '../Komponenten/authUtils';
import { getMyTasks, deleteTask } from '../Api';
import CardWithRandomBackground from '../Komponenten/CardWithRandomBackground';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuthAndRedirect(navigate, 'Bitte vorher anmelden.')) return;

    const fetchMyTasks = async () => {
      try {
        const response = await getMyTasks();
        setTasks(response.data);
      } catch (err) {
        setError('Fehler beim Laden deiner Aufgaben.');
      }
    };

    fetchMyTasks();
  }, [navigate]);

  const handleDeleteTask = async (projectId, taskId) => {
    try {
      await deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError('Fehler beim Löschen der Aufgabe');
    }
  };

  return (
    <div className="main-content">
      <h2>Meine Aufgaben</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="project-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              <CardWithRandomBackground>
                <h3>{task.name}</h3>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Fälligkeit:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                <p><strong>Priorität:</strong> {task.priority}</p>
                <p><strong>Projekt:</strong> {task.projectName || 'Unbekannt'}</p>
                <button
                  className="nav-btn"
                  onClick={() => handleDeleteTask(task.projectId, task._id)}
                >
                  Aufgabe lösen
                </button>
                <button
                  className="nav-btn"
                  onClick={() => handleDeleteTask(task.projectId, task._id)}
                >
                  Aufgabe löschen
                </button>
              </CardWithRandomBackground>
            </li>
          ))
        ) : (
          <p>Du hast keine Aufgaben.</p>
        )}
      </ul>
    </div>
  );
};

export default MyTasksPage;
