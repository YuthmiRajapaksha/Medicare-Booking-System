// const express = require("express");
// const router = express.Router();
// const appointmentsController = require("../controllers/appointmentsController");
// const authenticateToken = require("../middleware/authenticateToken");

// // Create appointment 
// // router.post("/", authenticateToken, appointmentsController.createAppointment);

// // ✅ Allow booking without login
// router.post("/", appointmentsController.createAppointment);


// // router.post("/", bookAppointment);

// // Change appointment status 
// router.put("/appointments/:id/status", authenticateToken, appointmentsController.changeAppointmentStatus);
// router.put("/appointments/:id/status", appointmentsController.changeAppointmentStatus);



// // Get cancelled appointments for a doctor
// router.get("/api/appointments/doctor/:doctorId/cancelled", appointmentsController.getCancelledAppointmentsByDoctor);

// // Count appointments for a doctor in a session
// router.get('/count/:doctorId', appointmentsController.countAppointments);

// // Get appointments by doctor id
// // router.get("/doctor/:doctorId", appointmentsController.getAppointmentsByDoctorId);
// // Get appointments by doctor id
// router.get("/doctor/:doctorId", appointmentsController.getAppointmentsByDoctor);


// // Get logged-in user's appointments (My Bookings)

// // router.get("/api/appointments/my", authenticateToken, appointmentsController.getMyAppointments);


// router.get("/my", authenticateToken, appointmentsController.getMyAppointments);

// // Get doctor by id
// router.get("/api/doctors/:id", appointmentsController.getDoctorById);

// // Get all doctors with patient count
// router.get("/api/doctors", appointmentsController.getAllDoctorsWithPatientCount);

// // Get all doctors with patient count and revenue
// // router.get("/api/doctors-with-patient-count", appointmentsController.getAllDoctorsWithPatientCountAndRevenue);

// // // Get patient count for a specific doctor
// // router.get("/api/doctors/:id/patient-count", appointmentsController.getPatientCountByDoctor);

// router.get("/doctors-with-patient-count", appointmentsController.getAllDoctorsWithPatientCountAndRevenue);
// router.get("/doctors/:id/patient-count", appointmentsController.getPatientCountByDoctor);
// router.get("/doctors/:id/daily-stats", appointmentsController.getDailyStatsByDoctor);


// router.get("/count-all", appointmentsController.getTotalAppointmentsCount);

// router.get("/count-today", appointmentsController.getTodayAppointmentsCount);

// router.get("/count-week", appointmentsController.getWeekAppointmentsCount);



// router.get("/api/appointments/doctor/:doctorId", appointmentsController.getAppointmentsByDoctor);


// //Get patients with revenue
// // router.get("/api/doctors/:id/daily-stats", appointmentsController.getDailyStatsByDoctor);

// router.post("/cancelByPatient/:id", authenticateToken, appointmentsController.cancelAppointmentByPatient);


// router.get("/doctor/:doctorId", appointmentsController.getAppointmentsByDoctor);

// module.exports = router;




const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const authenticateToken = require("../middleware/authenticateToken");
// Import the controller function
const { changeAppointmentStatus } = require("../controllers/appointmentsController");
const { getStatusCounts } = require("../controllers/appointmentsController"); // 👈 must be imported
const authenticateTokenOptional = require("../middleware/authenticateTokenOptional");

// Create appointment (allow without login)
// router.post("/",  appointmentsController.createAppointment);
// router.post("/", authenticateToken, appointmentsController.createAppointment);

// ✅ Booking (guest + logged)
router.post("/", authenticateTokenOptional, appointmentsController.createAppointment);

// Get logged-in user's appointments
router.get("/my", authenticateToken, appointmentsController.getMyAppointments);
router.get("/my/:id", appointmentsController.getAppointmentsByUserId);

// // Get all doctors with patient count and revenue
//  router.get("/api/doctors-with-patient-count", appointmentsController.getAllDoctorsWithPatientCountAndRevenue);

// // // Get patient count for a specific doctor
router.get("/api/doctors/:id/patient-count", appointmentsController.getPatientCountByDoctor);

// Doctor cancels appointment (no token required)
router.put("/:id/status", changeAppointmentStatus);

// //Get patients with revenue
router.get("/api/doctors/:id/daily-stats", appointmentsController.getDailyStatsByDoctor);

//  router.get("/doctors-with-patient-count", appointmentsController.getAllDoctorsWithPatientCountAndRevenue);

router.get("/api/doctors-with-patient-count", appointmentsController.getAllDoctorsWithPatientCountAndRevenue);

// Change appointment status (requires login)
// router.put("/appointments/:id/status", authenticateToken, appointmentsController.changeAppointmentStatus);

// Cancel appointment by patient
router.post("/cancelByPatient/:id", authenticateToken, appointmentsController.cancelAppointmentByPatient);

// Get appointments by doctor id
router.get("/doctor/:doctorId", appointmentsController.getAppointmentsByDoctor);

// Get cancelled appointments for a doctor
router.get("/doctor/:doctorId/cancelled", appointmentsController.getCancelledAppointmentsByDoctor);

// Count appointments for a doctor in a session
router.get("/count/:doctorId", appointmentsController.countAppointments);

// Get patient count + revenue per day for a doctor
// router.get("/api/doctors/:id/daily-stats", appointmentsController.getDailyStatsByDoctor);





// router.post("/notify-doctor-arrived",appointmentsController.notifyPatientsDoctorArrived);

console.log("Registering notify-doctor-arrived route");

router.post(
  "/notify-doctor-arrived",
//   authenticateToken,
  appointmentsController.notifyDoctorArrived
);

// Appointment stats
router.get("/count-all", appointmentsController.getTotalAppointmentsCount);
router.get("/count-today", appointmentsController.getTodayAppointmentsCount);
router.get("/count-week", appointmentsController.getWeekAppointmentsCount);

router.get(
  "/payment-details/:doctorId/:date",
  appointmentsController.getPaymentDetails
);

router.get(
  "/session-patients/:bookingformId",
  appointmentsController.getSessionPatients
);

// router.get("/doctor/:doctorId/status-count", appointmentsController.getStatusCounts);


router.get("/status-count",appointmentsController. getStatusCounts);

module.exports = router;
