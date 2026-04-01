const express = require('express');
const bookingsController = require('../controllers/bookings-controller');
const router = express.Router(); 
const authMiddleware = require('../middleware/auth-middleware');

router.get("/", authMiddleware.isLoggedIn, bookingsController.bookingformGet);
router.post("/", bookingsController.bookingformPost);

router.get("/history", authMiddleware.isLoggedIn, bookingsController.bookinghistoryGet);

router.get("/delete", authMiddleware.isLoggedIn, bookingsController.bookingDelete);

module.exports = router;