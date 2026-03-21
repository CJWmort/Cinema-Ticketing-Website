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
exports.retrieveAll = function() {
    return Movie.find();
};

exports.findByID = function(id) {
    return Movie.findOne({_id: id});
};



