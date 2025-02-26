const express = require("express");
const router = express.Router();
const { authenticate, auth0Authenticate } = require("../middleware/auth0");
const {
  registerValidation,
  loginValidation,
  profileUpdateValidation,
} = require("../validators/auth");
const {
  register,
  login,
  getCurrentUser,
  logout,
  updateProfile,
  handleAuth0Callback,
  linkAuth0Account,
} = require("../controllers/auth");

// Standard auth routes
// Register a new user
router.post("/register", registerValidation, register);

// Login user
router.post("/login", loginValidation, login);

// Get current user
router.get("/me", authenticate, getCurrentUser);

// Logout
router.post("/logout", logout);

// Update user profile
router.put("/profile", authenticate, profileUpdateValidation, updateProfile);

// On your backend
app.post('/api/auth/link-auth0', authenticateJWT, async (req, res) => {
  try {
    const { auth0Id } = req.body;
    const userId = req.user.id;
    
    // Update user record with Auth0 ID
    await User.findByIdAndUpdate(userId, { auth0Id });
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
