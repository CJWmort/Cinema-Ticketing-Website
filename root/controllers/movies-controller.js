const fs = require('fs/promises');

// Get Service model
const Movie = require('./../models/movie-model');

// Controller function to get all the documents in the db and display it
exports.showMovies = async (req, res) => {
  try {
    let movieList = await Movie.retrieveAll();// fetch all the list    
    console.log(movieList);
    res.render("display-movie", { movieList }); // Render the EJS form view and pass the posts
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

exports.findMovie = async (req, res) => {
  try {
    const id = req.query.movieId;
    if (id == ""){
      res.redirect("/movie-list");
    } else{
      let result = await Movie.findByID(id); // Get the movie selected to display the selected movie's view
      res.render("search-movie", { result }); // Render the EJS form view and pass the posts
    }
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};