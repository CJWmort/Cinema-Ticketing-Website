const express = require('express');
const moviesController = require('../controllers/movies-controller');
const router = express.Router(); 
const authMiddleware = require('../middleware/auth-middleware');


// GET route to display the list of movies
router.get("/", moviesController.showMovies);
router.get("/search-movie", moviesController.searchMovies);

router.get("/movie-edit",authMiddleware.isAdmin, moviesController.editMoviesGet);
router.post("/movie-edit",authMiddleware.isAdmin,moviesController.editMoviesPost);

// POST route for movie voting
router.post("/vote",moviesController.voteMovie);
// EXPORT
module.exports = router;