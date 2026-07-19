import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TitleCards.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const BASE_URL = 'https://api.themoviedb.org/3'

const resolveMovieDetails = async movie => {
  const title = movie.title?.trim()

  if (!title) {
    throw new Error('Movie title is missing')
  }

  if (movie.tmdbId) {
    const res = await fetch(`${BASE_URL}/movie/${movie.tmdbId}?api_key=${API_KEY}`)
    return res.json()
  }

  const searchRes = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
  )
  const searchData = await searchRes.json()

  const match =
    searchData.results?.find(
      result =>
        result.title?.toLowerCase() === title.toLowerCase() ||
        result.original_title?.toLowerCase() === title.toLowerCase()
    ) || searchData.results?.[0]

  if (!match) {
    throw new Error(`No TMDB match found for ${title}`)
  }

  const detailsRes = await fetch(`${BASE_URL}/movie/${match.id}?api_key=${API_KEY}`)
  return detailsRes.json()
}

const TitleCards = ({ title, movieList }) => {
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const results = await Promise.all(movieList.map(resolveMovieDetails))
        setMovies(results)
      } catch (err) {
        console.error('Failed to load movies', err)
      }
    }

    fetchMovies()
  }, [movieList])

  return (
    <div className="title-cards">
      <h1>{title}</h1>

      <div className="card-list">
        {movies.map(movie => (
          <div
            className="movie-card"
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
            <h2>{movie.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TitleCards
