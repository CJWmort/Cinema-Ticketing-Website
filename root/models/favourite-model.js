const mongoose = require('mongoose');

// Create a new 'favourite' schema
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
    timestamps: true // auto timestamp management (createdAt, updatedAt) will update automatically based on methods used
});

const Favourite = mongoose.model('Favourite', FavouriteSchema, 'favourites');

// Add a movie to favourites (each user can only favourite a movie once)
// "upsert: true" is a combination of update + insert
// If a user has never favourited a movie before,
// it will automatically create a new favourite document.
// If they have favourited it before, it updates the existing one.
// "$set" ensures only specific fields are modified, preserving the rest of the document data.
exports.addFavourite = function(movieid, userid, newFavourite) {
    return Favourite.findOneAndUpdate({movieid: movieid, userid: userid}, {$set: newFavourite}, {upsert: true});
};

// Fetch all favourites for a user, sorted by rank ascending
exports.findMyFavourites = function(userid) {
    return Favourite.find({userid: userid}).sort('rank');
};

// Fetch a single favourite entry for a user and a specific movie
exports.findOneFavourite = function(movieid, userid) {
    return Favourite.findOne({movieid: movieid, userid: userid});
};

// Update the rank of a favourited movie
exports.updateRank = function(movieid, userid, rank) {
    return Favourite.findOneAndUpdate({movieid: movieid, userid: userid}, {$set: {rank: rank}});
};

// Delete a movie from favourites
exports.deleteFavourite = function(movieid, userid) {
    return Favourite.deleteOne({movieid: movieid, userid: userid});
};

// Automatically remove all favourites if user deactivates their account
exports.removeDeletedUsers = function(userid) {
    return Favourite.deleteMany({userid: userid});
};
