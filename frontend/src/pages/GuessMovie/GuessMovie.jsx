import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { ALL_MOVIES } from '../../constants/movies'
import './GuessMovie.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/original'

const normalizeTitle = value =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const getRandomMovie = list => list[Math.floor(Math.random() * list.length)]

const shuffle = array => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const resolveMovieDetails = async title => {
  const searchRes = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
  )

  const searchData = await searchRes.json()
  const match =
    searchData.results?.find(result => normalizeTitle(result.title) === normalizeTitle(title)) ||
    searchData.results?.[0]

  if (!match) {
    throw new Error(`No TMDB match found for ${title}`)
  }

  const detailsRes = await fetch(`${BASE_URL}/movie/${match.id}?api_key=${API_KEY}`)
  return detailsRes.json()
}

const GuessMovie = () => {
  const [movie, setMovie] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [result, setResult] = useState('')
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('casual')

  const loadQuestion = async () => {
    setLoading(true)
    setSelectedOption(null)
    setResult('')

    try {
      const correctMovie = getRandomMovie(ALL_MOVIES)
      const movieDetails = await resolveMovieDetails(correctMovie.title)

      const distractors = shuffle(
        ALL_MOVIES.filter(item => item.title !== correctMovie.title).map(item => item.title)
      ).slice(0, 3)

      const nextOptions = shuffle([correctMovie.title, ...distractors])

      let nextImageUrl = `${IMG_BASE}${movieDetails.backdrop_path || movieDetails.poster_path}`

      if (difficulty === 'superfan') {
        const imageRes = await fetch(`${BASE_URL}/movie/${movieDetails.id}/images?api_key=${API_KEY}`)
        const imageData = await imageRes.json()
        const chosenBackdrop = imageData.backdrops?.[Math.floor(Math.random() * (imageData.backdrops?.length || 1))]

        if (chosenBackdrop?.file_path) {
          nextImageUrl = `${IMG_BASE}${chosenBackdrop.file_path}`
        }
      }

      setMovie(movieDetails)
      setImageUrl(nextImageUrl)
      setOptions(nextOptions)
    } catch (err) {
      console.error('Failed to load guess game question', err)
      setResult('Could not load a question right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestion()
  }, [difficulty])

  const handleOptionClick = option => {
    if (selectedOption) return

    setSelectedOption(option)

    if (normalizeTitle(option) === normalizeTitle(movie.title)) {
      setScore(prev => prev + 1)
      setResult(`Correct! It was ${movie.title}.`)

      window.setTimeout(() => {
        loadQuestion()
      }, 900)
    } else {
      setResult(`Not quite. The correct answer was ${movie.title}.`)
    }
  }

  return (
    <div className="guess-page">
      <Navbar />

      <div
        className="guess-banner"
        style={{
          backgroundImage: `url(${imageUrl || `${IMG_BASE}${movie?.backdrop_path || movie?.poster_path || ''}`})`
        }}
      />

      <div className="guess-content">
        <div className="guess-header">
          <p className="eyebrow">Mini Game</p>
          <h1>Guess the Movie</h1>
          <p>Pick the correct Ghibli title from the options below.</p>
        </div>

        <div className="quiz-controls">
          <div className="score-pill">Score: {score}</div>
          <div className="difficulty-toggle">
            <button
              className={`difficulty-btn ${difficulty === 'casual' ? 'active' : ''}`}
              onClick={() => setDifficulty('casual')}
            >
              Casual
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'superfan' ? 'active' : ''}`}
              onClick={() => setDifficulty('superfan')}
            >
              Super Fan
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading frame...</div>
        ) : movie ? (
          <>
            <div className="guess-panel">
              <div className="frame-panel">
                <img
                  src={imageUrl || `${IMG_BASE}${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title}
                  className="guess-image"
                />
              </div>

              <div className="option-grid">
                {options.map(option => {
                  const isCorrectAnswer = normalizeTitle(option) === normalizeTitle(movie.title)
                  const isChosen = selectedOption === option

                  return (
                    <button
                      key={option}
                      className={`option-button ${selectedOption ? (isCorrectAnswer ? 'correct' : isChosen ? 'wrong' : '') : ''}`}
                      onClick={() => handleOptionClick(option)}
                      disabled={Boolean(selectedOption)}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </div>

            {result && <p className="result-text">{result}</p>}

            <button onClick={loadQuestion} className="next-button">
              Next Frame
            </button>
          </>
        ) : null}
      </div>

      <Footer />
    </div>
  )
}

export default GuessMovie
