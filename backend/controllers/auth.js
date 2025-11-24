const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Register route (admin only in practice; here available to seed users)
router.post('/register', async (req, res) => {
  try{
    const { name, email, password, role } = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({message:'Email already registered'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password:hash, role: role||'employee'});
    res.json({message:'User created', userId:user._id});
  } catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

router.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({message:'Invalid credentials'});
    const payload = {id:user._id, role:user.role, name:user.name, email:user.email};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:'8h'});
    res.json({token, user:payload});
  } catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
});

module.exports = router;
