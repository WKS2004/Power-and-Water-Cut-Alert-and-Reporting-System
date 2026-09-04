const express = require('express');
const router = express.Router();
const {
  createOfficialAlert,
  getAllReportsForAdmin,
  approveReport,
  rejectReport,
  getTimeSkip,
  setTimeSkip,
} = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

/**
 * Admin Routes
 * Ownership: Member 2 (Backend API & Auth)
 */

router.post('/alerts', verifyToken, requireAdmin, createOfficialAlert);
router.get('/reports', verifyToken, requireAdmin, getAllReportsForAdmin);
router.put('/reports/:id/approve', verifyToken, requireAdmin, approveReport);
router.delete('/reports/:id', verifyToken, requireAdmin, rejectReport);

// Demo Time-Skip Simulator Routes
router.get('/time-skip', getTimeSkip);
router.post('/time-skip', verifyToken, requireAdmin, setTimeSkip);

module.exports = router;
