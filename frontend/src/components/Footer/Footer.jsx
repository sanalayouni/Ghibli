import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import gif from '../../assets/footer.gif'
import { FaInstagram, FaFacebookF, FaTwitter, FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer">
      <hr className="footer-line" />

      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">Ghibli Mori</h2>
          <p className="footer-quote">
            &ldquo;Stories are the bridge between imagination and reality.&rdquo;
          </p>
          <div className="footer-gif">
            <img src={gif} alt="Studio Ghibli animation" />
          </div>
          <div className="footer-socials">
            <FaInstagram aria-label="Instagram" />
            <FaFacebookF aria-label="Facebook" />
            <FaTwitter aria-label="Twitter" />
            <FaGithub aria-label="GitHub" />
          </div>
        </div>

        <div className="footer-sections">
          <div className="footer-section">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/top-rated">Top Rated</Link></li>
              <li><Link to="/guess">Guess the Movie</Link></li>
              <li><Link to="/ost">Soundtracks</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/home">Reviews</Link></li>
              <li><Link to="/movies">Discussions</Link></li>
              <li><Link to="/profile">Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Ghibli Mori</h4>
            <ul>
              <li><Link to="/home">About Us</Link></li>
              <li><Link to="/home">Privacy Policy</Link></li>
              <li><Link to="/home">Terms of Service</Link></li>
              <li><Link to="/home">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <p className="footer-copy">&copy; {new Date().getFullYear()} Ghibli Mori. For educational and personal use.</p>
    </footer>
  )
}

export default Footer
