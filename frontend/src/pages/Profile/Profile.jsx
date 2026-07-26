import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { GHIBLI_OST } from '../../constants/ost'
import './Profile.css'

const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [likedSongs, setLikedSongs] = useState([])

  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    profilePicture: ''
  })
  const fileInputRef = useRef(null)

  const navigate = useNavigate()

  const loadLikedSongs = () => {
    const likedIds = JSON.parse(localStorage.getItem('ghibli-ost-likes') || '[]')
    setLikedSongs(GHIBLI_OST.filter(track => likedIds.includes(track.id)))
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('http://localhost:3000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data.user)
          setEditForm({
            username: data.user.username || '',
            bio: data.user.bio || '',
            profilePicture: data.user.profilePicture || ''
          })
          localStorage.setItem('profilePicture', data.user.profilePicture || '')
        }
      } catch (err) {
        console.error('Failed to fetch profile', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()

    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(storedFavorites)
    loadLikedSongs()

    window.addEventListener('storage', loadLikedSongs)
    return () => window.removeEventListener('storage', loadLikedSongs)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('profilePicture')
    window.dispatchEvent(new Event('profileUpdated'))
    navigate('/')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('http://localhost:3000/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (res.ok) {
        const data = await res.json()
        setProfile(prev => ({ ...prev, ...data.user }))
        localStorage.setItem('profilePicture', data.user.profilePicture || '')
        window.dispatchEvent(new Event('profileUpdated'))
        setIsEditing(false)
      } else {
        alert('Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating profile')
    }
  }

  const removeFavorite = (id) => {
    const updated = favorites.filter(fav => fav.id !== id)
    setFavorites(updated)
    localStorage.setItem('favorites', JSON.stringify(updated))
  }

  const removeLikedSong = (id) => {
    const likedIds = JSON.parse(localStorage.getItem('ghibli-ost-likes') || '[]')
    const updated = likedIds.filter(songId => songId !== id)
    localStorage.setItem('ghibli-ost-likes', JSON.stringify(updated))
    setLikedSongs(prev => prev.filter(song => song.id !== id))
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-layout">
          <div className="profile-container">
            <h2>Your Profile</h2>

            {loading ? (
              <div className="profile-loading">Loading profile...</div>
            ) : profile ? (
              isEditing ? (
                <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                  <div className="avatar-upload" onClick={() => fileInputRef.current.click()}>
                    {editForm.profilePicture ? (
                      <img src={editForm.profilePicture} alt="Avatar" className="profile-avatar-img" />
                    ) : (
                      <div className="profile-avatar">
                        {editForm.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="avatar-upload-overlay">Change Photo</div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Tell us about your favorite Ghibli movies..."
                      rows="3"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="submit" className="save-btn">Save Changes</button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar" className="profile-avatar-img" />
                  ) : (
                    <div className="profile-avatar">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <h3 className="profile-username">{profile.username}</h3>
                  <p className="profile-email">{profile.email}</p>

                  {profile.bio && (
                    <div className="profile-bio">
                      <p>{profile.bio}</p>
                    </div>
                  )}

                  <div className="profile-actions">
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button className="logout-btn" onClick={handleLogout}>Log Out</button>
                  </div>
                </div>
              )
            ) : (
              <div className="profile-loading">
                Please log in to view your profile.
                <button className="login-btn" onClick={() => navigate('/')}>Go to Login</button>
              </div>
            )}
          </div>

          {profile && !isEditing && (
            <>
              <div className="favorites-container">
                <h2>My Favorite Movies</h2>
                {favorites.length === 0 ? (
                  <p className="no-favorites">You haven&apos;t added any movies to your favorites yet.</p>
                ) : (
                  <div className="favorites-grid">
                    {favorites.map(movie => (
                      <div key={movie.id} className="favorite-card">
                        <Link to={`/movie/${movie.id}`}>
                          <img src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} alt={movie.title} />
                        </Link>
                        <div className="favorite-card-info">
                          <h4>{movie.title}</h4>
                          <button className="remove-fav-btn" onClick={() => removeFavorite(movie.id)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="favorites-container favorite-songs-container">
                <h2>My Favorite Songs</h2>
                {likedSongs.length === 0 ? (
                  <p className="no-favorites">
                    No favorite songs yet. Visit the <Link to="/ost">OST page</Link> and tap the heart on tracks you love.
                  </p>
                ) : (
                  <ul className="favorite-songs-list">
                    {likedSongs.map(song => (
                      <li key={song.id} className="favorite-song-item">
                        <img src={song.cover} alt={song.title} className="favorite-song-cover" />
                        <div className="favorite-song-info">
                          <span className="favorite-song-title">{song.title}</span>
                          <span className="favorite-song-movie">{song.movie}</span>
                        </div>
                        <button className="remove-fav-btn" onClick={() => removeLikedSong(song.id)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
