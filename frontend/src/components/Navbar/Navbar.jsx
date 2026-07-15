import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/g.png'

const Navbar = () => {
  return (
    <nav>
      {/* Logo section */}
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span>Ghibli Mori</span>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <NavLink to="/home" className="hover:text-gray-300 font-medium">Home</NavLink>
        <NavLink to="/movies" className="hover:text-gray-300 font-medium">Movies</NavLink>
        <NavLink to="/top-rated" className="hover:text-gray-300 font-medium">Top Rated</NavLink>
      </div>

      {/* Search & Profile */}
      <div className="nav-right">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search" 
            className="rounded-md px-4 py-1 text-black focus:outline-none"
          />
        </div>
        
        <NavLink to="/profile" className="profile-icon-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar