const mongoose = require('mongoose');

// Create a new 'account' schema
const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    bio:{
        type: String,
        required: false
    },
    profilepic:{
        type: String,
        default: '../images/pfp/defaultpfp.jpg',
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true // auto timestamp management (createdAt, updatedAt) will update automatically based on methods used
});
// 'account' refer to the 'accounts' collection in our database
const Account = mongoose.model('Account', AccountSchema, 'accounts');

// CRUD Methods for Accounts Schema
// Register new account
exports.addUser = function(newUser) {
    return Account.create(newUser);
};

// Search account by email
exports.findByEmail = function(email) {
    return Account.findOne({ email: email });
};

// Update profile by email
exports.updateUser = function(email, newUsername, newEmail, newbio, newpfp) {
    return Account.updateOne({email: email}, {username: newUsername, email: newEmail, bio: newbio, profilepic:newpfp});
};

// Update profile password by email
exports.updatePassword = function(email, newPassword) {
    return Account.updateOne({email: email}, {password: newPassword});
};

//allow users to delete their account
exports.deleteacct = function (email) {
    return Account.findOneAndDelete({email: email});
};

//find account through id
exports.findByID = function (id) {
    return Account.findById(id);
};



