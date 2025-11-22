const express = require('express');
const router = express.Router();
const { authMiddleware, role } = require('../middleware/auth');
const SalaryController = require('../controllers/salary');

router.post('/calculate/:userId', authMiddleware, role('admin'), SalaryController.calculateForUser);
router.get('/me/history', authMiddleware, SalaryController.myHistory);
router.get('/user/:id', authMiddleware, role('admin'), SalaryController.forUser);

module.exports = router;
