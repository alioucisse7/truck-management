
const express = require('express');
const { check, validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const Truck = require('../models/Truck');
const Driver = require('../models/Driver');
const Finance = require('../models/Finance');
const { protect, manager } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/trips
// @desc    Get all trips for company
// @access  Private
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ companyId: req.user.companyId })
      .populate('truckId', 'plateNumber model')
      .populate('driverId', 'name')
      .sort({ startDate: -1 });
    
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get trip by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('truckId', 'plateNumber model')
      .populate('driverId', 'name');
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Ensure trip belongs to user's company
    if (trip.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trips
// @desc    Create a trip
// @access  Private (Managers and Admins)
router.post(
  '/',
  [
    manager,
    [
      check('startLocation', 'Start location is required').not().isEmpty(),
      check('destination', 'Destination is required').not().isEmpty(),
      check('startDate', 'Start date is required').not().isEmpty(),
      check('truckId', 'Truck assignment is required').not().isEmpty(),
      check('driverId', 'Driver assignment is required').not().isEmpty(),
      check('cargoType', 'Cargo type is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        startLocation, 
        destination, 
        startDate,
        endDate,
        truckId,
        driverId,
        distance = 0,
        cargoType,
        status = 'planned',
        revenue = 0,
        expenses = {
          fuel: 0,
          tolls: 0,
          maintenance: 0,
          other: 0
        },
        numBL = 0,
        equalization = 0,
        amountET = 0,
        mtqs = 0,
        mtqsLiters = 0,
        pricePerLiter = 0,
        missionFees = 0,
        managementFeesPercent = 0,
        observ = ''
      } = req.body;

      // Verify truck and driver belong to user's company
      const truck = await Truck.findById(truckId);
      if (!truck || truck.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(400).json({ message: 'Invalid truck selection' });
      }

      const driver = await Driver.findById(driverId);
      if (!driver || driver.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(400).json({ message: 'Invalid driver selection' });
      }

      const tripData = {
        startLocation,
        destination,
        startDate,
        endDate,
        truckId,
        driverId,
        distance,
        status,
        cargoType,
        revenue,
        expenses,
        numBL,
        equalization,
        amountET,
        mtqs,
        mtqsLiters,
        pricePerLiter,
        missionFees,
        managementFeesPercent,
        observ,
        companyId: req.user.companyId
      };

      const trip = new Trip(tripData);
      await trip.save();

      // Update truck and driver status if trip is starting now
      if (status === 'in-progress') {
        await Truck.findByIdAndUpdate(truckId, { status: 'on-trip' });
        await Driver.findByIdAndUpdate(driverId, { status: 'on-trip' });
      }

      const managementFees = Math.floor((amountET * managementFeesPercent) / 100);
      const TotalTripExpenses = managementFees + missionFees + mtqs;

      const totalExpenses = TotalTripExpenses + expenses.fuel + expenses.tolls + expenses.maintenance + expenses.other;

      // If trip has expenses, create a finance record
      if (totalExpenses > 0) {
       
        await Finance.create({
          type: 'expense',
          category: 'trip-expenses',
          amount: totalExpenses,
          date: new Date(),
          description: `Expenses for trip: ${startLocation} to ${destination}`,
          tripId: trip._id,
          truckId,
          driverId,
          companyId: req.user.companyId
        });
      }

      // If trip has expenses, create a finance record
      if (expenses.fuel > 0) {
       
        await Finance.create({
          type: 'expense',
          category: 'fuel',
          amount: expenses.fuel,
          date: new Date(),
          description: `Expenses for fuel trip: ${startLocation} to ${destination}`,
          tripId: trip._id,
          truckId,
          driverId,
          companyId: req.user.companyId
        });
      }

      // If trip has revenue, create a finance record
      if (amountET) {
        await Finance.create({
          type: 'income',
          category: 'trip-revenue',
          amount: amountET,
          date: new Date(),
          description: `Revenue from trip: ${startLocation} to ${destination}`,
          tripId: trip._id,
          truckId,
          driverId,
          companyId: req.user.companyId
        });
      }

      trip.revenue = amountET;
      await trip.save();


      res.status(201).json(trip);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/trips/:id
// @desc    Update a trip
// @access  Private (Managers and Admins)
router.put('/:id', manager, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if trip belongs to user's company
    if (trip.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this trip' });
    }

    const {
      startLocation,
      destination,
      startDate,
      endDate,
      status,
      truckId,
      driverId,
      cargoType,
      distance = 0,
      revenue = 0,
      expenses = {
        fuel: 0,
        tolls: 0,
        maintenance: 0,
        other: 0
      },
      numBL = 0,
      equalization = 0,
      amountET = 0,
      mtqs,
      mtqsLiters = 0,
      pricePerLiter = 0,
      missionFees = 0,
      managementFeesPercent = 0,
      observ = ''
    } = req.body;

    // Handle status change
    if (status && status !== trip.status) {
      // If status is changing to in-progress
      if (status === 'in-progress') {
        // Update truck and driver status
        await Truck.findByIdAndUpdate(trip.truckId, { status: 'on-trip' });
        await Driver.findByIdAndUpdate(trip.driverId, { status: 'on-trip' });
      }
      
      // If status is changing to completed or cancelled
      if ((status === 'completed' || status === 'cancelled') && trip.status === 'in-progress') {
        // Free up truck and driver
        await Truck.findByIdAndUpdate(trip.truckId, { status: 'available' });
        await Driver.findByIdAndUpdate(trip.driverId, { status: 'available' });
      }
    }

    // Handle truck change
    if (truckId && !trip.truckId.equals(truckId)) {
      // Verify new truck belongs to company
      const newTruck = await Truck.findById(truckId);
      if (!newTruck || newTruck.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(400).json({ message: 'Invalid truck selection' });
      }

      // Free up old truck if trip was in progress
      if (trip.status === 'in-progress') {
        await Truck.findByIdAndUpdate(trip.truckId, { status: 'available' });
        // Set new truck to on-trip
        await Truck.findByIdAndUpdate(truckId, { status: 'on-trip' });
      }
    }

    // Handle driver change
    if (driverId && !trip.driverId.equals(driverId)) {
      // Verify new driver belongs to company
      const newDriver = await Driver.findById(driverId);
      if (!newDriver || newDriver.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(400).json({ message: 'Invalid driver selection' });
      }

      // Free up old driver if trip was in progress
      if (trip.status === 'in-progress') {
        await Driver.findByIdAndUpdate(trip.driverId, { status: 'available' });
        // Set new driver to on-trip
        await Driver.findByIdAndUpdate(driverId, { status: 'on-trip' });
      }
    }

    // Update trip fields
    if (startLocation) trip.startLocation = startLocation;
    if (destination) trip.destination = destination;
    if (startDate) trip.startDate = startDate;
    if (endDate) trip.endDate = endDate;
    if (status) trip.status = status;
    if (truckId) trip.truckId = truckId;
    if (driverId) trip.driverId = driverId;
    if (distance !== undefined) trip.distance = distance;
    if (cargoType) trip.cargoType = cargoType;
    if (numBL !== undefined) trip.numBL = numBL;
    if (equalization !== undefined) trip.equalization = equalization;
    if (amountET !== undefined) trip.amountET = amountET;
    if (mtqs !== undefined) trip.mtqs = mtqs;
    if (pricePerLiter !== undefined) trip.pricePerLiter = pricePerLiter;
    if (mtqsLiters !== undefined) trip.mtqsLiters = mtqsLiters;
    if (missionFees !== undefined) trip.missionFees = missionFees;
    if (managementFeesPercent !== undefined) trip.managementFeesPercent = managementFeesPercent;
    if (observ !== undefined) trip.observ = observ;

    // Handle revenue update
    const managementFees = Math.floor((amountET * managementFeesPercent) / 100);
    const TotalTripExpenses = managementFees + missionFees + mtqs;

    const totalExpenses = TotalTripExpenses + expenses.fuel + expenses.tolls + expenses.maintenance + expenses.other;
    const calculatedRevenue = amountET - totalExpenses;
    if (calculatedRevenue) {
      trip.revenue = calculatedRevenue;
    }

    // Handle expenses update
    if (expenses) {
      trip.expenses = {
        fuel: expenses.fuel !== undefined ? expenses.fuel : trip.expenses.fuel,
        tolls: expenses.tolls !== undefined ? expenses.tolls : trip.expenses.tolls,
        maintenance: expenses.maintenance !== undefined ? expenses.maintenance : trip.expenses.maintenance,
        other: expenses.other !== undefined ? expenses.other : trip.expenses.other
      };
    }

    await trip.save();

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private (Managers and Admins)
router.delete('/:id', manager, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if trip belongs to user's company
    if (trip.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    // Free up truck and driver if trip was in progress
    if (trip.status === 'in-progress') {
      await Truck.findByIdAndUpdate(trip.truckId, { status: 'available' });
      await Driver.findByIdAndUpdate(trip.driverId, { status: 'available' });
    }

    // Delete associated finance records
    await Finance.deleteMany({ tripId: trip._id });

    await trip.remove();
    
    res.json({ message: 'Trip removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
