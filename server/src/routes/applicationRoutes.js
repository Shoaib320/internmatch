const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const {
  createApplication,
  getCompanyApplications,
  getStudentApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protectRoute, createApplication);
router.get("/student/:studentId", protectRoute, getStudentApplications);
router.get("/company/:companyId", protectRoute, getCompanyApplications);
router.put("/:id/status", protectRoute, updateApplicationStatus);

module.exports = router;
