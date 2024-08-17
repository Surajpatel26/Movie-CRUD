import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import MovieForm from './Components/MovieForm';
import Footer from './Components/Footer';
import MovieDetails from './Components/MovieDetails';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isUpdated, setIsUpdated] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Fantasy'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsUpdated(false);
        const response = await axios('http://localhost:8081/movies');
        setMovieList(response.data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };

    fetchMovies();
  }, [isUpdated]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const filterMoviesByGenre = (movies, selectedGenre) => {
    if (!selectedGenre) return movies;
    return movies.filter(movie => movie.genre === selectedGenre);
  };

  const filterMoviesBySearch = (movies, searchQuery) => {
    if (!searchQuery) return movies;
    return movies.filter(movie =>
      movie.movieName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredMovies = filterMoviesBySearch(
    filterMoviesByGenre(movieList, selectedGenre),
    searchQuery
  );

  const createMovie = async (movie) => {
    try {
      const response = await axios.post('http://localhost:8081/movies', movie, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  };

  const handleCreateMovieClick = () => {
    setEditMovie(null);
    setCurrentView('createMovie');
  };

  const handleHomeClick = () => {
    setCurrentView('home');
  };

  const handleAddOrUpdateMovie = async (movie) => {
    try {
      if (editMovie) {
        const updatedMovie = await updateMovie(editMovie._id, movie);
        const updatedMovies = movieList.map((m) =>
          m._id === updatedMovie._id ? updatedMovie : m
        );
        setMovieList(updatedMovies);
        setAlertMessage('Movie updated successfully!');
      } else {
        const createdMovie = await createMovie(movie);
        setMovieList([...movieList, createdMovie]);
        setAlertMessage('Movie added successfully!');
      }
      setAlertType('success');
      setCurrentView('home');
    } catch (error) {
      console.error('Error handling movie:', error);
      setAlertMessage('Failed to add or update movie.');
      setAlertType('danger');
    }
  };

  const updateMovie = async (movieId, updatedMovie) => {
    try {
      const response = await axios.put(`http://localhost:8081/movies/${movieId}`, updatedMovie);
      return response.data;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  };

  const handleEditMovie = (movieId) => {
    const movieToEdit = movieList.find((movie) => movie._id === movieId);
    setEditMovie(movieToEdit);
    setCurrentView('createMovie');
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await axios.delete(`http://localhost:8081/movies/${movieId}`);
      setMovieList(movieList.filter(movie => movie._id !== movieId));
      setAlertMessage('Movie deleted successfully!');
      setAlertType('success');
      setIsUpdated(true);
    } catch (error) {
      console.error('Error deleting movie:', error);
      setAlertMessage('Failed to delete movie.');
      setAlertType('danger');
    }
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar onCreateMovieClick={handleCreateMovieClick} onHomeClick={handleHomeClick} />

        <div style={{ marginLeft: '1rem', flex: 1 }}>
          {alertMessage && (
            <div className={`alert alert-${alertType}`} role="alert">
              {alertMessage}
            </div>
          )}
          
          <label htmlFor="genre-select">Filter by Genre:</label>
          <select id="genre-select" value={selectedGenre} onChange={handleGenreChange}>
            <option value="">All</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          {currentView === 'createMovie' ? 
            <MovieForm 
              onAddOrUpdateMovie={handleAddOrUpdateMovie} 
              editMovie={editMovie} 
            /> :
            <MovieDetails 
              movieList={filteredMovies} 
              onEditMovie={handleEditMovie} 
              onDeleteMovie={handleDeleteMovie} 
              setIsUpdated={(val) => setIsUpdated(val)}
            />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
