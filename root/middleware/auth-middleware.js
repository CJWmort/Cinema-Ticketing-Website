// Check if account is logged in, role should be "user"
exports.isLoggedIn = (req, res, next) => {
    if (!req.session.user){
        console.log("User not logged in, redirecting to /login");
        return res.redirect('/account/login?msg=Account required to proceed');
    } 
    next();
}

// Prevent logged in user from accessing certain pages (E.g, login page), need to logout first
exports.alreadyLoggedIn = (req, res, next) => {
    if (req.session.user){
        console.log("User already logged in, redirecting to profile page");
        return res.redirect('/account/profile');
    } 
    next();
}

// Check if account is logged in and has "admin" role
exports.isAdmin = (req, res, next) => {
    if (!req.session.user){
        console.log("User not logged in, redirecting to /login");
        return res.redirect('/account/login?msg=Account required to proceed');
    }
    if (req.session.user.role !== "admin"){
        console.log("Not an admin user, redirecting to home page");
        return res.redirect('/');
    }
    next();
}
