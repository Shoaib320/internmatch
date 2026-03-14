const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const {
  createCompanyProfile,
  getCompanyDashboard,
  getCompanyProfile,
  updateCompanyProfile,
} = require("../controllers/companyController");

const router = express.Router();

router.post("/profile", protectRoute, createCompanyProfile);
router.get("/profile/:userId", protectRoute, getCompanyProfile);
router.put("/profile/:userId", protectRoute, updateCompanyProfile);
router.get("/dashboard/:userId", protectRoute, getCompanyDashboard);

module.exports = router;
