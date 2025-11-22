const express = require('express');
const router = express.Router();
const { authMiddleware, role } = require('../middleware/authMiddleware');
const AttendanceController = require('../controllers/attendance');

router.post('/punch', authMiddleware, AttendanceController.punch);
router.get('/me/today', authMiddleware, AttendanceController.myToday);
router.get('/user/:id', authMiddleware, role('admin'), AttendanceController.forUser);
router.get('/report/csv', authMiddleware, role('admin'), AttendanceController.exportCsv);

module.exports = router;
