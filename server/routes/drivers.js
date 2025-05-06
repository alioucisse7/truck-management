
const express = require('express');
const { check, validationResult } = require('express-validator');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Trip = require('../models/Trip');
const { protect, manager } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/drivers
// @desc    Get all drivers for company
// @access  Private
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find({ companyId: req.user.companyId })
      .sort({ createdAt: -1 });
    
    res.json(drivers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/drivers/:id
// @desc    Get driver by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Ensure driver belongs to user's company
    if (driver.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this driver' });
    }

    res.json(driver);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/drivers/:id/trips
// @desc    Get trips for a specific driver
// @access  Private
router.get('/:id/trips', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Ensure driver belongs to user's company
    if (driver.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this driver' });
    }

    const trips = await Trip.find({ 
      driverId: req.params.id,
      companyId: req.user.companyId 
    }).sort({ startDate: -1 });

    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/drivers
// @desc    Create a driver
// @access  Private (Managers and Admins)
router.post(
  '/',
  [
    manager,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('phone', 'Phone number is required').not().isEmpty(),
      check('license', 'License number is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        name, 
        phone, 
        license,
        experience = 0,
        status = 'available',
        avatar = '',
        salary,
        userId = null
      } = req.body;

      const driverData = {
        name,
        phone,
        license,
        experience,
        status,
        avatar,
        salary,
        userId,
        companyId: req.user.companyId
      };

      const driver = new Driver(driverData);
      await driver.save();

      res.status(201).json(driver);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/drivers/:id
// @desc    Update a driver
// @access  Private (Managers and Admins)
router.put('/:id', manager, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if driver belongs to user's company
    if (driver.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this driver' });
    }

    // Update fields
    const {
      name,
      phone,
      license,
      experience,
      status,
      avatar,
      salary
    } = req.body;

    if (name) driver.name = name;
    if (phone) driver.phone = phone;
    if (license) driver.license = license;
    if (experience !== undefined) driver.experience = experience;
    if (status) driver.status = status;
    if (avatar !== undefined) driver.avatar = avatar;
    if (salary !== undefined) driver.salary = salary;

    await driver.save();

    res.json(driver);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/drivers/:id
// @desc    Delete a driver
// @access  Private (Managers and Admins)
router.delete('/:id', manager, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if driver belongs to user's company
    if (driver.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this driver' });
    }

    await driver.remove();
    
    res.json({ message: 'Driver removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
