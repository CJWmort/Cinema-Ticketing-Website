// Get Service model
const Movie = require('../models/movie-model');
const Review = require('../models/review-model');

// Controller function to get all the documents in the db and display it
exports.moviesGet = async (req, res) => {
  try {
    const searchQuery = req.query.search;
    let movieList;
    if (searchQuery){
      // filter movies based on search input
      movieList = await Movie.findByTitle(searchQuery);
    } else{
      // fetch all movies by default
      movieList = await Movie.retrieveAll();
    }
    
    let ratingList = {}; // Key: movieid, Value: rating (sum non null review ratings / review count)
    let ratingCountList = {} // Key: movieid, Value: count (number of times rated, don't count "no rating")
    let reviewList = await Review.findReviewsWithRating(); // fetch list of reviews with non-null ratings

    reviewList.forEach(review => {
      // initialize rating for movieid to 0, subsequently increment the rating
      ratingList[review.movieid] = (ratingList[review.movieid] || 0) + review.rating; 
      ratingCountList[review.movieid] = (ratingCountList[review.movieid] || 0) + 1;
    });

    // total rating / total rating count = average rating for movie
    Object.entries(ratingList).forEach(([key, value]) => {
      ratingList[key] = value / ratingCountList[key]
    });
   
    res.render("movie", { movieList, ratingList, user: req.session.user }); 
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

// Handle search result for user to search specific movies
exports.searchMovies = async (req, res) => {
    const searchQuery = req.query.search;   
    res.redirect('/movie?search=' + searchQuery);
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

exports.manageMovieGet = async (req,res) => {
    try {
    const movieList = await Movie.retrieveAll();
    res.render("movie-manage",{movieList: movieList ,user:req.session.user});
    } catch (error) {
        console.error(error);
        res.send("Error fetching movieList")
    }
};
