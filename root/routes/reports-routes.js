const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.post('/', authMiddleware.isLoggedIn, reportsController.createreport);

router.get('/admin-report', authMiddleware.isAdmin, reportsController.adminreport);

router.post('/action',  authMiddleware.isAdmin, reportsController.handlereport);
module.exports = router;
