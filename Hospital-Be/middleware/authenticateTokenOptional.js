const jwt = require("jsonwebtoken");

const authenticateTokenOptional = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;   // 👈 guest user
    return next();     // 🔥 allow request
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null; // 👈 invalid token → treat as guest
    } else {
      req.user = decoded; // 👈 logged user
    }
    next();
  });
};

module.exports = authenticateTokenOptional;