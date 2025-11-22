const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User');

function authMiddleware(req, res, next){
  const header = req.headers['authorization'];
  if(!header) return res.status(401).json({message:'No token provided'});
  const token = header.split(' ')[1];
  if(!token) return res.status(401).json({message:'Invalid token format'});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err){
    return res.status(401).json({message:'Invalid token'});
  }
}

function role(requiredRole){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({message:'Not authenticated'});
    if(req.user.role !== requiredRole) return res.status(403).json({message:'Forbidden'});
    next();
  };
}

module.exports = { authMiddleware, role };
