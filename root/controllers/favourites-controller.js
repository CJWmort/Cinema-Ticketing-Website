const Movie = require('../models/movie-model');
const Favourite = require('../models/favourite-model');

exports.favouriteGet = async (req, res) => {
    try {
        const msg = req.query.msg;
        const userid = req.session.user.id;

        const myFavourites = await Favourite.findMyFavourites(userid);

        const favouriteMovieIDs = [];
        myFavourites.forEach(fav => {
            favouriteMovieIDs.push(fav.movieid);
        });

        const favouriteList = await Movie.getMyWatched(favouriteMovieIDs);

        res.render('favourite', {msg, myFavourites, favouriteList, user: req.session.user});
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};

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
