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

router.get('/user/:id', accountsController.visitothersGet);//visit other user

router.get("/change-pfp", accountsController.changepfpGet); // fetch original pfp
router.post('/change-pfp',accountsController.changepfpPost);

router.get('/delete-acct', authMiddleware.isLoggedIn, accountsController.deleteacctGet);
router.post('/delete-acct', accountsController.deleteacctPost); // deactive account

router.get("/admin-tool", authMiddleware.isAdmin, accountsController.adminTool); //admin tools page

router.get("/user-manage",authMiddleware.isAdmin,accountsController.userList); //manage user page for admins

router.get("/admin-confirm",authMiddleware.isAdmin,accountsController.adminActionGet); // Admin action authroization
router.post("/admin-confirm",authMiddleware.isAdmin,accountsController.adminActionPost);
module.exports = router;