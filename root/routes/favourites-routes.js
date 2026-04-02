const express = require('express');
const favouritesController = require('../controllers/favourites-controller');
const router = express.Router();

const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware.isLoggedIn, favouritesController.favouriteGet);
router.post('/', favouritesController.favouritePost);

router.post('/update-rank', favouritesController.favouriteUpdateRank);

router.post('/delete', favouritesController.favouriteDelete);

module.exports = router;
