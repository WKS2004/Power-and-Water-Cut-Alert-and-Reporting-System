const Report = require('../models/Report');
const User = require('../models/User');
const { AREAS } = require('../config/areas');

// In-memory simulated time offset in milliseconds (for demo fast-forward)
let simulatedTimeOffsetMs = 0;

/**
 * Returns the effective reference time (real time + simulated demo offset)
 */
const getSimulatedTime = () => {
  return new Date(Date.now() + simulatedTimeOffsetMs);
};

// @desc    Issue official administrative outage alert
// @route   POST /api/admin/alerts
// @access  Private (Admin Only)
const createOfficialAlert = async (req, res, next) => {
  try {
    const { type, area, startTime, estimatedEndTime, description } = req.body;

    // 1. Required fields check
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
        message: 'Type must be either "power" or "water".',
      });
    }

    // 3. Area whitelist validation
    if (!AREAS.includes(area)) {
      return res.status(400).json({
        success: false,
        message: `Invalid area selected. Please select a valid area from the list.`,
      });
    }

    // 4. Start & End date parsing & validation
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

    // 5. Create official admin report (auto-approved, live immediately)
    const report = await Report.create({
      type,
      area,
      startTime: start,
      estimatedEndTime: end,
      description: description ? description.trim() : '',
      source: 'admin',
      approved: true,
      submittedBy: null,
    });

    const status = report.calculateStatus(getSimulatedTime());

    res.status(201).json({
      success: true,
      message: 'Official outage alert published successfully.',
      data: {
        ...report.toObject(),
        status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user-submitted & official reports for administrative review
// @route   GET /api/admin/reports
// @access  Private (Admin Only)
const getAllReportsForAdmin = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('submittedBy', 'username email address area')
      .sort({ createdAt: -1 });

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

// @desc    Approve a user-submitted report (turns into live official alert)
// @route   PUT /api/admin/reports/:id/approve
// @access  Private (Admin Only)
const approveReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Outage report not found.',
      });
    }

    report.approved = true;
    await report.save();

    const refTime = getSimulatedTime();
    const updatedObj = report.toObject();
    updatedObj.status = report.calculateStatus(refTime);

    res.status(200).json({
      success: true,
      message: 'Report approved successfully and is now visible to residents.',
      data: updatedObj,
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
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Outage report not found.',
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report rejected and removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current simulated reference time (Demo Time-Skip Feature)
// @route   GET /api/admin/time-skip
// @access  Public / Private
const getTimeSkip = (req, res) => {
  const effectiveTime = getSimulatedTime();
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

  const effectiveTime = getSimulatedTime();

  res.status(200).json({
    success: true,
    message: `Simulated clock updated. Current offset: ${simulatedTimeOffsetMs / (60 * 1000)} minutes.`,
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
  getSimulatedTime,
};

