const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    movieid: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    seat: [String] // store array of seat numbers e.g,[A1, B1, C3]
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', BookingSchema, 'bookings');

// CRUD Methods for Bookings Schema

// Create a new booking / update existing booking
// update/insert by userid, movieid, date, time
exports.newBooking = function(userid, movieid, date, time, booking) {
    return Booking.findOneAndUpdate({userid: userid, movieid: movieid, date: date, time: time}, {$set: booking}, {upsert: true});
};

// Update all booking username for user when they change username
exports.updateAllBooking = function(userid, username) {
    return Booking.updateMany({userid: userid}, { $set: { username: username } });
};

// Fetch all account's movie booking
exports.findBooking = function(userid) {
    return Booking.find({userid}).sort('date time -updatedAt').exec(); // sort by Ascending date, Ascending time, Descending updatedAt
};

// Fetch all seats occupied by others for a specific movie booking Title, Date, Time, 
exports.findOccupiedSeats = function(movieid, date, time) {
    return Booking.find({movieid: movieid, date: date, time: time}, 'userid seat');
};

// Delete a single booking record
exports.deleteBooking = function(bookingid, userid) {
    // require userid to delete booking for added security
    return Booking.deleteOne({_id: bookingid, userid: userid});
};

// Deletes all bookings for a user
exports.deleteByUser = function(userid) {
    return Booking.deleteMany({userid:userid});
};

// Deletes all bookings for a movie
exports.deleteByMovie = function(movieid) {
    return Booking.deleteMany({movieid:movieid});
};