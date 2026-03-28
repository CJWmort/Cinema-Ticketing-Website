const Movie = require('../models/movie-model');
const Review = require('../models/review-model');

// Display selected movie details and reviews
exports.reviewGet = async (req, res) => {
  try {
    const msg = req.query.msg;
    const movieid = req.query.movieid;
    const upvotes = reviewResult.filter(r => r.rating === 1).length;
    const downvotes = reviewResult.filter(r => r.rating === -1).length;
    if (!movieid){
      res.redirect("/movie");
    } else{
      let result = await Movie.findByID(movieid); // Fetch the selected movie details
      let reviewResult = await Review.findAllReview(movieid) // Fetch the selected movie reviews
      let myReview = undefined;
      if (req.session.user){
        myReview = await Review.findMyReview(movieid, req.session.user.id); // Find single the review for movie that belongs to user
        if (!myReview){
          const emptyReview = { //initialize empty review values for users who have not reviewed
            watched: undefined,
            rating: null,
            review: ''
          }
          return res.render("review", { msg, result, reviewResult, myReview: emptyReview, user: req.session.user }); 
        }
      }
      return res.render("review", { msg, result, reviewResult, myReview, user: req.session.user, upvotes, downvotes }); 
    }
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
};

// Handle review form submissions
exports.reviewPost = async (req, res) => {
  const movieid = req.body.movieid;
  const userid = req.session.user.id;
  const username = req.session.user.username;
  const watched = req.body.watched;
  const rating = req.body.rating;
  const review = req.body.review.trim(); // remove whitespaces from review

  try{
    const movieReview = {
      movieid: movieid,
      userid: userid,
      username: username,
      watched: watched,
      rating: rating,
      review: review
    }

    await Review.newReview(movieid, userid, movieReview);
    res.redirect('/review?msg=success&movieid=' + movieid);

  } catch(error){
      console.log(error);
      res.redirect('/review?msg=error&movieid=' + movieid);
  }
};

exports.reviewDelete = async (req, res) => {
  const movieid = req.body.movieid;
  const sessionuser = req.session.user;
  let userid;

  if (sessionuser.role == "admin" && req.body.userid) {
    userid = req.body.userid;
  } else {
    userid = sessionuser.id
  }

  try {
    await Review.deleteMyReview(movieid, userid);
    res.redirect('/review?msg=Movie Review Deleted&movieid=' + movieid + '#review-form');
  } catch (error) {
    console.log(error);
    res.redirect('/review?msg=Unable to delete review&movieid=' + movieid + '#review-form');
  }
}

exports.watchlistGet = async (req, res) => {
  try {
    const myWatched = await Review.findMyWatched(req.session.user.id);
    const watchedMovieID = []; //Store all the movieids that the user have indicated 'watched'
    myWatched.forEach(movie => {
      watchedMovieID.push(movie.movieid);
    });
    const watchList = await Movie.getMyWatched(watchedMovieID);
    res.render('watchlist', {watchList, user: req.session.user});
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
}

//movie voting
exports.voteMovie = async (req, res) => {
  try {
    const { movieid, vote } = req.body;
    const userid = req.session.user?._id;

    if(!userid) {
      return res.direct(`/review?movieid=?{movieid}&msg=Please log in to vote`);
    }
    let existingReview = await Review.findOne({ movieid, userid });

    if (existingReview) {
      existingReview.rating = parseInt(vote, 10);
      await existingReview.save();
    } else {
      await Review.create({
        movieid, userid, rating: parseInt(vote, 10)
      });
    }
    res.redirect(`/review?movieid=${movieid}`);
  } catch (error) {
    console.error(error);
    res.send("Error voting");
  }
};