

// const pool = require("../db"); 

// // GET all bookings for a doctor
// exports.getBookingsByDoctor = async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM bookingform WHERE doctor_id = ? ORDER BY session_date ASC, session_time ASC",
//       [req.params.doctorId]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch appointments" });
//   }
// };

// // UPDATE a booking by ID
// exports.updateBooking = async (req, res) => {
//   const { hospital, session_date, session_time } = req.body;
//   try {
//     await pool.query(
//       "UPDATE bookingform SET hospital = ?, session_date = ?, session_time = ? WHERE id = ?",
//       [hospital, session_date, session_time, req.params.id]
//     );
//     res.json({ message: "Appointment updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to update" });
//   }
// };

// // DELETE a booking by ID
// exports.deleteBooking = async (req, res) => {
//   try {
//     await pool.query("DELETE FROM bookingform WHERE id = ?", [req.params.id]);
//     res.json({ message: "Appointment deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to delete" });
//   }
// };


// // Get appointments for a doctor with assigned_count
// exports.getDoctorAppointments = async (req, res) => {
//   const { doctorId } = req.params;
//   try {
//     const [rows] = await pool.query(
//       `SELECT bf.id, bf.hospital, bf.session_date, bf.session_time,
//               COUNT(a.id) AS assigned_count
//        FROM bookingform bf
//        LEFT JOIN appointments a
//          ON a.doctor_id = bf.doctor_id
//          AND a.hospital = bf.hospital
//          AND a.session_date = bf.session_date
//          AND a.session_time = bf.session_time
//        WHERE bf.doctor_id = ?
//        GROUP BY bf.id, bf.hospital, bf.session_date, bf.session_time
//        ORDER BY bf.session_date, bf.session_time`,
//       [doctorId]
//     );

//     res.json({ appointments: rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Database error" });
//   }
// };



const pool = require("../config/db"); // Your MySQL2 pool

// GET all sessions for a doctor with assigned count
// exports.getDoctorSessions = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [rows] = await pool.query(
//       `SELECT bf.id, bf.hospital, bf.session_date, bf.session_time,
//               COUNT(a.id) AS assigned_count
//        FROM bookingform bf
//        LEFT JOIN appointments a
//          ON a.doctor_id = bf.doctor_id
//          AND a.hospital = bf.hospital
//          AND a.session_date = bf.session_date
//          AND a.session_time = bf.session_time
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

// GET doctor info
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

// PUT update appointment
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { hospital, session_date, session_time } = req.body;

  try {
    await pool.query(
      "UPDATE bookingform SET hospital=?, session_date=?, session_time=? WHERE id=?",
      [hospital, session_date, session_time, id]
    );
    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// DELETE appointment
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
