
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticateToken");


router.post("/doctor-login", authController.doctorAdminLogin);
router.post("/check-email", authController.checkEmail);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.put("/change-user-password", authenticateToken, authController.changeUserPassword);
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});



module.exports = router;





// router.get("/notifications", async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT * FROM notifications 
//       ORDER BY created_at DESC 
//       LIMIT 5
//     `);

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Doctor/Admin login
// router.post("/doctor-login", authController.doctorAdminLogin);

// // Site user registration
// router.post("/register", authController.registerUser);

// // Site user login
// router.post("/login", authController.loginUser);

// // Doctor password change
// router.put("/change-password", authenticateToken, authController.changePassword);

// // Test protected route
// router.get("/protected", authenticateToken, (req, res) => {
//   res.json({ message: "Protected route accessed", user: req.user });
// });


// // Check email before OTP
// router.post("/check-email", authController.checkEmail);

// router.post("/verify-otp", authController.verifyOTP);


// router.post("/send-otp", authController.sendOTP);




// module.exports = router;




// // const express = require("express");
// // const router = express.Router();
// // const authController = require("../controllers/authController");
// // const authenticateToken = require("../middleware/authenticateToken");


// // router.post("/login", authController.login);


// // router.post("/register", authController.registerUser);


// // router.post("/user-login", authController.loginUser);

// // router.put("/change-password", authenticateToken, authController.changePassword);


// // router.get("/protected", authenticateToken, (req, res) => {
// //   res.json({ message: "Protected route accessed", user: req.user });
// // });

// // module.exports = router;





