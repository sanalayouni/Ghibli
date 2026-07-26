import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/g.png'
import { searchGhibli, resolveMovieId } from '../../utils/search'

const Navbar = () => {
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [profilePicture, setProfilePicture] = useState(
    () => localStorage.getItem('profilePicture') || ''
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState({ movies: [], songs: [] })
  const [showResults, setShowResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setProfilePicture('')
        return
      }

      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const picture = data.user.profilePicture || ''
          setProfilePicture(picture)
          localStorage.setItem('profilePicture', picture)
        }
      } catch {
        // keep cached picture if fetch fails
      }
    }

    fetchProfile()
    window.addEventListener('profileUpdated', fetchProfile)
    return () => window.removeEventListener('profileUpdated', fetchProfile)
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ movies: [], songs: [] })
      return
    }
    setResults(searchGhibli(searchQuery))
  }, [searchQuery])

  const closeSearch = () => {
    setSearchQuery('')
    setShowResults(false)
  }

  const handleMovieSelect = async title => {
    setSearchLoading(true)
    try {
      const movieId = await resolveMovieId(title)
      if (movieId) {
        navigate(`/movie/${movieId}`)
        closeSearch()
      }
    } catch {
      // silently fail
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSongSelect = track => {
    navigate('/ost', { state: { trackId: track.id } })
    closeSearch()
  }

  const handleSearchSubmit = e => {
    e.preventDefault()
    if (results.movies.length > 0) {
      handleMovieSelect(results.movies[0].title)
    } else if (results.songs.length > 0) {
      handleSongSelect(results.songs[0])
    }
  }

  const hasResults = results.movies.length > 0 || results.songs.length > 0

  return (
    <nav className={isVisible ? 'nav-visible' : 'nav-hidden'}>
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span>Ghibli Mori</span>
      </div>

      <div className="nav-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/movies">Movies</NavLink>
        <NavLink to="/top-rated">Top Rated</NavLink>
        <NavLink to="/guess">Guess</NavLink>
        <NavLink to="/ost">Ost</NavLink>
      </div>

      <div className="nav-right">
        <div className="search-bar" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search movies or songs..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setShowResults(true)
              }}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
            />
          </form>

          {showResults && searchQuery.trim() && (
            <div className="search-dropdown">
              {searchLoading && <p className="search-status">Opening...</p>}

              {!searchLoading && !hasResults && (
                <p className="search-status">No results found</p>
              )}

              {results.movies.length > 0 && (
                <div className="search-group">
                  <p className="search-group-label">Movies</p>
                  <ul>
                    {results.movies.map(movie => (
                      <li key={movie.title}>
                        <button type="button" onClick={() => handleMovieSelect(movie.title)}>
                          {movie.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.songs.length > 0 && (
                <div className="search-group">
                  <p className="search-group-label">Soundtracks</p>
                  <ul>
                    {results.songs.map(song => (
                      <li key={song.id}>
                        <button type="button" onClick={() => handleSongSelect(song)}>
                          <span>{song.title}</span>
                          <small>{song.movie}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <NavLink to="/profile" className="profile-icon-btn" title="My Profile">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="nav-profile-img" />
          ) : (
            <span className="nav-profile-fallback" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar
