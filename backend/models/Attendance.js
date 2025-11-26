const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  punchIn: { type: Date },
  punchOut: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
