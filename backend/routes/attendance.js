const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const Attendance = require("../controllers/attendance");

router.post("/punch-in", auth, Attendance.punchIn);
router.post("/punch-out", auth, Attendance.punchOut);
router.get("/today", auth, Attendance.today);
router.get("/month", auth, Attendance.month);

module.exports = router;
