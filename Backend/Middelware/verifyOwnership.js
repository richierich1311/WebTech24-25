const Project = require('../Datenbank/projekt');
const mongoose = require('mongoose');//Importiert das Mongoose-Modell Project, das in der Datei 
//projekt.js definiert ist. Das Modell wird benötigt, um auf die Projektdaten in der Datenbank zuzugreifen.


module.exports = async function (req, res, next) { /* Exportiert eine asynchrone Middleware-Funktion.
    Diese Funktion überprüft, ob der Benutzer berechtigt ist, auf ein bestimmtes Projekt zuzugreifen.
    Die Middleware wird in geschützten Routen verwendet, um sicherzustellen, dass nur der Besitzer 
    eines Projekts es bearbeiten, löschen oder darauf zugreifen kann.*/


    try {
        const verifyProject = await Project.findById(req.params.projectId);
         /*Sucht in der MongoDB-Datenbank nach einem Projekt 
        mit der ID, die in der URL (req.params.id) angegeben ist. findById: Wird vom Mongoose-Modell bereitgestellt. Gibt das entsprechende Dokument 
        zurück, wenn es existiert. */
        if (verifyProject.owner.toString() !== req.user.id) { /* prüft, ob der aktuelle Benutzer (basierend auf req.user.id) der Besitzer des Projekts ist.
            project.owner ist eine MongoDB-ID (vom Typ ObjectId). .toString() konvertiert diese ID in einen String, damit sie mit 
            req.user.id verglichen werden kann.*/
            return res.status(403).json({ error: 'Nicht autorisiert' });
        }
        req.project = verifyProject; // Projekt speichern
        next();
    } catch (err) {
        next(err);
    }

};
