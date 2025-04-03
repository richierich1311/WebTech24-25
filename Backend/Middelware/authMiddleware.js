const jwt = require('jsonwebtoken');//Lädt das jsonwebtoken-Modul. Dieses Modul wird verwendet, um Tokens zu erstellen und zu überprüfen.

module.exports = (req, res, next) => { // Exportiert die Middleware als Funktion. Diese Middleware wird später in geschützten Routen verwendet, um Benutzer zu authentifizieren.
    
    const token = req.headers.authorization?.split(' ')[1]; /*Liest den Authorization-Header, der vom Client gesendet wird. 
    Extrahiert den Token (abc123xyz) aus dem Header. Falls der Header fehlt, bleibt token undefined.*/
    if (!token) return res.status(401).json({ error: 'Nicht autorisiert. Bitte vorher anmelden !' }); /*Wenn kein Token vorhanden ist, wird die Anfrage 
    mit einem HTTP-Statuscode 401 (Unauthorized) abgebrochen.
    Eine Fehlermeldung wird im JSON-Format an den Client zurückgesendet.*/

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);/*Verifiziert den Token:
        Stellt sicher, dass der Token mit dem geheimen Schlüssel (JWT_SECRET) signiert wurde.
        Überprüft, ob der Token gültig ist (z. B. nicht manipuliert oder abgelaufen).
        Gibt die entschlüsselten Nutzdaten (Payload) zurück, die beim Erstellen des Tokens hinzugefügt wurden.*/

        req.user = decoded; //Speichert die entschlüsselten Nutzdaten im req.user. Diese Daten stehen nachfolgendem Code zur Verfügung.
        next(); //Wenn der Token erfolgreich verifiziert wurde, wird die Kontrolle an die nächste Middleware oder Route weitergegeben.
    } catch (err) {
        res.status(401).json({ error: 'Ungültiger Token' });// Falls die Verifizierung fehlschlägt
        //(z. B. der Token ist manipuliert oder abgelaufen), wird ein Fehler behandelt.
    }
};