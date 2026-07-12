// // const express = require("express");
// // const router = express.Router();
// // const { otpStore } = require("./sendPin");

// // router.post("/verify-otp", (req, res) => {
// //   const { email, otp } = req.body;

// //   if (!otpStore[email])
// //     return res.status(400).json({ message: "OTP not found. Send OTP first." });

// //   if (otpStore[email] !== otp)
// //     return res.status(400).json({ message: "Invalid OTP" });

// //   delete otpStore[email];

// //   res.json({ message: "OTP verified" });
// // });

// // module.exports = router;

// // const express = require("express");
// // const router = express.Router();

// // router.post("/verify-otp", (req, res) => {
// //   const { email, otp } = req.body;

// //   if (!global.otpStore || !global.otpStore[email]) {
// //     return res.status(400).json({ success: false, message: "OTP expired or email not found" });
// //   }

// //   if (global.otpStore[email] !== otp) {
// //     return res.status(400).json({ success: false, message: "Invalid OTP" });
// //   }

// //   delete global.otpStore[email];

// //   return res.json({ success: true, message: "OTP verified successfully" });
// // });

// // module.exports = router;



// // const express = require("express");
// // const router = express.Router();

// // router.post("/verify-otp", (req, res) => {
// //   let { email, otp } = req.body;

// //   if (!email || !otp) {
// //     return res.status(400).json({ success: false, message: "Email and OTP required" });
// //   }

// //   // Normalize email
// //   const emailKey = email.trim().toLowerCase();

// //   if (!global.otpStore || !global.otpStore[emailKey]) {
// //     return res.status(400).json({ success: false, message: "OTP expired or email not found" });
// //   }

// //   // Convert both to string to avoid type issues
// //   if (String(global.otpStore[emailKey]) !== String(otp)) {
// //     return res.status(400).json({ success: false, message: "Invalid OTP" });
// //   }

// //   // OTP is correct → remove from store
// //   delete global.otpStore[emailKey];

// //   return res.json({ success: true, message: "OTP verified successfully" });
// // });

// // module.exports = router;



// const express = require("express");
// const router = express.Router();

// router.post("/verify-otp", (req, res) => {
//   let { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ success: false, message: "Email and OTP required" });
//   }

//   const emailKey = email.trim().toLowerCase();

// //   if (!global.otpStore || !global.otpStore[emailKey]) {
// //     return res.status(400).json({ success: false, message: "OTP expired or email not found" });
// //   }

// //   if (String(global.otpStore[emailKey]) !== String(otp)) {
// //     return res.status(400).json({ success: false, message: "Invalid OTP" });
// //   }

// if (!global.otpStore[emailKey]) {
//   return res.status(400).json({ success: false, message: "OTP expired or email not found" });
// }

// if (String(global.otpStore[emailKey]) !== String(otp)) {
//   return res.status(400).json({ success: false, message: "Invalid OTP" });
// }


//   delete global.otpStore[emailKey];

//   return res.json({ success: true, message: "OTP verified successfully" });
// });

// module.exports = router;



const express = require("express");
const router = express.Router();

router.post("/verify-otp", (req, res) => {
  let { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP required" });
  }

  const emailKey = email.trim().toLowerCase();

  if (!global.otpStore || !global.otpStore[emailKey]) {
    return res.status(400).json({ success: false, message: "OTP expired or email not found" });
  }

  if (String(global.otpStore[emailKey]) !== String(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete global.otpStore[emailKey];

  return res.json({ success: true, message: "OTP verified successfully" });
});

module.exports = router;
