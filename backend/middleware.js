const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");

dotenv.config();

console.log("Auth0 Domain:", process.env.AUTH0_DOMAIN);
console.log("Auth0 Audience:", process.env.AUTH0_AUDIENCE);

const checkJwt = jwt({
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

// Error handling middleware for JWT validation
const handleJwtErrors = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.error("JWT validation error:", err.message);
    return res
      .status(401)
      .json({ message: "Invalid token", details: err.message });
  }
  next(err);
};

module.exports = { checkJwt, handleJwtErrors };
