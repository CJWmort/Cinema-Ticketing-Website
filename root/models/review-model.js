const mongoose = require('mongoose');

// Create a new 'review' schema
const ReviewSchema = new mongoose.Schema({
    //"movieid" pairs with "userid" to find all watched movies for user
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
    watched: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    review: {
        type: String,
        required: false
    }
}, {
    timestamps: true // auto timestamp management (createdAt, updatedAt) will update automatically based on methods used
});

const Review = mongoose.model('Review', ReviewSchema, 'reviews');

// Find user's movie review by movieid AND userid
// Each user can only create 1 review for each unique movie

//"upsert: true" is a combination of update + insert
// If a user has never reviewed a movie before,
// it will automatically create a new review document. 
// If they have reviewed it before, it updates the existing one.

// "$set" ensures only specific fields are modified, preserving the rest of the document data.
exports.newReview = function(movieid, userid, newReview) {
    return Review.findOneAndUpdate({movieid: movieid, userid: userid}, {$set: newReview}, {upsert: true})
};

// Display all reviews for a specified movie and sort by latest review ('updatedAt' descending order) 
// '-updatedAt' means sort 'updatedAt' in descending order 
exports.findAllReview = function(movieid) {
    return Review.find({movieid: movieid}).sort('-updatedAt');
};

// Fetch the review that belongs to the user for a specified movie
exports.findMyReview = function(movieid, userid) {
    return Review.findOne({movieid: movieid, userid: userid});
};

// Fetch all watched movies for user
exports.findMyWatched = function(userid) {
    return Review.find({userid: userid, watched: true});
};

// Delete a user's review from a movie
exports.deleteMyReview = function(movieid, userid) {
    return Review.deleteOne({movieid: movieid, userid: userid});
};

// automatically remove review if user deactivate their acct
exports.removedeletedusers = function(userid){
    return Review.deleteMany({userid: userid})
};

// find all the reviews that this user gave
exports.findallreviewbyusers = function(userid){
    return Review.find({userid: userid}).sort('-updatedAt');
};

// Fetch all reviews with non-null ratings
// $ne is (not equal) operator
exports.findReviewsWithRating = function() {
    return Review.find({rating: { $ne: null }});
};
// Deletes all reviews of movie
exports.deleteByMovie = function(movieid) {
    return Review.deleteMany({movieid:movieid});
};