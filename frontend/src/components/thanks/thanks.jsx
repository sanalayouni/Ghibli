import React from 'react';
import './thanks.css';
import hayaoImage from '../../assets/hayao.jpg';

const Thanks = () => {
  return (
    <div className="thanks-container">
      <div className="thanks-card">
        <div className="thanks-content">
          <p className="thanks-label">A heartfelt tribute</p>
          <h1>Thank you, Hayao Miyazaki</h1>
          <p>
            Your stories, imagination, and passion have inspired generations of fans.
            This tribute celebrates the magic of your unforgettable work.
          </p>
        </div>
        <div className="thanks-portrait">
          <img src={hayaoImage} alt="Hayao Miyazaki" />
        </div>
      </div>
    </div>
  );
};

export default Thanks;