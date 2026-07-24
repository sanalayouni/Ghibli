import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { GHIBLI_OST } from '../../constants/ost'
import { FaHeart, FaPause, FaPlay, FaRandom, FaRegHeart, FaStepBackward, FaStepForward } from 'react-icons/fa'
import './Ost.css'
import MagicCursor from "../../components/MagicCursor";

const formatTime = seconds => {
  if (!seconds || Number.isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const Ost = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [liked, setLiked] = useState(() => {
    try {
      const saved = localStorage.getItem('ghibli-ost-likes')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [shuffle, setShuffle] = useState(false)

  const playerRef = useRef(null)
  const progressInterval = useRef(null)
  const apiReady = useRef(false)
  const isPlayingRef = useRef(false)
  const shuffleRef = useRef(false)
  const currentIndexRef = useRef(0)

  const currentTrack = GHIBLI_OST[currentIndex]

  isPlayingRef.current = isPlaying
  shuffleRef.current = shuffle
  currentIndexRef.current = currentIndex

  const getVisibleCards = () => {
    const total = GHIBLI_OST.length
    const prevIndex = (currentIndex - 1 + total) % total
    const nextIndex = (currentIndex + 1) % total
    return [
      { track: GHIBLI_OST[prevIndex], position: 'prev', index: prevIndex },
      { track: GHIBLI_OST[currentIndex], position: 'active', index: currentIndex },
      { track: GHIBLI_OST[nextIndex], position: 'next', index: nextIndex }
    ]
  }

  const clearProgressInterval = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
  }

  const startProgressPolling = useCallback(() => {
    clearProgressInterval()
    progressInterval.current = setInterval(() => {
      const player = playerRef.current
      if (!player?.getCurrentTime) return
      const current = player.getCurrentTime()
      const total = player.getDuration()
      if (total > 0) {
        setProgress((current / total) * 100)
        setDuration(total)
      }
    }, 500)
  }, [])

  const goToNext = useCallback(() => {
    if (shuffleRef.current) {
      let next
      do {
        next = Math.floor(Math.random() * GHIBLI_OST.length)
      } while (next === currentIndexRef.current && GHIBLI_OST.length > 1)
      setCurrentIndex(next)
    } else {
      setCurrentIndex(prev => (prev + 1) % GHIBLI_OST.length)
    }
  }, [])

  const initPlayer = useCallback(() => {
    if (playerRef.current) return

    playerRef.current = new window.YT.Player('ost-youtube-player', {
      height: '0',
      width: '0',
      videoId: GHIBLI_OST[0].youtubeId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          apiReady.current = true
        },
        onStateChange: event => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true)
            startProgressPolling()
          } else if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED
          ) {
            setIsPlaying(false)
            clearProgressInterval()
            if (event.data === window.YT.PlayerState.ENDED) {
              goToNext()
            }
          }
        }
      }
    })
  }, [goToNext, startProgressPolling])

  useEffect(() => {
    if (window.YT?.Player) {
      initPlayer()
      return () => clearProgressInterval()
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    if (!existingScript) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }

    window.onYouTubeIframeAPIReady = () => initPlayer()

    return () => clearProgressInterval()
  }, [initPlayer])

  useEffect(() => {
    if (!apiReady.current || !playerRef.current?.loadVideoById) return
    playerRef.current.loadVideoById(GHIBLI_OST[currentIndex].youtubeId)
    setProgress(0)
    setDuration(0)
    if (isPlayingRef.current) {
      playerRef.current.playVideo()
    }
  }, [currentIndex])

  const goToIndex = index => setCurrentIndex(index)

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + GHIBLI_OST.length) % GHIBLI_OST.length)
  }

  const togglePlay = () => {
    const player = playerRef.current
    if (!player?.getPlayerState) return

    const state = player.getPlayerState()
    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  const handleSeek = e => {
    const player = playerRef.current
    if (!player?.getDuration) return
    const total = player.getDuration()
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    player.seekTo(total * ratio, true)
    setProgress(ratio * 100)
  }

  const toggleLike = id => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem('ghibli-ost-likes', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <div className="ost-page">
      <Navbar />
      <MagicCursor mode="dust" />
      <div className="ost-hero">
        <p className="ost-eyebrow">Studio Ghibli</p>
        <h1 className="ost-title">Soundtracks</h1>
        <p className="ost-subtitle">Immerse yourself in the music of Joe Hisaishi</p>
      </div>

      <div className="ost-carousel-wrapper">
        <div className="ost-carousel">
          {getVisibleCards().map(({ track, position, index }) => (
            <div
              key={`${track.id}-${position}`}
              className={`ost-card ost-card--${position}`}
              onClick={() => position !== 'active' && goToIndex(index)}
              role={position !== 'active' ? 'button' : undefined}
              tabIndex={position !== 'active' ? 0 : undefined}
              onKeyDown={e => {
                if (position !== 'active' && (e.key === 'Enter' || e.key === ' ')) goToIndex(index)
              }}
            >
              <div className="ost-card-inner">
                <div className="ost-artwork">
                  <img src={track.cover} alt={`${track.title} cover`} />
                </div>

                {position === 'active' && (
                  <div className="ost-controls">
                    <div className="ost-track-info">
                      <button
                        type="button"
                        className={`ost-icon-btn ${shuffle ? 'ost-icon-btn--active' : ''}`}
                        onClick={e => {
                          e.stopPropagation()
                          setShuffle(s => !s)
                        }}
                        aria-label="Toggle shuffle"
                      >
                        <FaRandom />
                      </button>

                      <div className="ost-track-text">
                        <h2>{track.title}</h2>
                        <p>{track.composer} · {track.movie}</p>
                      </div>

                      <button
                        type="button"
                        className="ost-icon-btn ost-like-btn"
                        onClick={e => {
                          e.stopPropagation()
                          toggleLike(track.id)
                        }}
                        aria-label="Toggle favorite"
                      >
                        {liked.has(track.id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>

                    <div
                      className="ost-progress"
                      onClick={e => {
                        e.stopPropagation()
                        handleSeek(e)
                      }}
                      role="slider"
                      aria-valuenow={progress}
                    >
                      <div className="ost-progress-fill" style={{ width: `${progress}%` }}>
                        <span className="ost-progress-thumb" />
                      </div>
                    </div>

                    <div className="ost-time">
                      <span>{formatTime((progress / 100) * duration)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="ost-playback">
                      <button
                        type="button"
                        className="ost-playback-btn"
                        onClick={e => {
                          e.stopPropagation()
                          goToPrev()
                        }}
                        aria-label="Previous track"
                      >
                        <FaStepBackward />
                      </button>
                      <button
                        type="button"
                        className="ost-playback-btn ost-playback-btn--main"
                        onClick={e => {
                          e.stopPropagation()
                          togglePlay()
                        }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                      </button>
                      <button
                        type="button"
                        className="ost-playback-btn"
                        onClick={e => {
                          e.stopPropagation()
                          goToNext()
                        }}
                        aria-label="Next track"
                      >
                        <FaStepForward />
                      </button>
                    </div>
                  </div>
                )}

                {position !== 'active' && (
                  <div className="ost-side-label">
                    <h3>{track.title}</h3>
                    <p>{track.composer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ost-track-list">
        <h3>All Tracks</h3>
        <ul>
          {GHIBLI_OST.map((track, index) => (
            <li
              key={track.id}
              className={index === currentIndex ? 'ost-track-item ost-track-item--active' : 'ost-track-item'}
              onClick={() => goToIndex(index)}
            >
              <img src={track.cover} alt="" className="ost-track-thumb" />
              <div className="ost-track-meta">
                <span className="ost-track-name">{track.title}</span>
                <span className="ost-track-movie">{track.movie}</span>
              </div>
              {liked.has(track.id) && <FaHeart className="ost-track-like" />}
            </li>
          ))}
        </ul>
      </div>

      <div id="ost-youtube-player" className="ost-youtube-hidden" aria-hidden="true" />
      <Footer />
    </div>
  )
}

export default Ost
