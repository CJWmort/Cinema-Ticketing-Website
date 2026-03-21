const express = require('express');

const moviesController = require('../controllers/movies-controller');

const router = express.Router(); // sub application

// GET route to display the list of movies
router.get("/", moviesController.showMovies);

// GET route to display a selected movie
router.get("/search-movie", moviesController.findMovie);



// EXPORT
module.exports = router;