
const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  startLocation: {
    type: String,
    required: [true, 'Please provide a start location']
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    default: 0
  },
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  truckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: [true, 'Please assign a truck']
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'Please assign a driver']
  },
  distance: {
    type: Number,
    default: 0
  },
  fuelConsumed: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  expenses: {
    fuel: {
      type: Number,
      default: 0
    },
    tolls: {
      type: Number,
      default: 0
    },
    maintenance: {
      type: Number,
      default: 0
    },
    other: {
      type: Number,
      default: 0
    }
  },
  cargoType: {
    type: String,
    enum: ['fuel', 'diesel', 'mazout'],
    required: true
  },
  numBL: {
    type: Number,
    default: 0
  },
  equalization: {
    type: Number,
    default: 0
  },
  amountET: {
    type: Number,
    default: 0
  },
  mtqs:{
    type: Number,
    default: 0
  },
  mtqsLiters: {
    type: Number,
    default: 0
  },
  pricePerLiter: {
    type: Number,
    default: 0
  },
  missionFees: {
    type: Number,
    default: 0
  },
  managementFeesPercent: {
    type: Number,
    default: 0
  },
  observ: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);
