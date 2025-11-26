// backend/controllers/attendance.js

const Attendance = require("../models/Attendance");

// 👉 Punch In
exports.punchIn = async (req, res) => {
  try {
    const userId = req.user.id;

    const already = await Attendance.findOne({
      userId,
      date: new Date().toDateString()
    });

    if (already && already.punchIn)
      return res.status(400).json({ message: "Already punched in today" });

    const record = await Attendance.create({
      userId,
      date: new Date().toDateString(),
      punchIn: new Date(),
    });

    res.json({ message: "Punch In successful", record });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// 👉 Punch Out
exports.punchOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const record = await Attendance.findOne({
      userId,
      date: new Date().toDateString(),
    });

    if (!record) return res.status(404).json({ message: "Punch-in not found" });
    if (record.punchOut)
      return res.status(400).json({ message: "Already punched out" });

    record.punchOut = new Date();
    await record.save();

    res.json({ message: "Punch Out successful", record });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// 👉 Get Today Attendance
exports.today = async (req, res) => {
  try {
    const userId = req.user.id;

    const record = await Attendance.findOne({
      userId,
      date: new Date().toDateString(),
    });

    res.json(record || {});
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// 👉 Get Monthly Attendance
exports.month = async (req, res) => {
  try {
    const userId = req.user.id;
    const month = req.query.month; // "2025-02"

    const start = new Date(`${month}-01`);
    const end = new Date(`${month}-31`);

    const records = await Attendance.find({
      userId,
      punchIn: { $gte: start, $lte: end }
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
