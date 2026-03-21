// Get Service model
const Account = require('../models/account-model');
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
              role: userFound.role
          }
          
          req.session.user = accountFound;
          if (accountFound.role == "admin"){
              res.redirect('/admin-profile');
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
  } else{
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
      console.log(error);
      res.render('register', { msg: "This email is already taken", username, email, user: req.session.user });
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
  try {
    let success = await Account.updateUser(email, newUsername, newEmail);
    console.log(success);
    // Update the username and email session variables
    req.session.user.username = newUsername;
    req.session.user.email = newEmail;

    res.redirect('/account/profile?msg=success');
  } catch (error) {
    console.log(error);
    res.render('profile', { msg: "This email is already taken", user: req.session.user });
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