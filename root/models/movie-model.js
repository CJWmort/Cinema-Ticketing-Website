const mongoose = require('mongoose');

// Create a new 'movie' schema
const movieSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    release: {
        type: String,
        required: true
    },
    cast: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true
    }
});
// 'movies' refer to the 'movies' collection in our database
const Movie = mongoose.model('Movie', movieSchema, 'movies');

// CRUD Methods for Movie
exports.addMovie = function(newMovie) {
    return Movie.create(newMovie);
};

exports.retrieveAll = function() {
    return Movie.find();
};

exports.findByID = function(id) {
    return Movie.findOne({_id: id});
};

exports.edit = function(id,description,genre,release,cast,duration,language) {
    return Movie.updateOne({_id:id},
        {description:description,genre:genre,release:release,cast:cast,duration:duration,language:language})
};

// $regex to find movie that contains the search title
// $options to find movie ignoring case sensitivity
exports.findByTitle = function(title) {
    return Movie.find({title: { $regex: title, $options: 'i' }});
};

// $in query comparison operator used to select documents where 
// if the value matches any value within a provided array (movieList)
exports.getMyWatched = function(movieList) {
    return Movie.find({_id: { $in: movieList }});
};
exports.deleteOne = function(id) {
    return Movie.deleteOne({_id:id});
};