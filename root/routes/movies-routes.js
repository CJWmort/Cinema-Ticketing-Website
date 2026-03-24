const express = require('express');
const moviesController = require('../controllers/movies-controller');
const router = express.Router(); 

// GET route to display the list of movies
router.get("/", moviesController.showMovies);
router.get("/search-movie", moviesController.searchMovies);

// EXPORT
module.exports = router;