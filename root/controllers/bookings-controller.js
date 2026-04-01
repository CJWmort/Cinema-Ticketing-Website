// Get Service model
const Booking = require('../models/booking-model');
const Movie = require('../models/movie-model');

// Function to return empty array if no checkbox selected or 1 element array if only 1 value selected
function normaliseArray(value) {
    return value == undefined ? [] : Array.isArray(value) ? value : [value]
}

// Display list of past booking records
exports.bookinghistoryGet = async (req, res) => {
  const userid = req.session.user.id;
  const msg = req.query.msg;
  try {
    let history = await Booking.findBooking(userid);
    return res.render('booking-history', { history, msg, user: req.session.user })
  } catch (error) {
    console.log('Unable to fetch movie from database');
    return res.redirect('/review?movieid=' + movieid);
  }
};

// Display booking form for the movie
exports.bookingformGet = async (req, res) => {
  const movieid = req.query.movieid;
  const bookingDate = req.query.bookingDate;
  const bookingTime = req.query.bookingTime;
  const msg = req.query.msg;
  try {
    let result = await Movie.findByID(movieid);

    // Fetch all the currently occupied seats for this movie at this date and at this time
    let takenSeats = await Booking.findOccupiedSeats(movieid, bookingDate, bookingTime);
    let resultSeats = [];
    let mySeats = [];
    takenSeats.forEach(bookingFound => {
      // Only find seats occupied by other Accounts
      if (bookingFound.userid != req.session.user.id){
        resultSeats.push(...bookingFound.seat); // '...' spread operator to iterate through an array
      } else{
        mySeats.push(...bookingFound.seat);
      }
    });
    resultSeats = resultSeats || []; // empty array if no seats occupied
    mySeats = mySeats || [];
    return res.render('booking-form', { result, bookingDate, bookingTime, resultSeats, mySeats, msg, user: req.session.user })
  } catch (error) {
    console.log('Unable to fetch from database');
    return res.redirect('/review?movieid=' + movieid);
  }
};

// Handle / Validate booking form submission
exports.bookingformPost = async (req, res) => {
  const userid = req.session.user.id;
  const movieid = req.body.movieid;
  const date = req.body.bookingDate || undefined;
  const time = req.body.bookingTime || undefined;
  const seat = req.body.seat;
  const title = req.body.title;
  const img = req.body.img;
  const username = req.session.user.username;

  // Redirect back to booking-form if no date or time selected
  if (!date || !time){
    return res.redirect('/booking?msg=Select a Date and Time&movieid=' + movieid);
  }

  // Redirect back to booking-form if no seat selected
  if (normaliseArray(seat).length == 0){
    return res.redirect('/booking?msg=Seat Selection Required&movieid=' + movieid + '&bookingDate=' + date + '&bookingTime=' + time);
  }
  
  try {
    let booking = {
      userid: userid,
      movieid: movieid,
      date: date,
      time: time,
      seat: normaliseArray(seat),
      title: title,
      img: img,
      username: username
    };
    let result = await Booking.newBooking(userid, movieid, date, time, booking);
    if (result){ // This means that this booking record already exists, we Update
      return res.redirect(`/booking/history?msg=Success! Movie booking (ID: ${result._id}) modified`);
    }
    else{ // If booking record does not exist, we Create
      return res.redirect(`/booking/history?msg=Success! New movie booking added`);
    }
  } catch (error) {
    console.log('Unable to create this booking');
    return res.redirect('/booking?msg=Unable to create booking&movieid=' + movieid);
  }
};

// Delete booking based on bookingid
exports.bookingDelete = async (req, res) => {
  const bookingid = req.query.bookingid;
  const userid = req.session.user.id;
  
  try {
    await Booking.deleteBooking(bookingid, userid);
    res.redirect
    return res.redirect(`/booking/history?msg=Success! Booking refunded`);
  } catch (error) {
    console.log('Unable to delete booking from database');
    return res.redirect(`/booking/history?msg=Unable to delete booking from database`);
  }
};