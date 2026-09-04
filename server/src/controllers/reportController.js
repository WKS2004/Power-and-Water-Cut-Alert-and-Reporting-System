/**
 * Report Controller
 * Ownership: Member 2 (Backend API & Auth)
 * 
 * Handles listing active/upcoming/resolved utility alerts,
 * filtering by area, and accepting resident outage reports.
 */

// @desc    Get active/approved outage reports with area filter & calculated status
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res, next) => {
  try {
    const { area } = req.query;
    // Note for Member 2:
    // 1. Fetch reports matching approved: true OR source: 'admin'
    // 2. If 'area' query provided and not 'all', filter by area
    // 3. Compute dynamic status ('scheduled' | 'ongoing' | 'resolved') comparing to reference time
    res.status(200).json({
      success: true,
      data: [],
      message: 'getReports endpoint scaffolded. Ready for Member 2 logic.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new user outage report
// @route   POST /api/reports
// @access  Private (Registered User)
const createReport = async (req, res, next) => {
  try {
    // Note for Member 2:
    // Extract: { type, area, startTime, estimatedEndTime, description }
    // Server-side validation: estimatedEndTime > startTime, area is valid
    // Pull address from logged-in user profile
    // Save report with source: 'user', approved: false
    res.status(501).json({
      success: false,
      message: 'createReport endpoint scaffolded. Ready for Member 2 logic.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Public
const getReportById = async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      message: 'getReportById endpoint scaffolded.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
  createReport,
  getReportById,
};
