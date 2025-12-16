const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {};

auth.verify = async (req,res,next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'No token'});
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(payload.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({error: 'Invalid token'});
  }
};

auth.role = (roles=[]) => (req,res,next) => {
  if (!req.user) return res.status(401).json({error:'Not authorized'});
  if (!Array.isArray(roles)) roles = [roles];
  if (!roles.includes(req.user.role)) return res.status(403).json({error:'Forbidden'});
  next();
};

module.exports = auth;
