import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieDetails = ({ movieList, onEditMovie, onDeleteMovie, setIsUpdated }) => {
  const [movieToDelete, setMovieToDelete] = useState(null); // State to hold the movie to be deleted

  const handleDelete = (movie) => {
    setMovieToDelete(movie); // Set the movie to be deleted
  };

  const confirmDelete = () => {
    if (movieToDelete) {
      onDeleteMovie(movieToDelete._id);
      setIsUpdated(true);
      setMovieToDelete(null); // Clear the movie to delete after confirming
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        {movieList.length === 0 ? (
          <div className="col-12">
            <p>No movies listed yet.</p>
          </div>
        ) : (
          movieList.map((movie) => (
            <div className="col-md-4" key={movie._id}>
              <div className="card" style={{ width: '100%', marginBottom: '20px' }}>
                <div className="card-body">
                  <h3>{movie.movieName}</h3>
                  <p><strong>Actors:</strong> {movie.actors.join(', ')}</p>
                  <p><strong>Director:</strong> {movie.director}</p>
                  <p><strong>Budget:</strong> {movie.budget}Cr</p>
                  <p><strong>Genre:</strong> {movie.genre}</p>
                  <p>Posted on: {new Date(movie.createdAt).toLocaleString()}</p>

                  <Link to={`/update/${movie._id}`} className="btn btn-primary btn-sm">Edit</Link>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleDelete(movie)} // Trigger the modal
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete the movie "{movieToDelete?.movieName}"?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
