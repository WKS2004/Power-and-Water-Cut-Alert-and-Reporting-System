const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { AREAS } = require('../config/areas');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate a JWT token for a given payload
 */
const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// @desc    Register a new resident user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, password, email, area, address } = req.body;

    // Validate required fields
    if (!username || !password || !email || !area || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: username, password, email, area, and address.',
      });
    }

    // Validate username length
    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long.',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Validate area against whitelist
    if (!AREAS.includes(area)) {
      return res.status(400).json({
        success: false,
        message: `Area "${area}" is not in the supported area list. Please select a valid area.`,
      });
    }

    // Check for duplicate username (in both User and Admin collections)
    const existingUser = await User.findOne({ username: username.trim() });
    const existingAdmin = await Admin.findOne({ username: username.trim() });
    if (existingUser || existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'That username is already taken. Please choose a different one.',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username: username.trim(),
      password: hashedPassword,
      email: email.trim().toLowerCase(),
      area,
      address: address.trim(),
    });

    // Issue JWT
    const token = signToken({ id: user._id, role: user.role, username: user.username, area: user.area });

    res.status(201).json({
      success: true,
      message: 'Household registered successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        area: user.area,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user or admin
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    // Check Admin collection first
    let account = await Admin.findOne({ username: username.trim() });
    let role = 'admin';

    // Fall back to User collection
    if (!account) {
      account = await User.findOne({ username: username.trim() });
      role = 'user';
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'No account found with that username. Please check and try again.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    // Build token payload
    const payload = {
      id: account._id,
      role,
      username: account.username,
      area: account.area || null,
    };

    const token = signToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: account._id,
        username: account.username,
        role,
        area: account.area || null,
        email: account.email || null,
        address: account.address || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    let account;
    if (role === 'admin') {
      account = await Admin.findById(id).select('-password');
    } else {
      account = await User.findById(id).select('-password');
    }

    if (!account) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: account._id,
        username: account.username,
        role,
        area: account.area || null,
        email: account.email || null,
        address: account.address || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
