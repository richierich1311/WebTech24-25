const mongoose = require('mongoose'); 
/*Importiert das Mongoose-Paket.
Mongoose ist eine Bibliothek, die die Arbeit mit MongoDB erleichtert. 
Sie ermöglicht es dir, Schemas und Modelle für die Datenstruktur zu definieren.*/
const bcrypt = require('bcrypt');
/*Importiert das Bcrypt-Paket.
Bcrypt wird verwendet, um Passwörter sicher zu verschlüsseln (Hashing). 
Es schützt sensible Daten vor Missbrauch, selbst wenn die Datenbank kompromittiert wird.*/

const userSchema = new mongoose.Schema({ // -->Definiert ein Schema für die Benutzerdaten.
    username: { type: String, required: true, unique: true }, //type: String: Der Benutzername ist ein Textwert (String). 
    //required: true: Es ist verpflichtend, einen Benutzernamen anzugeben. Ohne diesen Wert wird ein Fehler ausgegeben. 
    //unique: true: Jeder Benutzername muss eindeutig sein. Zwei Benutzer können nicht denselben Namen haben.

    password: { type: String, required: true }, //type: String: Das Passwort wird als Text gespeichert (in gehashter Form).
    //required: true: Ein Passwort muss angegeben werden.
}); 

// Passwort hashen vor dem Speichern
userSchema.pre('save', async function (next) { //userSchema.pre('save', async function (next) {...}
//Eine Middleware-Funktion, die vor (pre) dem Speichern (save) eines Benutzers ausgeführt wird.
//Diese Funktion wird jedes Mal aufgerufen, bevor ein Benutzer in die Datenbank geschrieben wird.

 if (!this.isModified('password')) return next();
 /*if (!this.isModified('password')) return next(); Überprüft, ob das Passwort geändert wurde.
this.isModified('password'): Eine Mongoose-Funktion, die prüft, ob das Feld password verändert wurde.
return next();: Wenn das Passwort nicht geändert wurde, wird die Middleware übersprungen.*/

    this.password = await bcrypt.hash(this.password, 10);/*this.password = await bcrypt.hash(this.password, 10);
Verschlüsselt das Passwort mit Bcrypt, bevor es in der Datenbank gespeichert wird.
bcrypt.hash(value, saltRounds):
value: Das Passwort, das gehasht werden soll.
saltRounds: Die Anzahl der Iterationen, um den Hash zu berechnen (je höher, desto sicherer).
next(); Beendet die Middleware und lässt den Speichervorgang fortfahren.*/
    next();
});

module.exports = mongoose.model('User', userSchema);
/*module.exports = mongoose.model('User', userSchema); Erstellt ein Modell namens User basierend auf dem Schema userSchema.
Ein Modell ist eine Klasse, mit der du Operationen auf der MongoDB-Sammlung users durchführen kannst (z. B. neue Benutzer erstellen, finden oder löschen).*/