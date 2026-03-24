// Get Service model
const Movie = require('../models/movie-model');

// Controller function to get all the documents in the db and display it
exports.showMovies = async (req, res) => {
  try {
    let movieList = await Movie.retrieveAll();// fetch all the list of movies available from MongoDB   
    res.render("movie", { movieList, user: req.session.user }); // Render the EJS form view and pass the posts
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

// Handle search bar for user to search specific movies
exports.searchMovies = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let searchResult = await Movie.findByTitle(searchQuery);
    res.render("movie", { movieList: searchResult, user: req.session.user }); 
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};