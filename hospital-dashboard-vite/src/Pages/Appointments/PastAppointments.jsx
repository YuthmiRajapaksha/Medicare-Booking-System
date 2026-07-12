

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Card,
//   Grid,
//   CircularProgress,
//   Stack,
//   Avatar,
//   Chip,
//   IconButton,
// } from "@mui/material";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import EmailIcon from "@mui/icons-material/Email";
// import PhoneIcon from "@mui/icons-material/Phone";
// import BadgeIcon from "@mui/icons-material/Badge";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// const PastAppointments = () => {
//   const { doctorId } = useParams();
//   const navigate = useNavigate();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       const res = await fetch(
//         `http://localhost:3000/api/appointments/doctor/${doctorId}`
//       );
//       const data = await res.json();
//       setAppointments(data);
//       setLoading(false);
//     };
//     fetchAppointments();
//   }, [doctorId]);

//   const now = new Date();
//   const pastAppointments = appointments.filter((appt) => {
//     const apptDateTime = new Date(`${appt.session_date}T${appt.session_time}`);
//     return apptDateTime < now;
//   });

//   return (
//     <Box p={3} mt={8}>
//       <Stack direction="row" alignItems="center" spacing={2} mb={4}>
//         <IconButton onClick={() => navigate(-1)}>
//           <ArrowBackIcon />
//         </IconButton>
//         <Typography variant="h4" fontWeight="bold">
//           Past Appointments
//         </Typography>
//       </Stack>

//       {loading ? (
//         <CircularProgress />
//       ) : pastAppointments.length === 0 ? (
//         <Typography variant="h5" sx={{ fontStyle: "italic", color: "#888" }}>No past appointments found.</Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {pastAppointments.map((appointment) => (
//             <Grid item xs={12} sm={6} md={4} key={appointment.id}>
//               <Card sx={{ p: 2 }}>
//                 <Stack direction="row" alignItems="center" spacing={2} mb={2}>
//                   <Avatar sx={{ bgcolor: "#2B909B" }}>
//                     {appointment.patient_name?.charAt(0).toUpperCase()}
//                   </Avatar>
//                   <Box>
//                     <Typography fontWeight="bold">
//                       {appointment.patient_name}
//                     </Typography>
//                     <Chip label={appointment.hospital} size="small" />
//                   </Box>
//                 </Stack>

//                 <Stack direction="row" spacing={1} mb={1}>
//                   <CalendarMonthIcon fontSize="small" />
//                   <Typography variant="body2">
//                     {new Date(appointment.session_date).toDateString()} at{" "}
//                     {appointment.session_time?.slice(0, 5)}
//                   </Typography>
//                 </Stack>

//                 <Stack direction="row" spacing={1} mb={1}>
//                   <EmailIcon fontSize="small" />
//                   <Typography variant="body2">{appointment.email}</Typography>
//                 </Stack>

//                 <Stack direction="row" spacing={1} mb={1}>
//                   <PhoneIcon fontSize="small" />
//                   <Typography variant="body2">{appointment.phone}</Typography>
//                 </Stack>

//                 <Stack direction="row" spacing={1}>
//                   <BadgeIcon fontSize="small" />
//                   <Typography variant="body2">NIC: {appointment.nic}</Typography>
//                 </Stack>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default PastAppointments;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  IconButton,
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
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PastAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterHospital, setFilterHospital] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/appointments/doctor/${doctorId}`
        );
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  const now = new Date();
  const pastAppointments = appointments.filter((appt) => {
    const apptDateTime = new Date(`${appt.session_date}T${appt.session_time}`);
    return apptDateTime < now && appt.status !== "cancelled";
  });

  // Filtered appointments
  const filteredAppointments = pastAppointments.filter((appt) => {
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

  // Group appointments by session_date
  const groupedByDate = filteredAppointments.reduce((groups, appt) => {
    const date = appt.session_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(appt);
    return groups;
  }, {});

  return (
    <Box p={3} mt={8}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold"  sx={{ fontFamily: "Poppins" }}>
          Past Appointments 
        </Typography>
      </Stack>

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

      {loading ? (
        <CircularProgress />
      ) : Object.keys(groupedByDate).length === 0 ? (
        <Typography variant="h6" sx={{ color: "#777", fontStyle: "italic" }}>
          No past appointments found.
        </Typography>
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
                      <TableCell sx={{ color: "#2e7d32", fontWeight: "bold" }}>
                        Completed
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

export default PastAppointments;
