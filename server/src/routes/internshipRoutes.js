const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const {
  createInternship,
  deleteInternship,
  getCompanyInternships,
  getInternshipById,
  getInternships,
  updateInternship,
} = require("../controllers/internshipController");

const router = express.Router();

router.post("/", protectRoute, createInternship);
router.get("/", getInternships);
router.get("/company/:companyId", getCompanyInternships);
router.get("/:id", getInternshipById);
router.put("/:id", protectRoute, updateInternship);
router.delete("/:id", protectRoute, deleteInternship);

module.exports = router;
