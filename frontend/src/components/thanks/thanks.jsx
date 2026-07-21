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
         <div className="portrait-item">
         <img src={hayaoImage} alt="Hayao Miyazaki" />
        <span>Hayao Miyazaki</span>
        </div>

        <div className="portrait-item">
        <img src={isaoImage} alt="Isao Takahata" />
        <span>Isao Takahata</span>
        </div>

       <div className="portrait-item">
       <img src={toshioImage} alt="Toshio Suzuki" />
       <span>Toshio Suzuki</span>
      </div>
</div>
      </div>

      <section className="legends">
        <img src={legendsImage} alt="legends" />
        <p>
    In loving memory of <span>Isao Takahata</span> (1935–2018). <br />
    Thank you for your timeless stories, your kindness, and the emotions
    you shared with the world. Your legacy will continue to inspire
    generations. Rest in peace.
  </p>
      </section>
   
</div>
        
      
    
  );
};

export default Thanks;