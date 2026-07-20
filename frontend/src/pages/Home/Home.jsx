import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import FeaturedMovie from '../../components/FeaturedMovie/FeaturedMovie'
import { POPULAR_GHIBLI, CLASSIC_GHIBLI, KIDS_GHIBLI, FEATURED_GHIBLI } from '../../constants/movies'
import hero from '../../assets/back.jpg'
import Thanks from '../../components/thanks/thanks'

const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <div className="featured-stack">
        {FEATURED_GHIBLI.map(movie => (
          <FeaturedMovie key={movie.id} movie={movie} />
        ))}
      </div>

      <section className="welcome-section">
        <div className="welcome-card">
          <img src={hero} alt="Ghibli atmosphere" className="welcome-image" />
          <div className="welcome-overlay" />
          <div className="welcome-content">
            <p className="welcome-label">Welcome to Ghibli Mori</p>
            <h2>A home for fans and lovers of Studio Ghibli</h2>
            <p>
              Discover enchanting stories, iconic characters, and the magical world of animation that continues to inspire generations.
            </p>
          </div>
        </div>
      </section>

      <Thanks/>

      <div className="home-content">
        <TitleCards />
        <div className="More movies">
          <TitleCards title="Popular on Ghibli Mori" movieList={POPULAR_GHIBLI} />
          <TitleCards title="Ghibli Classics" movieList={CLASSIC_GHIBLI} />
          <TitleCards title="For Kids" movieList={KIDS_GHIBLI} />
        </div>
      </div>

      <div className="Footer">
        <Footer />
      </div>
    </div>
  )
}

export default Home