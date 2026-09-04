const mongoose = require('mongoose');
const { AREAS } = require('../config/areas');

/**
 * Report Schema
 * Ownership: Member 1 (Problem & Solution Design + Backend Data Layer)
 * 
 * Fields:
 * - type: "water" | "power"
 * - area: from predefined AREAS enum
 * - startTime: scheduled or actual start datetime
 * - estimatedEndTime: expected restoration datetime
 * - source: "admin" | "user"
 * - description: optional details/notes
 * - submittedBy: reference to User (only if source is "user")
 * - approved: boolean flag (auto true for admin, false initially for user)
 * 
 * Status derivation:
 * Calculated dynamically (scheduled / ongoing / resolved) relative to current time / demo simulated offset.
 */
const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Cut type is required (power or water)'],
      enum: ['power', 'water'],
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      enum: {
        values: AREAS,
        message: '{VALUE} is not a supported area',
      },
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    estimatedEndTime: {
      type: Date,
      required: [true, 'Estimated end time is required'],
    },
    source: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
      default: 'user',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual status helper: dynamically derives status relative to a reference time
reportSchema.methods.calculateStatus = function (referenceTime = new Date()) {
  const now = new Date(referenceTime);
  const start = new Date(this.startTime);
  const end = new Date(this.estimatedEndTime);

  if (now < start) {
    return 'scheduled';
  } else if (now >= start && now <= end) {
    return 'ongoing';
  } else {
    return 'resolved';
  }
};

module.exports = mongoose.model('Report', reportSchema);
