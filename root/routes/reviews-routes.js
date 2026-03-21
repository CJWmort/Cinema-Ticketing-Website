const express = require('express');
const reviewsController = require('../controllers/reviews-controller');
const router = express.Router(); 

router.get("/", reviewsController.reviewGet);
router.post("/", reviewsController.reviewPost);

router.post("/delete", reviewsController.reviewDelete);

module.exports = router;