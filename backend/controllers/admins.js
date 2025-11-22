
// backend/controllers/admins.js
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const SalaryRecord = require('../models/SalaryRecord');
const bcrypt = require('bcrypt');

// List all users (admin only)
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user (admin can create admin or employee)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, baseSalary, otRate } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || 'employee', baseSalary: baseSalary||0, otRate: otRate||0 });
    res.json({ message: 'User created', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (admin)
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json({ message: 'Updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // optionally: delete attendance & salary records
    await Attendance.deleteMany({ user: req.params.id });
    await SalaryRecord.deleteMany({ user: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset user password (admin)
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });
    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hash });
    res.json({ message: 'Password reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Promote / demote user role
exports.setRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin','employee'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ message: 'Role updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard stats (quick overview)
exports.stats = async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    // current month attendance count
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const attendanceCount = await Attendance.countDocuments({ timestamp: { $gte: startOfMonth } });
    // recent salary records count
    const salaryCount = await SalaryRecord.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({
      totalEmployees,
      totalAdmins,
      attendanceCount,
      salaryCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
