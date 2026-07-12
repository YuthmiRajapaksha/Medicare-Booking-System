// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db"); 


// router.get("/:doctorId", async (req, res) => {
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

//     const available = sessions.filter(session => {
//       const key = `${session.session_date} ${session.session_time}`;
//       return (sessionMap[key] || 0) < MAX_BOOKINGS;
//     });

//     res.json(available);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error loading sessions" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const { getAvailableSessions } = require("../controllers/sessionController");

router.get("/:doctorId", getAvailableSessions);

module.exports = router;
