const express = require('express');
const moviesController = require('../controllers/movies-controller');
const router = express.Router(); 

// GET route to display the list of movies
router.get("/", moviesController.showMovies);

// EXPORT
module.exports = router;