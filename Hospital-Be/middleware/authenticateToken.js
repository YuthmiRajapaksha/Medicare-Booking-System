

// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
    
//     req.user = null; 
//     return next();
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: "Forbidden: Invalid token" });
//     req.user = user; 
//     next();
//   });
// };

// module.exports = authenticateToken;


// Example middleware
// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
    
//     req.user = decoded; // decoded should contain userId and other info
//     next();
//   });
// };
// module.exports = authenticateToken;



//working code
// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });

//     req.user = user; // 👈 THIS MUST contain id
//     next();
//   });
// };

// module.exports = authenticateToken;



const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).json({ message: "No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT Error:", err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();
  });
};

module.exports = authenticateToken;


