import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import TitleCards from '../../components/TitleCards/TitleCards'
import Footer from '../../components/Footer/Footer'
import FeaturedMovie from '../../components/FeaturedMovie/FeaturedMovie'
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal'
import { FEATURED_GHIBLI, Fantasy_Epics, cozy_family, war_history, Slice_of_Life, TOP_RATED_GHIBLI } from '../../constants/movies'
import Thanks from '../../components/thanks/thanks'
import Welcome from '../../components/Welcome/Welcome'
import MagicCursor from '../../components/MagicCursor'

const Home = () => {
  return (
    <div className="home">
      <Navbar />

      <div className="featured-stack">
        {FEATURED_GHIBLI.map(movie => (
          <FeaturedMovie key={movie.id} movie={movie} />
        ))}
      </div>

      <ScrollReveal>
        <div className="thanks-section">
          <Thanks />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="welcome-section">
          <Welcome />
        </div>
      </ScrollReveal>

      <MagicCursor />

      <div className="more-movies">
        <ScrollReveal delay={0}>
          <TitleCards title="Top Rated" movieList={TOP_RATED_GHIBLI} />
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <TitleCards title="Slice of Life" movieList={Slice_of_Life} />
        </ScrollReveal>
        <ScrollReveal delay={240}>
          <TitleCards title="Fantasy Epics" movieList={Fantasy_Epics} />
        </ScrollReveal>
        <ScrollReveal delay={360}>
          <TitleCards title="Cozy Family" movieList={cozy_family} />
        </ScrollReveal>
        <ScrollReveal delay={480}>
          <TitleCards title="War History" movieList={war_history} />
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <div className="Footer">
          <Footer />
        </div>
      </ScrollReveal>
    </div>
  )
}

export default Home
