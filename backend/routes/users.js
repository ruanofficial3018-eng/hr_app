// backend/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { requireRole, requireAny } = require('../middleware/roles');

// Public: get own profile
router.get('/me', auth, async (req, res) => {
  const User = require('../models/User');
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin / HR: create user
router.post('/', auth, requireAny(['admin','hr']), userController.createUser);

// Admin/HR/Manager: list users
router.get('/', auth, requireAny(['admin','hr','manager']), userController.listUsers);

// Get specific user
router.get('/:id', auth, requireAny(['admin','hr','manager']), userController.getUser);

// Update user
router.put('/:id', auth, requireAny(['admin','hr','manager']), userController.updateUser);

// Delete user
router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);

// Reset password
router.post('/:id/reset', auth, requireAny(['admin','hr']), userController.resetPassword);

// Toggle active/suspend/resign
router.post('/:id/toggle', auth, requireAny(['admin','hr']), userController.toggleActive);

module.exports = router;
