const mongoose = require('mongoose');
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
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
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
  }
);

module.exports = mongoose.model('User', userSchema);
