const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const {
  createResume,
  getResume,
  updateResume,
} = require("../controllers/resumeController");

const router = express.Router();

router.post("/", protectRoute, createResume);
router.get("/:studentId", protectRoute, getResume);
router.put("/:studentId", protectRoute, updateResume);

module.exports = router;
