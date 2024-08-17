import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ searchQuery, onSearchChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">MOVIESpannel</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              style={{ width: '200px' }} // Optional styling for input width
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
