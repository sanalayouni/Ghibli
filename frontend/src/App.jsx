import React from 'react'
import Home from './pages/Home/Home'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'
import MovieDetails from './pages/MovieDetails/MovieDetails'
import Movies from './pages/Movies/Movies'
import TopRated from './pages/TopRated/TopRated'
import Profile from './pages/Profile/Profile'
const App = () => {
  return (
    <div className='home'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/top-rated' element={<TopRated />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>

    </div>
  )
}

export default App