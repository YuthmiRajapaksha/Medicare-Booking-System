const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  ignoreTLS: true,
});

exports.transporter = transporter;


exports.sendAppointmentEmail = async ({
  patientName,
  email,
  doctorName,
  hospital,
  sessionDate,
  sessionTime,
   estimatedTime,
  phone,
  country,
  nic,
  charge,
  appointmentNumber // added
}) => {
  const mailOptions = {
    from: 'nirajapaksha1998@gmail.com',
    to: email,
    subject: 'Confirmation of Your Appointment',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Appointment Confirmation</title>
        <style>
          body {
            background-color: #f5f7fa;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .header {
            background-color: #002a68;
            color: #ffffff;
            padding: 20px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
            color: #333333;
          }
          .content h2 {
            margin-top: 0;
            color: #003f9c;
          }
          .details {
            margin: 20px 0;
          }
          .details p {
            margin: 8px 0;
            line-height: 1.5;
          }
          .footer {
            background-color: #f0f0f0;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Book Appointment</h1>
          </div>
          <div class="content">
            <h2>Confirm Your Booking Details</h2>
            <div class="details">
            <p><strong>Appointment Number:</strong> ${appointmentNumber}</p>
              <p><strong>Doctor:</strong> ${doctorName}</p>
              <p><strong>Hospital:</strong> ${hospital} MediCare Hospital</p>
              <p><strong>Session Date:</strong> ${sessionDate}</p>
              <p><strong>Session Time:</strong> ${sessionTime}</p>
              <p><b>Estimated Time:</b> <span class="highlight">${estimatedTime}</span></p>
              <p><strong>Patient Name:</strong> ${patientName}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Country:</strong> ${country}</p>
              <p><strong>NIC:</strong> ${nic}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Charge:</strong> LKR ${charge}</p>
            </div>
            <p>Thank you for booking your appointment with us.</p>
          </div>
          <div class="footer">
            &copy; 2025 MediCare Hospital. All rights reserved. 
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('❌ Email send failed:', error);
    } else {
      console.log('✅ Email sent:', info.response);
    }
  });
};




exports.sendCancellationEmail = async ({
  patientName,
  email,
  doctorName,
  hospital,
  sessionDate,
  sessionTime,
  phone,
  country,
  nic,
}) => {
  const mailOptions = {
    from: 'nirajapaksha1998@gmail.com',
    to: email,
    subject: 'Your Appointment has been Cancelled',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Appointment Cancellation</title>
        <style>
          body { background: #f5f7fa; font-family: Arial; }
          .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .header { background: #d32f2f; color: #fff; padding: 20px 30px; text-align: center; }
          .content { padding: 30px; color: #333; }
          .details p { margin: 8px 0; }
          .footer { background: #f0f0f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${patientName},</p>
            <p>Your appointment has been cancelled . Below are the details:</p>
            <div class="details">
              <p><strong>Doctor:</strong> ${doctorName}</p>
              <p><strong>Hospital:</strong> ${hospital} MediCare Hospital</p>
              <p><strong>Session Date:</strong> ${sessionDate}</p>
              <p><strong>Session Time:</strong> ${sessionTime}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Country:</strong> ${country}</p>
              <p><strong>NIC:</strong> ${nic}</p>
            </div>
            <p>If you wish to book again, please visit our website.</p>
          </div>
          <div class="footer">
            &copy; 2025 MediCare Hospital. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Failed to send cancellation email:', error);
    } else {
      console.log('✅ Cancellation email sent:', info.response);
    }
  });
};


exports.sendDoctorCredentials = async ({ name, email, userName, password }) => {
  console.log(">>> Sending credentials:");
  console.log({ name, email, userName, password });

  const mailOptions = {
    from: 'nirajapaksha1998@gmail.com',
    to: email,
    subject: 'Your Doctor Account Credentials',
   html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Doctor Account Details</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .header {
          background: #2B909B;
          color: #fff;
          padding: 20px 30px;
          text-align: center;
        }
        .content {
          padding: 30px;
          color: #333;
        }
        .content p {
          margin: 8px 0;
        }
        .footer {
          background: #f0f0f0;
          text-align: center;
          padding: 20px 30px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Doctor Account Created</h1>
        </div>
        <div class="content">
          <p>Dear Dr. ${name},</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>
          <p><strong>Username:</strong> ${userName}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>Please keep this information safe and secure.</p>
        </div>
        <div class="footer">
          &copy; 2025 MediCare Hospital. All rights reserved.
        </div>
      </div>
    </body>
  </html>
`
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Failed to send doctor credentials:', error);
    } else {
      console.log('✅ Doctor credentials email sent:', info.response);
    }
  });
};


exports.sendAppointmentUpdateEmail = async ({
  patientName,
  email,
  doctorName,
  hospital,
  sessionDate,
  sessionTime,
}) => {

  const mailOptions = {
    from: 'nirajapaksha1998@gmail.com',
    to: email,
    subject: "Appointment Schedule Updated",

    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Appointment Updated</title>

      <style>
        body {
          background-color: #f5f7fa;
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        .email-container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .header {
          background-color: #2B909B;
          color: white;
          padding: 20px 30px;
          text-align: center;
        }

        .header h1 {
          margin: 0;
          font-size: 24px;
        }

        .content {
          padding: 30px;
          color: #333;
        }

        .content h2 {
          color: #2B909B;
          margin-top: 0;
        }

        .details {
          margin: 20px 0;
          background: #f8fafa;
          padding: 15px;
          border-radius: 6px;
        }

        .details p {
          margin: 10px 0;
          line-height: 1.5;
        }

        .highlight {
          color: #2B909B;
          font-weight: bold;
        }

        .message {
          background: #e8f6f7;
          padding: 15px;
          border-left: 4px solid #2B909B;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .footer {
          background-color: #f0f0f0;
          padding: 20px 30px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }

      </style>

    </head>


    <body>

      <div class="email-container">


        <div class="header">
          <h1>Appointment Updated</h1>
        </div>



        <div class="content">

          <h2>Dear ${patientName},</h2>


          <div class="message">
            <p>
              Your appointment schedule has been updated successfully.
              Please check your new appointment details below.
            </p>
          </div>



          <div class="details">

            <p>
              <strong>Doctor:</strong>
              Dr. ${doctorName}
            </p>


            <p>
              <strong>Hospital:</strong>
              ${hospital} MediCare Hospital
            </p>


            <p>
              <strong>New Session Date:</strong>
              <span class="highlight">
                ${sessionDate}
              </span>
            </p>


            <p>
              <strong>New Session Time:</strong>
              <span class="highlight">
                ${sessionTime}
              </span>
            </p>

          </div>



          <p>
            Please arrive 15 minutes before your appointment time.
          </p>


          <p>
            Thank you for choosing MediCare Hospital.
          </p>


        </div>



        <div class="footer">
          &copy; 2025 MediCare Hospital. All rights reserved.
        </div>


      </div>


    </body>
    </html>
    `,
  };


  await transporter.sendMail(mailOptions);

};

// exports.sendAppointmentUpdateEmail = async ({
//   patientName,
//   email,
//   doctorName,
//   hospital,
//   sessionDate,
//   sessionTime,
// }) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Appointment Schedule Updated",
//     html: `
//       <h2>Appointment Updated</h2>

//       <p>Dear <b>${patientName}</b>,</p>

//       <p>Your appointment has been updated.</p>

//       <table border="1" cellpadding="8" cellspacing="0">
//         <tr>
//           <td><b>Doctor</b></td>
//           <td>${doctorName}</td>
//         </tr>
//         <tr>
//           <td><b>Hospital</b></td>
//           <td>${hospital}</td>
//         </tr>
//         <tr>
//           <td><b>Date</b></td>
//           <td>${sessionDate}</td>
//         </tr>
//         <tr>
//           <td><b>Time</b></td>
//           <td>${sessionTime}</td>
//         </tr>
//       </table>

//       <p>Please arrive 15 minutes early.</p>

//       <p>Thank you.</p>
//     `,
//   });
// };

// exports.sendAppointmentUpdateEmail = async ({
//   patientName,
//   email,
//   doctorName,
//   hospital,
//   sessionDate,
//   sessionTime,
// }) => {
//   const subject = "Update: Your Appointment Details Changed";

//   const html = `
//     <p>Dear ${patientName},</p>
//     <p>This is to inform you that your appointment session details have been updated. Please see the new details below:</p>
//     <ul>
//       <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
//       <li><strong>Hospital:</strong> ${hospital}</li>
//       <li><strong>New Date:</strong> ${sessionDate}</li>
//       <li><strong>New Time:</strong> ${sessionTime}</li>
//     </ul>
//     <p>Please contact us if you have any questions.</p>
//     <p>Thank you for your understanding.</p>
//   `;

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject,
//     html,
//   });
// };

// exports.sendAppointmentUpdateEmail = async ({
//   patientName,
//   email,
//   doctorName,
//   hospital,
//   sessionDate,
//   sessionTime,
// }) => {
//   const subject = "Update: Your Appointment Details Changed";

//   const html = `
//     <p>Dear ${patientName},</p>
//     <p>This is to inform you that your appointment session details have been updated. Please see the new details below:</p>
//     <ul>
//       <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
//       <li><strong>Hospital:</strong> ${hospital}</li>
//       <li><strong>New Date:</strong> ${sessionDate}</li>
//       <li><strong>New Time:</strong> ${sessionTime}</li>
//     </ul>
//     <p>Please contact us if you have any questions.</p>
//     <p>Thank you for your understanding.</p>
//   `;

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject,
//     html,
//   });
// };


// exports.sendOTPEmail = async (to, subject, text) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT || 587,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: `"Hospital App" <${process.env.SMTP_USER}>`,
//     to,
//     subject,
//     text,
//   });

//   return info;
// };

// ================================
// 5. SEND OTP EMAIL (for 2-step signup)
// ================================

exports.sendOTPEmail = async (email, pin) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "nirajapaksha1998@gmail.com",
    to: email,
    subject: "Your Verification PIN",
    text: `Your verification PIN is: ${pin}`,
  });
};


// exports.sendDoctorArrivedEmail = async ({
//   patientName,
//   email,
//   doctorName,
//   hospital,
//   sessionDate,
//   sessionTime,
//   appointmentNumber,
//   estimatedTime
// }) => {
//   const mailOptions = {
//     to: email,
//     subject: `Dr. ${doctorName} has arrived - Your appointment is active`,
//     html: `
//       <h2>Doctor Arrived Notification</h2>
//       <p>Hello <b>${patientName}</b>,</p>

//       <p>Dr. <strong>${doctorName}</strong> has arrived at 
//       <b>${hospital}</b> for the scheduled session.</p>

//       <p><strong>Your appointment details:</strong></p>
//       <ul>
//         <li>Date: ${sessionDate}</li>
//         <li>Session Start: ${sessionTime}</li>
//         <li>Your Number: ${appointmentNumber}</li>
//         <li>Estimated Time: ${estimatedTime}</li>
//       </ul>

//       <p>Please be ready. Thank you for using our service.</p>
//       <br/>
//       <small>Hospital Channeling System</small>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };



// exports.sendDoctorArrivedEmail = async ({
//   patientName,
//   email,
//   doctorName,
//   hospital,
//   sessionTime,
// }) => {
//   const message = `
//     Hello ${patientName},

//     Dr. ${doctorName} has arrived at ${hospital}.

//     Your appointment is scheduled at ${sessionTime}.
//     Please proceed to the hospital.

//     Thank you.
//   `;

//   console.log("Sending email to:", email);
//   console.log(message);

//   // If using SendGrid / Nodemailer → send here
// };


// exports.sendDoctorArrivedEmail = async ({
//   patientName,
//   email,
//   doctorName,
//   hospital,
//   sessionDate,
//   sessionTime,
//   appointmentNumber,
//   estimatedTime
// }) => {
//   const mailOptions = {
//     from: 'nirajapaksha1998@gmail.com',
//     to: email,
//     subject: `Dr. ${doctorName} has arrived - Please come now`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           body {
//             background-color: #f5f7fa;
//             font-family: Arial, sans-serif;
//           }
//           .container {
//             max-width: 600px;
//             margin: 30px auto;
//             background: #fff;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 2px 8px rgba(0,0,0,0.05);
//           }
//           .header {
//             background: #2B909B;
//             color: #fff;
//             padding: 20px;
//             text-align: center;
//           }
//           .content {
//             padding: 30px;
//             color: #333;
//           }
//           .footer {
//             background: #f0f0f0;
//             padding: 20px;
//             text-align: center;
//             font-size: 12px;
//             color: #777;
//           }
//         </style>
//       </head>

//       <body>
//         <div class="container">
//           <div class="header">
//             <h2>Doctor Arrived Notification</h2>
//           </div>

//           <div class="content">
//             <p>Dear <b>${patientName}</b>,</p>

//             <p>
//               Dr. <strong>${doctorName}</strong> has arrived at 
//               <strong>${hospital}</strong>.
//             </p>

//             <p>Please come to the hospital now.</p>

//             <h3>Your Appointment Details:</h3>
//             <ul>
//               <li><b>Date:</b> ${sessionDate}</li>
//               <li><b>Session Time:</b> ${sessionTime}</li>
//               <li><b>Your Number:</b> ${appointmentNumber}</li>
//               <li><b>Estimated Time:</b> ${estimatedTime}</li>
//             </ul>

//             <p>Thank you.</p>
//           </div>

//           <div class="footer">
//             © 2025 MediCare Hospital
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };


exports.sendDoctorArrivedEmail = async ({
  patientName,
  email,
  doctorName,
  hospital,
  sessionDate,
  sessionTime,
  appointmentNumber,
  estimatedTime
}) => {
  const mailOptions = {
    from: 'nirajapaksha1998@gmail.com',
    to: email,
    subject: `Dr. ${doctorName} has arrived - Please come now`,
    html: `
      <html>
      <body style="background:#f5f7fa;font-family:Arial;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;">
          <div style="background:#2B909B;color:#fff;padding:20px;text-align:center;">
            <h2>Doctor Arrived Notification</h2>
          </div>

          <div style="padding:30px;">
            <p>Dear <b>${patientName}</b>,</p>

            <p>
              Dr. <strong>${doctorName}</strong> has arrived at 
              <strong>${hospital}</strong>.
            </p>

            <p><b>Please come to the hospital now.</b></p>

            <h3>Your Appointment Details:</h3>
            <ul>
              <li>Date: ${sessionDate}</li>
              <li>Time: ${sessionTime}</li>
              <li>Number: ${appointmentNumber}</li>
              <li>Estimated Time: ${estimatedTime}</li>
            </ul>
          </div>

          <div style="background:#f0f0f0;padding:20px;text-align:center;font-size:12px;">
            © 2025 MediCare Hospital
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};