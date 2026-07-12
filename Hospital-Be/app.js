require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// DB
const db = require("./config/db");

// Middlewares
const authenticateToken = require("./middleware/authenticateToken");

// Routes
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctorRoutes");
const registerRoutes = require("./routes/registerRoutes");
const labReportsRoutes = require("./routes/labReportsRoutes");
const appointmentsRoutes = require("./routes/appointmentsRoutes");
const bookingFormRoutes = require("./routes/bookingFormRoutes");
const doctorSearchRoutes = require("./routes/doctorSearchRoutes");
const sessionRoutes = require("./routes/session");
const notificationRoutes = require("./routes/notificationRoutes");


app.use(cors());
app.use(express.json());  
app.use(bodyParser.json());

const sendPin = require("./routes/sendPin");
const otpVerify = require("./routes/otpVerify");



app.use("/api", sendPin);
app.use("/api", otpVerify);


// app.use(cors());
// app.use(bodyParser.json());

// Public uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// --------------------------------------------------
// ✅ AUTH ROUTES
// --------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/login", registerRoutes);
app.use("/api/register", registerRoutes);
app.use("/api", registerRoutes); // Contains login + register merged





// --------------------------------------------------
// ✅ PROFILE (Protected Route)
// --------------------------------------------------
app.get("/api/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is your profile", user: req.user });
});


// --------------------------------------------------
// ✅ DOCTOR ROUTES
// --------------------------------------------------
app.use("/api/doctors", doctorRoutes);       // doctor CRUD
app.use("/api/doctors", doctorSearchRoutes); // doctor search


// --------------------------------------------------
// ✅ LAB REPORT ROUTES
// --------------------------------------------------
app.use("/api/lab-reports", labReportsRoutes);


// --------------------------------------------------
// ✅ SESSION ROUTES
// --------------------------------------------------
app.use("/api/sessions", sessionRoutes);


// --------------------------------------------------
// ✅ APPOINTMENTS ROUTES
// --------------------------------------------------
app.use("/api/appointments", appointmentsRoutes);


// --------------------------------------------------
// ✅ BOOKING FORM ROUTES
// --------------------------------------------------
app.use("/api/bookingForm", bookingFormRoutes);
app.use("/api/bookingform", doctorSearchRoutes); // Search route for booking form



app.use("/api/notifications", notificationRoutes);


// --------------------------------------------------
// ✅ SEARCH DOCTOR (General Search Endpoint)
// --------------------------------------------------
app.get("/api/search", async (req, res) => {
  const { doctor, specialization, hospital } = req.query;

  let query = "SELECT * FROM doctors WHERE 1=1";
  let params = [];

  if (doctor) {
    query += " AND name LIKE ?";
    params.push(`%${doctor}%`);
  }
  if (specialization) {
    query += " AND specialization LIKE ?";
    params.push(`%${specialization}%`);
  }
  if (hospital) {
    query += " AND hospital LIKE ?";
    params.push(`%${hospital}%`);
  }

  try {
    const [rows] = await db.execute(query, params);
    res.json({ doctors: rows });
  } catch (error) {
    console.error("Search query failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// --------------------------------------------------
// ✅ GET APPOINTMENTS FOR A SPECIFIC DOCTOR
// --------------------------------------------------
app.get("/api/appointments/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const query = `
      SELECT a.id, a.appointment_number, a.patient_name, a.phone, a.country,
             a.nic, a.email, a.hospital, a.session_date, a.session_time, a.status,
             d.name AS doctor_name, d.specialization
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE d.id = ?
      ORDER BY a.session_date, a.session_time;
    `;

    const [results] = await db.query(query, [doctorId]);
    res.json(results);

  } catch (err) {
    console.error("Error fetching appointments for doctor:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// --------------------------------------------------
// ✅ START SERVER
// --------------------------------------------------
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
