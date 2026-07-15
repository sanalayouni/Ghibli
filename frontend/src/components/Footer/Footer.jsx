import React from "react";
import "./Footer.css";
import gif from '../../assets/footer.gif'
import { FaInstagram, FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
       <hr className="line"/>
      <div className="footer-container">
       
        {/* Left side */}
        <div className="footer-left">
        <div className="footer-brand-edge">
  <h2 className="footer-logo">Ghibli Mori</h2>
  <p className="footer-quote">
    “Stories are the bridge between imagination and reality.”
  </p>
</div>
          <div className="footer-gif">
        <img src={gif} alt="footer animation" />
        </div>
        </div>

        {/* Right side */}
<div className="footer-sections">

<div className="footer-section">
  <h4>Explore</h4>
  <ul>
    <li>Movies</li>
    <li>Genres</li>
    <li>New Releases</li>
    <li>Top Rated</li>
    <li>Watchlist</li>
  </ul>
</div>

<div className="footer-section">
  <h4>Community</h4>
  <ul>
    <li>My Account</li>
    <li>Reviews</li>
    <li>Discussions</li>
    <li>Support</li>
    <li>FAQs</li>
  </ul>
</div>

<div className="footer-section">
  <h4>Ghibli Mori</h4>
  <ul>
    <li>About Us</li>
    <li>Careers</li>
    <li>Privacy Policy</li>
    <li>Terms of Service</li>
    <li>Contact</li>
  </ul>
</div>


</div>
{/* SOCIAL ICONS */}
<div className="footer-socials">
      <FaInstagram />
      <FaFacebookF />
      <FaTwitter />
      <FaGithub />
    </div>
   
      </div>
    </footer>
  );
};

export default Footer;
