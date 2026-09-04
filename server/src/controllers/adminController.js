const Report = require('../models/Report');
const { AREAS } = require('../config/areas');

/**
 * Admin Controller
 * 
 * In-memory simulated time offset in milliseconds (for demo fast-forward).
 * Exported via getSimulatedTimeOffset() for use in reportController.
 */
let simulatedTimeOffsetMs = 0;

/** Exported getter so reportController can sync reference time */
const getSimulatedTimeOffset = () => simulatedTimeOffsetMs;

// Utility: current reference time
const getReferenceTime = () => new Date(Date.now() + simulatedTimeOffsetMs);

// @desc    Issue official administrative outage alert (live immediately, no approval needed)
// @route   POST /api/admin/alerts
// @access  Private (Admin Only)
const createOfficialAlert = async (req, res, next) => {
  try {
    const { type, area, startTime, estimatedEndTime, description } = req.body;

    // Validate required fields
    if (!type || !area || !startTime || !estimatedEndTime) {
      return res.status(400).json({
        success: false,
        message: 'Type, area, start time, and estimated end time are all required.',
      });
    }

    if (!['power', 'water'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Cut type must be either "power" or "water".',
      });
    }

    if (!AREAS.includes(area)) {
      return res.status(400).json({
        success: false,
        message: `Area "${area}" is not supported. Please select a valid area.`,
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

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Estimated restoration time must be after the start time.',
      });
    }

    const report = await Report.create({
      type,
      area,
      startTime: start,
      estimatedEndTime: end,
      description: description?.trim() || '',
      source: 'admin',
      approved: true,
      submittedBy: null,
    });

    const obj = report.toObject({ virtuals: true });
    obj.status = report.calculateStatus(getReferenceTime());

    res.status(201).json({
      success: true,
      message: `Official ${type} alert issued for ${area}. It is now live.`,
      data: obj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user-submitted reports for administrative review (including address)
// @route   GET /api/admin/reports
// @access  Private (Admin Only)
const getAllReportsForAdmin = async (req, res, next) => {
  try {
    const referenceTime = getReferenceTime();

    const reports = await Report.find({ source: 'user' })
      .populate('submittedBy', 'username address area email')
      .sort({ createdAt: -1 });

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

// @desc    Approve a user-submitted report (converts it into a live official alert)
// @route   PUT /api/admin/reports/:id/approve
// @access  Private (Admin Only)
const approveReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    if (report.source !== 'user') {
      return res.status(400).json({ success: false, message: 'Only user-submitted reports require approval.' });
    }

    report.approved = true;
    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report approved. It is now visible as an official alert.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject (delete) a user-submitted report
// @route   DELETE /api/admin/reports/:id
// @access  Private (Admin Only)
const rejectReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Report rejected and removed from the queue.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current simulated reference time (Demo Time-Skip Feature)
// @route   GET /api/admin/time-skip
// @access  Public
const getTimeSkip = (req, res) => {
  const effectiveTime = getReferenceTime();
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

  const effectiveTime = getReferenceTime();

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
  getSimulatedTimeOffset,
};
