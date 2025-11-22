const express = require("express");
const router = express.Router();
const SuspiciousLog = require("../models/SuspiciousLog");
const auth = require("../middleware/authMiddleware");

// Save suspicious activity
router.post("/suspicious", auth, async (req, res) => {
  const { reason, lat, lon, accuracy, distanceMoved } = req.body;

  await SuspiciousLog.create({
    userId: req.user.id,
    reason,
    lat,
    lon,
    accuracy,
    distanceMoved
  });

  res.json({ message: "Suspicious activity logged" });
});

module.exports = router;
