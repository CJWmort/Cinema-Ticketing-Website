const Report = require('../models/report-model');
const Review = require('../models/review-model');



// submit new report
exports.createreport = async (req, res) => {
    const reportedbyuser = req.session.user.username;
     console.log('Report POST hit!', req.body);
    try {
        await Report.addReport(
        reportedbyuser,        // reporter
        req.body.username,     // reported user
        req.body.review,
        req.body.movieid,
        req.body.reason,       
        req.body.description
    );
    res.redirect(`/movie?report=success`);
    } catch (err) {
        console.log(err);
        res.status(500).send('error');
    }
};
    
exports.adminreport = async (req, res) => {
    try {
        let status = req.query.status;

        let status_array;
        if (Array.isArray(status)) {
            status_array = status;
        } else if (status) {
            status_array = [status];
        } else {
            status_array = ['pending', 'deleted', 'dismissed'];
        }

        const reports = await Report.getallreports(status_array);
       
        res.render('admin-report', { reports, status_array });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching reports');
    }
};



exports.handlereport = async (req, res) => {
    const reportid = req.body.id;
    const action = req.body.action;

    try {
        const report = await Report.findByID(reportid);

        if (!report) return res.status(404).send('Report not found');

        if (action === 'ignore') {
            await Report.updatestatus (reportid,  'dismissed' );
        } else if (action === 'delete') {
            await Review.deletereportedreview(report.movieid, report.reported_username);
            await Report.updatestatus (reportid,  'deleted');
        }

        res.redirect('/report/admin-report');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};