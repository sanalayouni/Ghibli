const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validateRegister, validateLogin } = require("../middlewares/validation.middleware");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");

// Register
router.post("/register", validateRegister,authController.register);
// Login
router.post("/login", validateLogin,authController.login);

module.exports = router;