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
      const loadedMovies = []
      // extrating the info recieved in "data" and creating a better structure in "loadedMovies"
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      } 

      setMovies(loadedMovies)
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false) 
  },[])

  // Request the movie list when the page is loaged
  useEffect(() => {
    fetchMoviesHandler()
  },[fetchMoviesHandler])

  // Function that makes the POST request to Firebase
  async function addMovieHandler(movie) {
    const response = await fetch('https://http-request-2f250-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
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
