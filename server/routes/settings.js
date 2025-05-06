
const express = require('express');
const Settings = require('../models/Settings');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/settings
// @desc    Get company settings
// @access  Private
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ companyId: req.user.companyId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        companyId: req.user.companyId
      });
      await settings.save();
    }

    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/settings
// @desc    Update company settings
// @access  Private
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne({ companyId: req.user.companyId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({
        companyId: req.user.companyId
      });
    }

    const {
      defaultCurrency,
      language,
      notificationSettings,
      fuelUnit,
      distanceUnit
    } = req.body;

    if (defaultCurrency) settings.defaultCurrency = defaultCurrency;
    if (language) settings.language = language;
    if (notificationSettings) settings.notificationSettings = notificationSettings;
    if (fuelUnit) settings.fuelUnit = fuelUnit;
    if (distanceUnit) settings.distanceUnit = distanceUnit;

    settings.updatedAt = Date.now();

    await settings.save();

    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
