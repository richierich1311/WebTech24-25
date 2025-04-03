import React from 'react';


const Impressum = () => {
  return (
    <div className="static-page">
      <main className="main-content">
        <div className="card">
          <h2>Impressum</h2>
          <p><strong>Verantwortlich:</strong></p>
          <p>Richie Hanitzsch<br />
            Musterstraße 1<br />
            12345 Musterstadt<br />
            Deutschland</p>

          <p><strong>Kontakt:</strong></p>
          <p>Telefon: 01234 / 56789<br />
            E-Mail: kontakt@protasker.de</p>

          <p><strong>Haftungshinweis:</strong></p>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
            Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </div>
      </main>

    
    </div>
  );
};

export default Impressum;
