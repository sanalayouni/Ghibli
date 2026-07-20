import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import FeaturedMovie from '../../components/FeaturedMovie/FeaturedMovie'
import { POPULAR_GHIBLI, CLASSIC_GHIBLI, KIDS_GHIBLI, FEATURED_GHIBLI } from '../../constants/movies'
import Thanks from '../../components/thanks/thanks'
import Welcome from '../../components/Welcome/Welcome'

const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <div className="featured-stack">
        {FEATURED_GHIBLI.map(movie => (
          <FeaturedMovie key={movie.id} movie={movie} />
        ))}
      </div>
      
      <Thanks/>

      <Welcome />

      

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