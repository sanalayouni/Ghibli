import React from 'react'
import '../Movies/Movies.css' // Reusing the same grid layout styles as the Movies page
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import { TOP_RATED_GHIBLI } from '../../constants/movies'

const TopRated = () => {
  return (
    <div className="movies-page">
      <Navbar />
      <div className="movies-container">
        <TitleCards title="Top Rated Ghibli Movies" movieList={TOP_RATED_GHIBLI} />
      </div>
      <Footer />
    </div>
  )
}

export default TopRated
