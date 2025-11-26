const express = require('express');
const router = express.Router();
const { authMiddleware, role } = require('../middleware/authMiddleware');
const EmployeeController = require('../controllers/employees');
const role = require("../middleware/roles");

router.get('/', authMiddleware, role('admin'), EmployeeController.list);
router.get('/:id', authMiddleware, EmployeeController.get);
router.post('/', authMiddleware, role('admin'), EmployeeController.create);
router.put('/:id', authMiddleware, role('admin'), EmployeeController.update);
router.delete('/:id', authMiddleware, role('admin'), EmployeeController.remove);

module.exports = router;
