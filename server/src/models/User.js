const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { AREAS } = require('../config/areas');

/**
 * User Schema
 * Ownership: Member 1 (Problem & Solution Design + Backend Data Layer)
 * 
 * Fields:
 * - username: unique identifier for login
 * - password: encrypted password string
 * - email: contact email
 * - area: selected from predefined AREAS list
 * - address: full text residential address
 * - role: default "user"
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      enum: {
        values: AREAS,
        message: '{VALUE} is not a supported area',
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required for verification reference'],
      trim: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user'],
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
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Validate entered password against stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

