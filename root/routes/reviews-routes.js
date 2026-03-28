const express = require('express');
const reviewsController = require('../controllers/reviews-controller');
const router = express.Router(); 

const authMiddleware = require('../middleware/auth-middleware');

router.get("/", reviewsController.reviewGet);
router.post("/", reviewsController.reviewPost);

router.post("/delete", reviewsController.reviewDelete);

router.get("/watchlist", authMiddleware.isLoggedIn, reviewsController.watchlistGet);

module.exports = router;

// POST route for movie voting
router.post("/vote",moviesController.voteMovie);