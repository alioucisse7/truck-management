
const express = require('express');
const { check, validationResult } = require('express-validator');
const Invoice = require('../models/Invoice');
const Trip = require('../models/Trip');
const { protect, manager } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and need authentication
router.use(protect);

// Helper function to format invoice data
const formatInvoiceData = (invoice) => {
  const invoiceObj = invoice.toObject();
  invoiceObj.id = invoiceObj._id;
  delete invoiceObj._id;
  return invoiceObj;
};

// @route   GET /api/invoices
// @desc    Get all invoices for company
// @access  Private
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find({ companyId: req.user.companyId })
      .sort({ createdAt: -1 });
    
    // Map through and format each invoice
    const formattedInvoices = invoices.map(formatInvoiceData);
    
    res.json(formattedInvoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/invoices/generate-from-trips
// @desc    Generate invoice data from trips for a specific period
// @access  Private
router.get('/generate-from-trips', async (req, res) => {
  try {
    const { startDate, endDate, clientName } = req.query;
    if (!startDate || !endDate || !clientName) {
      return res.status(400).json({ message: 'Start date, end date and client name are required' });
    }
    
    // Find completed trips within the date range
    const trips = await Trip.find({
      companyId: req.user.companyId,
      status: 'completed',
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) }
    })
    .populate('truckId', 'plateNumber model')
    .populate('driverId', 'name');
    
    if (trips.length === 0) {
      return res.status(404).json({ message: 'No completed trips found for the selected period' });
    }
    
    // Generate invoice items from trips
    const invoiceItems = trips.map(trip => {
      const tripObj = trip.toObject();
      tripObj.id = tripObj._id;
      delete tripObj._id;
      
      return {
        tripId: trip._id,
        description: `Transport service from ${trip.startLocation} to ${trip.destination}`,
        quantity: 1,
        unitPrice: trip.amountET || 0,
        amount: trip.amountET || 0
      };
    });
    
    // Calculate totals
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    
    res.json({
      clientName,
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Due in 30 days
      items: invoiceItems,
      subtotal,
      trips
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate({
        path: 'items.tripId',
        select: 'startLocation destination startDate endDate'
      });
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Ensure invoice belongs to user's company
    if (invoice.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this invoice' });
    }

    // Format the invoice before sending
    const formattedInvoice = formatInvoiceData(invoice);

    res.json(formattedInvoice);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate invoice number
const generateInvoiceNumber = async (companyId) => {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  
  // Find the highest invoice number for this company and year
  const lastInvoice = await Invoice.findOne({
    companyId,
    invoiceNumber: { $regex: `^${prefix}` }
  }).sort({ invoiceNumber: -1 });
  
  let nextNumber = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1], 10);
    nextNumber = lastNumber + 1;
  }
  
  // Format with leading zeros (e.g., 2023-0001)
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
};

// @route   POST /api/invoices
// @desc    Create an invoice
// @access  Private (Managers and Admins)
router.post(
  '/',
  [
    manager,
    [
      check('clientName', 'Client name is required').not().isEmpty(),
      check('dueDate', 'Due date is required').not().isEmpty(),
      check('items', 'At least one item is required').isArray({ min: 1 })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        clientName,
        clientAddress,
        clientEmail,
        issueDate = new Date(),
        dueDate,
        items,
        taxRate = 0,
        notes
      } = req.body;

      // Calculate subtotal
      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = (subtotal * taxRate) / 100;
      const totalAmount = subtotal + taxAmount;

      // Generate unique invoice number
      const invoiceNumber = await generateInvoiceNumber(req.user.companyId);

      const invoiceData = {
        companyId: req.user.companyId,
        invoiceNumber,
        clientName,
        clientAddress,
        clientEmail,
        issueDate,
        dueDate,
        items,
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        notes,
        status: 'draft'
      };

      const invoice = new Invoice(invoiceData);
      await invoice.save();

      // Format the invoice before sending
      const formattedInvoice = formatInvoiceData(invoice);

      res.status(201).json(formattedInvoice);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/invoices/:id
// @desc    Update an invoice
// @access  Private (Managers and Admins)
router.put('/:id', manager, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if invoice belongs to user's company
    if (invoice.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this invoice' });
    }

    const {
      clientName,
      clientAddress,
      clientEmail,
      issueDate,
      dueDate,
      items,
      taxRate,
      notes,
      status
    } = req.body;

    // Update fields if provided
    if (clientName) invoice.clientName = clientName;
    if (clientAddress !== undefined) invoice.clientAddress = clientAddress;
    if (clientEmail !== undefined) invoice.clientEmail = clientEmail;
    if (issueDate) invoice.issueDate = issueDate;
    if (dueDate) invoice.dueDate = dueDate;
    if (items) {
      invoice.items = items;
      invoice.subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    }
    if (taxRate !== undefined) {
      invoice.taxRate = taxRate;
      invoice.taxAmount = (invoice.subtotal * taxRate) / 100;
    }
    invoice.totalAmount = invoice.subtotal + invoice.taxAmount;
    if (notes !== undefined) invoice.notes = notes;
    if (status) invoice.status = status;

    await invoice.save();

    // Format the invoice before sending
    const formattedInvoice = formatInvoiceData(invoice);

    res.json(formattedInvoice);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete an invoice
// @access  Private (Managers and Admins)
router.delete('/:id', manager, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Check if invoice belongs to user's company
    if (invoice.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this invoice' });
    }

    await Invoice.findByIdAndDelete(req.params.id)
    
    res.json({ message: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
