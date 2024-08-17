import React from 'react';

const Sidebar = ({ onCreateMovieClick, onHomeClick }) => {
  return (
    <aside className="p-3 bg-light" style={{ width: '200px' }}>
      <ul className="list-unstyled">
        <li className="mb-3">
          <button className="btn btn-primary w-100" onClick={onHomeClick}>
            Home
          </button>
        </li>
        <li>
          <button className="btn btn-primary w-100" onClick={onCreateMovieClick}>
            Create Movie Listing
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
