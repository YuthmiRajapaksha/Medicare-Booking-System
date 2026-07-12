import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";

const ViewAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [searchHospital, setSearchHospital] = useState("");

  const [notifiedSessions, setNotifiedSessions] = useState({});

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:3000/api/appointments/doctor/${doctorId}`
  //       );
  //       if (!res.ok) throw new Error("Failed to fetch appointments");

  //       const data = await res.json();

  //       const now = new Date();

  //       const upcoming = data.filter((appt) => {
  //         const apptDateTime = new Date(
  //           `${appt.session_date}T${appt.session_time}`
  //         );
  //         return appt.status !== "cancelled" && apptDateTime >= now;
  //       });

  //       setAppointments(upcoming);
  //     } catch (err) {
  //       setError("Failed to load appointments");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const fetchDoctor = async () => {
  //     try {
  //       const res = await fetch(
  //         `http://localhost:3000/api/doctors/${doctorId}`
  //       );
  //       if (!res.ok) throw new Error("Failed to fetch doctor");


        
  //       const data = await res.json();
  //       setDoctor(data.doctor || data);
  //     } catch (err) {
  //       setError("Failed to load doctor info");
  //     }
  //   };

  //   fetchAppointments();
  //   fetchDoctor();
  // }, [doctorId]);


  useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/appointments/doctor/${doctorId}`
      );
      if (!res.ok) throw new Error("Failed to fetch appointments");

      const data = await res.json();

      const now = new Date();

      const upcoming = data.filter((appt) => {
        const apptDateTime = new Date(
          `${appt.session_date}T${appt.session_time}`
        );
        return appt.status !== "cancelled" && apptDateTime >= now;
      });

      setAppointments(upcoming);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctor = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/doctors/${doctorId}`
      );
      if (!res.ok) throw new Error("Failed to fetch doctor");

      const data = await res.json();
      setDoctor(data.doctor || data);
    } catch (err) {
      setError("Failed to load doctor info");
    }
  };

  // ✅ LOAD LOCAL STORAGE
  const saved = localStorage.getItem("notifiedSessions");
  if (saved) {
    setNotifiedSessions(JSON.parse(saved));
  }

  fetchAppointments();
  fetchDoctor();
}, [doctorId]);

  // ❌ Cancel Appointment
  const handleCancel = async (appointment) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This appointment will be cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await fetch(
          `http://localhost:3000/api/appointments/${appointment.id}/status`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "cancelled" }),
          }
        );

        setAppointments((prev) =>
          prev.filter((appt) => appt.id !== appointment.id)
        );

        Swal.fire("Cancelled!", "The appointment has been cancelled.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to cancel the appointment", "error");
      }
    }
  };



  // 🟢 Doctor Arrived → Notify Patients
const handleNotify = async (appts, key) => {
  try {
    const token = localStorage.getItem("token"); // ✅ get saved token

    const res = await fetch(
      "http://localhost:3000/api/appointments/notify-doctor-arrived",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
        body: JSON.stringify({
          doctorId,
          hospital: appts[0].hospital,
          sessionDate: appts[0].session_date,
          sessionTime: appts[0].session_time,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed");

    Swal.fire("Success", "Patients notified!", "success");

    // setNotifiedSessions((prev) => ({ ...prev, [key]: true }));
    setNotifiedSessions((prev) => {
  const updated = { ...prev, [key]: true };
  localStorage.setItem("notifiedSessions", JSON.stringify(updated));
  return updated;
});
  } catch (err) {
    Swal.fire("Error", "Failed to notify patients", "error");
  }
};



  const handleViewCancelled = () => {
    navigate(`/cancelled/${doctorId}`);
  };

  const handleViewPast = () => {
    navigate(`/past/${doctorId}`);
  };

  const hospitalOptions = [
    ...new Set(appointments.map((appt) => appt.hospital).filter(Boolean)),
  ];

  // 🔍 FILTER
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = appointment.session_date?.split("T")[0] || "";
    const appointmentTime = appointment.session_time?.slice(0, 5) || "";
    const appointmentHospital = appointment.hospital?.toLowerCase() || "";

    const matchDate = !searchDate || appointmentDate === searchDate;
    const matchTime = !searchTime || appointmentTime === searchTime;
    const matchHospital =
      !searchHospital || appointmentHospital === searchHospital.toLowerCase();

    return matchDate && matchTime && matchHospital;
  });

  // ✅ GROUP BY SESSION (DATE + TIME)
  const groupedBySession = filteredAppointments.reduce((groups, appt) => {
    const key = `${appt.session_date}_${appt.session_time}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(appt);
    return groups;
  }, {});

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Loading appointments...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3} mt={8}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", fontFamily: "Poppins" }}
        >
          Appointments for Dr. {doctor?.name || ""}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2B909B", minWidth: 250, fontFamily: "Poppins" }}
            onClick={handleViewCancelled}
          >
            VIEW CANCELLED APPOINTMENTS
          </Button>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#2B909B", minWidth: 250, fontFamily: "Poppins" }}
            onClick={handleViewPast}
          >
            VIEW EXPIRED APPOINTMENTS
          </Button>
        </Stack>
      </Box>

      {/* FILTERS */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
        <TextField
          label="Filter by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          sx={{ width: 220 }}
        />

        <TextField
          label="Filter by Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={searchTime}
          onChange={(e) => setSearchTime(e.target.value)}
          sx={{ width: 220 }}
        />

        <TextField
          select
          label="Filter by Hospital"
          value={searchHospital}
          onChange={(e) => setSearchHospital(e.target.value)}
          sx={{ width: 220 }}
        >
          <MenuItem value="">All Hospitals</MenuItem>
          {hospitalOptions.map((hospital) => (
            <MenuItem key={hospital} value={hospital}>
              {hospital}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          onClick={() => {
            setSearchDate("");
            setSearchTime("");
            setSearchHospital("");
          }}
        >
          Reset
        </Button>
      </Box>

      {/* TABLES */}
      {Object.keys(groupedBySession).length === 0 ? (
        <Typography>No appointments found.</Typography>
      ) : (
        Object.entries(groupedBySession).map(([key, appts]) => {
          const [date, time] = key.split("_");

          return (
            <Box key={key} mb={5}>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                sx={{ color: "#2B909B", fontFamily: "Poppins" }}
              >
                📅 {new Date(date).toDateString()} | ⏰ {time.slice(0, 5)}
              </Typography>

              {/* 🟢 DOCTOR ARRIVED BUTTON */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2B909B",
                  mb: 2,
                  fontFamily: "Poppins",
                  minWidth: 250,
                   minWidth: 250,
    "&.Mui-disabled": {
      backgroundColor: "#b0b0b0", // optional nicer disabled look
      color: "#fff",
    },
                }}
                disabled={notifiedSessions[key]}
                onClick={() => handleNotify(appts, key)}
              >
                {notifiedSessions[key]
                  ? "PATIENTS NOTIFIED"
                  : "DOCTOR ARRIVED"}
              </Button>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#90d2d9ff" }}>
                    <TableRow>
                      <TableCell><b>No.</b></TableCell>
                      <TableCell><b>Appointment No.</b></TableCell>
                      <TableCell><b>Patient Name</b></TableCell>
                      <TableCell><b>Hospital</b></TableCell>
                      <TableCell><b>Time</b></TableCell>
                      <TableCell><b>Email</b></TableCell>
                      <TableCell><b>Phone</b></TableCell>
                      <TableCell><b>NIC</b></TableCell>
                      <TableCell align="center"><b>Action</b></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {appts.map((appointment, index) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{appointment.appointment_number || "-"}</TableCell>
                        <TableCell>{appointment.patient_name}</TableCell>
                        <TableCell>{appointment.hospital}</TableCell>
                        <TableCell>{appointment.session_time?.slice(0, 5)}</TableCell>
                        <TableCell>{appointment.email}</TableCell>
                        <TableCell>{appointment.phone}</TableCell>
                        <TableCell>{appointment.nic}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleCancel(appointment)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default ViewAppointments;
