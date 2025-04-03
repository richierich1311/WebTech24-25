import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthAndRedirect } from '../Komponenten/authUtils';
import { getAllTasks, deleteTask } from '../Api';
import CardWithRandomBackground from '../Komponenten/CardWithRandomBackground';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuthAndRedirect(navigate, 'Bitte vorher anmelden.')) return;

    const fetchTasks = async () => {
      try {
        const response = await getAllTasks();
        setTasks(response.data);
      } catch (error) {
        setErrorMessage('❌ Fehler beim Laden der Aufgaben.');
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleDeleteTask = async (projectId, taskId) => {
    try {
      await deleteTask(projectId, taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      setErrorMessage('❌ Nur der Ersteller kann die Aufgabe lösen.');
    }
  };

  return (
    <div className="main-content">
      <h2>Alle Aufgaben</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ul className="project-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <CardWithRandomBackground key={task._id}>
              <h3>{task.name}</h3>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Fälligkeit:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Priorität:</strong> {task.priority}</p>
            </CardWithRandomBackground>
          ))
        ) : (
          <p>Keine Aufgaben gefunden.</p>
        )}
      </ul>
    </div>
  );
};

export default TaskListPage;
