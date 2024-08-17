import React, { useState, useEffect } from 'react';

const MovieForm = ({ onAddOrUpdateMovie, editMovie }) => {
  const [movieName, setMovieName] = useState('');
  const [actors, setActors] = useState('');
  const [director, setDirector] = useState('');
  const [budget, setBudget] = useState('');
  const [genre, setGenre] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  
  const [errors, setErrors] = useState({});

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Fantasy'];

  useEffect(() => {
    if (editMovie) {
      setMovieName(editMovie.movieName);
      setActors(editMovie.actors.join(', '));
      setDirector(editMovie.director);
      setBudget(editMovie.budget);
      setGenre(editMovie.genre);
      setCreatedAt(editMovie.createdAt);
    } else {
      setMovieName('');
      setActors('');
      setDirector('');
      setBudget('');
      setGenre('');
      setCreatedAt('');
    }
  }, [editMovie]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!movieName.trim()) newErrors.movieName = 'Movie name is required.';
    if (!actors.trim()) {
      newErrors.actors = 'Actors are required.';
    } else if (!/^[a-zA-Z,\s]+$/.test(actors)) {
      newErrors.actors = 'Actors names should only contain letters and commas.';
    }
    if (!director.trim()) {
      newErrors.director = 'Director name is required.';
    } else if (!/^[a-zA-Z\s]+$/.test(director)) {
      newErrors.director = 'Director name should only contain letters.';
    }
    if (!budget.trim()) {
      newErrors.budget = 'Budget is required.';
    } else if (isNaN(budget) || budget <= 0) {
      newErrors.budget = 'Budget should be a positive number.';
    }
    if (!genre) {
      newErrors.genre = 'Genre is required.';
    } else if (!genres.includes(genre)) {
      newErrors.genre = `Genre must be one of: ${genres.join(', ')}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const movie = {
      id: editMovie ? editMovie.id : Date.now(),
      movieName,
      actors: actors.split(',').map(actor => actor.trim()),
      director,
      budget,
      genre,
      createdAt: editMovie ? editMovie.createdAt : new Date(),
    };
    
    onAddOrUpdateMovie(movie);

    setMovieName('');
    setActors('');
    setDirector('');
    setBudget('');
    setGenre('');
    setCreatedAt('');
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="mb-4">{editMovie ? 'Edit Movie' : 'Add Movie'}</h2>
      
      <div className="mb-3">
        <label htmlFor="movieName" className="form-label">Movie Name</label>
        <input 
          type="text" 
          id="movieName" 
          className={`form-control ${errors.movieName ? 'is-invalid' : ''}`} 
          value={movieName} 
          onChange={(e) => setMovieName(e.target.value)} 
        />
        {errors.movieName && <div className="invalid-feedback">{errors.movieName}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="actors" className="form-label">Actors (comma separated)</label>
        <input 
          type="text" 
          id="actors" 
          className={`form-control ${errors.actors ? 'is-invalid' : ''}`} 
          value={actors} 
          onChange={(e) => setActors(e.target.value)} 
        />
        {errors.actors && <div className="invalid-feedback">{errors.actors}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="director" className="form-label">Director</label>
        <input 
          type="text" 
          id="director" 
          className={`form-control ${errors.director ? 'is-invalid' : ''}`} 
          value={director} 
          onChange={(e) => setDirector(e.target.value)} 
        />
        {errors.director && <div className="invalid-feedback">{errors.director}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="budget" className="form-label">Budget</label>
        <input 
          type="text" 
          id="budget" 
          className={`form-control ${errors.budget ? 'is-invalid' : ''}`} 
          value={budget} 
          onChange={(e) => setBudget(e.target.value)} 
        />
        {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="genre" className="form-label">Genre</label>
        <select 
          id="genre" 
          className={`form-control ${errors.genre ? 'is-invalid' : ''}`} 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)} 
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

      {createdAt && (
        <div className="mb-3">
          <label className="form-label">Posted on</label>
          <p>{new Date(createdAt).toLocaleString()}</p>
        </div>
      )}

      <div>
        <button type="submit" className="btn btn-primary me-2">
          {editMovie ? 'Update Listing' : 'Add Listing'}
        </button>
        <button 
          type="reset" 
          className="btn btn-secondary" 
          onClick={() => {
            setMovieName('');
            setActors('');
            setDirector('');
            setBudget('');
            setGenre('');
            setCreatedAt('');
            setErrors({});
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default MovieForm;
