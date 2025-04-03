const express = require('express');
const router = express.Router();
const project = require('../Datenbank/projekt'); // Importiere das Projektmodell
const authMiddleware = require('../Middelware/authMiddleware');
const ownership = require('../Middelware/verifyOwnership');

// Route: Alle Aufgaben abrufen
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await project.find({ tasks: { $exists: true, $ne: [] } });
        const allTasks = projects.flatMap((proj) => proj.tasks);

        if (allTasks.length === 0) {
            return res.status(404).json({ message: 'Keine Aufgaben gefunden' });
        }

        res.status(200).json(allTasks);
    } catch (err) {
        console.error('Fehler beim Abrufen der Aufgaben:', err);
        res.status(500).json({ error: 'Fehler beim Abrufen der Aufgaben' });
    }
});

router.get('/mytasks', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const myProjects = await project.find({ owner: userId }).populate('tasks');
  
      let myTasks = [];
      myProjects.forEach((proj) => {
        const tasksWithProjectInfo = proj.tasks.map((task) => ({
          ...task.toObject(),
          projectId: proj._id,         // 👈 HINZUGEFÜGT
          projectName: proj.name,      // optional, falls du es anzeigen willst
        }));
        myTasks.push(...tasksWithProjectInfo);
      });
  
      res.json(myTasks);
    } catch (err) {
      console.error('Fehler beim Abrufen der Aufgaben:', err.message);
      res.status(500).json({ error: 'Fehler beim Abrufen deiner Aufgaben.' });
    }
  });
  
// Aufgabe zu einem Projekt hinzufügen
router.post('/:projectId/tasks', authMiddleware, ownership, async (req, res) => {
    try {
        req.project.tasks.push(req.body); /* req.project: Wird von der ownership-Middleware gesetzt und enthält das aktuelle Projekt.
        tasks.push(req.body): Fügt die vom Client übermittelte Aufgabe (req.body) zum tasks-Array des Projekts hinzu.*/

        await req.project.save(); //Speichert die Änderungen (einschließlich der neuen Aufgabe) in der MongoDB-Datenbank.
        const newTask = req.project.tasks[req.project.tasks.length - 1];
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: 'Fehler beim Hinzufügen der Aufgabe' });
    }
});


// Aufgabe in einem Projekt aktualisieren
router.put('/:projectId/tasks/:taskId', authMiddleware,ownership, async (req, res) => {
    try {
        const task = req.project.tasks.id(req.params.taskId); /*req.project.tasks: Enthält das Aufgaben-Array des aktuellen Projekts.
        .id(req.params.taskId): Sucht die Aufgabe mit der angegebenen taskId innerhalb des Arrays.*/
        
        if (!task) {
            return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
        }
        Object.assign(task, req.body); // Kopiert die Felder aus req.body in das task-Objekt.
        await req.project.save(); //Speichert die Änderungen des Projekts (inklusive der aktualisierten Aufgabe) in der Datenbank.
        res.json(task); //Gibt die aktualisierte Aufgabe als JSON zurück.
    } catch (err) {
        res.status(400).json({ error: 'Fehler beim Aktualisieren der Aufgabe' });
    }
});

// Aufgabe aus einem Projekt löschen
router.delete('/:projectId/tasks/:taskId', authMiddleware,ownership, async (req, res) => {
    try {
        const task = req.project.tasks.id(req.params.taskId);//Sucht die Aufgabe mit der angegebenen taskId im Aufgaben-Array des Projekts.
        if (!task) {
            return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
        }
        task.deleteOne();//Entfernt die gefundene Aufgabe aus dem Aufgaben-Array des Projekts.
        await req.project.save();//Speichert die Änderungen (die entfernte Aufgabe) in der Datenbank.
        res.json({ message: 'Aufgabe gelöscht' });
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Löschen der Aufgabe' });
    }
});


module.exports = router;
