
// const db = require ("../config/db")
const pool = require("../config/db");
const emailService = require("../utils/emailService");
const bcrypt = require("bcrypt");


exports.addDoctor = async (req, res) => {
  const {
    name,
    specialization,
    // workExperience,
    // qualifications,
    // address,
    email,
    contactNumber,
    userName,
    password,
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  if (!name || !specialization || !userName || !password || !email) {
    return res.status(400).json({
      message: "Name, Specialization, Username, Password, and Email are required!",
    });
  }

  try {


    //  Check duplicate email
    const [existingEmail] = await pool.query(
      "SELECT id FROM doctors WHERE email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(409).json({
        message: "Email already exists. Please use a different email.",
      });
    }

    //  Check duplicate username
    const [existingUsername] = await pool.query(
      "SELECT id FROM doctors WHERE userName = ?",
      [userName]
    );
    if (existingUsername.length > 0) {
      return res.status(409).json({
        message: "Username already exists. Please choose another username.",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
const [result] = await pool.query(
  `INSERT INTO doctors 
    (name, specialization, email, contactNumber, userName, password, photo)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    name,
    specialization,
    email,
    contactNumber || null,
    userName,
    hashedPassword,
    photo,
  ]
);

// ✅ 🔥 ADD NOTIFICATION
    await pool.query(
      `INSERT INTO notifications (message, user_name, created_at)
       VALUES (?, ?, NOW())`,
      [
        "New doctor added",
        `Dr. ${name}`,
      ]
    );
    await emailService.sendDoctorCredentials({
      name,
      email,
      userName,
      password,
    });

    res.status(201).json({
      message: "Doctor added and credentials email sent!",
      doctorId: result.insertId,
    });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ message: "Database error", error: err });
  }
};


exports.getDoctors = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM doctors");
    res.status(200).json({ doctors: results });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getDoctorById = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM doctors WHERE id = ?", [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ doctor: results[0] });
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ message: "Database error" });
  }
};


// exports.updateDoctor = async (req, res) => {
//   const { id } = req.params;
//   const {
//     name,
//     specialization,
    
//     email,
//     contactNumber,
//     userName,
//     password,
//   } = req.body;

//   const photo = req.file ? req.file.filename : null;

//   if (!name || !specialization || !userName || !password) {
//     return res.status(400).json({ message: "Name, Specialization, Username, and Password are required!" });
//   }

//   const query = photo
//     ? `UPDATE doctors SET name=?, specialization=?,  email=?, contactNumber=?, userName=?, password=?, photo=? WHERE id=?`
//     : `UPDATE doctors SET name=?, specialization=?,  email=?, contactNumber=?, userName=?, password=? WHERE id=?`;

//   const values = photo
//     ? [name, specialization,  email, contactNumber, userName, password, photo, id]
//     : [name, specialization,  email, contactNumber, userName, password, id];

//   try {
//     const [result] = await pool.query(query, values);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Doctor not found" });
//     }
//     res.status(200).json({ message: "Doctor updated successfully!" });
//   } catch (err) {
//     console.error("Error updating doctor:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };


// exports.updateDoctor = async (req, res) => {
//   try {
//     const { name, specialization, email, contactNumber, userName, password } = req.body;
//     const doctorId = req.params.id;

//     // ✅ Only required fields for update
//     if (!name || !specialization || !email) {
//       return res.status(400).json({
//         message: "Name, Specialization, and Email are required!"
//       });
//     }

//     let query = `
//       UPDATE doctors 
//       SET name = ?, specialization = ?, email = ?, contactNumber = ?
//     `;

//     const values = [name, specialization, email, contactNumber];

//     // ✅ Update username only if provided
//     if (userName) {
//       query += `, userName = ?`;
//       values.push(userName);
//     }

//     // ✅ Update password only if provided
//     if (password) {
//       query += `, password = ?`;
//       values.push(password);
//     }

//     // ✅ Update photo only if uploaded
//     if (req.file) {
//       query += `, photo = ?`;
//       values.push(req.file.filename);
//     }

//     query += ` WHERE id = ?`;
//     values.push(doctorId);

//     await db.query(query, values);

//     res.json({ message: "Doctor updated successfully!" });

//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ message: "Server error while updating doctor" });
//   }
// };

exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { name, specialization, email, contactNumber, userName, password } = req.body;

    let fields = [];
    let values = [];

    // ✅ Only push fields if they exist
    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (specialization) {
      fields.push("specialization = ?");
      values.push(specialization);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    if (contactNumber) {
      fields.push("contactNumber = ?");
      values.push(contactNumber);
    }

    if (userName) {
      fields.push("userName = ?");
      values.push(userName);
    }

    if (password) {
      fields.push("password = ?");
      values.push(password);
    }

    if (req.file) {
      fields.push("photo = ?");
      values.push(req.file.filename);
    }

    // ❌ No fields to update
    if (fields.length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const query = `UPDATE doctors SET ${fields.join(", ")} WHERE id = ?`;
    values.push(doctorId);

    // await db.query(query, values);
    await pool.query(query, values);

    res.json({ message: "Doctor updated successfully!" });

  } catch (error) {
    console.error("🔥 Update error:", error); // VERY IMPORTANT
    res.status(500).json({ message: "Server error while updating doctor" });
  }
};

exports.deleteDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    //  all appointments for  doctor 
    await pool.query("DELETE FROM appointments WHERE doctor_id = ?", [doctorId]);

    // delete the doctor
    await pool.query("DELETE FROM doctors WHERE id = ?", [doctorId]);

    res.json({ message: "Doctor and all related appointments deleted successfully!" });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Doctor password change
exports.changePassword = async (req, res) => {
  console.log("req.user:", req.user);
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { currentPassword, newPassword } = req.body;
  const doctorId = req.user.id;

  try {
    const [rows] = await pool.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
    const doctor = rows[0];

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE doctors SET password = ? WHERE id = ?", [hashedPassword, doctorId]);

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ message: "Server error" });
  }
};