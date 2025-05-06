
const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Company = require('../models/Company');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a user and create company
// @access  Public
router.post(
  '/signup',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('name', 'Name is required').not().isEmpty(),
    check('companyName', 'Company name is required').not().isEmpty(),
    check('phone', 'Phone number is required').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, companyName, phone } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create company first
      const company = new Company({
        name: companyName,
        phone,
        email
      });

      await company.save();

      // Create default settings for the company
      const settings = new Settings({
        companyId: company._id
      });

      await settings.save();

      // Create user with link to company
      user = new User({
        name,
        email,
        password,
        phone,
        companyId: company._id,
        role: 'admin' // First user is admin
      });

      await user.save();

      // Generate JWT
      const token = user.getSignedJwtToken();

      // Get user data without password
      const userData = await User.findById(user._id).select('-password');

      res.status(201).json({
        token,
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          companyId: userData.companyId,
          companyName: companyName
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check for user
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Get company name
      const company = await Company.findById(user.companyId);
      
      // Generate token
      const token = user.getSignedJwtToken();

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: company ? company.name : 'Unknown Company'
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get company name
    const company = await Company.findById(user.companyId);
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      companyName: company ? company.name : 'Unknown Company',
      phone: user.phone
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
