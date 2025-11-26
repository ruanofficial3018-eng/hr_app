// backend/controllers/employees.js

const User = require("../models/User");

// 👉 Get all employees
exports.list = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 👉 Create employee
exports.create = async (req, res) => {
  try {
    const { name, email, password, baseSalary, otRate } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash(password, 10);

    const employee = await User.create({
      name,
      email,
      password: hash,
      role: "employee",
      baseSalary: baseSalary || 0,
      otRate: otRate || 0
    });

    res.status(201).json({ message: "Employee created", employee });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 👉 Get single employee
exports.getOne = async (req, res) => {
  try {
    const emp = await User.findById(req.params.id).select("-password");
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 👉 Update employee
exports.update = async (req, res) => {
  try {
    const emp = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select("-password");

    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee updated", emp });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 👉 Delete employee
exports.remove = async (req, res) => {
  try {
    const emp = await User.findByIdAndDelete(req.params.id);

    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
