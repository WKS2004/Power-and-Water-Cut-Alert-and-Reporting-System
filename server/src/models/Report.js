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
 * - estimatedEndTime: expected restoration datetime (must be > startTime)
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
      enum: {
        values: ['power', 'water'],
        message: '{VALUE} is not a valid cut type. Must be power or water.',
      },
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
      validate: {
        validator: function (value) {
          if (!this.startTime || !value) return true;
          return new Date(value).getTime() > new Date(this.startTime).getTime();
        },
        message: 'Estimated restoration time must be strictly after the start time',
      },
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
      maxlength: [500, 'Description cannot exceed 500 characters'],
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
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Virtual status derived against current system clock
reportSchema.virtual('status').get(function () {
  return this.calculateStatus(new Date());
});

// Virtual remaining minutes until restoration (0 if already passed)
reportSchema.virtual('remainingMinutes').get(function () {
  const now = new Date();
  const end = new Date(this.estimatedEndTime);
  if (now >= end) return 0;
  return Math.max(0, Math.round((end - now) / (1000 * 60)));
});

// Instance method: dynamically derives status relative to an arbitrary reference time (supporting Demo Time-Skip)
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

