const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
    movieid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: false,
        default: null
    }
}, {
    timestamps: true 
});

const Favourite = mongoose.model('Favourite', FavouriteSchema, 'favourites');

exports.addFavourite = function(movieid, userid, newFavourite) {
    return Favourite.findOneAndUpdate({movieid: movieid, userid: userid}, {$set: newFavourite}, {upsert: true});
};

exports.findMyFavourites = function(userid) {
    return Favourite.find({userid: userid}).sort('rank');
};

exports.findOneFavourite = function(movieid, userid) {
    return Favourite.findOne({movieid: movieid, userid: userid});
};

exports.updateRank = function(movieid, userid, rank) {
    return Favourite.findOneAndUpdate({movieid: movieid, userid: userid}, {$set: {rank: rank}});
};

exports.deleteFavourite = function(movieid, userid) {
    return Favourite.deleteOne({movieid: movieid, userid: userid});
};

exports.removeDeletedUsers = function(userid) {
    return Favourite.deleteMany({userid: userid});
};

exports.deleteByMovie = function(movieid) {
    return Favourite.deleteMany({movieid: movieid});
};