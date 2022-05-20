import React, { useState, useEffect, useCallback } from 'react'
import MoviesList from './components/MoviesList'
import AddMovie from './components/AddMovie';

import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function that makes the http request
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://http-request-2f250-default-rtdb.firebaseio.com/movies.json')

      // fetch doesn't handle errors by default, so we need to check manually 
      if (!response.ok) {
        throw new Error('Ops! Something went wrong!')
      }

      const data = await response.json() 
      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        }
      })
      setMovies(transformedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false) 
  },[])

  // Request the movie list when the page is loaged
  useEffect(() => {
    fetchMoviesHandler()
  },[fetchMoviesHandler])

  function addMovieHandler(movie) {
    console.log(movie)
  }

  // Set de conditions to render the list of movies or status messages
  let content = <p>Found no movies.</p>
  if (movies.length > 0)
    content = <MoviesList movies={movies} />
  if (error)
    content = <p>Ops! Something went wrong...</p>
  if (isLoading)
    content = <p>Loading...</p>


  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  )
}

export default App
