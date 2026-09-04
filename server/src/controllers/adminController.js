/**
 * Admin Controller
 * Ownership: Member 2 (Backend API & Auth)
 * 
 * Handles administrative functions:
 * - Issuing official alerts directly (live immediately)
 * - Reviewing user-submitted outage reports (including user address)
 * - Approving or rejecting reports
 * - Demo time-skip simulation offset logic
 */

// In-memory simulated time offset in milliseconds (for demo fast-forward)
let simulatedTimeOffsetMs = 0;

// @desc    Issue official administrative outage alert
// @route   POST /api/admin/alerts
// @access  Private (Admin Only)
const createOfficialAlert = async (req, res, next) => {
  try {
    // Note for Member 2:
    // Create report with source: 'admin', approved: true
    res.status(501).json({
      success: false,
      message: 'createOfficialAlert scaffolded. Ready for Member 2 logic.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user-submitted reports for administrative review
// @route   GET /api/admin/reports
// @access  Private (Admin Only)
const getAllReportsForAdmin = async (req, res, next) => {
  try {
    // Note for Member 2:
    // Fetch all reports, populating user details (specifically address and username)
    res.status(200).json({
      success: true,
      data: [],
      message: 'getAllReportsForAdmin scaffolded.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a user-submitted report (turns into live official alert)
// @route   PUT /api/admin/reports/:id/approve
// @access  Private (Admin Only)
const approveReport = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      message: 'approveReport scaffolded.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a user-submitted report
// @route   DELETE /api/admin/reports/:id
// @access  Private (Admin Only)
const rejectReport = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      message: 'rejectReport scaffolded.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current simulated reference time (Demo Time-Skip Feature)
// @route   GET /api/admin/time-skip
// @access  Public / Private
const getTimeSkip = (req, res) => {
  const effectiveTime = new Date(Date.now() + simulatedTimeOffsetMs);
  res.status(200).json({
    success: true,
    data: {
      offsetMinutes: simulatedTimeOffsetMs / (60 * 1000),
      effectiveTime,
    },
  });
};

// @desc    Fast-forward or reset simulated demo reference time
// @route   POST /api/admin/time-skip
// @access  Private (Admin Only)
const setTimeSkip = (req, res) => {
  const { addMinutes, reset } = req.body;

  if (reset) {
    simulatedTimeOffsetMs = 0;
  } else if (typeof addMinutes === 'number') {
    simulatedTimeOffsetMs += addMinutes * 60 * 1000;
  }

  const effectiveTime = new Date(Date.now() + simulatedTimeOffsetMs);

  res.status(200).json({
    success: true,
    message: `Simulated clock updated. Offset: ${simulatedTimeOffsetMs / (60 * 1000)} minutes.`,
    data: {
      offsetMinutes: simulatedTimeOffsetMs / (60 * 1000),
      effectiveTime,
    },
  });
};

module.exports = {
  createOfficialAlert,
  getAllReportsForAdmin,
  approveReport,
  rejectReport,
  getTimeSkip,
  setTimeSkip,
};
