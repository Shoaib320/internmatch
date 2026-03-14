const express = require("express");

const protectRoute = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const {
  deleteCompany,
  deleteInternship,
  deleteUser,
  getAdminDashboard,
  getCompanies,
  getInternships,
  getUsers,
} = require("../controllers/adminController");

const router = express.Router();

router.use(protectRoute);
router.use(allowRoles("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/users", getUsers);
router.get("/companies", getCompanies);
router.get("/internships", getInternships);
router.delete("/users/:id", deleteUser);
router.delete("/companies/:id", deleteCompany);
router.delete("/internships/:id", deleteInternship);

module.exports = router;
