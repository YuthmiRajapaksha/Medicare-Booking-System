
// const db = require('../config/db');
// const emailService = require("../utils/emailService");


// // exports.saveMultipleSessions = async (req, res) => {
// //   const { doctorId, sessions } = req.body;

// //   if (!doctorId || !Array.isArray(sessions) || sessions.length === 0) {
// //     return res.status(400).json({ message: "Missing required fields: doctorId and sessions" });
// //   }

// //   try {
    
// //     const validSessions = sessions.filter(
// //       session => session.hospital && session.date && session.time && session.time !== "--:--"
// //     );

// //     if (validSessions.length === 0) {
// //       return res.status(400).json({ message: "No valid session entries provided" });
// //     }


// //     for (const { hospital, date, time } of validSessions) {
// //       //  Get all existing sessions for same doctor/hospital/date
// //       const [existing] = await db.query(
// //         `SELECT session_time FROM bookingForm WHERE doctor_id = ? AND hospital = ? AND session_date = ?`,
// //         [doctorId, hospital, date]
// //       );

// //       const [hNew, mNew] = time.split(":").map(Number);
// //       const newMins = hNew * 60 + mNew;

// //       for (const row of existing) {
// //         const [hDb, mDb] = row.session_time.split(":").map(Number); //split into hours
// //         const dbMins = hDb * 60 + mDb; // convert to total minutes

// //         const diff = Math.abs(newMins - dbMins); // difference between sessions

// //         if (diff < 120) {
// //           return res.status(400).json({
// //             message: `Already scheduled.`
// //           });
// //         }
// //       }
// //     }
    
// //     await Promise.all(
// //       validSessions.map(({ hospital, date, time }) => {
// //         return db.query(
// //           `INSERT INTO bookingForm (doctor_id, hospital, session_date, session_time) VALUES (?, ?, ?, ?)`,
// //           [doctorId, hospital, date, time]
// //         );
// //       })
// //     );

// //     res.status(201).json({ message: "Appointments saved successfully" });
// //   } catch (error) {
// //     console.error("Error saving appointments:", error.sqlMessage || error.message);
// //     res.status(500).json({ message: "Database error", error: error.message });
// //   }
// // };


// const pool = require("../config/db");

// // Save multiple sessions (Admin)
// // exports.saveMultipleSessions = async (req, res) => {
// //   const { doctorId, sessions } = req.body;

// //   if (!doctorId || !Array.isArray(sessions) || sessions.length === 0) {
// //     return res.status(400).json({ message: "Missing doctorId or sessions" });
// //   }

// //   try {
// //     for (const { hospital, date, time, max_appointments } of sessions) {
// //       if (!hospital || !date || !time || time === "--:--") continue;

// //       // Check overlap within same doctor/hospital/date
// //       const [existing] = await pool.query(
// //         `SELECT session_time FROM bookingform WHERE doctor_id = ? AND hospital = ? AND session_date = ?`,
// //         [doctorId, hospital, date]
// //       );

// //       const [hNew, mNew] = time.split(":").map(Number);
// //       const newMins = hNew * 60 + mNew;

// //       for (const row of existing) {
// //         const [hDb, mDb] = row.session_time.split(":").map(Number);
// //         const dbMins = hDb * 60 + mDb;
// //         if (Math.abs(newMins - dbMins) < 120) {
// //           return res.status(400).json({ message: "Session overlaps with existing session" });
// //         }
// //       }

// //       await pool.query(
// //         `INSERT INTO bookingform (doctor_id, hospital, session_date, session_time, max_appointments)
// //          VALUES (?, ?, ?, ?, ?)`,
// //         [doctorId, hospital, date, time, max_appointments || 5]
// //       );
// //     }

// //     res.status(201).json({ message: "Sessions saved successfully" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Database error", error: err.message });
// //   }
// // };

// // ✅ Save multiple sessions with maxAppointments
// exports.saveMultipleSessions = async (req, res) => {
//   const { doctorId, sessions } = req.body;

//   if (!doctorId || !Array.isArray(sessions) || sessions.length === 0) {
//     return res.status(400).json({ message: "Missing required fields: doctorId and sessions" });
//   }

//   try {
//     const validSessions = sessions.filter(
//       (session) => session.hospital && session.date && session.time && session.time !== "--:--"
//     );

//     if (validSessions.length === 0) {
//       return res.status(400).json({ message: "No valid session entries provided" });
//     }

//     // Check time conflicts and save sessions
//     for (const { hospital, date, time, maxAppointments } of validSessions) {
//       const [existing] = await db.query(
//         `SELECT session_time FROM bookingForm WHERE doctor_id = ? AND hospital = ? AND session_date = ?`,
//         [doctorId, hospital, date]
//       );

//       const [hNew, mNew] = time.split(":").map(Number);
//       const newMins = hNew * 60 + mNew;

//       for (const row of existing) {
//         const [hDb, mDb] = row.session_time.split(":").map(Number);
//         const dbMins = hDb * 60 + mDb;
//         const diff = Math.abs(newMins - dbMins);
//         if (diff < 120) {
//           return res.status(400).json({
//             message: `Conflict: another session within 2 hours already scheduled at ${row.session_time}.`,
//           });
//         }
//       }

//       await db.query(
//         `INSERT INTO bookingForm (doctor_id, hospital, session_date, session_time, max_appointments)
//          VALUES (?, ?, ?, ?, ?)`,
//         [doctorId, hospital, date, time, max_appointments || 5]
//       );
//     }

//     res.status(201).json({ message: "Sessions saved successfully!" });
//   } catch (err) {
//     console.error("Error saving sessions:", err);
//     res.status(500).json({ message: "Server error while saving sessions" });
//   }
// };


// // in bookingFormController.js
// exports.addMultipleSessions = async (req, res) => {
//   const { doctorId, sessions } = req.body;
//   try {
//     for (const s of sessions) {
//       await db.query(
//         "INSERT INTO bookingform (doctor_id, hospital, session_date, session_time, max_appointments) VALUES (?, ?, ?, ?, ?)",
//         [doctorId, s.hospital, s.date, s.time, s.max_appointments]
//       );
//     }
//     res.status(200).json({ message: "Sessions saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Database error" });
//   }
// };


// // ✅ Get max appointments for a session
// exports.getMaxAppointments = async (req, res) => {
//   const { doctorId } = req.params;
//   const { hospital, sessionDate, sessionTime } = req.query;

//   try {
//     const [rows] = await db.query(
//       `SELECT max_appointments 
//        FROM bookingForm 
//        WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND session_time = ?`,
//       [doctorId, hospital, sessionDate, sessionTime]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.status(200).json({ max_appointments: rows[0].max_appointments });
//   } catch (err) {
//     console.error("Error fetching maxAppointments:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };


// // Get sessions with availability
// exports.getAvailableSessions = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [sessions] = await pool.query(
//       `SELECT id, session_date, session_time, hospital, max_appointments
//        FROM bookingform
//        WHERE doctor_id = ? AND session_date >= CURDATE()
//        ORDER BY session_date ASC, session_time ASC`,
//       [doctorId]
//     );

//     const [counts] = await pool.query(
//       `SELECT bookingform_id, COUNT(*) AS count
//        FROM appointments
//        WHERE doctor_id = ?
//        GROUP BY bookingform_id`,
//       [doctorId]
//     );

//     const sessionMap = {};
//     counts.forEach(row => {
//       sessionMap[row.bookingform_id] = row.count;
//     });

//     const available = sessions.map((session) => {
//       const currentCount = sessionMap[session.id] || 0;
//       const remaining = session.max_appointments - currentCount;
//       return { ...session, remaining };
//     });

//     res.json(available);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error loading sessions" });
//   }
// };



// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   if (!doctorId) {
//     return res.status(400).json({ message: "Missing doctorId parameter" });
//   }

//   try {
//     const [results] = await db.query(
//       `SELECT id, hospital, session_date, session_time 
//        FROM bookingForm 
//        WHERE doctor_id = ? 
//        ORDER BY session_date ASC, session_time ASC`,
//       [doctorId]
//     );

//     res.json({ appointments: results });
//   } catch (err) {
//     console.error('Error fetching appointments:', err);
//     res.status(500).json({ message: 'Error fetching appointments' });
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


// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   const { hospital, session_date, session_time } = req.body;

//   if (!hospital || !session_date || !session_time) {
//     return res.status(400).json({ message: "Missing fields: hospital, session_date, and session_time are required" });
//   }

//   try {

//      const [bookingForm] = await db.query(
//       'SELECT doctor_id FROM bookingForm WHERE id = ?',
//       [id]
//     );

//     if (bookingForm.length === 0) {
//       return res.status(404).json({ message: "BookingForm not found" });
//     }

//     const doctorId = bookingForm[0].doctor_id;

//     // Get other sessions for same doctor/hospital/date, excluding this one
//     const [existing] = await db.query(
//       `SELECT session_time FROM bookingForm 
//        WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND id != ?`,
//       [doctorId, hospital, session_date, id]
//     );

//     // Check for overlaps
//     const [hNew, mNew] = session_time.split(":").map(Number);
//     const newMins = hNew * 60 + mNew;

//     for (const row of existing) {
//       const [hDb, mDb] = row.session_time.split(":").map(Number);
//       const dbMins = hDb * 60 + mDb;

//       const diff = Math.abs(newMins - dbMins);

//       if (diff < 120) {
//         return res.status(400).json({
//           message: `This session overlaps with an existing one for this doctor. Must be at least 2 hours apart.`
//         });
//       }
//     }
   
//     const [result] = await db.query(
//       'UPDATE bookingForm SET hospital = ?, session_date = ?, session_time = ? WHERE id = ?',
//       [hospital, session_date, session_time, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "BookingForm not found" });
//     }


   
//     const [appointments] = await db.query(
//       `SELECT * FROM appointments WHERE bookingform_id = ? AND status = 'active'`,
//       [id]
//     );

//     if (appointments.length === 0) {
//       return res.json({
//         message: "BookingForm updated. No active linked appointments to update or notify.",
//       });
//     }

    
   
//     await db.query(
//       `UPDATE appointments SET hospital = ?, session_date = ?, session_time = ? WHERE bookingform_id = ? AND status = 'active'`,
//       [hospital, session_date, session_time, id]
//     );

    
//     for (const appt of appointments) {
//       await emailService.sendAppointmentUpdateEmail({
//         patientName: appt.patient_name,
//         email: appt.email,
//         doctorName: appt.doctor_name,
//         hospital,
//         sessionDate: session_date,
//         sessionTime: session_time,
//       });
//     }

//     res.json({
//       message: `BookingForm and ${appointments.length} active appointments updated. Patients notified.`,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating bookingForm" });
//   }
// };




// exports.deleteAppointment = async (req, res) => {
//   const { id } = req.params;

//   try {



//     const [result] = await db.query('DELETE FROM bookingForm WHERE id = ?', [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.json({ message: 'Appointment deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting appointment:', err);
//     res.status(500).json({ message: 'Error deleting appointment' });
//   }
// };


const db = require("../config/db");
const emailService = require("../utils/emailService");
const { sendDoctorArrivedEmail,sendAppointmentUpdateEmail, } = require("../utils/emailService");


// ✅ Save multiple sessions with max_appointments
exports.saveMultipleSessions = async (req, res) => {
  const { doctorId, sessions } = req.body;

  if (!doctorId || !Array.isArray(sessions) || sessions.length === 0) {
    return res.status(400).json({ message: "Missing required fields: doctorId and sessions" });
  }

  try {
    const validSessions = sessions.filter(
      (session) => session.hospital && session.date && session.time && session.time !== "--:--"
    );

    if (validSessions.length === 0) {
      return res.status(400).json({ message: "No valid session entries provided" });
    }

    // ✅ Check time conflicts and save sessions
    for (const { hospital, date, time, max_appointments } of validSessions) {
      const [existing] = await db.query(
        `SELECT session_time FROM bookingForm WHERE doctor_id = ? AND hospital = ? AND session_date = ?`,
        [doctorId, hospital, date]
      );

      const [hNew, mNew] = time.split(":").map(Number);
      const newMins = hNew * 60 + mNew;

      for (const row of existing) {
        const [hDb, mDb] = row.session_time.split(":").map(Number);
        const dbMins = hDb * 60 + mDb;
        const diff = Math.abs(newMins - dbMins);

        if (diff < 120) {
          return res.status(400).json({
            message: `Conflict: another session within 2 hours already scheduled at ${row.session_time}.`,
          });
        }
      }

      await db.query(
        `INSERT INTO bookingForm (doctor_id, hospital, session_date, session_time, max_appointments)
         VALUES (?, ?, ?, ?, ?)`,
        [doctorId, hospital, date, time, max_appointments || 5]
      );
    }

    res.status(201).json({ message: "Sessions saved successfully!" });
  } catch (err) {
    console.error("Error saving sessions:", err);
    res.status(500).json({ message: "Server error while saving sessions" });
  }
};


// ✅ Get max appointments for a specific session
exports.getMaxAppointments = async (req, res) => {
  const { doctorId } = req.params;
  const { hospital, sessionDate, sessionTime } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT max_appointments 
       FROM bookingForm 
       WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND session_time = ?`,
      [doctorId, hospital, sessionDate, sessionTime]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ max_appointments: rows[0].max_appointments });
  } catch (err) {
    console.error("Error fetching maxAppointments:", err);
    res.status(500).json({ message: "Database error" });
  }
};


// ✅ Get available sessions and remaining slots
exports.getAvailableSessions = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [sessions] = await db.query(
      `SELECT id, session_date, session_time, hospital, max_appointments
       FROM bookingForm
       WHERE doctor_id = ? AND session_date >= CURDATE()
       ORDER BY session_date ASC, session_time ASC`,
      [doctorId]
    );

    const [counts] = await db.query(
      `SELECT bookingform_id, COUNT(*) AS count
       FROM appointments
       WHERE doctor_id = ?
       GROUP BY bookingform_id`,
      [doctorId]
    );

    const sessionMap = {};
    counts.forEach(row => {
      sessionMap[row.bookingform_id] = row.count;
    });

    const available = sessions.map((session) => {
      const currentCount = sessionMap[session.id] || 0;
      const remaining = session.max_appointments - currentCount;
      return { ...session, remaining };
    });

    res.json(available);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error loading sessions" });
  }
};


// ✅ Get all appointments for a doctor
// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   if (!doctorId) {
//     return res.status(400).json({ message: "Missing doctorId parameter" });
//   }

//   try {
//     const [results] = await db.query(
//       `SELECT id, hospital, session_date, session_time 
//        FROM bookingForm 
//        WHERE doctor_id = ? 
//        ORDER BY session_date ASC, session_time ASC`,
//       [doctorId]
//     );

//     res.json({ appointments: results });
//   } catch (err) {
//     console.error('Error fetching appointments:', err);
//     res.status(500).json({ message: 'Error fetching appointments' });
//   }
// };


// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   if (!doctorId) {
//     return res.status(400).json({ message: "Missing doctorId parameter" });
//   }

//   try {
//     const [results] = await db.query(
//       `SELECT b.id, b.hospital, b.session_date, b.session_time,
//               COUNT(a.id) AS activeAppointments
//        FROM bookingForm b
//        LEFT JOIN appointments a
//          ON a.bookingform_id = b.id AND a.status = 'active'
//        WHERE b.doctor_id = ?
//        GROUP BY b.id, b.hospital, b.session_date, b.session_time
//        ORDER BY b.session_date ASC, b.session_time ASC`,
//       [doctorId]
//     );

//     res.json({ appointments: results });
//   } catch (err) {
//     console.error('Error fetching appointments:', err);
//     res.status(500).json({ message: 'Error fetching appointments' });
//   }
// };

// bookingFormController.js

// bookingFormController.js
// exports.getAppointmentsByDoctor = async (req, res) => {
//   const { doctorId } = req.params;

//   try {
//     const [sessions] = await db.query(
//       `SELECT b.*, 
//               COALESCE(a.total, 0) AS activeCount
//        FROM bookingForm b
//        LEFT JOIN (
//          SELECT bookingform_id, COUNT(*) AS total
//          FROM appointments
//          WHERE status='active'
//          GROUP BY bookingform_id
//        ) a ON a.bookingform_id = b.id
//        WHERE b.doctor_id = ?
//        ORDER BY b.session_date ASC, b.session_time ASC`,
//       [doctorId]
//     );

//     // Fetch all appointments linked to these sessions
//     const sessionIds = sessions.map((s) => s.id);
//     const [assigned] = await db.query(
//       `SELECT * FROM appointments 
//        WHERE bookingform_id IN (?) AND status='active'`,
//       [sessionIds]
//     );

//     // Map appointments under their session
//     const sessionMap = sessions.map((s) => ({
//       ...s,
//       assignedAppointments: assigned.filter((a) => a.bookingform_id === s.id),
//     }));

//     res.json({ appointments: sessionMap });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Database error" });
//   }
// };


exports.getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [sessions] = await db.query(
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
      WHERE b.doctor_id = ?
      GROUP BY
        b.id,
        b.doctor_id,
        b.hospital,
        b.session_date,
        b.session_time,
        b.max_appointments
      ORDER BY
        b.session_date ASC,
        b.session_time ASC
      `,
      [doctorId]
    );

    const sessionIds = sessions.map((s) => s.id);

    let assigned = [];

    if (sessionIds.length > 0) {
      const [rows] = await db.query(
        `
        SELECT *
        FROM appointments
        WHERE bookingform_id IN (?)
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
    console.error(err);
    res.status(500).json({
      message: "Database error",
    });
  }
};



// ✅ Update a session
// exports.updateAppointment = async (req, res) => {
//   const { id } = req.params;
//   const { hospital, session_date, session_time } = req.body;

//   if (!hospital || !session_date || !session_time) {
//     return res.status(400).json({ message: "Missing fields: hospital, session_date, and session_time are required" });
//   }

//   try {
//     const [bookingForm] = await db.query(
//       'SELECT doctor_id FROM bookingForm WHERE id = ?',
//       [id]
//     );

//     if (bookingForm.length === 0) {
//       return res.status(404).json({ message: "BookingForm not found" });
//     }

//     const doctorId = bookingForm[0].doctor_id;

//     // Check for overlaps
//     const [existing] = await db.query(
//       `SELECT session_time FROM bookingForm 
//        WHERE doctor_id = ? AND hospital = ? AND session_date = ? AND id != ?`,
//       [doctorId, hospital, session_date, id]
//     );

//     const [hNew, mNew] = session_time.split(":").map(Number);
//     const newMins = hNew * 60 + mNew;

//     for (const row of existing) {
//       const [hDb, mDb] = row.session_time.split(":").map(Number);
//       const dbMins = hDb * 60 + mDb;
//       if (Math.abs(newMins - dbMins) < 120) {
//         return res.status(400).json({
//           message: `This session overlaps with an existing one for this doctor. Must be at least 2 hours apart.`,
//         });
//       }
//     }

//     const [result] = await db.query(
//       'UPDATE bookingForm SET hospital = ?, session_date = ?, session_time = ? WHERE id = ?',
//       [hospital, session_date, session_time, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "BookingForm not found" });
//     }

//     res.json({ message: "BookingForm updated successfully" });
//   } catch (err) {
//     console.error("Error updating bookingForm:", err);
//     res.status(500).json({ message: "Error updating bookingForm" });
//   }
// };


exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { hospital, session_date, session_time } = req.body;

  if (!hospital || !session_date || !session_time) {
    return res.status(400).json({
      message: "Missing fields"
    });
  }

  try {

    // Get doctor id
    const [bookingForm] = await db.query(
      'SELECT doctor_id FROM bookingForm WHERE id = ?',
      [id]
    );

    if (bookingForm.length === 0) {
      return res.status(404).json({
        message: "BookingForm not found"
      });
    }


    const doctorId = bookingForm[0].doctor_id;


    // Check overlapping sessions
    const [existing] = await db.query(
      `SELECT session_time 
       FROM bookingForm
       WHERE doctor_id = ?
       AND hospital = ?
       AND session_date = ?
       AND id != ?`,
      [
        doctorId,
        hospital,
        session_date,
        id
      ]
    );


    const [hNew, mNew] = session_time.split(":").map(Number);
    const newMins = hNew * 60 + mNew;


    for (const row of existing) {

      const [hDb, mDb] = row.session_time.split(":").map(Number);
      const dbMins = hDb * 60 + mDb;

      if(Math.abs(newMins-dbMins)<120){

        return res.status(400).json({
          message:"Session overlaps"
        });

      }
    }



    // Update bookingForm
    await db.query(
      `UPDATE bookingForm
       SET hospital=?,
           session_date=?,
           session_time=?
       WHERE id=?`,
      [
        hospital,
        session_date,
        session_time,
        id
      ]
    );



    // Get patients
    const [patients] = await db.query(
      `SELECT *
       FROM appointments
       WHERE bookingform_id = ?
       AND status != 'cancelled'`,
       [id]
    );


    console.log("Patients found:", patients.length);



    // Update appointments
    await db.query(
      `UPDATE appointments
       SET hospital=?,
           session_date=?,
           session_time=?
       WHERE bookingform_id=?
       AND status!='cancelled'`,
       [
        hospital,
        session_date,
        session_time,
        id
       ]
    );



    // Send emails
    for(const patient of patients){

      console.log("Sending email:", patient.email);


      await sendAppointmentUpdateEmail({

        patientName: patient.patient_name,
        email: patient.email,
        doctorName: patient.doctor_name,
        hospital,
        sessionDate: session_date,
        sessionTime: session_time

      });


      console.log("Email sent:", patient.email);

    }



    res.json({
      message:`Booking updated. ${patients.length} patients notified`
    });



  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }
};


// ✅ Delete appointment/session
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM bookingForm WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};




// ✅ Get single booking form by ID (with appointment count)
exports.getBookingFormById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        bf.id,
        bf.doctor_id,
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
        AND a.session_time = bf.session_time
      WHERE bf.id = ?
      GROUP BY bf.id, bf.doctor_id, bf.hospital, bf.session_date, bf.session_time, bf.max_appointments
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching booking form:", err);
    res.status(500).json({ message: "Database error" });
  }
};




