import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './MovieDetails.css'
import Navbar from '../../components/Navbar/Navbar'
import Comments from '../../components/Comments/Comments'
import MagicCursor from "../../components/MagicCursor";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_IMG = 'https://image.tmdb.org/t/p/original'

const MovieDetails = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
        )
        const movieData = await movieRes.json()

        const videoRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        )
        const videoData = await videoRes.json()

        const trailerData = videoData.results.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        )

        setMovie(movieData)
        setTrailer(trailerData)
        setLoading(false)

        // Check if movie is already in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setIsFavorite(favorites.some(fav => fav.id === movieData.id))
      } catch (err) {
        console.error(err)
      }
    }

    fetchMovie()
  }, [id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorite) {
      // Remove from favorites
      const updated = favorites.filter(fav => fav.id !== movie.id)
      localStorage.setItem('favorites', JSON.stringify(updated))
      setIsFavorite(false)
    } else {
      // Add to favorites
      favorites.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      })
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setIsFavorite(true)
    }
  }

  if (loading) return <div className="loader-wrapper"><div className="spinner"></div></div>

  // Get director from crew
  const director = movie.credits?.crew?.find(
    person => person.job === 'Director'
  )?.name || 'N/A'

  // Get main cast (first 5)
  const cast = movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ') || 'N/A'

  // Get genres
  const genres = movie.genres?.map(g => g.name).join(', ') || 'N/A'

  return (
    <>
    <Navbar/>
    <div className="movie-details">
      
      <div
        className="movie-banner"
        style={{
          backgroundImage: `url(${BASE_IMG}${movie.backdrop_path})`
        }}
      />
      <MagicCursor mode="stars" />
      <div className="movie-content">
        <div className="movie-header">
          <h1>{movie.title}</h1>
          <button 
            className="favorite-btn"
            onClick={toggleFavorite}
          >
            <span className="icon">{isFavorite ? '❤️' : '🤍'}</span>
            <span>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
          </button>
        </div>

        <div className="movie-meta">
          <span>📅 {movie.release_date}</span>
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span>⏱ {movie.runtime} min</span>
        </div>

        <p className="movie-description">
          {movie.overview}
        </p>

        <div className="movie-info-grid">
          <div className="info-item">
            <span className="info-label">Director</span>
            <span className="info-value">{director}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Genre</span>
            <span className="info-value">{genres}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Cast</span>
            <span className="info-value">{cast}</span>
          </div>

          
        </div>

        {trailer && (
          <div className="movie-trailer">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        )}
        
        <Comments movieId={movie.id} />
      </div>
    </div>
    </>
  )
}

export default MovieDetails