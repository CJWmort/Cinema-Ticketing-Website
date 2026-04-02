const Movie = require('../models/movie-model');
const Favourite = require('../models/favourite-model');

// Display all favourites for the logged-in user
exports.favouriteGet = async (req, res) => {
    try {
        const msg = req.query.msg;
        const userid = req.session.user.id;

        // Fetch all favourited entries for this user
        const myFavourites = await Favourite.findMyFavourites(userid);

        // Extract all the movieids from the favourites
        const favouriteMovieIDs = [];
        myFavourites.forEach(fav => {
            favouriteMovieIDs.push(fav.movieid);
        });

        // Fetch the actual movie details for each favourited movie
        const favouriteList = await Movie.getMyWatched(favouriteMovieIDs);

        res.render('favourite', {msg, myFavourites, favouriteList, user: req.session.user});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

// Handle adding a movie to favourites
exports.favouritePost = async (req, res) => {
    const movieid = req.body.movieid;
    const userid = req.session.user.id;
    const username = req.session.user.username;

    try {
        const newFavourite = {
            movieid: movieid,
            userid: userid,
            username: username,
            rank: null
        };

        await Favourite.addFavourite(movieid, userid, newFavourite);
        res.redirect('/favourite?msg=success');
    } catch (error) {
        console.log(error);
        res.redirect('/review?msg=Unable to add to favourites&movieid=' + movieid);
    }
};

// Handle updating the rank of a favourited movie
exports.favouriteUpdateRank = async (req, res) => {
    const movieid = req.body.movieid;
    const userid = req.session.user.id;
    const rank = req.body.rank;

    try {
        await Favourite.updateRank(movieid, userid, rank);
        res.redirect('/favourite?msg=Rank updated');
    } catch (error) {
        console.log(error);
        res.redirect('/favourite?msg=Unable to update rank');
    }
};

// Handle removing a movie from favourites
exports.favouriteDelete = async (req, res) => {
    const movieid = req.body.movieid;
    const userid = req.session.user.id;

    try {
        await Favourite.deleteFavourite(movieid, userid);
        res.redirect('/favourite?msg=Movie removed from favourites');
    } catch (error) {
        console.log(error);
        res.redirect('/favourite?msg=Unable to remove from favourites');
    }
};
