// const pool = require("../config/db");

// exports.getAvailableSessions = async (req, res) => {
//   const { doctorId } = req.params;
//   const MAX_BOOKINGS = 5;

//   try {
//     const [sessions] = await pool.query(
//       `SELECT session_date, session_time
//        FROM bookingform
//        WHERE doctor_id = ?
//        GROUP BY session_date, session_time`,
//       [doctorId]
//     );

//     const [counts] = await pool.query(
//       `SELECT session_date, session_time, COUNT(*) AS count
//        FROM appointments
//        WHERE doctor_id = ?
//        GROUP BY session_date, session_time`,
//       [doctorId]
//     );

//     const sessionMap = {};
//     counts.forEach(row => {
//       const key = `${row.session_date} ${row.session_time}`;
//       sessionMap[key] = row.count;
//     });

//     // const available = sessions.filter(session => {
//     //   const key = `${session.session_date} ${session.session_time}`;
//     //   return (sessionMap[key] || 0) < MAX_BOOKINGS;
//     // });

//     const available = sessions.filter(session => {
//       const key = `${session.session_date} ${session.session_time}`;
//       const currentCount = sessionMap[key] || 0;
//       const maxAllowed = session.max_appointments || 5; // fallback if null
//       return currentCount < maxAllowed;
//     });

//     res.json(available);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error loading sessions" });
//   }
// };

const pool = require("../config/db");


// Example: Get sessions with availability
exports.getAvailableSessions = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [sessions] = await pool.query(
      `SELECT id, session_date, session_time, hospital, max_appointments
       FROM bookingform
       WHERE doctor_id = ? AND session_date >= CURDATE()
       ORDER BY session_date ASC, session_time ASC`,
      [doctorId]
    );

    const [counts] = await pool.query(
      `SELECT bookingform_id, COUNT(*) AS count
       FROM appointments
       WHERE doctor_id = ?
       GROUP BY bookingform_id`,
      [doctorId]
    );

    const sessionMap = {};
    counts.forEach((row) => {
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
