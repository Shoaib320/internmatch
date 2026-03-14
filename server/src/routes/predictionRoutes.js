const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const {
  getPredictionHistory,
  recommendInternships,
} = require("../controllers/predictionController");

const router = express.Router();

router.post("/recommend", protectRoute, recommendInternships);
router.get("/:studentId", protectRoute, getPredictionHistory);

module.exports = router;
