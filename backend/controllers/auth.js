// Add these functions to your existing auth controller file

const axios = require("axios");
const User = require("../db/schema/User");

// Handle Auth0 callback after authentication
const handleAuth0Callback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "authorization_code",
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: process.env.AUTH0_CALLBACK_URL,
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    // Get user info from Auth0
    const userInfoResponse = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const auth0UserInfo = userInfoResponse.data;
    const auth0Id = auth0UserInfo.sub;

    // Check if user with this Auth0 ID already exists
    let user = await User.findOne({ auth0Id });

    if (!user) {
      // Check if user with this email exists
      user = await User.findOne({ email: auth0UserInfo.email });

      if (user) {
        // Link existing user with Auth0
        user.auth0Id = auth0Id;
        await user.save();
      } else {
        // Create new user with Auth0 info
        user = new User({
          name: auth0UserInfo.name,
          email: auth0UserInfo.email,
          picture: auth0UserInfo.picture,
          auth0Id,
          // Generate a random secure password for users who authenticate through Auth0
          password: require("crypto").randomBytes(32).toString("hex"),
        });

        await user.save();
      }
    }

    // Generate our custom JWT
    const token = generateToken(user._id);

    // Set cookie with token
    setCookie(res, token);

    // Redirect to frontend with token
    return res.redirect(
      `${process.env.CLIENT_URL}/auth-success?token=${token}`
    );
  } catch (error) {
    console.error("Auth0 callback error:", error);
    res
      .status(500)
      .json({ message: "Server error during Auth0 authentication" });
  }
};

// Link existing account with Auth0
const linkAuth0Account = async (req, res) => {
  try {
    const { auth0Id } = req.body;

    if (!auth0Id) {
      return res.status(400).json({ message: "Auth0 ID is required" });
    }

    // Check if another user is already linked to this Auth0 ID
    const existingUser = await User.findOne({ auth0Id });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(400)
        .json({
          message: "This Auth0 account is already linked to another user",
        });
    }

    // Update user with Auth0 ID
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { auth0Id } },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (error) {
    console.error("Link Auth0 error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export the new functions along with your existing ones
module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  updateProfile,
  handleAuth0Callback,
  linkAuth0Account,
};
