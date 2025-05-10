
const express = require('express');
const Trip = require('../models/Trip');
const Truck = require('../models/Truck');
const Driver = require('../models/Driver');
const Finance = require('../models/Finance');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // Get counts
    const activeTrucks = await Truck.countDocuments({ 
      companyId: req.user.companyId,
      status: 'available'
    });

    const availableDrivers = await Driver.countDocuments({ 
      companyId: req.user.companyId,
      status: 'available'
    });
    
    const ongoingTrips = await Trip.countDocuments({ 
      companyId: req.user.companyId,
      status: 'in-progress'
    });
    
    // Calculate revenue (all time)
    const revenueResult = await Finance.aggregate([
      { 
        $match: { 
          companyId: req.user.companyId,
          type: 'income'
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Calculate expenses (all time)
    const expensesResult = await Finance.aggregate([
      { 
        $match: { 
          companyId: req.user.companyId,
          type: 'expense',
          category: { $nin: ["fuel", "Management Fees"]}
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    // Calculate fuel expenses (all time)
    const fuelExpenses = await Finance.aggregate([
      { 
        $match: { 
          companyId: req.user.companyId,
          type: 'expense',
          category: 'fuel'
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
       
    // Calculate fuel expenses (all time)
    const ManagementFeesExpenses = await Finance.aggregate([
      { 
        $match: { 
          companyId: req.user.companyId,
          type: 'expense',
          category: 'Management Fees'
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Calculate totals
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;
    const fuelConsumption = fuelExpenses.length > 0 ? fuelExpenses[0].total : 0;
    const ManagementFees = ManagementFeesExpenses.length > 0 ? ManagementFeesExpenses[0].total : 0;
    
    res.json({
      activeTrucks,
      availableDrivers,
      ongoingTrips,
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      managementFees: ManagementFees,
      fuelConsumption
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/recent-trips
// @desc    Get recent trips
// @access  Private
router.get('/recent-trips', async (req, res) => {
  try {
    const trips = await Trip.find({ companyId: req.user.companyId })
      .populate('truckId', 'plateNumber')
      .populate('driverId', 'name')
      .sort({ startDate: -1 })
      .limit(5);
    
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/revenue-overview
// @desc    Get monthly revenue overview
// @access  Private
router.get('/revenue-overview', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();
    
    // Get monthly revenue data
    const monthlyRevenue = await Finance.aggregate([
      {
        $match: {
          companyId: req.user.companyId,
          type: 'income',
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get monthly expense data
    const monthlyExpenses = await Finance.aggregate([
      {
        $match: {
          companyId: req.user.companyId,
          type: 'expense',
          category: { $nin: ["fuel", "Management Fees"] },
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format data for chart
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const chartData = months.map((month, index) => {
      const monthNum = index + 1;
      const revenueItem = monthlyRevenue.find(item => item._id === monthNum);
      const expenseItem = monthlyExpenses.find(item => item._id === monthNum);
      
      const revenue = revenueItem ? revenueItem.total : 0;
      const expense = expenseItem ? expenseItem.total : 0;
      
      return {
        name: month,
        revenue,
        expense,
        profit: revenue - expense
      };
    });
    
    res.json(chartData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/dashboard/fuel-data
// @desc    Get fuel level data for trucks
// @access  Private
router.get('/fuel-data', async (req, res) => {
  try {
    const trucks = await Truck.find({ 
      companyId: req.user.companyId 
    }).select('plateNumber fuelLevel');
    
    res.json(trucks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
