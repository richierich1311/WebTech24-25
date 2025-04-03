import React from 'react';


const Kontakt = () => {
  return (
    <div className="static-page">
      <main className="main-content">
        <div className="card">
          <h2>Kontaktformular</h2>
          <form className="form" action="mailto:kontakt@protasker.de" method="post" encType="text/plain">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">E-Mail:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="message">Nachricht:</label>
            <textarea id="message" name="message" rows="5" required></textarea>

            <button type="submit" className="btn">Absenden</button>
          </form>
        </div>

        <h2>Standort</h2>
        <div className="map-container">
          <iframe
            title="Karte: Musterstraße 123, Berlin"
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=13.3799%2C52.5301%2C13.3899%2C52.5341&layer=mapnik&marker=52.5321%2C13.3849"
            style={{ borderRadius: '8px' }}
          ></iframe>
        </div>
      </main>

    
    </div>
  );
};

export default Kontakt;
