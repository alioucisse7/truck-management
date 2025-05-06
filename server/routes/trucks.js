
const express = require('express');
const { check, validationResult } = require('express-validator');
const Truck = require('../models/Truck');
const { protect, manager } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/trucks
// @desc    Get all trucks for company
// @access  Private
router.get('/', async (req, res) => {
  try {
    const trucks = await Truck.find({ companyId: req.user.companyId })
      .populate('assignedDriverId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(trucks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trucks/:id
// @desc    Get truck by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id)
      .populate('assignedDriverId', 'name');
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Ensure truck belongs to user's company
    if (truck.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this truck' });
    }

    res.json(truck);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trucks
// @desc    Create a truck
// @access  Private (Managers and Admins)
router.post(
  '/',
  [
    manager,
    [
      check('plateNumber', 'Plate number is required').not().isEmpty(),
      check('model', 'Model is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        plateNumber, 
        model, 
        status = 'available',
        fuelLevel = 100,
        lastMaintenance,
        capacity,
        assignedDriverId = null,
        monthlyExtraCosts
      } = req.body;

      const truckData = {
        plateNumber,
        model,
        status,
        fuelLevel,
        lastMaintenance: lastMaintenance || Date.now(),
        capacity,
        assignedDriverId,
        companyId: req.user.companyId,
        monthlyExtraCosts
      };

      const truck = new Truck(truckData);
      await truck.save();

      res.status(201).json(truck);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/trucks/:id
// @desc    Update a truck
// @access  Private (Managers and Admins)
router.put('/:id', manager, async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Check if truck belongs to user's company
    if (truck.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this truck' });
    }

    // Update fields
    const {
      plateNumber,
      model,
      status,
      fuelLevel,
      lastMaintenance,
      capacity,
      currentLocation,
      assignedDriverId,
      monthlyExtraCosts
    } = req.body;

    if (plateNumber) truck.plateNumber = plateNumber;
    if (model) truck.model = model;
    if (status) truck.status = status;
    if (fuelLevel !== undefined) truck.fuelLevel = fuelLevel;
    if (lastMaintenance) truck.lastMaintenance = lastMaintenance;
    if (capacity !== undefined) truck.capacity = capacity;
    if (currentLocation) truck.currentLocation = currentLocation;
    if (assignedDriverId !== undefined) truck.assignedDriverId = assignedDriverId === "none" ? null : assignedDriverId;

    if (monthlyExtraCosts) {
      truck.monthlyExtraCosts = {
        fuel: monthlyExtraCosts.loadingCosts !== undefined ? monthlyExtraCosts.loadingCosts : truck.expenses.loadingCosts,
        tolls: monthlyExtraCosts.challenge !== undefined ? monthlyExtraCosts.challenge : truck.expenses.challenge,
        maintenance: monthlyExtraCosts.otherManagementFees !== undefined ? monthlyExtraCosts.otherManagementFees : truck.expenses.otherManagementFees,
        other: monthlyExtraCosts.otherFees !== undefined ? monthlyExtraCosts.otherFees : truck.monthlyExtraCosts.otherFees
      };
    }

    await truck.save();

    res.json(truck);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trucks/:id
// @desc    Delete a truck
// @access  Private (Managers and Admins)
router.delete('/:id', manager, async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    // Check if truck belongs to user's company
    if (truck.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this truck' });
    }

    await truck.remove();
    
    res.json({ message: 'Truck removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
