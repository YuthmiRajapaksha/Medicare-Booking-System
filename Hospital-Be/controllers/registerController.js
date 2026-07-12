

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

//user register
exports.registerUser = async (req, res) => {
  const {
    country,
    phone,
    email,
    title,
    firstName,
    lastName,
    idType,
    nicOrPassport,
    password,
  } = req.body;

  try {

     let finalNIC = nicOrPassport.trim();

    if (idType === "NIC") {
      if (/^\d{9}$/.test(finalNIC)) {
        finalNIC += "V";
      }
      finalNIC = finalNIC.toUpperCase();
    }
   
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ? OR nic_or_passport = ?",
      [email, nicOrPassport]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email or NIC/Passport already exists" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    await db.query(
      `INSERT INTO users 
       (country, phone, email, title, first_name, last_name, id_type, nic_or_passport, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [country, phone, email, title, firstName, lastName, idType, nicOrPassport, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};




//user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      JWT_SECRET,
      { expiresIn: 300 }
    );

    const decoded = jwt.decode(token);
console.log("Token issued at:", new Date(decoded.iat * 1000));
console.log("Token expires at:", new Date(decoded.exp * 1000));
console.log("Expires in seconds:", decoded.exp - decoded.iat);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

