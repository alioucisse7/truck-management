
const express = require('express');
const { check, validationResult } = require('express-validator');
const Company = require('../models/Company');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/company
// @desc    Get company details
// @access  Private
router.get('/', async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/company
// @desc    Update company details
// @access  Private (Admin only)
router.put('/', admin, async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const {
      name,
      address,
      phone,
      email,
      logoUrl
    } = req.body;

    if (name) company.name = name;
    if (address) company.address = address;
    if (phone) company.phone = phone;
    if (email) company.email = email;
    if (logoUrl) company.logoUrl = logoUrl;

    await company.save();

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/company/users
// @desc    Get all users in the company
// @access  Private (Admin only)
router.get('/users', admin, async (req, res) => {
  try {
    const users = await User.find({ companyId: req.user.companyId })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/company/users
// @desc    Create a new user in the company
// @access  Private (Admin only)
router.post(
  '/users',
  [
    admin,
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
      check('name', 'Name is required').not().isEmpty(),
      check('role', 'Role is required').isIn(['admin', 'manager', 'driver'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, phone = '' } = req.body;

    try {
      // Check if user exists
      let existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        role,
        phone,
        companyId: req.user.companyId
      });

      await user.save();

      // Return user without password
      const newUser = await User.findById(user._id).select('-password');

      res.status(201).json(newUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/company/users/:id
// @desc    Update a user in the company
// @access  Private (Admin only)
router.put('/users/:id', admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user belongs to the same company
    if (user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this user' });
    }

    const {
      name,
      email,
      role,
      phone,
      password
    } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    
    // If password is being updated
    if (password) {
      user.password = password;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/company/users/:id
// @desc    Delete a user in the company
// @access  Private (Admin only)
router.delete('/users/:id', admin, async (req, res) => {
  try {
    // Don't allow deletion of own account
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure user belongs to the same company
    if (user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    await user.remove();
    
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
