
const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide driver name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  license: {
    type: String,
    required: [true, 'Please provide license number']
  },
  experience: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'on-trip', 'off-duty'],
    default: 'available'
  },
  avatar: {
    type: String,
    default: ''
  },
  salary: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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

module.exports = mongoose.model('Driver', DriverSchema);
