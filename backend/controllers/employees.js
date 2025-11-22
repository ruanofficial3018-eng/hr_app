const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.list = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.get = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if(!user) return res.status(404).json({message:'Not found'});
  res.json(user);
};

exports.create = async (req, res) => {
  const {name,email,password,role,baseSalary,otRate} = req.body;
  if(!name||!email||!password) return res.status(400).json({message:'Missing'});
  const exists = await User.findOne({email});
  if(exists) return res.status(400).json({message:'Email exists'});
  const hash = await bcrypt.hash(password,10);
  const user = await User.create({name,email,password:hash,role, baseSalary, otRate});
  res.json({message:'Created', id:user._id});
};

exports.update = async (req, res) => {
  const updates = {...req.body};
  if(updates.password){
    updates.password = await bcrypt.hash(updates.password,10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, updates, {new:true}).select('-password');
  res.json({message:'Updated', user});
};

exports.remove = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({message:'Deleted'});
};
