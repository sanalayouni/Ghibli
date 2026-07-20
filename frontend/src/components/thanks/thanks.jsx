import React from 'react';
import './thanks.css';
import hayaoImage from '../../assets/hayao.jpg';
import isaoImage from '../../assets/isao.jpg';
import toshioImage from '../../assets/toshio.jpeg';
import legendsImage from '../../assets/legends.jpg';

const Thanks = () => {
  return (
    <div className="thanks-container">
      <div className="thanks-card">
        <div className="thanks-content">
          <p className="thanks-label">A heartfelt tribute</p>
          <h2>Thank you to the creators of Studio Ghibli</h2>
          <p className="thanks-text">
            Thank you to the visionary creators of Studio Ghibli for inspiring generations with unforgettable stories and animation.
          </p>
        </div>
        <div className="thanks-portrait">
          <img src={hayaoImage} alt="Hayao Miyazaki" />
          <img src={isaoImage} alt="Isao Takahata" />
          <img src={toshioImage} alt="Toshio Suzuki" />
        </div>
      </div>
      <div className="legends">
        <img src={legendsImage} alt="legends" />
        
      </div>
        
      </div>
    
  );
};

export default Thanks;