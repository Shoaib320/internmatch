const express = require("express");

const { getCurrentUser, login, signup } = require("../controllers/authController");
const protectRoute = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protectRoute, getCurrentUser);

module.exports = router;
