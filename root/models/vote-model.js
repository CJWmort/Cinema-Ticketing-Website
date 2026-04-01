const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    movieid: { 
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    vote: { 
        type: Number, 
        enum: [1, -1], 
        required: true } //1 is upvote, -1 is downvote
});

// One vote per user per review
voteSchema.index({ movieid: 1, userid: 1}, { unique: true});

module.exports = mongoose.model('Vote', voteSchema);