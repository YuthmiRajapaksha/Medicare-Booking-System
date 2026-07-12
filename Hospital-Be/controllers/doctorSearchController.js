

const db = require("../config/db");

exports.searchDoctors = async (req, res) => {
  try {
    const { doctorId, hospital, session_date, specialization, doctor_name } = req.query;

    let sql = `
      SELECT bookingform.*, doctors.name AS doctor_name, doctors.specialization, doctors.photo
      FROM bookingform
      JOIN doctors ON bookingform.doctor_id = doctors.id
      WHERE 1=1
    `;

    const params = [];

    if (doctorId) {
      sql += " AND bookingform.doctor_id = ?";
      params.push(doctorId);
    }

    if (hospital) {
      sql += " AND bookingform.hospital LIKE ?";
      params.push(`%${hospital}%`);
    }

    if (session_date) {
      sql += " AND bookingform.session_date = ?";
      params.push(session_date);
    }

    if (specialization) {
      sql += " AND doctors.specialization LIKE ?";
      params.push(`%${specialization}%`);
    }

    if (doctor_name) {
      sql += " AND doctors.name LIKE ?";
      params.push(`%${doctor_name}%`);
    }

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


