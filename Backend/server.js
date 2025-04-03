// 🔹 Notwendige Module importieren
const express = require('express'); // Express für den Server
const cors = require('cors'); // Cross-Origin Resource Sharing
const path = require('path'); // Für statische Dateien
const mongoose = require('mongoose'); // MongoDB Verbindung
require('dotenv').config(); // Falls du Umgebungsvariablen nutzen willst

// 🔹 Import der Routen
const authRoutes = require('./Routes/auth'); // Authentifizierungs-Routen
const projectRoutes = require('./Routes/projekte'); // Projekt-Routen
const taskRoutes = require('./Routes/tasks'); // Aufgaben-Routen

// 🔹 Express-App initialisieren
const app = express();

// 🔹 Middleware für JSON-Daten und Formulardaten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 CORS erlauben (wichtig für Kommunikation mit Frontend)
const allowedOrigins = [
    'http://localhost:3000',
    'https://protasker-frontend.onrender.com'
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
  

// 🔹 Verbindung zur Datenbank (MongoDB)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/protasker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB verbunden'))
.catch((err) => console.error('❌ Fehler beim Verbinden mit MongoDB:', err));

// 🔹 API-Routen registrieren (WICHTIG: Vor dem Servieren der React-App)
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/tasks', taskRoutes);


// 🔹 Statische React-Dateien bereitstellen (nach Build von React)
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Alle nicht erkannten API-Routen abfangen
app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(404).json({ error: "API-Route nicht gefunden" });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 Server starten
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
