// routes/userRoutes.js
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../db/schema/User");
const { checkJwt } = require("../middlewar");
const router = express.Router();

// Custom middleware to verify local JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to handle both Auth0 and local JWT authentication
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // If token starts with 'auth0|', use Auth0 verification
  if (authHeader.includes("auth0|")) {
    checkJwt(req, res, next);
  } else {
    verifyToken(req, res, next);
  }
};

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    // For Auth0 users
    if (req.user.sub) {
      const user = await User.findOne({ auth0Id: req.user.sub }).select(
        "-password"
      );
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ user });
    }

    // For local JWT users
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put(
  "/profile",
  authenticate,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Valid email is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.picture) updateData.picture = req.body.picture;

      let userId;

      // For Auth0 users
      if (req.user.sub) {
        const user = await User.findOne({ auth0Id: req.user.sub });
        if (!user) return res.status(404).json({ message: "User not found" });
        userId = user._id;
      } else {
        // For local JWT users
        userId = req.user.userId;
      }

      // Update user
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ user });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
