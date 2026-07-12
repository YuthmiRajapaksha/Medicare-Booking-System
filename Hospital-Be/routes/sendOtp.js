// // const express = require("express");
// // const router = express.Router();
// // const sendEmail = require("../utils/emailService");

// // let otpStore = {}; // temp memory

// // router.post("/send-otp", async (req, res) => {
// //   const { email } = req.body;

// //   if (!email) return res.status(400).json({ error: "Email required" });

// //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
// //   otpStore[email] = otp;

// //   await sendEmail(
// //     email,
// //     "Your Verification Code",
// //     `<h2>Your OTP is:</h2><h1>${otp}</h1>`
// //   );

// //   res.json({ message: "OTP sent successfully" });
// // });

// // module.exports = { router, otpStore };


// const express = require("express");
// const router = express.Router();
// const { sendOTPEmail } = require("../utils/emailService");

// router.post("/send-otp", async (req, res) => {
//   const { email } = req.body;

//   if (!email) return res.status(400).json({ error: "Email required" });

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // Use global store
//   global.otpStore = global.otpStore || {};
//   const emailKey = email.trim().toLowerCase();
//   global.otpStore[emailKey] = otp;

//   // Automatically delete OTP after 5 minutes
//   setTimeout(() => {
//     delete global.otpStore[emailKey];
//     console.log(`OTP for ${emailKey} expired`);
//   }, 5 * 60 * 1000);

//   try {
//     await sendOTPEmail(email, otp); // sends email
//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// });


// // router.post("/send-otp", async (req, res) => {
// //   const { email } = req.body;

// //   if (!email) return res.status(400).json({ error: "Email required" });

// //   const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //   // Use global store instead of local variable
// //   global.otpStore = global.otpStore || {};
// //   global.otpStore[email.trim().toLowerCase()] = otp;

// //   try {
// //     await sendOTPEmail(email, otp); // sends email
// //     res.json({ message: "OTP sent successfully" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to send OTP" });
// //   }
// // });

// module.exports = router;
