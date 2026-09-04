const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema
 * Ownership: Member 1 (Problem & Solution Design + Backend Data Layer)
 * 
 * Fields:
 * - username: unique identifier for admin login
 * - password: encrypted password string
 * - role: default "admin"
 */
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Admin username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook: Hash password with bcrypt before saving if modified
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Validate entered password against stored hash
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

