import React from 'react'
import './Movies.css'
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { ALL_MOVIES } from '../../constants/movies'
import MagicCursor from "../../components/MagicCursor";

const Movies = () => {
  return (
    <div className="movies-page">
      <Navbar />
      <MagicCursor mode="stars" />
      <div className="movies-container">
        <TitleCards title="All Ghibli Movies" movieList={ALL_MOVIES} />
      </div>
      <Footer />
    </div>
  )
}

export default Movies
