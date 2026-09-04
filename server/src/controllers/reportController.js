const Report = require('../models/Report');
const User = require('../models/User');
const { AREAS } = require('../config/areas');
const { getSimulatedTime } = require('./adminController');

// @desc    Get active/approved outage reports with area filter & calculated status
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res, next) => {
  try {
    const { area, type } = req.query;

    // Filter to only approved reports or official admin alerts
    const filter = {
      $or: [{ approved: true }, { source: 'admin' }],
    };

    // Filter by specific area if provided and not 'all'
    if (area && area !== 'all') {
      filter.area = area;
    }

    // Filter by type if provided ('power' or 'water')
    if (type && ['power', 'water'].includes(type)) {
      filter.type = type;
    }

    const reports = await Report.find(filter)
      .populate('submittedBy', 'username area')
      .sort({ startTime: 1 });

    const refTime = getSimulatedTime();

    const formattedReports = reports.map((report) => {
      const obj = report.toObject();
      obj.status = report.calculateStatus(refTime);
      return obj;
    });

    res.status(200).json({
      success: true,
      count: formattedReports.length,
      referenceTime: refTime,
      data: formattedReports,
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

    // 1. Check required fields
    if (!type || !area || !startTime || !estimatedEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: type, area, startTime, and estimatedEndTime.',
      });
    }

    // 2. Type validation
    if (!['power', 'water'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Cut type must be either "power" or "water".',
      });
    }

    // 3. Area whitelist validation
    if (!AREAS.includes(area)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid area selected. Please select a valid area from the list.',
      });
    }

    // 4. Start & End time parsing & validation
    const start = new Date(startTime);
    const end = new Date(estimatedEndTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start time or estimated end time format.',
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Estimated restoration end time must be after the start time.',
      });
    }

    // 5. Create user outage report (pending admin approval)
    const report = await Report.create({
      type,
      area,
      startTime: start,
      estimatedEndTime: end,
      description: description ? description.trim() : '',
      source: 'user',
      approved: false,
      submittedBy: req.user.id,
    });

    const refTime = getSimulatedTime();
    const reportObj = report.toObject();
    reportObj.status = report.calculateStatus(refTime);

    res.status(201).json({
      success: true,
      message: 'Outage report submitted successfully! It will be reviewed by an administrator.',
      data: reportObj,
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
    const report = await Report.findById(req.params.id).populate('submittedBy', 'username area address');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.',
      });
    }

    const refTime = getSimulatedTime();
    const reportObj = report.toObject();
    reportObj.status = report.calculateStatus(refTime);

    res.status(200).json({
      success: true,
      data: reportObj,
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

