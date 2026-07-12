// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import {
// //   Box,
// //   Typography,
// //   Grid,
// //   Card,
// //   Stack,
// //   Avatar,
// //   TextField,
// //   Button,
// //   Chip,
// //   MenuItem
// // } from "@mui/material";
// // import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// // import EmailIcon from "@mui/icons-material/Email";
// // import PhoneIcon from "@mui/icons-material/Phone";
// // import BadgeIcon from "@mui/icons-material/Badge";

// // const CancelledAppointments = () => {
// //   const { doctorId } = useParams();
// //   const [doctor, setDoctor] = useState(null);
// //   const [cancelledAppointments, setCancelledAppointments] = useState([]);

// //   //filter 
// //   const [filterDate, setFilterDate] = useState("");
// //   const [filterTime, setFilterTime] = useState("");
// //   const [filterHospital, setFilterHospital] = useState("");


// //   useEffect(() => {
// //     const fetchDoctor = async () => {
// //       const res = await fetch(`http://localhost:3000/api/doctors/${doctorId}`);
// //       const data = await res.json();
// //       setDoctor(data.doctor);
// //     };

// //     const fetchCancelled = async () => {
// //       const res = await fetch(
// //         `http://localhost:3000/api/appointments/doctor/${doctorId}/cancelled`
// //       );
// //       const data = await res.json();
// //       setCancelledAppointments(data);
// //     };

// //     fetchDoctor();
// //     fetchCancelled();
// //   }, [doctorId]);

// //   const filteredAppointments = cancelledAppointments.filter((appt) => {
// //     const matchDate = filterDate
// //       ? appt.session_date === filterDate
// //       : true;
// //     const matchTime = filterTime
// //       ? appt.session_time.startsWith(filterTime)
// //       : true;
// //     const matchHospital = filterHospital
// //       ? appt.hospital.toLowerCase().includes(filterHospital.toLowerCase())
// //       : true;

// //     return matchDate && matchTime && matchHospital;
// //   });

// //   const handleResetFilters = () => {
// //     setFilterDate("");
// //     setFilterTime("");
// //     setFilterHospital("");
// //   };

// //   return (
// //     <Box p={3} mt={8}>
// //       <Typography variant="h4" mb={4} fontWeight="bold" sx={{fontFamily: "Poppins"}} >
// //         Cancelled Appointments for Dr. {doctor?.name || doctorId}
// //       </Typography>

      

// //       {/*  Filter inputs */}
// //       <Stack direction="row" spacing={2} mb={4}>
// //         <TextField
// //           label="Filter by Date"
// //           type="date"
// //           value={filterDate}
// //           onChange={(e) => setFilterDate(e.target.value)}
// //           InputLabelProps={{ shrink: true }}
// //         />
// //         <TextField
// //           label="Filter by Time"
// //           type="time"
// //           value={filterTime}
// //           onChange={(e) => setFilterTime(e.target.value)}
// //           InputLabelProps={{ shrink: true }}
// //         />
// //         <TextField
// //           select
// //           label="Filter by Hospital"
// //           value={filterHospital}
// //           onChange={(e) => setFilterHospital(e.target.value)}
// //           sx={{ minWidth: 180 }}
// //         >
// //           <MenuItem value="">All</MenuItem>
// //           <MenuItem value="piliyandala">Piliyandala</MenuItem>
// //           <MenuItem value="gampaha">Gampaha</MenuItem>
// //           <MenuItem value="maharagama">Maharagama</MenuItem>
// //         </TextField>
// //          <Button
// //           variant="outlined"
// //           onClick={handleResetFilters}
// //           sx={{ height: "56px" }}
// //         >
// //           Reset Filters
// //         </Button>
// //       </Stack>

// //       {filteredAppointments.length === 0 ? (
// //         <Typography>No cancelled appointments match the filters.</Typography>
// //       ) : (
// //         <Grid container spacing={3}>
// //           {filteredAppointments.map((appointment) => (
// //             <Grid item xs={12} sm={6} md={4} key={appointment.id}>
// //               <Card sx={{ p: 2 }}>
// //                 <Stack direction="row" alignItems="center" spacing={2}>
// //                   <Avatar>
// //                     {appointment.patient_name?.charAt(0).toUpperCase()}
// //                   </Avatar>
// //                   <Box>
// //                     <Typography fontWeight="bold">
// //                       {appointment.patient_name}
// //                     </Typography>
// //                     <Chip
// //                       label={appointment.hospital || "No Hospital"}
// //                       size="small"
// //                       sx={{ mt: 1 }}
// //                     />
// //                   </Box>
// //                 </Stack>

// //                 <Box mt={2}>
// //                   <Stack direction="row" spacing={1} mb={1}>
// //                     <CalendarMonthIcon fontSize="small" />
// //                     <Typography variant="body2">
// //                       Session:{" "}
// //                       {new Date(appointment.session_date).toDateString()} at{" "}
// //                       {appointment.session_time?.slice(0, 5)}
// //                     </Typography>
// //                   </Stack>
// //                   <Stack direction="row" spacing={1} mb={1}>
// //                     <EmailIcon fontSize="small" />
// //                     <Typography variant="body2">{appointment.email}</Typography>
// //                   </Stack>
// //                   <Stack direction="row" spacing={1} mb={1}>
// //                     <PhoneIcon fontSize="small" />
// //                     <Typography variant="body2">{appointment.phone}</Typography>
// //                   </Stack>
// //                   <Stack direction="row" spacing={1}>
// //                     <BadgeIcon fontSize="small" />
// //                     <Typography variant="body2">
// //                       NIC: {appointment.nic}
// //                     </Typography>
// //                   </Stack>
// //                 </Box>
// //               </Card>
// //             </Grid>
// //           ))}
// //         </Grid>
// //       )}
// //     </Box>
// //   );
// // };

// // export default CancelledAppointments;



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   Stack,
//   Avatar,
//   TextField,
//   Button,
//   Chip,
//   MenuItem
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import BadgeIcon from "@mui/icons-material/Badge";

// const CancelledAppointments = () => {
//   const { doctorId } = useParams();
//   const [doctor, setDoctor] = useState(null);
//   const [cancelledAppointments, setCancelledAppointments] = useState([]);

//   // Filters
//   const [filterDate, setFilterDate] = useState("");
//   const [filterTime, setFilterTime] = useState("");
//   const [filterHospital, setFilterHospital] = useState("");

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/api/doctors/${doctorId}`);
//         const data = await res.json();
//         setDoctor(data.doctor || data); // backend may return doctor directly
//       } catch (err) {
//         console.error("Error fetching doctor:", err);
//       }
//     };

//     const fetchCancelled = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/appointments/doctor/${doctorId}/cancelled`
//         );
//         const data = await res.json();
//         setCancelledAppointments(data);
//       } catch (err) {
//         console.error("Error fetching cancelled appointments:", err);
//       }
//     };

//     fetchDoctor();
//     fetchCancelled();
//   }, [doctorId]);

//   // Filtered appointments
//   const filteredAppointments = cancelledAppointments.filter((appt) => {
//     const matchDate = filterDate ? appt.session_date === filterDate : true;
//     const matchTime = filterTime
//       ? appt.session_time.startsWith(filterTime)
//       : true;
//     const matchHospital = filterHospital
//       ? appt.hospital.toLowerCase().includes(filterHospital.toLowerCase())
//       : true;

//     return matchDate && matchTime && matchHospital;
//   });

//   const handleResetFilters = () => {
//     setFilterDate("");
//     setFilterTime("");
//     setFilterHospital("");
//   };

//   // Check if appointment can be cancelled (more than 5 hours away)
//   const canCancel = (appointment) => {
//     if (!appointment.session_date || !appointment.session_time) return false;
//     const appointmentDateTime = new Date(
//       `${appointment.session_date}T${appointment.session_time}`
//     );
//     const now = new Date();
//     const diffHours = (appointmentDateTime - now) / (1000 * 60 * 60);
//     return diffHours > 5;
//   };

//   // Cancel appointment
//   const handleCancel = async (id) => {
//     try {
//       const res = await fetch(
//         `http://localhost:3000/api/appointments/cancelByPatient/${id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // add auth token if required
//           },
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         alert("Appointment cancelled successfully");
//         setCancelledAppointments((prev) =>
//           prev.map((appt) =>
//             appt.id === id ? { ...appt, status: "cancelled" } : appt
//           )
//         );
//       } else {
//         alert(data.message || "Cannot cancel this appointment");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error cancelling appointment");
//     }
//   };

//   return (
//     <Box p={3} mt={8}>
//       <Typography
//         variant="h4"
//         mb={4}
//         fontWeight="bold"
//         sx={{ fontFamily: "Poppins" }}
//       >
//         Cancelled Appointments for Dr. {doctor?.name || doctorId}
//       </Typography>

//       {/* Filter inputs */}
//       <Stack direction="row" spacing={2} mb={4}>
//         <TextField
//           label="Filter by Date"
//           type="date"
//           value={filterDate}
//           onChange={(e) => setFilterDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           label="Filter by Time"
//           type="time"
//           value={filterTime}
//           onChange={(e) => setFilterTime(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//         />
//         <TextField
//           select
//           label="Filter by Hospital"
//           value={filterHospital}
//           onChange={(e) => setFilterHospital(e.target.value)}
//           sx={{ minWidth: 180 }}
//         >
//           <MenuItem value="">All</MenuItem>
//           <MenuItem value="piliyandala">Piliyandala</MenuItem>
//           <MenuItem value="gampaha">Gampaha</MenuItem>
//           <MenuItem value="maharagama">Maharagama</MenuItem>
//         </TextField>
//         <Button variant="outlined" onClick={handleResetFilters} sx={{ height: "56px" }}>
//           Reset Filters
//         </Button>
//       </Stack>

//       {filteredAppointments.length === 0 ? (
//         <Typography>No cancelled appointments match the filters.</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {filteredAppointments.map((appointment) => (
//             <Grid item xs={12} sm={6} md={4} key={appointment.id}>
//               <Card sx={{ p: 2 }}>
//                 <Stack direction="row" alignItems="center" spacing={2}>
//                   <Avatar>
//                     {appointment.patient_name?.charAt(0).toUpperCase()}
//                   </Avatar>
//                   <Box>
//                     <Typography fontWeight="bold">
//                       {appointment.patient_name}
//                     </Typography>
//                     <Chip
//                       label={appointment.hospital || "No Hospital"}
//                       size="small"
//                       sx={{ mt: 1 }}
//                     />
//                   </Box>
//                 </Stack>

//                 <Box mt={2}>
//                   <Stack direction="row" spacing={1} mb={1}>
//                     <CalendarMonthIcon fontSize="small" />
//                     <Typography variant="body2">
//                       Session:{" "}
//                       {new Date(appointment.session_date).toDateString()} at{" "}
//                       {appointment.session_time?.slice(0, 5)}
//                     </Typography>
//                   </Stack>
//                   <Stack direction="row" spacing={1} mb={1}>
//                     <EmailIcon fontSize="small" />
//                     <Typography variant="body2">{appointment.email}</Typography>
//                   </Stack>
//                   <Stack direction="row" spacing={1} mb={1}>
//                     <PhoneIcon fontSize="small" />
//                     <Typography variant="body2">{appointment.phone}</Typography>
//                   </Stack>
//                   <Stack direction="row" spacing={1}>
//                     <BadgeIcon fontSize="small" />
//                     <Typography variant="body2">NIC: {appointment.nic}</Typography>
//                   </Stack>

//                   {/* Cancel button if allowed */}
//                   {canCancel(appointment) && (
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       size="small"
//                       sx={{ mt: 2 }}
//                       onClick={() => handleCancel(appointment.id)}
//                     >
//                       Cancel Appointment
//                     </Button>
//                   )}
//                 </Box>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default CancelledAppointments;





import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CancelledAppointments = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterHospital, setFilterHospital] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/doctors/${doctorId}`);
        const data = await res.json();
        setDoctor(data.doctor || data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };

    const fetchCancelled = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/appointments/doctor/${doctorId}/cancelled`
        );
        const data = await res.json();
        setCancelledAppointments(data);
      } catch (err) {
        console.error("Error fetching cancelled appointments:", err);
      }
    };

    fetchDoctor();
    fetchCancelled();
  }, [doctorId]);

  const filteredAppointments = cancelledAppointments.filter((appt) => {
    const matchDate = filterDate ? appt.session_date === filterDate : true;
    const matchTime = filterTime
      ? appt.session_time.startsWith(filterTime)
      : true;
    const matchHospital = filterHospital
      ? appt.hospital.toLowerCase().includes(filterHospital.toLowerCase())
      : true;
    return matchDate && matchTime && matchHospital;
  });

  const handleResetFilters = () => {
    setFilterDate("");
    setFilterTime("");
    setFilterHospital("");
  };

  // Group appointments by date
  const groupedByDate = filteredAppointments.reduce((groups, appt) => {
    const date = appt.session_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(appt);
    return groups;
  }, {});

  return (
    <Box p={3} mt={8}>
      <Typography
        variant="h4"
        mb={4}
        fontWeight="bold"
        sx={{ fontFamily: "Poppins" }}
      >
        Cancelled Appointments for Dr. {doctor?.name || doctorId}
      </Typography>

      {/* Filters */}
      <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
        <TextField
          label="Filter by Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Filter by Time"
          type="time"
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Filter by Hospital"
          value={filterHospital}
          onChange={(e) => setFilterHospital(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="piliyandala">Piliyandala</MenuItem>
          <MenuItem value="gampaha">Gampaha</MenuItem>
          <MenuItem value="maharagama">Maharagama</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          onClick={handleResetFilters}
          sx={{ height: "56px" }}
        >
          Reset Filters
        </Button>
      </Stack>

      {Object.keys(groupedByDate).length === 0 ? (
        <Typography>No cancelled appointments found.</Typography>
      ) : (
        Object.entries(groupedByDate).map(([date, appts]) => (
          <Box key={date} mb={5}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              sx={{ fontFamily: "Poppins" }}
            >
              Date: {new Date(date).toDateString()}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#90d2d9ff" }}>
                  <TableRow>
                    <TableCell><strong>Patient Name</strong></TableCell>
                    <TableCell><strong>NIC</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Phone</strong></TableCell>
                    <TableCell><strong>Hospital</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appts.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell>{appt.patient_name}</TableCell>
                      <TableCell>{appt.nic}</TableCell>
                      <TableCell>{appt.email}</TableCell>
                      <TableCell>{appt.phone}</TableCell>
                      <TableCell>{appt.hospital}</TableCell>
                      <TableCell>{appt.session_time?.slice(0, 5)}</TableCell>
                      <TableCell sx={{ color: "red", fontWeight: "bold" }}>
                        Cancelled
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      )}
    </Box>
  );
};

export default CancelledAppointments;
