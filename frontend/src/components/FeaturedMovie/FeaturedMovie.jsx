import React from 'react'
import { useNavigate } from 'react-router-dom'
import './FeaturedMovie.css'

const IMG_BASE = 'https://image.tmdb.org/t/p/original'

const FeaturedMovie = ({ movie }) => {
  const navigate = useNavigate()
  const backdropUrl = movie.backdrop_path?.startsWith('http')
    ? movie.backdrop_path
    : `${IMG_BASE}${movie.backdrop_path}`
  const trailerSrc = movie.trailerKey
    ? `https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&mute=1&loop=1&playlist=${movie.trailerKey}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`
    : null

  return (
    <section className="featured-movie-section">
      <div className="featured-media">
        {trailerSrc ? (
          <iframe
            className="featured-video"
            src={trailerSrc}
            title={movie.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : backdropUrl ? (
          <img
            className="featured-image"
            src={backdropUrl}
            alt={movie.title}
          />
        ) : (
          <div className="featured-image featured-fallback" />
        )}
      </div>

      <div className="featured-overlay" />

      <div className="featured-content">
        <p className="featured-label">Featured</p>
        <h1>{movie.title}</h1>
        <div className="featured-meta">
          {movie.vote_average ? <span>⭐ {movie.vote_average.toFixed(1)}</span> : null}
          {movie.release_date ? <span>{new Date(movie.release_date).getFullYear()}</span> : null}
          {movie.genres?.length ? <span>{movie.genres.slice(0, 3).map(genre => genre.name).join(' • ')}</span> : null}
        </div>
        <p className="featured-overview">{movie.overview || 'A cinematic story from the Ghibli universe.'}</p>

        <div className="featured-actions">
          <button className="featured-btn featured-btn-primary" onClick={() => navigate(`/movie/${movie.id}`)}>
            Play
          </button>
          <button className="featured-btn featured-btn-secondary" onClick={() => navigate(`/movie/${movie.id}`)}>
            Details
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedMovie
