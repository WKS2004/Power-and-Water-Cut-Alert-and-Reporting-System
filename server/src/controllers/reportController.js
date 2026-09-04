const Report = require('../models/Report');
const User = require('../models/User');
const { AREAS } = require('../config/areas');

// Utility: get current reference time (respects the demo time-skip offset from adminController)
// We import the getter lazily to avoid circular deps
const getReferenceTime = () => {
  try {
    // Access the in-memory offset from adminController
    const { getSimulatedTimeOffset } = require('./adminController');
    return new Date(Date.now() + getSimulatedTimeOffset());
  } catch {
    return new Date();
  }
};

// @desc    Get active/approved outage reports with optional area filter + calculated status
// @route   GET /api/reports?area=<area>
// @access  Public
const getReports = async (req, res, next) => {
  try {
    const { area } = req.query;
    const referenceTime = getReferenceTime();

    // Build query: only approved reports (admin-issued are auto-approved; user reports need approval)
    const query = { approved: true };

    if (area && area !== 'all' && AREAS.includes(area)) {
      query.area = area;
    }

    const reports = await Report.find(query)
      .populate('submittedBy', 'username address area')
      .sort({ startTime: 1 });

    // Attach calculated status to each report
    const data = reports.map((r) => {
      const obj = r.toObject({ virtuals: true });
      obj.status = r.calculateStatus(referenceTime);
      return obj;
    });

    res.status(200).json({
      success: true,
      count: data.length,
      data,
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
    const { type, area, startTime, estimatedEndTime, description } = req.body;

    // Validate required fields
    if (!type || !area || !startTime || !estimatedEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Type, area, start time, and estimated end time are all required.',
      });
    }

    // Validate type
    if (!['power', 'water'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Cut type must be either "power" or "water".',
      });
    }

    // Validate area
    if (!AREAS.includes(area)) {
      return res.status(400).json({
        success: false,
        message: `Area "${area}" is not in the supported list. Please select a valid area.`,
      });
    }

    const start = new Date(startTime);
    const end = new Date(estimatedEndTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for start time or end time.',
      });
    }

    // Validate end time is after start time
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Estimated restoration time must be after the start time.',
      });
    }

    // Fetch submitting user's address from their profile
    const userProfile = await User.findById(req.user.id).select('address');
    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    const report = await Report.create({
      type,
      area,
      startTime: start,
      estimatedEndTime: end,
      description: description?.trim() || '',
      source: 'user',
      approved: false,
      submittedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. It will be reviewed and published by authorities.',
      data: report,
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
    const report = await Report.findById(req.params.id).populate('submittedBy', 'username address');
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }
    const obj = report.toObject({ virtuals: true });
    obj.status = report.calculateStatus(getReferenceTime());
    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
  createReport,
  getReportById,
};
