
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

// Middleware to check if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

// Middleware to check if user is manager or admin
exports.manager = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Manager role required.' });
  }
};

// Middleware to ensure user only accesses their company data
exports.companyAccess = async (req, res, next) => {
  try {
    // If it's a parameterized route with companyId
    if (req.params.companyId && req.user.companyId.toString() !== req.params.companyId) {
      return res.status(403).json({ message: 'Not authorized to access this company data' });
    }
    
    // For requests with company data in body
    if (req.body.companyId && req.user.companyId.toString() !== req.body.companyId) {
      return res.status(403).json({ message: 'Not authorized to modify this company data' });
    }
    
    next();
  } catch (error) {
    console.error('Company access middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
