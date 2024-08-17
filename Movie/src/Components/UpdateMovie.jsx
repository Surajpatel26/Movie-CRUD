import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';

const UpdateMovie = () => {
  const [movie, setMovie] = useState({
    movieName: '',
    actors: '',
    director: '',
    budget: '',
    genre: '',
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false); // Notification state
  const navigate = useNavigate();
  const { movieId } = useParams(); // Get movie ID from URL parameters

  // Predefined genres for selection
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Fantasy'];

  // Fetch the movie details when the component mounts
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/movies/${movieId}`);
        setMovie({
          ...response.data,
          actors: response.data.actors.join(', '), // Join actors into a comma-separated string
          budget: String(response.data.budget), // Ensure budget is a string
        });
        setErrors({}); // Reset errors when fetching new movie details
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Function to validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!movie.movieName.trim()) newErrors.movieName = 'Movie name is required.';
    if (!movie.actors.trim()) {
      newErrors.actors = 'Actors are required.';
    } else if (!/^[a-zA-Z\s,]+$/.test(movie.actors)) {
      newErrors.actors = 'Actor names should only contain letters and commas.';
    }
    if (!movie.director.trim()) {
      newErrors.director = 'Director name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(movie.director)) {
      newErrors.director = 'Director name should only contain letters.';
    }
    // Convert budget to string for validation
    const budgetString = String(movie.budget).trim();
    if (!budgetString) {
      newErrors.budget = 'Budget is required.';
    } else if (isNaN(budgetString) || Number(budgetString) <= 0) {
      newErrors.budget = 'Budget should be a positive number.';
    }
    if (!movie.genre) {
      newErrors.genre = 'Genre is required.';
    } else if (!genres.includes(movie.genre)) {
      newErrors.genre = `Genre must be one of: ${genres.join(', ')}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle the form submission to update the movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8081/movies/${movieId}`, {
        ...movie,
        actors: movie.actors.split(',').map(actor => actor.trim()), // Convert actors input to an array
        budget: Number(movie.budget), // Convert budget back to a number for the API
      });
      setErrors({}); // Reset errors on successful update
      setShowNotification(true); // Show notification
      setTimeout(() => {
        setShowNotification(false);
        navigate('/'); // Redirect to home page after notification
      }, 3000); // Show notification for 3 seconds
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));
  };

  // Functions for sidebar navigation
  const handleHomeClick = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar showAddMovieButton={false} onHomeClick={handleHomeClick} />

        <div style={{ marginLeft: '1rem', flex: 1 }}>
          <div className="container mt-5">
            <h1 className="text-center mb-4">Update Movie</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Movie Name:</label>
                <input
                  type="text"
                  name="movieName"
                  className={`form-control ${errors.movieName ? 'is-invalid' : ''}`}
                  value={movie.movieName}
                  onChange={handleChange}
                  required
                />
                {errors.movieName && <div className="invalid-feedback">{errors.movieName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Actors (comma separated):</label>
                <input
                  type="text"
                  name="actors"
                  className={`form-control ${errors.actors ? 'is-invalid' : ''}`}
                  value={movie.actors}
                  onChange={handleChange}
                  required
                />
                {errors.actors && <div className="invalid-feedback">{errors.actors}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Director:</label>
                <input
                  type="text"
                  name="director"
                  className={`form-control ${errors.director ? 'is-invalid' : ''}`}
                  value={movie.director}
                  onChange={handleChange}
                  required
                />
                {errors.director && <div className="invalid-feedback">{errors.director}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Budget:</label>
                <input
                  type="number"
                  name="budget"
                  className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                  value={movie.budget}
                  onChange={handleChange}
                  required
                />
                {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Genre:</label>
                <select
                  name="genre"
                  className={`form-control ${errors.genre ? 'is-invalid' : ''}`}
                  value={movie.genre}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Genre</option>
                  {genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.genre && <div className="invalid-feedback">{errors.genre}</div>}
              </div>
              <button type="submit" className="btn btn-success w-100">Update Movie</button>
            </form>
            {showNotification && (
              <div className="alert alert-success mt-3" role="alert">
                Movie has been successfully updated!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateMovie;
