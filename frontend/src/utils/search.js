import { ALL_MOVIES } from '../constants/movies'
import { GHIBLI_OST } from '../constants/ost'

const normalize = value =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

export const searchGhibli = query => {
  const term = normalize(query)
  if (!term) return { movies: [], songs: [] }

  const movies = ALL_MOVIES.filter(movie => normalize(movie.title).includes(term))

  const songs = GHIBLI_OST.filter(
    track =>
      normalize(track.title).includes(term) || normalize(track.movie).includes(term)
  )

  return { movies, songs }
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const resolveMovieId = async title => {
  const searchRes = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
  )
  const searchData = await searchRes.json()

  const match =
    searchData.results?.find(
      result =>
        normalize(result.title || '') === normalize(title) ||
        normalize(result.original_title || '') === normalize(title)
    ) || searchData.results?.[0]

  return match?.id ?? null
}
