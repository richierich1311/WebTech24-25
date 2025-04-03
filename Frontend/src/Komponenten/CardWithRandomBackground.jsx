
import React from 'react';

const backgroundImages = [
  '/images/one.jpg',
  '/images/two.jpg',
  '/images/three.jpg'
];

const getRandomImage = () =>
  backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

const CardWithRandomBackground = ({ children }) => {
  const image = getRandomImage();

  const cardStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  return <div style={cardStyle}>{children}</div>;
};

export default CardWithRandomBackground;
