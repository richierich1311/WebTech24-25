const express = require('express'); //Lädt das Express-Paket, um HTTP-Routing und Middleware zu ermöglichen. Express hilft uns, Server und APIs zu erstellen.
const jwt = require('jsonwebtoken'); //JWT wird verwendet, um Benutzer nach dem Einloggen zu authentifizieren und ihre Sitzungen zu sichern.
const bcrypt = require('bcrypt'); //Importiert Bcrypt, um eingegebene Passwörter mit gehashten Passwörtern in der Datenbank zu vergleichen.
const User = require('../Datenbank/user'); // Importiert das Benutzer-Modell (User) aus der user.js. Dieses Modell wird verwendet, um Benutzer in der MongoDB-Datenbank zu finden oder zu erstellen.
const router = express.Router(); //Erstellt eine neue Instanz von Router. Router erlaubt uns, mehrere Routen zu erstellen und modular zu organisieren

// Registrieren
router.post('/register', async (req, res) => {// Definiert eine POST-Route unter /auth/register. Wird aufgerufen, wenn ein Benutzer sich registrieren möchte.
    const { username, password } = req.body; //Extrahiert die Felder username und password aus der Anfrage (req.body).
    try {
        const existingUser = await User.findOne({ username });/* Überprüft, ob der Benutzername bereits in der Datenbank existiert.
        User.findOne({...}) sucht nach einem Benutzer mit dem angegebenen username.*/
        if (existingUser) { //Wenn ein Benutzer mit dem angegebenen username existiert, wird ein Fehler zurückgegeben.
            return res.status(400).json({ error: 'Benutzername bereits vergeben' });
        }
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    } catch (err) {
        res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
    }
});

// Login
router.post('/login', async (req, res) => { //Definiert eine POST-Route unter /auth/login. Wird aufgerufen, wenn ein Benutzer sich einloggen möchte.
    try {
        const user = await User.findOne({ username: req.body.username }); //enthält die Daten, die der Benutzer über das Login-Formular eingegeben hat
        //Es wird in der MongoDB nach einem Dokument gesucht, das mit dem username übereinstimmt.

        if (!user || !(await bcrypt.compare(req.body.password, user.password))) { //bcrypt.compare überprüft das eingegebene Passwort
             // (req.body.password) mit dem gehashten Passwort (user.password) aus der Datenbank.
            return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });/* Erstellt ein JSON Web Token mit folgenden Parametern:
        Payload: { id: user._id }, also die Benutzer-ID. Geheimschlüssel: process.env.JWT_SECRET, der in der .env-Datei definiert ist.
        Ablaufzeit: { expiresIn: '1h' }, bedeutet, dass der Token 1 Stunde gültig bleibt. Dieser Token wird später vom Frontend verwendet, um geschützte Endpunkte aufzurufen.*/
        res.json({ token, userId: user._id, user: { username: user.username }}); //Antwortet mit dem erstellten Token als JSON, damit das Frontend diesen Token speichern und für zukünftige Anfragen verwenden kann.
    } catch (err) { // Fängt alle unerwarteten Fehler ab, z. B. wenn die Datenbankverbindung fehlschlägt.
        res.status(500).json({ error: 'Fehler beim Anmelden' });
    }
});

module.exports = router; //Exportiert den Router, damit er in der server.js-Datei eingebunden werden kann.
