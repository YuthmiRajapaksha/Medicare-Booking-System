
const db = require("../config/db");
const path = require('path');


exports.getAllReports = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM lab_reports ORDER BY id DESC");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error getting reports:", err);
    res.status(500).json({ message: "Database error" });
  }
};


// exports.addLabReport = async (req, res) => {
//   let { reference_number, patient_name, test_name, report_date, status } = req.body;

//   if (!patient_name || !test_name || !report_date || !status) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   if (!reference_number) {
//     reference_number = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
//   }

//   try {
//     await db.query(
//       `INSERT INTO lab_reports (reference_number, patient_name, test_name, report_date, status)
//        VALUES (?, ?, ?, ?, ?)`,
//       [reference_number, patient_name, test_name, report_date, status]
//     );
//     res.status(201).json({ message: "Report added", reference_number });
//   } catch (err) {
//     console.error("Insert error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };


exports.addLabReport = async (req, res) => {
  try {
    let { reference_number, patient_name, test_name, report_date, status } = req.body;
    const file = req.file;

    if (!patient_name || !test_name || !report_date || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!reference_number) {
      reference_number = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // If file is uploaded, save its path
    const reportFileUrl = file ? `/uploads/${file.filename}` : null;

    await db.query(
      `INSERT INTO lab_reports (reference_number, patient_name, test_name, report_date, status, report_file_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [reference_number, patient_name, test_name, report_date, status, reportFileUrl]
    );

    res.status(201).json({ message: "Lab report added successfully", reference_number, reportFileUrl });
  } catch (err) {
    console.error("Add report error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateLabReport = async (req, res) => {
  const { id } = req.params;
  const { reference_number, patient_name, test_name, report_date, status } = req.body;
  const file = req.file;

  if (!patient_name || !test_name || !report_date || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const reportFileUrl = file ? `/uploads/${file.filename}` : null;

  try {
    const [result] = await db.query(
      `UPDATE lab_reports 
       SET reference_number = ?, patient_name = ?, test_name = ?, report_date = ?, status = ?, report_file_url = COALESCE(?, report_file_url)
       WHERE id = ?`,
      [reference_number, patient_name, test_name, report_date, status, reportFileUrl, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lab report not found" });
    }

    res.status(200).json({ message: "Report updated", reportFileUrl });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Database error" });
  }
};



// exports.updateLabReport = async (req, res) => {
//   const { id } = req.params;
//   const { reference_number, patient_name, test_name, report_date, status } = req.body;
// const file = req.file;
//   try {
//     const [result] = await db.query(
//       `UPDATE lab_reports SET reference_number = ?, patient_name = ?, test_name = ?, report_date = ?, status = ? WHERE id = ?`,
//       [reference_number, patient_name, test_name, report_date, status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Lab report not found" });
//     }

//     res.status(200).json({ message: "Report updated" });
//   } catch (err) {
//     console.error("Update error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };

exports.uploadLabReportFile = async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  const fileUrl = `/uploads/${file.filename}`;

  try {
    await db.query(`UPDATE lab_reports SET report_file_url = ? WHERE id = ?`, [fileUrl, id]);
    res.json({ message: "File uploaded successfully", fileUrl });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: "Database error" });
  }
};


exports.deleteLabReport = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM lab_reports WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lab report not found" });
    }

    res.status(200).json({ message: "Report deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Database error" });
  }
};


// exports.checkLabReportStatus = async (req, res) => {
//   const { referenceNumber } = req.params;

//   try {
//     const [results] = await db.query(
//       "SELECT status FROM lab_reports WHERE reference_number = ?",
//       [referenceNumber]
//     );

//     if (results.length === 0) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     res.status(200).json({ status: results[0].status });
//   } catch (err) {
//     console.error("Status check error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };

// ✅ Fetch report by reference number and include file URL
exports.checkLabReportStatus = async (req, res) => {
  const { referenceNumber } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT status, report_file_url FROM lab_reports WHERE reference_number = ?",
      [referenceNumber]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ status: rows[0].status, fileUrl: rows[0].report_file_url });
  } catch (err) {
    console.error("Check status error:", err);
    res.status(500).json({ message: "Database error" });
  }
};


exports.getTodayLabReportsCount = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS count FROM lab_reports WHERE DATE(report_date) = CURDATE()`
    );
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error("Error fetching today's lab reports count:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getLabReportsTotalCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM lab_reports");
    const count = rows?.[0]?.count ?? 0;
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error retrieving lab reports count:", err);
    res.status(500).json({ message: "Database error" });
  }
};


// exports.uploadLabReportFile = async (req, res) => {
//   const reportId = req.params.id;
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

  
//   const fileUrl = `/uploads/${file.filename}`;

//   try {
//     await db.query(
//       `UPDATE lab_reports SET report_file_url = ? WHERE id = ?`,
//       [fileUrl, reportId]
//     );

//     res.json({ message: "Report uploaded successfully", url: fileUrl });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Database error" });
//   }
// };