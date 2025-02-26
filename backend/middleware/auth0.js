// middleware/auth0.js
const jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const User = require("../db/schema/User");

// Auth0 authentication middleware using express-jwt
const auth0Authenticate = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

// Combined authentication middleware that works with both custom JWT and Auth0
const authenticate = async (req, res, next) => {
  // Try to get token from Authorization header (Bearer token)
  const bearerToken = req.headers.authorization?.split(" ")[1];

  // Try to get token from cookies
  const cookieToken = req.cookies.token;

  // If no token in either place, unauthorized
  if (!bearerToken && !cookieToken) {
    return res
      .status(401)
      .json({ message: "No authentication token, access denied" });
  }

  const token = bearerToken || cookieToken;

  try {
    // First try to verify as our custom JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token, user not found" });
    }

    req.user = user;
    return next();
  } catch (customJwtError) {
    // If custom JWT verification fails, try Auth0
    auth0Authenticate(req, res, async (auth0Error) => {
      if (auth0Error) {
        return res
          .status(401)
          .json({
            message: "Authentication failed",
            error: auth0Error.message,
          });
      }

      try {
        // At this point, req.auth contains Auth0 user info (from express-jwt)
        const auth0Id = req.auth.sub;

        // Try to find user with this Auth0 ID
        const user = await User.findOne({ auth0Id });

        if (!user) {
          return res.status(401).json({
            message: "Auth0 account not linked to any user in our system",
            auth0Id,
          });
        }

        // Replace Auth0 user info with our user model
        req.user = user;
        next();
      } catch (err) {
        return res
          .status(401)
          .json({
            message: "Server error during authentication",
            error: err.message,
          });
      }
    });
  }
};

module.exports = {
  authenticate,
  auth0Authenticate,
};
