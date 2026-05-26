const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { body, } = require("express-validator");

// Register
router.post(
  "/register",

  [
    body("username")
      .notEmpty()
      .withMessage(
        "Username is required"
      ),

    body("email")
      .isEmail()
      .withMessage(
        "Valid email required"
      ),

    body("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password must be at least 6 characters"
      ),
  ],

  registerUser
);

// Login
router.post(
  "/login",

  [
    body("email")
      .isEmail()
      .withMessage(
        "Valid email required"
      ),

    body("password")
      .notEmpty()
      .withMessage(
        "Password is required"
      ),
  ],

  loginUser
);

// Protected Route
router.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;