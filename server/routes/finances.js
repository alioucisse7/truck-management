
const express = require('express');
const { check, validationResult } = require('express-validator');
const Finance = require('../models/Finance');
const { protect, manager } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/finances
// @desc    Get all finances for company with filtering
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Extract query parameters
    const { type, startDate, endDate, category } = req.query;
    
    // Build query filter
    const filter = { companyId: req.user.companyId };
    
    if (type) {
      filter.type = type;
    }
    
    if (category) {
      filter.category = category;
    }
    
    // Date range filtering
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    
    const finances = await Finance.find(filter)
      .populate('tripId', 'startLocation destination')
      .populate('truckId', 'plateNumber model')
      .populate('driverId', 'name')
      .sort({ date: -1 });
    
    res.json(finances);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/finances/summary
// @desc    Get financial summary for company (total income, expenses, profit)
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    // Extract query parameters for date range
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }
    
    // Query for total income
    const incomeQuery = { 
      companyId: req.user.companyId,
      type: 'income'
    };
    
    if (startDate || endDate) {
      incomeQuery.date = dateFilter;
    }
    
    const incomeResult = await Finance.aggregate([
      { $match: incomeQuery },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Query for total expenses
    const expenseQuery = { 
      companyId: req.user.companyId,
      type: 'expense',
      category: { $ne: "fuel"}
    };
    
    if (startDate || endDate) {
      expenseQuery.date = dateFilter;
    }
    
    const expenseResult = await Finance.aggregate([
      { $match: expenseQuery },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Calculate totals
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
    const profit = totalIncome - totalExpense;
    
    res.json({
      income: totalIncome,
      expenses: totalExpense,
      profit: profit
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/finances/categories
// @desc    Get finance summary by categories
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const { type } = req.query;
    
    // Build query filter
    const filter = { 
      companyId: req.user.companyId
    };
    
    if (type) {
      filter.type = type;
    }
    
    const categorySummary = await Finance.aggregate([
      { $match: filter },
      { $group: { 
        _id: { type: "$type", category: "$category" }, 
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }},
      { $sort: { "_id.type": 1, "total": -1 } }
    ]);
    
    res.json(categorySummary);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/finances
// @desc    Create a finance record
// @access  Private (Managers and Admins)
router.post(
  '/',
  [
    manager,
    [
      check('type', 'Type is required (income or expense)').isIn(['income', 'expense']),
      check('category', 'Category is required').not().isEmpty(),
      check('amount', 'Amount is required and must be a number').isNumeric(),
      check('date', 'Date is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        type, 
        category, 
        amount,
        date,
        description = '',
        tripId = null,
        truckId = null,
        driverId = null
      } = req.body;

      const financeData = {
        type,
        category,
        amount,
        date,
        description,
        tripId,
        truckId,
        driverId,
        companyId: req.user.companyId
      };

      const finance = new Finance(financeData);
      await finance.save();

      res.status(201).json(finance);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/finances/:id
// @desc    Update a finance record
// @access  Private (Managers and Admins)
router.put('/:id', manager, async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }

    // Check if finance record belongs to user's company
    if (finance.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this finance record' });
    }

    const {
      type,
      category,
      amount,
      date,
      description,
      tripId,
      truckId,
      driverId
    } = req.body;

    if (type) finance.type = type;
    if (category) finance.category = category;
    if (amount !== undefined) finance.amount = amount;
    if (date) finance.date = date;
    if (description !== undefined) finance.description = description;
    if (tripId !== undefined) finance.tripId = tripId;
    if (truckId !== undefined) finance.truckId = truckId;
    if (driverId !== undefined) finance.driverId = driverId;

    await finance.save();

    res.json(finance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/finances/:id
// @desc    Delete a finance record
// @access  Private (Managers and Admins)
router.delete('/:id', manager, async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }

    // Check if finance record belongs to user's company
    if (finance.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this finance record' });
    }

    await finance.remove();
    
    res.json({ message: 'Finance record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
