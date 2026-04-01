// models/report-model.js
const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reported_username: {
        type: String,
        required: true
    },
    reportedby_username: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    movieid: { 
        type: String,
        required: true
    },
    description: {
        type: String
    },
    reason: {
        type: String,
        required: false,
        default: 'others' 
    },
    status: {
        type: String,
        default: 'pending' 
    }
});

const Report = mongoose.model('Report', ReportSchema, 'reports');

// create report
exports.addReport= function(username,reportedbyuser, review,movieid,reason,description) {
    return Report.create({reported_username:reportedbyuser, reportedby_username:username, movieid, review, reason ,  description})
};

// fetch all reports for admin
exports.getallreports = function(status) {
    return Report.find( { status: { $in: status }}).sort({ createdAt: -1 });

};

// update the status (ignore/delete)
exports.updatestatus = function(id, newStatus) {
    return Report.findByIdAndUpdate(id, {status: newStatus});
};

// delete report
exports.deleteReport = function(id) {
    return Report.deleteOne({ _id: id });
};

exports.findByID = function(id) {
    return Report.findOne({_id: id});
};