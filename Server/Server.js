const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define Movie model
const movieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  actors: { type: [String], required: true },
  director: { type: String, required: true },
  budget: { type: Number, required: true },
  genre: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

// GET a movie by ID
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie' });
  }
});


// Routes
// GET all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// POST a new movie
app.post('/movies', async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  const { movieName, actors, director, budget, genre } = req.body;
  const movie = new Movie({
    movieName,
    actors,
    director,
    budget,
    genre,
  });

  try {
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error saving movie:', error); // Log any errors
    res.status(500).json({ message: 'Error saving movie' });
  }
});


// PUT to update an existing movie by ID
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { movieName, actors, director, budget, genre } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { movieName, actors, director, budget, genre },
      { new: true }
    );
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie' });
  }
});

// DELETE a movie by ID
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Movie.findByIdAndDelete(id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error deleting movie' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
