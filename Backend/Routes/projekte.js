const express = require('express');
const router = express.Router();
const project = require('../Datenbank/projekt'); // Import des Modells
const authMiddleware = require('../Middelware/authMiddleware');
const ownership = require('../Middelware/verifyOwnership');
const mongoose = require('mongoose'); // Stelle sicher, dass mongoose importiert wird
const ObjectId = mongoose.Types.ObjectId; // Hole den ObjectId-Typ



// Alle Projekte abrufen
router.get('/', async (req, res) => { /* Definiert eine GET-Route für den Basis-Pfad /.Die Route ist asynchron (async), 
    da die Datenbankoperation (project.find()) ein Promise zurückgibt.*/
    try {
        const allProjects = await project.find().populate('owner', 'username').populate('tasks');// Ruft alle Dokumente (Projekte) aus der MongoDB-Sammlung projects. Wartet darauf, 
        //dass die Datenbankabfrage abgeschlossen ist, bevor der Code weiterläuft.
        res.json(allProjects); //Sendet die Liste der abgerufenen Projekte als JSON-Antwort an den Client.
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Projekte' });
    }
});

router.get('/myprojects', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "Benutzer-ID nicht gefunden. Bitte neu einloggen." });
        }

        const myProjects = await project.find({ owner: req.user.id }).populate('tasks');
        res.json(myProjects);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen des Projekts' });
    }
});

router.get('/:projectId', authMiddleware, async (req, res) => {
    try {
        const detailProject = await project.findById(req.params.projectId);
        if (!detailProject) {
            return res.status(404).json({ error: 'Projekt nicht gefunden' });
        }

        res.json(detailProject);
    } catch (err) {
        console.error('Fehler beim Abrufen des Projekts:', err);
        res.status(500).json({ error: 'Fehler beim Abrufen des Projekts' });
    }
});

// Neues Projekt erstellen
router.post('/', authMiddleware, async (req, res) => { /* Definiert eine POST-Route, um ein neues Projekt zu erstellen.
    authMiddleware: Stellt sicher, dass der Benutzer authentifiziert ist und req.user gesetzt ist.*/
    try {
        const newProject = new project({
            ...req.body, /* req.body: Enthält die vom Client übermittelten Daten.*/
            owner: req.user.id, /* req.user.id: ID des authentifizierten Benutzers, die von authMiddleware bereitgestellt wird.*/
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({ error: 'Fehler beim Erstellen des Projekts' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params; // Extrahiere die Projekt-ID aus der URL
        const foundProject = await project.findById(id).populate('tasks'); // Suche das Projekt und populieren der Aufgaben
        
        if (!foundProject) {
            return res.status(404).json({ message: 'Projekt nicht gefunden' });
        }

        res.status(200).json(foundProject); // Projekt zurückgeben
    } catch (err) {
        console.error('Fehler beim Abrufen des Projekts:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

//Projekt bearbeiten
router.put('/:projectId', authMiddleware, ownership, async (req, res) => { /*Definiert eine PUT-Route, um ein Projekt zu bearbeiten.
    authMiddleware: Verifiziert die Authentifizierung. ownership: Überprüft, ob der Benutzer der Besitzer des Projekts ist.*/
    try {
        Object.assign(req.project, req.body);/*req.project: Enthält das Projekt, das von ownership geladen wurde.
        req.body: Enthält die aktualisierten Daten, die vom Client gesendet wurden. Object.assign(target, source): Kopiert die Eigenschaften aus 
        req.body in req.project.*/
        await req.project.save(); //Speichert die Änderungen des Projekts in der Datenbank.
        res.json(req.project);//Gibt das aktualisierte Projekt als JSON zurück.
    } catch (err) {
        res.status(400).json({ error: 'Fehler beim Aktualisieren des Projekts' });
    }
});


// 4. Ein Projekt löschen
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deleteProject = await project.findById(req.params.id).populate('owner');

        if (!deleteProject) {
            return res.status(404).json({ error: 'Projekt nicht gefunden.' });
        }
        await deleteProject.deleteOne();
        res.status(200).json({ message: '✅ Projekt erfolgreich gelöscht' });

    } catch (error) {
        console.error('Fehler beim Löschen des Projekts:', error.message);
        res.status(500).json({ error: 'Serverfehler beim Löschen des Projekts.' });
    }
});

module.exports = router;







