const mongoose = require("mongoose");

const SuspiciousLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: { type: String, required: true },
  lat: { type: Number },
  lon: { type: Number },
  accuracy: { type: Number },
  distanceMoved: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SuspiciousLog", SuspiciousLogSchema);
