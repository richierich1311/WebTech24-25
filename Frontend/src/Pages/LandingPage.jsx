import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    image: '/Images/one.jpg',
    headline: 'Projektmanagement neu gedacht',
    text: 'Plane, organisiere und verfolge deine Aufgaben effizient.',
  },
  {
    image: '/Images/two.jpg',
    headline: 'Arbeiten im Team',
    text: 'Koordiniere deine Projekte gemeinsam mit deinem Team.',
  },
  {
    image: '/Images/three.jpg',
    headline: 'Ziele erreichen',
    text: 'Behalte Deadlines, Aufgaben und Fortschritte stets im Blick.',
  },
];

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { image, headline, text } = slides[currentIndex];

  return (
    <div className="landing-page">
      <div
        className={`background ${fade ? 'fade-in' : 'fade-out'}`}
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className={`overlay ${fade ? 'fade-in' : 'fade-out'}`}>
          <div className="container card">
            <h1>{headline}</h1>
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
