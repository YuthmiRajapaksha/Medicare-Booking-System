// const db = require("../config/db");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// //Dashboard
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password required" });
//   }

 
//   if (username === "admin" && password === "1234") {
//     const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     return res.json({ success: true, role: "admin", token, message: "Admin login successful" });
//   }

 
//   try {
//     const [rows] = await db.query("SELECT * FROM doctors WHERE userName = ?", [username]);
//     const doctor = rows[0];

    
//     if (!doctor) {
//   return res.status(401).json({ message: "Invalid credentials" });
// }

//     const isMatch = await bcrypt.compare(password, doctor.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: doctor.id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({
//       success: true,
//       role: "user",
//       token,
//       doctor: {
//         id: doctor.id,
//         name: doctor.name,
//         email: doctor.email,
//         specialization: doctor.specialization,
//         userName: doctor.userName,
//       },
//     });
//   } catch (err) {
//     console.error("Doctor/Admin login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// //user register
// exports.registerUser = async (req, res) => {
//   const { country, phone, email, title, firstName, lastName, idType, nicOrPassport, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password required" });
//   }

//   try {

//  let finalNIC = nicOrPassport.trim();

//     if (idType === "NIC") {
//       if (/^\d{9}$/.test(finalNIC)) {
//         finalNIC += "V";
//       }
//       finalNIC = finalNIC.toUpperCase();
//     }

//     const [existing] = await db.query(
//   "SELECT * FROM users WHERE email = ? OR nic_or_passport = ?",
//   [email, finalNIC]
// );

//     if (existing.length > 0) {
//       return res.status(400).json({ message: "Email or NIC/Passport already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       `INSERT INTO users (country, phone, email, title, first_name, last_name, id_type, nic_or_passport, password)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [country, phone, email, title, firstName, lastName, idType, nicOrPassport, hashedPassword]
//     );

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };




// //user login
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password required" });
//   }

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//     if (rows.length === 0) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const user = rows[0];
//     const isValid = await bcrypt.compare(password, user.password);

//     if (!isValid) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ id: user.id, role: "site_user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.first_name,
//         lastName: user.last_name,
//       },
//     });
//   } catch (err) {
//     console.error("User login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Doctor password change
// exports.changePassword = async (req, res) => {
//   console.log("req.user:", req.user);
//   if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//   const { currentPassword, newPassword } = req.body;
//   const doctorId = req.user.id;

//   try {
//     const [rows] = await db.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
//     const doctor = rows[0];

//     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//     const isMatch = await bcrypt.compare(currentPassword, doctor.password);
//     if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await db.query("UPDATE doctors SET password = ? WHERE id = ?", [hashedPassword, doctorId]);

//     res.json({ success: true, message: "Password changed successfully" });
//   } catch (err) {
//     console.error("Password change error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { transporter } = require("../utils/emailService");

// -------------------------------
// ADMIN + DOCTOR LOGIN
// -------------------------------
exports.doctorAdminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  // Admin login
  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ success: true, role: "admin", token });
  }

  try {
    const [rows] = await db.query("SELECT * FROM doctors WHERE userName = ?", [username]);
    const doctor = rows[0];

    if (!doctor) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: doctor.id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      success: true,
      role: "user",
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        userName: doctor.userName,
      },
    });
  } catch (err) {
    console.error("Doctor/Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------
// USER REGISTRATION
// -------------------------------
// exports.registerUser = async (req, res) => {
//   const { country, phone, email, title, firstName, lastName, idType, nicOrPassport, password } =
//     req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: "Email and password required" });

//   try {
//     let finalNIC = nicOrPassport.trim();

//     if (idType === "NIC") {
//       if (/^\d{9}$/.test(finalNIC)) finalNIC += "V";
//       finalNIC = finalNIC.toUpperCase();
//     }

//     const [existing] = await db.query(
//       "SELECT * FROM users WHERE email = ? OR nic_or_passport = ?",
//       [email, finalNIC]
//     );

//     if (existing.length > 0)
//       return res.status(400).json({ message: "Email or NIC/Passport already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await db.query(
//       `INSERT INTO users (country, phone, email, title, first_name, last_name, id_type, nic_or_passport, password)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [country, phone, email, title, firstName, lastName, idType, finalNIC, hashedPassword]
//     );

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.registerUser = async (req, res) => {
  const { country, phone, email, title, firstName, lastName, idType, nicOrPassport, password } =
    req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    let finalNIC = nicOrPassport.trim();

    if (idType === "NIC") {
      if (/^\d{9}$/.test(finalNIC)) finalNIC += "V";
      finalNIC = finalNIC.toUpperCase();
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ? OR nic_or_passport = ?",
      [email, finalNIC]
    );

    if (existing.length > 0)
      return res.status(400).json({ message: "Email or NIC/Passport already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (country, phone, email, title, first_name, last_name, id_type, nic_or_passport, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [country, phone, email, title, firstName, lastName, idType, finalNIC, hashedPassword]
    );


     // ✅ INSERT NOTIFICATION 🔥
    const fullName = `${title || ""} ${firstName} ${lastName}`.trim();

    await db.query(
      `INSERT INTO notifications (message, user_name, created_at)
       VALUES (?, ?, NOW())`,
      ["New patient registered", fullName]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    return res.json({ message: "Email available" });
  } catch (err) {
    console.error("Check email error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// -------------------------------
// USER LOGIN
// -------------------------------
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ message: "Email and password required" });

//   try {
//     const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//     if (rows.length === 0)
//       return res.status(401).json({ message: "Invalid email or password" });

//     const user = rows[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) return res.status(401).json({ message: "Invalid email or password" });

//     const token = jwt.sign({ id: user.id, role: "site_user" }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         email: user.email,
//         firstName: user.first_name,
//         lastName: user.last_name,
//       },
//     });
//   } catch (err) {
//     console.error("User login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ message: "Invalid email or password" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    // ✅ Include user ID in token
    const token = jwt.sign({ id: user.id, role: "site_user" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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
    console.error("User login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// -------------------------------
// DOCTOR PASSWORD CHANGE
// -------------------------------
exports.changePassword = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { currentPassword, newPassword } = req.body;
  const doctorId = req.user.id;

  try {
    const [rows] = await db.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
    const doctor = rows[0];

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE doctors SET password = ? WHERE id = ?", [
      hashedPassword,
      doctorId,
    ]);

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Store temporarily (shared in-memory store also used by routes/sendPin.js)
  global.otpStore = global.otpStore || {};
  global.otpStore[email] = otp;

  // Email template
  const mailOptions = {
    from: "noreply@medicare.com",
    to: email,
    subject: "Your OTP Code for Signup",
    html: `
      <div style="background:#f5f7fa;padding:20px;font-family:Arial">
        <div style="max-width:600px;background:#fff;padding:30px;margin:auto;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
          <h2 style="text-align:center;color:#0b5ed7">Your Verification Code</h2>

          <p>Hello,</p>
          <p>Your OTP for signup verification is:</p>

          <h1 style="text-align:center; letter-spacing:5px; color:#0b5ed7;">
            ${otp}
          </h1>

          <p>This OTP will expire in <strong>5 minutes</strong>.</p>

          <p style="margin-top:30px;">Thank you,<br/>MediCare Hospital</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Error sending OTP:", error);
      return res.status(500).json({ message: "OTP sending failed" });
    }
    console.log("✅ OTP sent:", otp);
    return res.json({ success: true, message: "OTP sent successfully" });
  });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  if (global.otpStore && global.otpStore[email] === otp) {
    delete global.otpStore[email]; // remove after verifying
    return res.json({ success: true, message: "OTP verified" });
  }

  return res.status(400).json({ message: "Invalid or expired OTP" });
};





exports.changeUserPassword = async (req, res) => {
  console.log("req.user:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { currentPassword, newPassword } = req.body;

  const userId = req.user.id;

  try {
    // Get user from database
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {
    console.error("Password change error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};