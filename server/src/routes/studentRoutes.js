const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const {
  createStudentProfile,
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/profile", protectRoute, createStudentProfile);
router.get("/profile/:userId", protectRoute, getStudentProfile);
router.put("/profile/:userId", protectRoute, updateStudentProfile);
router.get("/dashboard/:userId", protectRoute, getStudentDashboard);

module.exports = router;
