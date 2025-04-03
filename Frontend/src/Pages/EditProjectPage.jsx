import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetails, updateProject, updateTask } from '../Api';

const EditProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    status: 'Offen',
    dueDate: '',
    priority: 'Mittel',
    tasks: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectDetails(id);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden des Projekts');
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleProjectChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleTaskChange = async (taskId, field, value) => {
    setProject((prevProject) => ({
      ...prevProject,
      tasks: prevProject.tasks.map((task) =>
        task._id === taskId ? { ...task, [field]: value } : task
      ),
    }));

    try {
      const taskToUpdate = project.tasks.find((task) => task._id === taskId);
      if (taskToUpdate) {
        await updateTask(id, taskId, { ...taskToUpdate, [field]: value });
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Aufgabe:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(id, project);
      navigate('/myprojects');
    } catch (err) {
      setError('Fehler beim Speichern der Änderungen');
    }
  };

  if (loading) return <p>Lädt...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="main-content">
      <div className="card">
        <h2>Projekt bearbeiten</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={project.name} onChange={handleProjectChange} required />
          </label>
          <label>
            Status:
            <select name="status" value={project.status} onChange={handleProjectChange}>
              <option value="Offen">Offen</option>
              <option value="In Arbeit">In Arbeit</option>
              <option value="Fertig">Fertig</option>
            </select>
          </label>
          <label>
            Fälligkeitsdatum:
            <input type="date" name="dueDate" value={project.dueDate.split('T')[0]} onChange={handleProjectChange} required />
          </label>
          <label>
            Priorität:
            <select name="priority" value={project.priority} onChange={handleProjectChange}>
              <option value="Hoch">Hoch</option>
              <option value="Mittel">Mittel</option>
              <option value="Niedrig">Niedrig</option>
            </select>
          </label>
          <button className="nav-btn" type="submit">Projekt speichern</button>
          <button className="nav-btn" type="button" onClick={() => navigate('/myprojects')}>Abbrechen</button>
        </form>
      </div>

      <div className="card">
        <h3>Aufgaben bearbeiten</h3>
        {project.tasks.length > 0 ? (
          <ul>
            {project.tasks.map((task) => (
              <li className="card" key={task._id}>
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => handleTaskChange(task._id, 'name', e.target.value)}
                />
                <select
                  value={task.status}
                  onChange={(e) => handleTaskChange(task._id, 'status', e.target.value)}
                >
                  <option value="Offen">Offen</option>
                  <option value="In Arbeit">In Arbeit</option>
                  <option value="Erledigt">Erledigt</option>
                </select>
                <input
                  type="date"
                  value={task.dueDate.split('T')[0]}
                  onChange={(e) => handleTaskChange(task._id, 'dueDate', e.target.value)}
                />
                <select
                  value={task.priority}
                  onChange={(e) => handleTaskChange(task._id, 'priority', e.target.value)}
                >
                  <option value="Hoch">Hoch</option>
                  <option value="Mittel">Mittel</option>
                  <option value="Niedrig">Niedrig</option>
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Aufgaben vorhanden</p>
        )}
      </div>
    </div>
  );
};

export default EditProjectPage;
