// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Create user (admin only)
 * body: { name, email, password, phone, department, designation, role, baseSalary, otRate }
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, department, designation, role, baseSalary, otRate, employeeId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash, phone, department, designation, role: role || 'employee',
      baseSalary: baseSalary || 0, otRate: otRate || 0, employeeId: employeeId || ''
    });

    res.status(201).json({ message: 'User created', user: user.toJSON() });
  } catch (err) {
    console.error('createUser', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('listUsers', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error('getUser', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const allowed = ['name','phone','department','designation','role','status','baseSalary','otRate','employeeId','personal'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Updated', user });
  } catch (err) {
    console.error('updateUser', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteUser', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // generate temporary password and send in response (you should email in production)
    const temp = crypto.randomBytes(4).toString('hex');
    const hash = await bcrypt.hash(temp, 10);
    const user = await User.findByIdAndUpdate(req.params.id, { password: hash });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Password reset', tempPassword: temp });
  } catch (err) {
    console.error('resetPassword', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const { action } = req.body; // 'activate' | 'deactivate' | 'suspend' | 'resign'
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    if (action === 'activate') user.status = 'active';
    else if (action === 'resign') user.status = 'resigned';
    else if (action === 'suspend') user.status = 'suspended';

    await user.save();
    res.json({ message: 'Status updated', status: user.status });
  } catch (err) {
    console.error('toggleActive', err);
    res.status(500).json({ message: 'Server error' });
  }
};
