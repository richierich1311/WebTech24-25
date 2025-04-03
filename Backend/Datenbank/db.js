require('dotenv').config();

console.log('Lade Umgebungsvariablen:', process.env.MONGO_URI);

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Erfolgreich mit der Datenbank verbunden'))
    .catch((err) => console.error('Fehler bei der Verbindung mit MongoDB:', err));
