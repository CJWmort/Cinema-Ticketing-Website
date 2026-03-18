const express = require('express');

const accountsController = require('./../controllers/accounts-controller');

const router = express.Router(); // sub application

router.get("/login", accountsController.login);
router.get("/register", accountsController.register);


// EXPORT
module.exports = router;