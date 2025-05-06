
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  defaultCurrency: {
    type: String,
    default: 'USD'
  },
  language: {
    type: String,
    default: 'en'
  },
  notificationSettings: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  fuelUnit: {
    type: String,
    enum: ['gallon', 'liter'],
    default: 'liter'
  },
  distanceUnit: {
    type: String,
    enum: ['km', 'mile'],
    default: 'km'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', SettingsSchema);
