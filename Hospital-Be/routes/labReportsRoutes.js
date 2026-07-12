// const express = require("express");
// const router = express.Router();
// const labReportController = require("../controllers/labReportController");
// const multer = require('multer');

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, path.join(__dirname, "..", "uploads"));
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, uniqueSuffix + "-" + file.originalname);
// //   },
// // });

// // const upload = multer({ storage }); 

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// //  Get total lab reports count
// router.get("/count", labReportController.getLabReportsTotalCount);

// // Get all lab reports
// router.get("/", labReportController.getAllReports);

// //  Add new lab report
// router.post("/add", labReportController.addLabReport);

// // Update lab report by ID
// router.put("/update/:id", labReportController.updateLabReport);

// //  Delete lab report by ID
// router.delete("/delete/:id", labReportController.deleteLabReport);

// // Check lab report status by reference number
// router.get("/check/:referenceNumber", labReportController.checkLabReportStatus);

// // Get today’s lab reports count
// router.get("/count-today", labReportController.getTodayLabReportsCount);

// router.post(
//   "/upload/:id",
//   upload.single("reportFile"),
//   labReportController.uploadLabReportFile 
// );


// module.exports = router;




const express = require("express");
const router = express.Router();
const labReportController = require("../controllers/labReportController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image or PDF files are allowed for lab reports"));
  },
});

// ✅ FIXED: Add multer here
router.post("/add", upload.single("reportFile"), labReportController.addLabReport);

// Update lab report (also handle file)
router.put("/update/:id", upload.single("reportFile"), labReportController.updateLabReport);

router.get("/count", labReportController.getLabReportsTotalCount);
router.get("/", labReportController.getAllReports);
router.delete("/delete/:id", labReportController.deleteLabReport);
router.get("/check/:referenceNumber", labReportController.checkLabReportStatus);
router.get("/count-today", labReportController.getTodayLabReportsCount);

router.post("/upload/:id", upload.single("reportFile"), labReportController.uploadLabReportFile);

module.exports = router;

