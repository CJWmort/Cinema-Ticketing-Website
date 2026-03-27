const mongoose = require('mongoose');

// Create a new 'movie' schema
const movieSchema = new mongoose.Schema({
    img: {
        type: String,
        required: [true, 'A movie must have a img path']
    },
    title: {
        type: String,
        required: [true, 'A movie must have a title']
    },
    description: {
        type: String,
        required: [true, 'A movie must have a description']
    },
    genre: {
        type: String,
        required: [true, 'A movie must have a genre']
    },
    release: {
        type: String,
        required: [true, 'A movie must have a release date']
    },
    cast: {
        type: String,
        required: [true, 'A movie must have cast members']
    },
    duration: {
        type: Number,
        required: [true, 'A movie must have a duration in minutes']
    },
    language: {
        type: String,
        required: [true, 'A movie must have language available']
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

exports.findByTitle = function(title) {
    // $regex to find movie that contains the search title
    // $options to find movie ignoring case sensitivity
    return Movie.find({title: { $regex: title, $options: 'i' }});
};

// $in query comparison operator used to select documents where 
// if the value matches any value within a provided array (movieList)
exports.getMyWatched = function(movieList) {
    return Movie.find({_id: { $in: movieList }});
};