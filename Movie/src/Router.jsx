import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // Your main movie listing component
import UpdateMovie from './Components/UpdateMovie'; // Update movie component

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* Main Movie Listing Page */}
        <Route path="/update/:movieId" element={<UpdateMovie />} /> {/* Update Movie Page */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;

