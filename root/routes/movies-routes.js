const express = require('express');
const moviesController = require('../controllers/movies-controller');
const router = express.Router(); 
const authMiddleware = require('../middleware/auth-middleware');

router.get("/", moviesController.moviesGet);
router.get("/search-movie", moviesController.searchMovies);

router.get("/movie-edit",authMiddleware.isAdmin, moviesController.editMoviesGet); //admin edit movie page
router.post("/movie-edit",authMiddleware.isAdmin,moviesController.editMoviesPost);


// EXPORT
router.get("/movie-create",authMiddleware.isAdmin,moviesController.createMoviesGet); //admin create movie page
router.post("/movie-create",authMiddleware.isAdmin,moviesController.createMoviesPost);

router.get("/movie-manage",authMiddleware.isAdmin,moviesController.manageMovieGet); //admin movie-manage page

module.exports = router;