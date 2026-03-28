const express = require('express');
const accountsController = require('../controllers/accounts-controller');
const router = express.Router(); 

const authMiddleware = require('../middleware/auth-middleware');

router.get("/", (req, res) => {
    res.redirect('/account/login');
});

router.get("/login", authMiddleware.alreadyLoggedIn, accountsController.loginGet);
router.post("/login", accountsController.loginPost);

router.get("/register", accountsController.registerGet);
router.post("/register", accountsController.registerPost);

router.get("/logout", accountsController.logout);

router.get("/profile", authMiddleware.isLoggedIn, accountsController.profileGet);
router.post("/profile", accountsController.profilePost); // Update Profile Details

router.get("/change-password", authMiddleware.isLoggedIn, accountsController.changePasswordGet);
router.post("/change-password", accountsController.changePasswordPost); // Update Profile Password


router.get('/delete-acct', accountsController.deleteacctGet);
router.post('/delete-acct', accountsController.deleteacctPost); // deactive account

router.get("/admin-tool", authMiddleware.isAdmin, accountsController.adminTool)


router.get('/home', accountsController.homeGet);// homepage
router.get('/user/:id', accountsController.visitothersGet);
module.exports = router;