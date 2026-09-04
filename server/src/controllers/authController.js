const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { AREAS } = require('../config/areas');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production';

// Helper to sign JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new resident user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, password, email, area, address } = req.body;

    // 1. Required fields check
    if (!username || !password || !email || !area || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: username, password, email, area, and address.',
      });
    }

    // 2. Password minimum length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 3. Area whitelist validation
    if (!AREAS.includes(area)) {
      return res.status(400).json({
        success: false,
        message: `Invalid area selected. Please select one of the allowed areas.`,
      });
    }

    // 4. Check if username is already registered as User or Admin
    const existingUser = await User.findOne({ username });
    const existingAdmin = await Admin.findOne({ username });
    if (existingUser || existingAdmin) {
      return res.status(400).json({
        success: false,
        message: `The username "${username}" is already taken. Please choose another.`,
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Save new user
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      area,
      address,
      role: 'user',
    });

    // 7. Generate JWT token
    const tokenPayload = {
      id: user._id,
      username: user.username,
      role: 'user',
      area: user.area,
    };
    const token = generateToken(tokenPayload);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
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
        message: 'Please provide both username and password.',
      });
    }

    // Check Admin collection first
    let account = await Admin.findOne({ username });
    let role = 'admin';

    // If not admin, check User collection
    if (!account) {
      account = await User.findOne({ username });
      role = 'user';
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Create JWT token payload
    const tokenPayload = {
      id: account._id,
      username: account.username,
      role,
      ...(role === 'user' ? { area: account.area } : {}),
    };
    const token = generateToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: account._id,
        username: account.username,
        role,
        ...(role === 'user'
          ? {
              email: account.email,
              area: account.area,
              address: account.address,
            }
          : {}),
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
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: account,
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

