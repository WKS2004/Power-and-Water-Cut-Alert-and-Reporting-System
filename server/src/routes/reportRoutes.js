const express = require('express');
const router = express.Router();
const { getReports, createReport, getReportById } = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * Report Routes
 * Ownership: Member 2 (Backend API & Auth)
 */

router.get('/', getReports);
router.post('/', verifyToken, createReport);
router.get('/:id', getReportById);

module.exports = router;
