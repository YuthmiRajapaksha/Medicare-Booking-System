
const pool = require("../config/db");
const emailService = require("../utils/emailService");
const { sendDoctorArrivedEmail,sendAppointmentUpdateEmail, } = require("../utils/emailService");


exports.bookAppointment = async (req, res) => {
  const { bookingform_id, patient_name, email, phone } = req.body;

  if (!bookingform_id || !patient_name || !email || !phone) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1. Get max appointments for this session
    const [sessionRows] = await db.query(
      `SELECT max_appointments FROM bookingForm WHERE id = ?`,
      [bookingform_id]
    );

    if (sessionRows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const maxAppointments = sessionRows[0].max_appointments;

    // 2. Count current active appointments
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS count FROM appointments WHERE bookingform_id = ? AND status = 'active'`,
      [bookingform_id]
    );

    const currentCount = countRows[0].count;

    if (currentCount >= maxAppointments) {
      return res.status(400).json({ message: "Session is fully booked" });
    }

    // 3. Insert the new appointment
    await db.query(
      `INSERT INTO appointments (bookingform_id, doctor_id, patient_name, email, phone, status)
       SELECT b.id, b.doctor_id, ?, ?, ?, 'active'
       FROM bookingForm b
       WHERE b.id = ?`,
      [patient_name, email, phone, bookingform_id]
    );

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// -------------------- Booking an Appointment --------------------
exports.createAppointment = async (req, res) => {
  const {
    doctorId,
    doctorName,
    hospital,
    sessionDate,
    sessionTime,
    patientName,
    phone,
    country,
    nic,
    email,
    date,
    paymentId,
    bookingformId,
  } = req.body;

  if (!doctorId || !hospital || !sessionDate || !sessionTime || !bookingformId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // const userId = req.user?.id || null;
    // const userId = req.body.userId;
    // const userId = req.user?.id || null;
    const userId = req.user?.id || null;

       // ✅ ADD THIS HERE
    if (!userId) {
      console.log("Guest booking");
    }

    // Duplicate check
    const [existing] = await pool.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND session_time = ? 
       AND patient_name = ? AND nic = ? AND status != 'cancelled'`,
      [doctorId, hospital, sessionDate, sessionTime, patientName, nic]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "You already have an active appointment for this time slot." });
    }

    // Check session availability
    const [sessionRows] = await pool.query(
      `SELECT max_appointments FROM bookingform WHERE id = ?`,
      [bookingformId]
    );

    if (!sessionRows.length) return res.status(404).json({ error: "Session not found" });
    const maxAllowed = sessionRows[0].max_appointments;

    // Count current active bookings
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS count FROM appointments 
       WHERE bookingform_id = ? AND status != 'cancelled'`,
      [bookingformId]
    );

    // if (countRows[0].count >= maxAllowed) {
    //   return res.status(409).json({ error: "This session is fully booked" });
    // }

    const currentCount = countRows[0].count;

    if (currentCount >= maxAllowed) {
      return res.status(409).json({ error: "This session is fully booked." });
    }
    
    // 🧮 Assign sequential appointment number (1-based)
    const appointmentNumber = currentCount + 1;

    // // Insert appointment
    // await pool.query(
    //   `INSERT INTO appointments (
    //     doctor_id, doctor_name, hospital, session_date, session_time,
    //     patient_name, phone, country, nic, email, date, payment_id, user_id, bookingform_id,appointment_number
    //   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
    //   [
    //     doctorId,
    //     doctorName,
    //     hospital,
    //     sessionDate,
    //     sessionTime,
    //     patientName,
    //     phone,
    //     country,
    //     nic,
    //     email,
    //     date,
    //     paymentId,
    //     userId,
    //     bookingformId,
    //     appointmentNumber,
    //   ]
    // );


     // 🕒 Calculate estimated time (30 min per patient)
    const baseTime = new Date(`${sessionDate}T${sessionTime}`);
    const estimatedDateTime = new Date(baseTime.getTime() + (appointmentNumber - 1) * 30 * 60000);
    const estimatedTime = estimatedDateTime.toTimeString().slice(0, 8); // Format: HH:MM:SS

    // 🟢 Save appointment
    await pool.query(
      `INSERT INTO appointments (
        doctor_id, doctor_name, hospital, session_date, session_time,
        patient_name, phone, country, nic, email, date, payment_id, user_id, bookingform_id,
        appointment_number, estimated_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        doctorId,
        doctorName,
        hospital,
        sessionDate,
        sessionTime,
        patientName,
        phone,
        country,
        nic,
        email,
        date,
        paymentId,
        userId,
        bookingformId,
        appointmentNumber,
        estimatedTime,
      ]
    );

    // Send confirmation email
    await emailService.sendAppointmentEmail({
      appointmentNumber,
      patientName,
      email,
      doctorName,
      hospital,
      sessionDate,
      sessionTime,
      estimatedTime,
      phone,
      country,
      nic,
      charge: 2500,
    });

    res.status(201).json({ message: "Appointment created and email sent successfully" });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};





exports.getDoctorSessions = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
          bf.id, 
          bf.hospital, 
          bf.session_date, 
          bf.session_time,
          bf.max_appointments,
          COUNT(a.id) AS assigned_count
       FROM bookingform bf
       LEFT JOIN appointments a
         ON a.doctor_id = bf.doctor_id
         AND a.hospital = bf.hospital
         AND a.session_date = bf.session_date
         AND TIME(a.session_time) = TIME(bf.session_time)
         AND a.status != 'cancelled'
       WHERE bf.doctor_id = ?
       GROUP BY bf.id, bf.hospital, bf.session_date, bf.session_time, bf.max_appointments
       ORDER BY bf.session_date, bf.session_time`,
      [doctorId]
    );

    res.json({ appointments: rows });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// -------------------- Get Doctor Info --------------------
exports.getDoctorById = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
    if (rows.length === 0) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// -------------------- Update Booking Form Appointment --------------------
// const { sendAppointmentUpdateEmail } = require("../utils/emailService");


// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   const { hospital, session_date, session_time } = req.body;

//   try {
//     console.log("🔥 UPDATE API HIT");

//     // 1. get old session
//     const [oldSession] = await pool.query(
//       "SELECT * FROM bookingform WHERE id=?",
//       [id]
//     );

//     const old = oldSession[0];

//     // 2. update session
//     await pool.query(
//       "UPDATE bookingform SET hospital=?, session_date=?, session_time=? WHERE id=?",
//       [hospital, session_date, session_time, id]
//     );

//     // 3. get patients
//     const [patients] = await pool.query(
//       `SELECT * FROM appointments
//        WHERE doctor_id = ?
//        AND hospital = ?
//        AND session_date = ?
//        AND TIME(session_time) = TIME(?)
//        AND status != 'cancelled'`,
//       [old.doctor_id, old.hospital, old.session_date, old.session_time]
//     );

//     console.log("👥 Patients found:", patients.length);

//     // 4. send emails
//     for (let p of patients) {
//       console.log("📧 Sending email to:", p.email);

//       await sendAppointmentUpdateEmail({
//         patientName: p.patient_name,
//         email: p.email,
//         doctorName: p.doctor_name || "Doctor",
//         hospital,
//         sessionDate: session_date,
//         sessionTime: session_time,
//       });
//     }

//     res.json({ message: "Updated + emails sent" });

//   } catch (err) {
//     console.error("❌ ERROR:", err);
//     res.status(500).json({ message: "Error" });
//   }
// };



// ✅ Update a session + notify patients
// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   const { hospital, session_date, session_time } = req.body;

//   if (!hospital || !session_date || !session_time) {
//     return res.status(400).json({
//       message: "Missing required fields",
//     });
//   }

//   try {

//     console.log("UPDATE SESSION API HIT");
//     // 1. Get OLD booking session
//     const [oldBooking] = await pool.query(
//       `SELECT * FROM bookingForm WHERE id = ?`,
//       [id]
//     );

//     if (oldBooking.length === 0) {
//       return res.status(404).json({
//         message: "Booking session not found",
//       });
//     }

//     const old = oldBooking[0];

//     // 2. Check overlapping sessions
//     const [existing] = await pool.query(
//       `SELECT session_time
//        FROM bookingForm
//        WHERE doctor_id = ?
//        AND hospital = ?
//        AND session_date = ?
//        AND id != ?`,
//       [old.doctor_id, hospital, session_date, id]
//     );

//     const [hNew, mNew] = session_time.split(":").map(Number);
//     const newMinutes = hNew * 60 + mNew;

//     for (const row of existing) {
//       const [hDb, mDb] = row.session_time.split(":").map(Number);
//       const dbMinutes = hDb * 60 + mDb;

//       if (Math.abs(newMinutes - dbMinutes) < 120) {
//         return res.status(400).json({
//           message:
//             "This session overlaps with another session. Sessions must be at least 2 hours apart.",
//         });
//       }
//     }

//     // 3. Update bookingForm
//     await pool.query(
//       `UPDATE bookingForm
//        SET hospital = ?, session_date = ?, session_time = ?
//        WHERE id = ?`,
//       [hospital, session_date, session_time, id]
//     );

//     // 4. Get all booked patients using OLD session details
//     const [patients] = await pool.query(
//       `SELECT *
//        FROM appointments
//        WHERE bookingform_id = ?
//        AND status != 'cancelled'`,
//       [id]
//     );

//     console.log("Patients found:", patients.length);

//     // 5. Update appointments table
//     await pool.query(
//       `UPDATE appointments
//        SET hospital = ?,
//            session_date = ?,
//            session_time = ?
//        WHERE bookingform_id = ?
//        AND status != 'cancelled'`,
//       [hospital, session_date, session_time, id]
//     );

//     // 6. Send email to every patient
//     for (const patient of patients) {
//       await sendAppointmentUpdateEmail({
//         patientName: patient.patient_name,
//         email: patient.email,
//         doctorName: patient.doctor_name,
//         hospital,
//         sessionDate: session_date,
//         sessionTime: session_time,
//       });

//       console.log("Email sent to:", patient.email);
//     }

//     res.json({
//       message: `Booking updated successfully. ${patients.length} patients notified.`,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Server Error",
//     }
//   );
//   }
// };


exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { hospital, session_date, session_time } = req.body;

  try {
    console.log("🔥 UPDATE API HIT");

    // 1. get old session
    const [oldSession] = await pool.query(
      "SELECT * FROM bookingform WHERE id=?",
      [id]
    );

    const old = oldSession[0];

    // 2. update session
    // await pool.query(
    //   "UPDATE bookingform SET hospital=?, session_date=?, session_time=? WHERE id=?",
    //   [hospital, session_date, session_time, id]
    // );

    await pool.query(
  `UPDATE appointments
   SET hospital = ?,
       session_date = ?,
       session_time = ?
   WHERE bookingform_id = ?
   AND status != 'cancelled'`,
  [
    hospital,
    session_date,
    session_time,
    id
  ]
);

    // 3. get patients
    const [patients] = await pool.query(
      `SELECT * FROM appointments
       WHERE doctor_id = ?
       AND hospital = ?
       AND session_date = ?
       AND TIME(session_time) = TIME(?)
       AND status != 'cancelled'`,
      [old.doctor_id, old.hospital, old.session_date, old.session_time]
    );

    console.log("👥 Patients found:", patients.length);

    // 4. send emails
    for (let p of patients) {
      console.log("📧 Sending email to:", p.email);

      await sendAppointmentUpdateEmail({
        patientName: p.patient_name,
        email: p.email,
        doctorName: p.doctor_name || "Doctor",
        hospital,
        sessionDate: session_date,
        sessionTime: session_time,
      });
    }

    res.json({ message: "Updated + emails sent" });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Error" });
  }
};


// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   const { hospital, session_date, session_time } = req.body;

//   try {
//     console.log("🔥 UPDATE API HIT");
//     // ✅ 1. GET OLD SESSION DETAILS FIRST
//     const [oldSession] = await pool.query(
//       "SELECT * FROM bookingform WHERE id = ?",
//       [id]
//     );

//     if (oldSession.length === 0) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     const old = oldSession[0];

//     // ✅ 2. UPDATE SESSION
//     await pool.query(
//       "UPDATE bookingform SET hospital=?, session_date=?, session_time=? WHERE id=?",
//       [hospital, session_date, session_time, id]
//     );

//     // ✅ 3. GET ALL PATIENTS WHO BOOKED THIS SESSION
//     const [patients] = await pool.query(
//       `
//       SELECT * FROM appointments
//       WHERE doctor_id = ?
//       AND hospital = ?
//       AND session_date = ?
//       AND TIME(session_time) = TIME(?)
//       AND status != 'cancelled'
//       `,
//       [old.doctor_id, old.hospital, old.session_date, old.session_time]
//     );

//     console.log("📧 Patients to notify:", patients.length);

//     // ✅ 4. SEND EMAIL TO ALL PATIENTS
//     for (let patient of patients) {
//       await sendAppointmentUpdateEmail({
//         patientName: patient.patient_name,
//         email: patient.email,
//         doctorName: patient.doctor_name || "Doctor",
//         hospital: hospital, // NEW updated
//         sessionDate: session_date,
//         sessionTime: session_time,
//       });
//     }

//     res.json({
//       message: "Appointment updated + patients notified",
//     });

//   } catch (err) {
//     console.error("❌ Update error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };

// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   const { hospital, session_date, session_time } = req.body;

//   try {
//     await pool.query(
//       "UPDATE bookingform SET hospital=?, session_date=?, session_time=? WHERE id=?",
//       [hospital, session_date, session_time, id]
//     );
//     res.json({ message: "Appointment updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Database error" });
//   }
// };




// -------------------- Delete Appointment --------------------
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM bookingform WHERE id=?", [id]);
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// -------------------- Get All Doctors with Active Patient Count --------------------
exports.getAllDoctorsWithPatientCount = async (req, res) => {
  try {
    const [doctors] = await pool.query(`
      SELECT 
        d.id, 
        d.name, 
        d.specialization, 
        d.hospital, 
        COUNT(a.id) AS totalAppointments
      FROM doctors d
      LEFT JOIN appointments a 
        ON a.doctor_id = d.id 
        AND a.status != 'cancelled'
      GROUP BY d.id
    `);
    res.json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

exports.changeAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;


  try {
    await pool.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);

    // const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [id]);
    const [rows] = await pool.query(
  `SELECT a.*, d.name AS doctor_name
   FROM appointments a
   JOIN doctors d ON a.doctor_id = d.id
   WHERE a.id = ?`,
  [id]
);

    const appointment = rows[0];

    
    if (status === "cancelled") {
      await emailService.sendCancellationEmail({
        patientName: appointment.patient_name,
        email: appointment.email,
        doctorName: appointment.doctor_name,
        hospital: appointment.hospital,
        sessionDate: appointment.session_date,
        sessionTime: appointment.session_time,
        phone: appointment.phone,
        country: appointment.country,
        nic: appointment.nic,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
};


exports.getCancelledAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM appointments WHERE doctor_id = ? AND status = 'cancelled'",
      [doctorId]
      
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cancelled appointments" });
  }
};


exports.countAppointments = async (req, res) => {
  const doctorId = req.params.doctorId;
  const { hospital, sessionDate, sessionTime } = req.query;

  if (!doctorId || !hospital || !sessionDate || !sessionTime) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS count FROM appointments 
       WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND session_time = ? AND status != 'cancelled'`,
      [doctorId, hospital, sessionDate, sessionTime]
    );

    res.json({ count: rows[0].count });
  } catch (error) {
    console.error("Count query error:", error);
    res.status(500).json({ error: "Database error" });
  }
};



// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [appointments] = await pool.query(
//       `SELECT b.id, b.hospital, b.session_date, b.session_time,
//               IFNULL(COUNT(a.id), 0) AS assigned_count
//        FROM bookingForm b
//        LEFT JOIN appointments a
//        ON a.hospital = b.hospital 
//           AND a.session_date = b.session_date 
//           AND a.session_time = b.session_time
//           AND a.doctor_id = b.doctor_id
//        WHERE b.doctor_id = ?
//        GROUP BY b.id
//        ORDER BY b.session_date, b.session_time`,
//       [doctorId]
//     );

//     res.json({ appointments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching appointments" });
//   }
// };



// exports.getMyAppointments = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const [rows] = await pool.query(
//       `SELECT a.*, d.specialization
//        FROM appointments a
//        JOIN doctors d ON a.doctor_id = d.id
//        WHERE a.user_id = ?
//        ORDER BY a.created_at DESC`,
//       [userId]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };


// exports.getMyAppointments = async (req, res) => {
//   try {
//     const userId = req.user?.id || null;

//     if (!userId) {
//       return res.status(401).json({ message: "Not logged in" });
//     }

//     const [rows] = await pool.query(
//       `SELECT * FROM appointments WHERE user_id = ? ORDER BY id DESC`,
//       [userId]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// exports.getMyAppointments = async (req, res) => {
//   try {
//     console.log("req.user =", req.user);

//     const userId = req.user?.id;

//     const [rows] = await pool.query(
//       "SELECT * FROM appointments WHERE user_id = ?",
//       [userId]
//     );

//     console.log("Found rows:", rows);

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//   }
// };

exports.getMyAppointments = async (req, res) => {
  try {
    console.log("req.user =", req.user);

    const userId = req.user?.id; // may need to be req.user.userId

    console.log("userId =", userId);

    const [rows] = await pool.query(
      "SELECT * FROM appointments WHERE user_id = ?",
      [userId]
    );

    console.log("Found rows:", rows);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const [rows] = await pool.query(
      "SELECT * FROM appointments WHERE user_id = ?",
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error",
      error: error.message, });
  }
};



exports.getDoctorById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM doctors WHERE id = ?", [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Doctor not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};





// -------------------- Get Doctor Daily Revenue + Patient Count --------------------
// exports.getDailyStatsByDoctor = async (req, res) => {
//   const doctorId = req.params.id;

//   try {
//     const [rows] = await pool.query(
//       `SELECT 
//           session_date,
//           COUNT(*) AS patient_count,
//           (COUNT(*) * 2500) AS revenue
//        FROM appointments
//        WHERE doctor_id = ?
//          AND status != 'cancelled'
//        GROUP BY session_date
//        ORDER BY session_date DESC`,
//       [doctorId]
//     );

//     // res.json({ stats: rows });
//     res.json({ dailyStats: rows });

//   } catch (error) {
//     console.error("Daily stats error:", error);
//     res.status(500).json({ error: "Failed to fetch revenue and patient count" });
//   }
// };

//payment view details
exports.getDailyStatsByDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE(appointment_date) AS date,
        COUNT(*) AS patientCount,
        COUNT(*) * 2500 AS totalRevenue
      FROM appointments
      WHERE doctor_id = ?
        AND status != 'cancelled'
        AND appointment_date >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(appointment_date)
      ORDER BY date DESC
    `, [doctorId]);

    res.json({ dailyStats: rows });

  } catch (error) {
    console.error("Error fetching daily stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// exports.getDailyStatsByDoctor = async (req, res) => {
//   const doctorId = req.params.id;

//   try {
//     const [rows] = await pool.query(`
//       SELECT 
//         DATE(appointment_date) AS date,
//         COUNT(*) AS patientCount,
//         COUNT(*) * 2500 AS totalRevenue
//       FROM appointments
//       WHERE doctor_id = ?
//         AND status != 'cancelled'
//         AND appointment_date >= CURDATE() - INTERVAL 30 DAY
//       GROUP BY DATE(appointment_date)
//       ORDER BY date DESC
//     `, [doctorId]);

//     res.status(200).json({
//       dailyStats: rows
//     });

//   } catch (error) {
//     console.error("Daily stats error:", error);
//     res.status(500).json({
//       message: "Failed to fetch daily stats"
//     });
//   }
// };


exports.getAllDoctorsWithPatientCountAndRevenue = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        d.id, 
        d.name, 
        COUNT(a.id) AS totalAppointments,
        COUNT(a.id) * 2500 AS totalRevenue
      FROM doctors d
      LEFT JOIN appointments a 
        ON d.id = a.doctor_id
        AND a.status != 'cancelled'
      GROUP BY d.id
    `);

    res.status(200).json({ doctors: rows });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getPatientCountByDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [result] = await pool.query(
      "SELECT COUNT(*) AS patientCount FROM appointments WHERE doctor_id = ?",
      [doctorId]
    );

    res.json({ doctorId, patientCount: result[0].patientCount });
  } catch (error) {
    console.error("Error fetching patient count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getTotalAppointmentsCount = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM appointments");
    res.status(200).json({ count: rows?.[0]?.count ?? 0 });
  } catch (err) {
    console.error("Error retrieving total appointments count:", err);
    res.status(500).json({ message: "Database error" });
  }
};



exports.getTodayAppointmentsCount = async (req, res) => {
  // const { id } = req.params;  
  // const userId = req.user?.id;
  try {
    const today = new Date().toISOString().split('T')[0]; 

    const [rows] = await pool.query(
      "SELECT COUNT(*) AS count FROM appointments WHERE DATE(created_at) = ?",
      [today]
    );

    res.json({ count: rows[0].count });
  } catch (error) {
    console.error("Error fetching today's appointments count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//workinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
// exports.getDailyStatsByDoctor = async (req, res) => {
//   const doctorId = req.params.id;

//   try {
//     const [rows] = await pool.query(`
//       SELECT 
//         DATE(created_at) AS date,
//         COUNT(*) AS patientCount,
//         COUNT(*) * 2500 AS totalRevenue
//       FROM appointments
//       WHERE doctor_id = ?
//         AND status != 'cancelled'   
//         AND DATE(created_at) >= CURDATE() - INTERVAL 30 DAY
//       GROUP BY DATE(created_at)
//       ORDER BY DATE(created_at) DESC
//     `, [doctorId]);

//     res.json({ dailyStats: rows });
//   } catch (error) {
//     console.error("Error fetching daily stats:", error);
//     res.status(500).json({ error: "Database error" });
//   }
// };

exports.getDailyStatsByDoctor = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const [rows] = await pool.query(`
      SELECT
        DATE(session_date) AS date,
        COUNT(*) AS patientCount,
        COUNT(*) * 2500 AS totalRevenue
      FROM appointments
      WHERE doctor_id = ?
        AND status != 'cancelled'
        AND DATE(session_date) >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(session_date)
      ORDER BY DATE(session_date) DESC
    `, [doctorId]);

    res.json({
      dailyStats: rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database error"
    });
  }
};


// exports.getDailyStatsByDoctor = async (req, res) => {
//   const doctorId = req.params.id;

//   try {
//     const [rows] = await pool.query(
//       `SELECT 
//           session_date,
//           COUNT(*) AS patient_count,
//           (COUNT(*) * 2500) AS revenue
//        FROM appointments
//        WHERE doctor_id = ?
//          AND status != 'cancelled'
//        GROUP BY session_date
//        ORDER BY session_date DESC`,
//       [doctorId]
//     );

//     // res.json({ stats: rows });
//     res.json({ dailyStats: rows });

//   } catch (error) {
//     console.error("Daily stats error:", error);
//     res.status(500).json({ error: "Failed to fetch revenue and patient count" });
//   }
// };



exports.getWeekAppointmentsCount = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS count
      FROM appointments
      WHERE created_at >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Fill missing days with zero
    const result = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = rows.find(r => r.date === dateStr);
      result.push({
        date: dateStr,
        count: found ? found.count : 0,
      });
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// -------------------- Cancel Appointment --------------------
exports.cancelAppointmentByPatient = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const [rows] = await pool.query(
      `SELECT * FROM appointments WHERE id = ? AND user_id = ? AND status = 'active'`,
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found or not active" });
    }

    await pool.query(
      `UPDATE appointments SET status = 'cancelled' WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ Final version: count active (non-cancelled) appointments per doctor
exports.getAllDoctorsWithPatientCount = async (req, res) => {
  try {
    const [doctors] = await pool.query(`
      SELECT 
        d.id, 
        d.name, 
        d.specialization, 
        d.hospital, 
        COUNT(a.id) AS totalAppointments
      FROM doctors d
      LEFT JOIN appointments a 
        ON a.doctor_id = d.id 
        AND a.status != 'cancelled'
      GROUP BY d.id
    `);

    res.json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};


// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [rows] = await pool.query(
//       `SELECT 
//         id,
//         bookingform_id,
//         doctor_id,
//         doctor_name,
//         hospital,
//         session_date,
//         session_time,
//         patient_name,
//         phone,
//         email,
//         nic,
//         status,
//         appointment_number,
//         estimated_time
//        FROM appointments
//        WHERE doctor_id = ?
//        ORDER BY session_date ASC, session_time ASC`,
//       [doctorId]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error("Fetch doctor appointments error:", error);
//     res.status(500).json({ error: "Failed to load appointments" });
//   }
// };

// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     // Get all sessions with booking count
//     const [sessions] = await db.query(
//       `
//       SELECT
//         b.id,
//         b.doctor_id,
//         b.hospital,
//         b.session_date,
//         b.session_time,
//         b.max_appointments,
//         COUNT(a.id) AS assigned_count
//       FROM bookingForm b
//       LEFT JOIN appointments a
//         ON a.bookingform_id = b.id
//         AND a.status != 'cancelled'
//       WHERE b.doctor_id = ?
//       GROUP BY
//         b.id,
//         b.doctor_id,
//         b.hospital,
//         b.session_date,
//         b.session_time,
//         b.max_appointments
//       ORDER BY
//         b.session_date ASC,
//         b.session_time ASC
//       `,
//       [doctorId]
//     );

//     // Get all appointments belonging to those sessions
//     const sessionIds = sessions.map((s) => s.id);

//     let assigned = [];

//     if (sessionIds.length > 0) {
//       const [rows] = await db.query(
//         `
//         SELECT *
//         FROM appointments
//         WHERE bookingform_id IN (?)
//         AND status != 'cancelled'
//         `,
//         [sessionIds]
//       );

//       assigned = rows;
//     }

//     // Attach appointments to each session
//     const sessionMap = sessions.map((session) => ({
//       ...session,
//       assignedAppointments: assigned.filter(
//         (a) => a.bookingform_id === session.id
//       ),
//     }));

//     res.json({
//       appointments: sessionMap,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Database error",
//     });
//   }
// };


exports.getStatusCounts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM appointments
      GROUP BY status
    `);

    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// exports.notifyDoctorArrived = async (req, res) => {
//   const { doctorId, hospital, sessionDate, sessionTime } = req.body;

//   try {
//     const [appointments] = await pool.query(
//       `SELECT * FROM appointments
//        WHERE doctor_id = ? 
//        AND hospital = ? 
//        AND session_date = ? 
//        AND session_time = ?
//        AND status != 'cancelled'`,
//       [doctorId, hospital, sessionDate, sessionTime]
//     );

//     for (const appt of appointments) {
//       await emailService.sendDoctorArrivedEmail({
//         patientName: appt.patient_name,
//         email: appt.email,
//         doctorName: appt.doctor_name,
//         hospital: appt.hospital,
//         sessionDate: appt.session_date,
//         sessionTime: appt.session_time,
//         appointmentNumber: appt.appointment_number,
//         estimatedTime: appt.estimated_time,
//       });
//     }

//     res.json({ message: "All patients notified successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to notify patients" });
//   }
// }; 

// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [sessions] = await db.query(
//       `
//       SELECT
//         b.id,
//         b.doctor_id,
//         b.hospital,
//         b.session_date,
//         b.session_time,
//         b.max_appointments,
//         COUNT(a.id) AS assigned_count
//       FROM bookingForm b
//       LEFT JOIN appointments a
//         ON a.bookingform_id = b.id
//       WHERE b.doctor_id = ?
//       GROUP BY
//         b.id,
//         b.doctor_id,
//         b.hospital,
//         b.session_date,
//         b.session_time,
//         b.max_appointments
//       ORDER BY
//         b.session_date ASC,
//         b.session_time ASC
//       `,
//       [doctorId]
//     );

//     const sessionIds = sessions.map((s) => s.id);

//     let assigned = [];

//     if (sessionIds.length > 0) {
//       const [rows] = await db.query(
//         `
//         SELECT *
//         FROM appointments
//         WHERE bookingform_id IN (?)
//         `,
//         [sessionIds]
//       );

//       assigned = rows;
//     }

//     const sessionMap = sessions.map((session) => ({
//       ...session,
//       assignedAppointments: assigned.filter(
//         (a) => Number(a.bookingform_id) === Number(session.id)
//       ),
//     }));

//     res.json({
//       appointments: sessionMap,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Database error",
//     });
//   }
// };


exports.getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [sessions] = await pool.query(
      `
      SELECT
        b.id,
        b.doctor_id,
        b.hospital,
        b.session_date,
        b.session_time,
        b.max_appointments,
        COUNT(a.id) AS assigned_count
      FROM bookingForm b
     LEFT JOIN appointments a
  ON a.bookingform_id = b.id
  AND a.status != 'cancelled'
      WHERE b.doctor_id = ?
      GROUP BY
        b.id,
        b.doctor_id,
        b.hospital,
        b.session_date,
        b.session_time,
        b.max_appointments
      ORDER BY
        b.session_date ASC, b.session_time ASC
      `,
      [doctorId]
    );

    const sessionIds = sessions.map((s) => s.id);

    let assigned = [];

    if (sessionIds.length > 0) {
      // const [rows] = await pool.query(
      //   `
      //   SELECT *
      //   FROM appointments
      //   WHERE bookingform_id IN (?)
      //   `,
      //   [sessionIds]
      // );

      const [rows] = await pool.query(
  `
  SELECT *
  FROM appointments
  WHERE bookingform_id IN (?)
  AND status != 'cancelled'
  `,
  [sessionIds]
);

      assigned = rows;
    }

    const sessionMap = sessions.map((session) => ({
      ...session,
      assignedAppointments: assigned.filter(
        (a) => Number(a.bookingform_id) === Number(session.id)
      ),
    }));

    res.json({
      appointments: sessionMap,
    });

  } catch (err) {
    console.error("DB ERROR:", err);   
    res.status(500).json({
      message: "Database error",
      error: err.message
    });
  }
};




// exports.notifyDoctorArrived = async (req, res) => {
//   try {
//     const { doctorId, hospital, sessionDate, sessionTime } = req.body;

//     console.log("📢 Doctor Arrived Triggered:", req.body);

//     // ✅ 1. GET ALL PATIENTS FOR THAT SESSION
//     const [appointments] = await pool.query(
//       `
//       SELECT 
//   a.*,
//   d.name AS doctor_name
// FROM appointments a
// JOIN doctors d ON d.id = a.doctor_id
// WHERE a.doctor_id = ?
// AND a.hospital = ?
// AND a.session_date = ?
// AND a.session_time = ?
// AND a.status != 'cancelled'
// ORDER BY a.appointment_number ASC
//       `,
//       [doctorId, hospital, sessionDate, sessionTime]
//     );

//     if (appointments.length === 0) {
//       return res.status(404).json({ message: "No patients found" });
//     }

//     // ✅ 2. LOOP + SEND EMAIL TO EACH PATIENT
//     for (let appt of appointments) {
//       await sendDoctorArrivedEmail({
//         patientName: appt.patient_name,
//         email: appt.email,
//         doctorName: appt.doctor_name, // make sure this exists
//         hospital: appt.hospital,
//         sessionDate: appt.session_date,
//         sessionTime: appt.session_time,
//         appointmentNumber: appt.appointment_number,
//         estimatedTime: appt.estimated_time || "Please wait",
//       });
//     }

//     console.log("✅ All patients notified");

//     res.json({ message: "All patients notified successfully" });
//   } catch (error) {
//     console.error("❌ Notify Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.notifyDoctorArrived = async (req, res) => {
  try {
    const { doctorId, hospital, sessionDate, sessionTime } = req.body;

    console.log("📢 Doctor Arrived Triggered:", req.body);

    const [appointments] = await pool.query(
      `
      SELECT
        a.*,
        d.name AS doctor_name
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.doctor_id = ?
      AND a.hospital = ?
      AND a.session_date = ?
      AND a.session_time = ?
      AND a.status != 'cancelled'
      ORDER BY a.appointment_number ASC
      `,
      [doctorId, hospital, sessionDate, sessionTime]
    );

    console.log("Appointments found:", appointments.length);
    console.log(appointments);

    if (appointments.length === 0) {
      return res.status(404).json({
        message: "No patients found"
      });
    }

    for (const appt of appointments) {
      console.log("Sending email to:", appt.email);

      await sendDoctorArrivedEmail({
        patientName: appt.patient_name,
        email: appt.email,
        doctorName: appt.doctor_name,
        hospital: appt.hospital,
        sessionDate: appt.session_date,
        sessionTime: appt.session_time,
        appointmentNumber: appt.appointment_number,
        estimatedTime: appt.estimated_time || "Please wait",
      });

      console.log("Email sent to:", appt.email);
    }

    console.log("✅ All patients notified");

    res.json({
      success: true,
      message: "All patients notified successfully",
    });

  } catch (error) {
    console.error("FULL ERROR:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};


exports.getPaymentDetails = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        appointment_number,
        patient_name,
        hospital,
        email,
        phone,
        nic,
        2500 AS amount
      FROM appointments
      WHERE doctor_id = ?
        AND DATE(session_date) = ?
        AND status != 'cancelled'
      ORDER BY appointment_number
      `,
      [doctorId, date]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.getSessionPatients = async (req, res) => {
  const { bookingformId } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT
        appointment_number,
        patient_name,
        phone,
        email,
        nic,
        estimated_time
      FROM appointments
      WHERE bookingform_id = ?
      AND status != 'cancelled'
      ORDER BY appointment_number
      `,
      [bookingformId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Database error"
    });
  }
};

// exports.notifyPatientsDoctorArrived = async (req, res) => {
//   const { doctorId, hospital, sessionDate, sessionTime } = req.body;

//   if (!doctorId || !hospital || !sessionDate || !sessionTime) {
//     return res.status(400).json({ message: "Missing required data" });
//   }

//   try {
//     // 1. Get all active patients for this session
//     const [patients] = await pool.query(
//       `SELECT * FROM appointments
//        WHERE doctor_id = ?
//        AND hospital = ?
//        AND session_date = ?
//        AND session_time = ?
//        AND status != 'cancelled'`,
//       [doctorId, hospital, sessionDate, sessionTime]
//     );

//     if (patients.length === 0) {
//       return res.status(404).json({ message: "No patients found" });
//     }

//     // 2. Send notification to each patient
//     for (const patient of patients) {
//       await emailService.sendDoctorArrivedEmail({
//         patientName: patient.patient_name,
//         email: patient.email,
//         doctorName: patient.doctor_name,
//         hospital: patient.hospital,
//         sessionTime: patient.session_time,
//       });
//     }

//     res.json({ message: "Patients notified successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };






// exports.getMyAppointments = async (req, res) => {
//   try {
//     const userId = req.user?.id;
    
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const [rows] = await pool.query(
//       `SELECT a.*, d.specialization
//        FROM appointments a
//        JOIN doctors d ON a.doctor_id = d.id
//        WHERE a.user_id = ?
//        ORDER BY a.created_at DESC`,
//       [userId]
//     );

//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };



// exports.getMyAppointments = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const email = req.query.email; // 👈 for guest

//     let query = `
//       SELECT a.*, d.specialization
//       FROM appointments a
//       JOIN doctors d ON a.doctor_id = d.id
//     `;

//     let params = [];

//     if (userId) {
//       // ✅ Logged-in user
//       query += ` WHERE a.user_id = ?`;
//       params.push(userId);
//     } else if (email) {
//       // ✅ Guest user
//       query += ` WHERE a.email = ?`;
//       params.push(email);
//     } else {
//       return res.status(400).json({ message: "User not identified" });
//     }

//     query += ` ORDER BY a.created_at DESC`;

//     const [rows] = await pool.query(query, params);

//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };


// exports.getMyAppointments = async (req, res) => {
//   try {
//     const userId = req.user?.id || null; // if token middleware used
//     const email = req.query.email || null;

//     let query = `
//       SELECT a.*, d.specialization
//       FROM appointments a
//       JOIN doctors d ON a.doctor_id = d.id
//     `;

//     let params = [];

//     if (userId) {
//       // ✅ Logged-in user
//       query += ` WHERE a.user_id = ?`;
//       params.push(userId);
//     } else if (email) {
//       // ✅ Guest user
//       query += ` WHERE a.email = ?`;
//       params.push(email);
//     } else {
//       return res.status(400).json({
//         message: "Provide login token or email",
//       });
//     }

//     query += ` ORDER BY a.created_at DESC`;

//     const [rows] = await pool.query(query, params);

//     res.json(rows);
//   } catch (error) {
//     console.error("Get appointments error:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };


// exports.getMyAppointments = async (req, res) => {
//   try {
//     let userId = null;

//     // ✅ Safely check token (optional auth)
//     if (req.headers.authorization) {
//       try {
//         const decoded = jwt.verify(
//           req.headers.authorization.split(" ")[1],
//           process.env.JWT_SECRET
//         );
//         userId = decoded.id;
//       } catch (err) {
//         console.log("Invalid token");
//       }
//     }

//     const email = req.query.email;

//     // let query = `
//     //   SELECT a.*, d.specialization
//     //   FROM appointments a
//     //   JOIN doctors d ON a.doctor_id = d.id
//     // `;

//     let query = `
//   SELECT a.*, d.specialization
//   FROM appointments a
//   JOIN doctors d ON a.doctor_id = d.id
//   `;

//     let params = [];

//     if (userId) {
//       query += ` WHERE a.user_id = ?`;
//       params.push(userId);
//     } else if (email) {
//       query += ` WHERE a.email = ?`;
//       params.push(email);
//     } else {
//       return res.status(400).json({ message: "Provide login or email" });
//     }

//     query += ` ORDER BY a.created_at DESC`;

//     const [rows] = await pool.query(query, params);

//     console.log("RESULT:", rows); // 🔥 DEBUG

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };



// controllers/appointmentsController.js

// exports.getAllDoctorsWithPatientCount = async (req, res) => {
//   try {
//     const [doctors] = await pool.query(`
//       SELECT d.id, d.name, d.specialization, d.hospital, COUNT(a.id) as totalAppointments
//       FROM doctors d
//       LEFT JOIN appointments a ON a.doctor_id = d.id
//       GROUP BY d.id
//     `);

//     res.json({ doctors });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching doctors" });
//   }
// };


// exports.cancelAppointmentByPatient = async (req, res) => {
//   const { id } = req.params;  // appointment ID
//   const userId = req.user?.id;

//   if (!userId) return res.status(401).json({ message: "Unauthorized" });

//   try {
//     const [rows] = await pool.query(
//       `SELECT * FROM appointments WHERE id = ? AND user_id = ? AND status = 'active'`,
//       [id, userId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Appointment not found or not active" });
//     }

//     await pool.query(
//       `UPDATE appointments 
//        SET status = 'cancelled' 
//        WHERE id = ? AND user_id = ?`,
//       [id, userId]
//     );

//     res.json({ message: "Appointment cancelled successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// exports.getAllDoctorsWithPatientCount = async (req, res) => {
//   try {
//     const [rows] = await pool.query(`
//       SELECT d.id, d.name, COUNT(a.id) AS patientCount 
//       FROM doctors d 
//       LEFT JOIN appointments a ON d.id = a.doctor_id 
//       GROUP BY d.id;
//     `);

//     const doctors = rows.map(row => ({
//       ...row,
//       patientCount: Number(row.patientCount) || 0,
//     }));

//     res.status(200).json({ doctors });
//   } catch (err) {
//     console.error("Error fetching doctors:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };



// exports.getMyAppointments = async (req, res) => {
  
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const [rows] = await pool.query(
//     `SELECT 
//         a.*,
//         d.specialization
//       FROM 
//         appointments a
//       JOIN 
//         doctors d ON a.doctor_id = d.id
//       WHERE 
//         a.user_id = ?
        
//       ORDER BY 
//         a.created_at DESC`,
//       [userId]
//     );

//     return res.json(rows);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };




// -------------------- Get Doctor Sessions with Assigned Count --------------------
// exports.getDoctorSessions = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [rows] = await pool.query(
//       `SELECT 
//           bf.id, 
//           bf.hospital, 
//           bf.session_date, 
//           bf.session_time,
//           COUNT(a.id) AS assigned_count
//        FROM bookingform bf
//        LEFT JOIN appointments a
//          ON a.doctor_id = bf.doctor_id
//          AND a.hospital = bf.hospital
//          AND a.session_date = bf.session_date
//          AND TIME(a.session_time) = TIME(bf.session_time)
//          AND a.status != 'cancelled'
//        WHERE bf.doctor_id = ?
//        GROUP BY bf.id, bf.hospital, bf.session_date, bf.session_time
//        ORDER BY bf.session_date, bf.session_time`,
//       [doctorId]
//     );

//     res.json({ appointments: rows });
//   } catch (err) {
//     console.error("DB error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };





// exports.getAppointmentsByDoctorId = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM appointments WHERE doctor_id = ? ORDER BY session_date, session_time",
//       [doctorId]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch appointments" });
//   }
// };

// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [appointments] = await pool.query(
//       `SELECT id, appointment_number, patient_name, hospital, session_date, session_time, email, phone, nic, status 
//        FROM appointments 
//        WHERE doctor_id = ?
//        ORDER BY session_date, session_time`,
//       [doctorId]
//     );
//     res.json(appointments);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: "Error fetching appointments" });
//   }
// };





// exports.createAppointment = async (req, res) => {
//   const {
//     doctorId,
//     doctorName,
//     hospital,
//     sessionDate,
//     sessionTime,
//     patientName,
//     phone,
//     country,
//     nic,
//     email,
//     date,
//     paymentId,
//     bookingformId,
//   } = req.body;

//   if (!doctorId) {
//     return res.status(400).json({ error: "Doctor ID missing, cannot book appointment." });
//   }

//   if (!hospital || !sessionDate || !sessionTime) {
//     return res.status(400).json({ error: "Missing session data" });
//   }

//   if (!bookingformId) return res.status(400).json({ error: "Missing bookingform ID" });

//   try {
//     const userId = req.user?.id || null; 

//      //  Duplicate check
//     const [existing] = await pool.query(
//       `SELECT id FROM appointments 
//        WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND session_time = ?
//        AND patient_name = ? AND nic = ? AND status != 'cancelled'`,
//       [doctorId, hospital, sessionDate, sessionTime, patientName, nic]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({ error: "You already have an active appointment for this time slot." });
//     }


//     // Check session availability
// const [sessionRows] = await pool.query(
//   "SELECT max_appointments FROM bookingform WHERE id = ?",
//   [bookingformId]
// );

// if (!sessionRows.length) return res.status(404).json({ error: "Session not found" });

// const maxAllowed = sessionRows[0].max_appointments;

// // Count existing active bookings for this session
// const [countRows] = await pool.query(
//   `SELECT COUNT(*) AS count FROM appointments 
//    WHERE bookingform_id = ? AND status != 'cancelled'`,
//   [bookingformId]
// );

// if (countRows[0].count >= maxAllowed) {
//   return res.status(409).json({ error: "This session is fully booked" });
// }


//     const [result] = await pool.query(
//       `INSERT INTO appointments (
//         doctor_id, doctor_name, hospital, session_date, session_time,
//         patient_name, phone, country, nic, email, date, payment_id, user_id, bookingform_id
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         doctorId,
//         doctorName,
//         hospital,
//         sessionDate,
//         sessionTime,
//         patientName,
//         phone,
//         country,
//         nic,
//         email,
//         date,
//         paymentId,
//         userId,
//         bookingformId,
//       ]
//     );

   
//     await emailService.sendAppointmentEmail({
//       patientName,
//       email,
//       doctorName,
//       hospital,
//       sessionDate,
//       sessionTime,
//       phone,
//       country,
//       nic,
//       charge: 2500,
//     });

//     res.status(201).json({ message: "Appointment created and email sent successfully" });
//   } catch (error) {
//     console.error("Create appointment error:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };