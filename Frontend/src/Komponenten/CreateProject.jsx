import React, { useState } from 'react';
import { createProject } from '../Api';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Offen');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Mittel');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Mittel');
  const [projektMessage, setProjektMessage] = useState('');
  const [taskMessage, setTaskMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !dueDate) {
      setProjektMessage('Bitte Projektname und Fälligkeit angeben.');
      return;
    }

    try {
      const response = await createProject({ name, status, dueDate, priority, tasks });
      navigate('/myprojects', { state: { newProject: response.data } });
    } catch (error) {
      console.error('Fehler beim Erstellen:', error.message);
    }
  };

  const addTask = () => {
    if (!taskName || !taskDueDate) {
      setTaskMessage('Bitte Aufgabenname und Fälligkeit angeben.');
      return;
    }
    setTasks([...tasks, { name: taskName, dueDate: taskDueDate, priority: taskPriority }]);
    setTaskName('');
    setTaskDueDate('');
    setTaskPriority('Mittel');
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Neues Projekt erstellen</h2>
        {projektMessage && <p className="error-message">{projektMessage}</p>}
        <input
          type="text"
          placeholder="Projektname"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Offen">Offen</option>
          <option value="In Arbeit">In Arbeit</option>
          <option value="Fertig">Fertig</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Hoch">Hoch</option>
          <option value="Mittel">Mittel</option>
          <option value="Niedrig">Niedrig</option>
        </select>

        <h3>Aufgabe hinzufügen</h3>
        {taskMessage && <p className="error-message">{taskMessage}</p>}
        <input
          type="text"
          placeholder="Aufgabenname"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
          <option value="Hoch">Hoch</option>
          <option value="Mittel">Mittel</option>
          <option value="Niedrig">Niedrig</option>
        </select>
        <button className="nav-btn" type="button" onClick={addTask}>Aufgabe hinzufügen</button>

        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task.name} – {task.dueDate} – {task.priority}
            </li>
          ))}
        </ul>

        <button className="nav-btn" type="submit">Projekt erstellen</button>
      </form>
    </div>
  );
};

export default CreateProject;
