// backend/routes/employees.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware"); // ✅ correct filename
const role = require("../middleware/roles");                    // ✅ only one import

const EmployeeController = require("../controllers/employees");

// 🔹 Get all employees (Admin only)
router.get(
  "/",
  authMiddleware,
  role("admin"),
  EmployeeController.list
);

// 🔹 Create new employee
router.post(
  "/",
  authMiddleware,
  role("admin"),
  EmployeeController.create
);

// 🔹 Get single employee by ID
router.get(
  "/:id",
  authMiddleware,
  role("admin"),
  EmployeeController.getOne
);

// 🔹 Update employee
router.put(
  "/:id",
  authMiddleware,
  role("admin"),
  EmployeeController.update
);

// 🔹 Delete employee
router.delete(
  "/:id",
  authMiddleware,
  role("admin"),
  EmployeeController.remove
);

module.exports = router;
