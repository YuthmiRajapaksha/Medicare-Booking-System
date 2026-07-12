// // services/appointmentStats.js
// import axios from "axios";

// export const getCancelledAppointments = async (doctorId) => {
//   const res = await axios.get(
//     `http://localhost:3000/api/appointments/doctor/${doctorId}/cancelled`
//   );
//   return res.data;
// };

import axios from "axios";

export const getStatusCounts = async () => {
  const res = await axios.get(
    `http://localhost:3000/api/appointments/status-count`
  );
  return res.data;
};