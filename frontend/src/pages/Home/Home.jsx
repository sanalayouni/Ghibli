import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import FeaturedMovie from '../../components/FeaturedMovie/FeaturedMovie'
import {FEATURED_GHIBLI,Fantasy_Epics,cozy_family,war_history,Slice_of_Life,TOP_RATED_GHIBLI } from '../../constants/movies'
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
      <div className="thanks-section">
      <Thanks/>
      </div>
      
      <div className="welcome-section">
      <Welcome />
      </div>
    
        <div className="More movies">
          <TitleCards title="Top Rated" movieList={TOP_RATED_GHIBLI} />
          <TitleCards title="Slice of Life" movieList={Slice_of_Life} />
          <TitleCards title="Fantasy Epics" movieList={Fantasy_Epics} />
          <TitleCards title="Cozy Family " movieList={cozy_family} />
          <TitleCards title="War History" movieList={war_history} />
        </div>

      <div className="Footer">
        <Footer />
      </div>
    </div>
  )
}

export default Home