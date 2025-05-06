
const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Please provide plate number'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please provide truck model']
  },
  status: {
    type: String,
    enum: ['available', 'on-trip', 'maintenance'],
    default: 'available'
  },
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastMaintenance: {
    type: Date,
    default: Date.now
  },
  capacity: {
    type: Number,
    default: 0
  },
  currentLocation: {
    lat: {
      type: Number,
      default: 0
    },
    lng: {
      type: Number,
      default: 0
    }
  },
  assignedDriverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
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
  monthlyExtraCosts: {
      loadingCosts: {
        type: Number,
        default: 0
      },
      challenge: {
        type: Number,
        default: 0
      },
      otherManagementFees: {
        type: Number,
        default: 0
      },
      otherFees: {
        type: Number,
        default: 0
      },
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Truck', TruckSchema);
