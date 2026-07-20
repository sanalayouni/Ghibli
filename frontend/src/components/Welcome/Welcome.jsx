import React from "react";
import "./Welcome.css";
import hero from '../../assets/back.jpg'

const Welcome = () => {
  return (
    <section className="welcome-section">
      <img src={hero} alt="Ghibli atmosphere" className="welcome-image" />
      
    </section>
  )
}

export default Welcome