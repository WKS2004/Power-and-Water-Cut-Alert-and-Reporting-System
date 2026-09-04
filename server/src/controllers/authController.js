/**
 * Auth Controller
 * Ownership: Member 2 (Backend API & Auth)
 * 
 * Handles user registration, authentication (admin & user),
 * password hashing (bcrypt), and JWT session issuance.
 */

// @desc    Register a new resident user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    // Note for Member 2:
    // Extract: { username, password, email, area, address }
    // Validate required fields & area whitelist
    // Hash password with bcryptjs
    // Save to User collection
    // Return JWT token and user info
    res.status(501).json({
      success: false,
      message: 'registerUser endpoint scaffolded. To be implemented by Member 2.',
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
    // Note for Member 2:
    // Extract: { username, password }
    // Check both Admin and User collections
    // Verify password match with bcrypt
    // Return JWT token containing user id and role
    res.status(501).json({
      success: false,
      message: 'loginUser endpoint scaffolded. To be implemented by Member 2.',
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
    res.status(200).json({
      success: true,
      data: req.user,
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
