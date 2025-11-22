// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admins');
const { authMiddleware, role } = require('../middleware/authMiddleware');

// All routes below require auth & admin
router.get('/users', authMiddleware, role('admin'), adminCtrl.listUsers);
router.get('/users/:id', authMiddleware, role('admin'), adminCtrl.getUser);
router.post('/users', authMiddleware, role('admin'), adminCtrl.createUser);
router.put('/users/:id', authMiddleware, role('admin'), adminCtrl.updateUser);
router.delete('/users/:id', authMiddleware, role('admin'), adminCtrl.deleteUser);

router.post('/users/:id/reset-password', authMiddleware, role('admin'), adminCtrl.resetPassword);
router.post('/users/:id/role', authMiddleware, role('admin'), adminCtrl.setRole);

router.get('/stats', authMiddleware, role('admin'), adminCtrl.stats);

module.exports = router;
