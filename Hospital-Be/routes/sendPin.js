// // // // // POST /api/send-pin
// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const nodemailer = require('nodemailer');

// // // // router.post('/send-pin', async (req, res) => {
// // // //   const { email, pin } = req.body;
// // // //   if (!email || !pin) return res.status(400).json({ error: 'Email and PIN required' });

// // // //   try {
// // // //     const transporter = nodemailer.createTransport({
// // // //       service: 'Gmail',
// // // //       auth: {
// // // //         user: process.env.EMAIL_USER, // your Gmail
// // // //         pass: process.env.EMAIL_PASS, // app password
// // // //       },
// // // //     });

// // // //     await transporter.sendMail({
// // // //       from: `"My App" <${process.env.EMAIL_USER}>`,
// // // //       to: email,
// // // //       subject: 'Your Verification PIN',
// // // //       text: `Your verification PIN is: ${pin}`,
// // // //     });

// // // //     res.json({ message: 'PIN sent successfully' });
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).json({ error: 'Failed to send email' });
// // // //   }
// // // // });

// // // // module.exports = router;


// // // const express = require('express');
// // // const router = express.Router();
// // // const { sendOTPEmail } = require('../utils/emailService');


// // // router.post('/send-pin', async (req, res) => {
// // //   const { email, pin } = req.body;

// // //   if (!email || !pin) {
// // //     return res.status(400).json({ error: 'Email and PIN required' });
// // //   }

// // //   try {
// // //     await sendOTPEmail(email, pin);
// // //     res.json({ message: 'PIN sent successfully' });
// // //   } catch (error) {
// // //     console.error('Error sending PIN:', error);
// // //     res.status(500).json({ error: 'Failed to send email' });
// // //   }
// // // });

// // // module.exports = router;


// // // const express = require("express");
// // // const router = express.Router();
// // // const sendEmail = require("../utils/emailService");

// // // // TEMP store
// // // let otpStore = {};

// // // router.post("/send-otp", async (req, res) => {
// // //   const { email } = req.body;

// // //   if (!email) return res.status(400).json({ message: "Email is required" });

// // //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
// // //   otpStore[email] = otp;

// // //   try {
// // //     await sendEmail(
// // //       email,
// // //       "Your Verification Code",
// // //       `<h3>Your OTP Code</h3><h1>${otp}</h1>`
// // //     );

// // //     res.json({ message: "OTP sent successfully" });
// // //   } catch (err) {
// // //     console.error("OTP email error:", err);
// // //     res.status(500).json({ message: "Failed to send OTP" });
// // //   }
// // // });

// // // // Export correctly
// // // module.exports = router;
// // // module.exports.otpStore = otpStore;



// // const express = require("express");
// // const router = express.Router();
// // const crypto = require("crypto");
// // const { sendOTPEmail } = require("../utils/emailService");

// // router.post("/send-otp", async (req, res) => {
// //   const { email } = req.body;

// //   if (!email) return res.status(400).json({ error: "Email required" });

// //   const otp = Math.floor(100000 + Math.random() * 900000).toString();

// //   // Use global store
// //   global.otpStore = global.otpStore || {};
// //   const emailKey = email.trim().toLowerCase();
// //   global.otpStore[emailKey] = otp;

// //   // Automatically delete OTP after 5 minutes
// //   setTimeout(() => {
// //     delete global.otpStore[emailKey];
// //     console.log(`OTP for ${emailKey} expired`);
// //   }, 5 * 60 * 1000);

// //   try {
// //     await sendOTPEmail(email, otp); // sends email
// //     res.json({ message: "OTP sent successfully" });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: "Failed to send OTP" });
// //   }
// // });


// // module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { sendOTPEmail } = require("../utils/emailService");

// router.post("/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ success: false, message: "Email is required" });
//     }

//     // Normalize key
//     const emailKey = email.trim().toLowerCase();

//     // Ensure OTP store exists
//     global.otpStore = global.otpStore || {};

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     global.otpStore[emailKey] = otp;

//     // Auto-expire after 5 minutes
//     setTimeout(() => {
//       delete global.otpStore[emailKey];
//       console.log(`OTP expired for ${emailKey}`);
//     }, 5 * 60 * 1000);

//     await sendOTPEmail(email, otp);

//     return res.json({ success: true, message: "OTP sent successfully!" });

//   } catch (err) {
//     console.error("OTP send error:", err);
//     return res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// });

// module.exports = router;

//workinggggggg
const express = require("express");
const router = express.Router();
const { sendOTPEmail } = require("../utils/emailService");

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const emailKey = email.trim().toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global.otpStore = global.otpStore || {};
    global.otpStore[emailKey] = otp;

    // Auto expire in 5 min
    setTimeout(() => {
      delete global.otpStore[emailKey];
      console.log("OTP expired:", emailKey);
    }, 5 * 60 * 1000);

    await sendOTPEmail(email, otp);

    return res.json({ success: true, message: "OTP sent successfully!" });

  } catch (error) {
    console.error("OTP send error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

module.exports = router;






