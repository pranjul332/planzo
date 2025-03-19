// middleware/authMiddleware.js
const { auth } = require("express-oauth2-jwt-bearer");
const dotenv = require("dotenv");

dotenv.config();

// This is the standard JWT verification middleware
const checkJwt = auth({
  audience: "https://myapi.com", // Replace with your actual API audience
  issuerBaseURL: "https://dev-o12o1p7fhpbr5soe.us.auth0.com/",
  tokenSigningAlg: "RS256",
});


const authMiddleware = (req, res, next) => {
//   console.log("Auth headers:", req.headers.authorization);

  // Debugging environment variables
//   console.log("Auth0 Domain:", process.env.AUTH0_DOMAIN);
//   console.log("Auth0 Audience:", process.env.AUTH0_AUDIENCE);

  // Apply the JWT check
  checkJwt(req, res, (err) => {
    if (err) {
      console.error("Auth error:", err);
      return res
        .status(401)
        .json({ message: "Unauthorized", error: err.message });
    }

    // console.log("Auth object:", req.auth);

    if (!req.auth) {
      console.error("req.auth is undefined or null");
      return res
        .status(401)
        .json({ message: "Invalid token structure - auth object missing" });
    }

    if (!req.auth.payload.sub) {
      console.error("req.auth.sub is missing, full auth object:", req.auth);
      return res
        .status(401)
        .json({ message: "Invalid token structure - sub claim missing" });
    }
    // console.log(req.auth.payload);
    
    // Set user ID from the 'sub' claim
    req.userId = req.auth.payload.sub;
    // console.log("User ID set to:", req.userId); 

    next();
  });
};
module.exports = authMiddleware;
