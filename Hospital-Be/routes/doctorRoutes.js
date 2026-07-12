
const db = require("../config/db");
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const multer = require("multer");
const authenticateToken = require("../middleware/authenticateToken");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed for doctor photos"));
  },
});


router.post("/add", upload.single("photo"), doctorController.addDoctor);
router.get("/", doctorController.getDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/update/:id", upload.single("photo"), doctorController.updateDoctor);
router.delete("/delete/:id", doctorController.deleteDoctor);
router.put("/change-password", authenticateToken, doctorController.changePassword);
// Count doctors
router.get("/count/all", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM doctors");
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error("Error counting doctors:", error);
    res.status(500).json({ error: "Failed to count doctors" });
  }
});


module.exports = router;
