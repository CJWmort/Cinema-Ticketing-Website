// Get Service model
const Account = require('../models/account-model');
const Review = require('../models/review-model') 
const Movie = require('../models/movie-model') 
const Booking = require('../models/booking-model') 
// Bcrypt used to Hash and protect passwords
const bcrypt = require('bcrypt');

// Logout user, return to login page
exports.logout = (req, res) => {
  console.log("Ending current session");
  req.session.destroy(); // destroy existing req.session variables
  res.redirect('/account/login?msg=You have logged out');
}

// Display the login page view
exports.loginGet = async (req, res) => {
  const msg = req.query.msg; // Show error / success message
  res.render("login", { msg, email: undefined });
};

// Handle user authentication, login with correct hash password
exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try{
      const userFound = await Account.findByEmail(email);
      const match = await bcrypt.compare(password, userFound.password);
      if (userFound && match){
          const accountFound = {
              id: userFound._id,
              username: userFound.username,
              email: userFound.email,
              bio: userFound.bio,
              role: userFound.role,
              profilepic: userFound.profilepic
          }
          
          req.session.user = accountFound;
          if (accountFound.role == "admin"){
              res.redirect('/movie');
          } else{
              res.redirect('/movie');
          }
      } else{
          res.render('login', { msg: "Email or Password is incorrect", email });
      }
  } catch(error){
      console.log(error);
      res.render('login', { msg: "Email or Password is incorrect", email });
  }
};

// Display the register account view
exports.registerGet = async (req, res) => {
  res.render("register", { msg: undefined, username: undefined, email: undefined, user: req.session.user });
};

// Handle account registration form submissions
exports.registerPost = async (req, res) => {
  // Add the user to the Accounts Schema
  const username = req.body.username;
  const password = req.body.password;
  const cfmpassword = req.body.cfmpassword;
  const email = req.body.email;
  
  // Check if Password matches Confirm Password
  if (password != cfmpassword){
    res.render("register", { msg: "Password not matching", username, email, user: req.session.user });
  } 
  else{
    try {
      // Password matches, need to hash the Password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username: username,
        password: hashedPassword, // Save the Hashed Password to the Accounts Schema
        email: email,
        role: "user" // Every new account created will have role "user" 
        // Change role manually in MongoDB Accounts Schema to "admin" to have administrative functions
      }

      if (newUser){
        await Account.addUser(newUser);
        // Upon successful account creation,
        // Redirect user to login page with success message if havent logged in
        if (!req.session.user){
          res.redirect('/account/login?msg=success');
        } else{
          res.render('register', {msg: "success", username: undefined, email: undefined, user: req.session.user})
        }      
      } else{
        res.render('register', { msg: "Error creating account", username, email, user: req.session.user });
      }
    } catch (error) {
      if (error.code === 11000) {
        // 11000 is duplicate key error code
        const field = Object.keys(error.keyPattern)[0]; 
        res.render('register', { msg: `A user with this ${field} already exists`, username, email, user: req.session.user });
      } else {
        res.render('register', { msg: "Error creating account", username, email, user: req.session.user });
      }
    }
  }
};

// Display the current logged in user's profile page
exports.profileGet = async (req, res) => {
  const msg = req.query.msg; // Show error / success message
  res.render('profile', { msg, user: req.session.user });
};

// Update the current logged in user's profile details (username, email)
exports.profilePost = async (req, res) => {
  const email = req.session.user.email; // Find by the email of the current logged in user
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newbio = req.body.bio;
  
  try {
    let success = await Account.updateUser(email, newUsername, newEmail , newbio);
    
    // Update the username, email and bio session variables
    req.session.user.username = newUsername;
    req.session.user.email = newEmail;
    req.session.user.bio = newbio;

    res.redirect('/account/profile?msg=success');
  } catch (error) {
    if (error.code === 11000) {
      // 11000 is duplicate key error code
      const field = Object.keys(error.keyPattern)[0]; 
      res.render('profile', { msg: `A user with this ${field} already exists`, user: req.session.user });
    } else {
      res.render('profile', { msg: "Error updating account", user: req.session.user });
    }
  }
};

// Allow current logged in user to change password
exports.changePasswordGet = async (req, res) => {
  const msg = req.query.msg; // Show error / success message
  res.render("change-password", { msg, user: req.session.user });
};

// Update the current logged in user's password
exports.changePasswordPost = async (req, res) => {
  // Fetch the current user's password from server instead of session for better security
  const userFound = await Account.findByEmail(req.session.user.email);
  
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const cfmNewPassword = req.body.cfmNewPassword;

  // Logic for updating password:
  // 1. Current user need to enter correct Current Password (if wrong, prevent password change)
  // 2. New Password must equal Confirm New Password (if not same, prevent password change)
  // Logic 1 & 2 must be fulfilled to allow changing password

  // Logic 1: Catch incorrect Current Password
  const matchPassword = await bcrypt.compare(currentPassword, userFound.password);
  if (!matchPassword){
    console.log("Incorrect Current Password");
    return res.render('change-password', { msg: "Incorrect Current Password, Try again", user: req.session.user });
  }
  // Logic 2: New Password & Confirm New Password must match
  if (newPassword != cfmNewPassword){
    console.log("New Password not matching");
    return res.render('change-password', { msg: "New Password not matching, Try again", user: req.session.user });
  }

  try {
    //Hash New Password and Update user's password
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    let success = await Account.updatePassword(userFound.email, newHashPassword);
    console.log(success);
    res.redirect('/account/change-password?msg=success');
  } catch (error) {
    console.log(error);
    res.render('change-password', { msg: "Error, Unable to update password", user: req.session.user });
  }
};

// go to delete acct page
exports.deleteacctGet = (req, res) => {
  res.render('delete-acct', { msg: '', user: req.session.user });
};

// allow users to delete their acct (with password verification)
exports.deleteacctPost = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.session.user.email;
    const username = req.session.user.username;
    const userid = req.session.user.id;

    console.log("Deleting account for:", email, username);

    // find user & check if it exists
    const user = await Account.findByEmail(email);
    console.log("User found:", user);
    if (!user) {
      return res.render('delete-acct', { msg: 'user not found', user: req.session.user });
    }

    // verify password
    const match = await bcrypt.compare(password, user.password);
    console.log("Password match?", match);
    if (!match) {
      return res.render('delete-acct', { msg: 'incorrect password', user: req.session.user });
    }

    // remove all reviews by user
    await Review.removedeletedusers(userid);
    
    // remove all bookings by user
    await Booking.deleteByUser(userid);

    // delete account
    await Account.deleteacct(email);

    // destroy current session
    req.session.destroy();

    // redirect to login page
    res.redirect('/account/login?msg=Your Account has been Deleted')

  } catch (err) {
    console.log(err);
    res.render('delete-acct', { msg: 'an error has occured', user: req.session.user });
  }
};

exports.visitothersGet = async (req, res) => {
  const user = req.params.id; // get user ID from URL
  let combined =[];
  try {
    
    console.log("Visiting user ID:", user);

    const otherUser = await Account.findByID(user); // other user acct
    const reviews = await Review.findallreviewbyusers(user) || [];  // fetch their reviews
  
    for (let i = 0; i < reviews.length; i++) {
      const movie = await Movie.findByID(reviews[i].movieid);
      combined.push({ review: reviews[i], movie });
    }

    res.render('home', { userFound: otherUser, combined, user: req.session.user });
  } catch (err) {
    console.log("Error in visitothersGet:", err);
    res.status(500).send("Server error");
  }
};
exports.adminTool = async (req,res) => {
    const msg = req.query.msg;
    res.render('admin-tool', { msg, user: req.session.user });
}


exports.changepfpGet = async (req,res) =>{
  const currentpfp = req.session.user.profilepic;
  res.render('change-pfp',{user: req.session.user, currentpfp});
}

exports.changepfpPost = async (req,res) =>{
  const user = req.session.user;
  const selected_pfp =req.body.pfp;
  
  try{
    await Account.updateUser( selected_pfp);
    user.profilepic = selected_pfp
    res.redirect('/account/profile?msg=success');
  } catch (err) {
    console.log(err);
    res.render('change-pfp', {user: user, currentpfp: user.profilepic, msg: 'Error updating avatar'
    });
  }
};
exports.userList = async (req,res) => {
    const userList = await Account.retrieveAll();
    res.render("user-manage",{userList : userList, user : req.session.user});
};
exports.adminActionGet = async (req,res) => {
    const { id, type } = req.query;
    let displayName = "";

    if (type.includes('user')) {
        const user = await Account.findByID(id);
        displayName = user.username;
    } else if (type.includes('movie')) {
        const movie = await Movie.findByID(id);
        displayName = movie.title;
    }

    res.render('admin-confirm', { 
        targetId: id, 
        actionType: type, 
        displayName: displayName,
        user : req.session.user
    })
};
exports.adminActionPost = async (req,res) => {
    const { targetId, actionType, adminPassword } = req.body;
    const adminUser = await Account.findByID(req.session.user.id);
    const isMatch = await bcrypt.compare(adminPassword, adminUser.password);
    if (!isMatch) {
        return res.status(403).send("Incorrect admin password. Action denied.");
    }

    try {
        switch (actionType) {
            case 'delete-user':
                // remove all bookings by user
                await Booking.deleteByUser(targetId);
                // remove all reviews by user
                await Review.removedeletedusers(targetId);
                await Account.deleteAccountByID(targetId);
                return res.redirect("/account/user-manage");

            case 'promote-user':
                await Account.changeRole(targetId,"admin");
                return res.redirect("/account/user-manage");
            case 'demote-user':
                await Account.changeRole(targetId,"user");
                if (adminUser.id === targetId) { //checks if user demoted themselves
                    req.session.user.role = "user"; //updat user role
                    return req.session.save(()=> {
                        return res.redirect("/"); //redirect back to homepage
                    })
                } else {
                    return res.redirect("/account/user-manage");
                }
            case 'delete-movie':
                // remove all bookings of movie
                await Booking.deleteByMovie(targetId);
                // remove all reviews of movie
                await Review.deleteByMovie(targetId);
                await Movie.deleteOne(targetId);
                return res.redirect("/movie/movie-manage");

            default:
                return res.status(400).send("Unknown action type.");
        }

        res.redirect("/");
    } catch (err) {
        res.status(500).send("An error occurred while processing the request.");
    }
}
