import React from "react";
import "./Welcome.css";
import hero from '../../assets/back.jpg'


export default function Welcome() {
  return (
    <section className="welcome-section">
      <img src={hero} alt="Ghibli atmosphere" className="welcome-image" />
      <div className="welcome-content">
        <h1>Welcome, Ghibli Dreamer</h1>
        <p>Step into a world of soot sprites, flying castles, and quiet forest spirits.</p>
      </div>
    </section>
  );
}
