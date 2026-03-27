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

exports.editMoviesGet = async (req, res) => {
    try {
    const movieid = req.query.movieid;
    const result = await Movie.findByID(movieid);
    return res.render("movie-edit", { result:result, reviewResult:[], user: req.session.user }); 
} catch (error) {
    console.error(error);
    res.send("Error loading page");
}};

exports.editMoviesPost = async (req,res) => {
    try {
        const movieid = req.body.movieid;
        const cast = req.body.cast;
        const genre = req.body.genre;
        const release = req.body.release;
        const duration = req.body.duration;
        const language = req.body.language;
        const description = req.body.description;

        let updatecheck = await Movie.edit(movieid,description,genre,release,cast,duration,language);
        res.redirect(`/review?movieid=${movieid}`)
    } catch (error) {
        console.error(error);
        res.send("Error updating database"); // Send error message if update fails
    }
}

exports.createMoviesGet = async (req,res) => {
    res.render("movie-create",{msg:null,user:req.session.user});
}
exports.createMoviesPost = async (req,res) => {
    try {
        const {img,title,description,genre,release,cast,duration,language} = req.body;
        if (!title || !img) {
            return res.render("movie-create",{msg:"Please fill all required fields",user:req.session.user});
        };
        const newMovie = {
            img:img,
            title:title,
            description:description ? description :"nill",
            genre:genre ? genre : "nill",
            release:release ? release : "nill",
            cast:cast ? cast : "nill",
            duration:duration ? duration : 0,
            language:language ? language : "nill",
        };
        await Movie.addMovie(newMovie);
        res.render("movie-create",{msg:"success",user:req.session.user})

    } catch(error) {
        console.error(error);
        res.send("Error adding movie to database");
    };
};