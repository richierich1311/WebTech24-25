const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['Offen', 'In Arbeit', 'Erledigt'], default: 'Offen' },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['Hoch', 'Mittel', 'Niedrig'], default: 'Mittel' },
});

// Schema für Projekte
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['Offen', 'In Arbeit', 'Fertig'], default: 'Offen' },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ['Hoch', 'Mittel', 'Niedrig'], default: 'Mittel' },
    tasks: [taskSchema],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

});

module.exports = mongoose.model('Project', projectSchema);
