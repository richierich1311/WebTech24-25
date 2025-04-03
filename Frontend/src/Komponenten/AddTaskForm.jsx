import { useState } from 'react';
import { addTask } from '../Api';

const AddTaskForm = ({ projectId, onTaskAdded }) => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Mittel');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!name || !dueDate) {
      setMessage('❗ Bitte Name und Fälligkeitsdatum eingeben.');
      return;
    }

    try {
      const response = await addTask(projectId, { name, dueDate, priority });
      onTaskAdded(projectId, response.data); 
      setName('');
      setDueDate('');
      setPriority('Mittel');
      setMessage('✅ Aufgabe erfolgreich hinzugefügt!');
    } catch (err) {
      setMessage('❌ Fehler beim Hinzufügen der Aufgabe.');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h4>Neue Aufgabe</h4>
      {message && <p className="error-message">{message}</p>}
      <input
        type="text"
        placeholder="Aufgabenname"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button className="nav-btn" type="submit">Aufgabe speichern</button>
    </form>
  );
};

export default AddTaskForm;
