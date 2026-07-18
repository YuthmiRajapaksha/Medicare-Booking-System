import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  CircularProgress,
  Chip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PageHeader from "../../components/PageHeader";

const PastAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterHospital, setFilterHospital] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/appointments/doctor/${doctorId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await res.json();

      console.log("API Response:", data);

      // booking sessions
      const sessions = Array.isArray(data.appointments)
        ? data.appointments
        : [];

      // flatten assigned appointments
      const allAppointments = sessions.flatMap((session) =>
        (session.assignedAppointments || []).map((appt) => ({
          ...appt,
          hospital: session.hospital,
          session_date: session.session_date,
          session_time: session.session_time,
        }))
      );

      console.log("All Appointments:", allAppointments);

      setAppointments(allAppointments);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();

  const pastAppointments = appointments.filter((appt) => {
    const dateTime = new Date(
      `${appt.session_date}T${appt.session_time}`
    );

    return (
      appt.status !== "cancelled" &&
      dateTime < now
    );
  });

  const filteredAppointments = pastAppointments.filter((appt) => {
    const matchDate =
      !filterDate || appt.session_date === filterDate;

    const matchTime =
      !filterTime || appt.session_time.startsWith(filterTime);

    const matchHospital =
      !filterHospital ||
      appt.hospital.toLowerCase() ===
        filterHospital.toLowerCase();

    return matchDate && matchTime && matchHospital;
  });

  const groupedAppointments = filteredAppointments.reduce(
    (groups, appt) => {
      const key = `${appt.session_date}_${appt.session_time}`;

      if (!groups[key]) groups[key] = [];

      groups[key].push(appt);

      return groups;
    },
    {}
  );

  const hospitals = [
    ...new Set(appointments.map((a) => a.hospital)),
  ];

  return (
    <Box>
      <PageHeader
        title="Past Appointments"
        subtitle="Review completed appointment history"
        onBack={() => navigate(-1)}
      />

      <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        <TextField
          label="Time"
          type="time"
          InputLabelProps={{ shrink: true }}
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
        />

        <TextField
          select
          label="Hospital"
          value={filterHospital}
          onChange={(e) => setFilterHospital(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>

          {hospitals.map((hospital) => (
            <MenuItem key={hospital} value={hospital}>
              {hospital}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          onClick={() => {
            setFilterDate("");
            setFilterTime("");
            setFilterHospital("");
          }}
        >
          Reset
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : Object.keys(groupedAppointments).length === 0 ? (
        <Typography>No past appointments found.</Typography>
      ) : (
        Object.entries(groupedAppointments).map(([key, appts]) => {
          const [date, time] = key.split("_");

          return (
            <Box key={key} mb={5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  color: "primary.main",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <CalendarMonthIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {new Date(date).toDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {time.slice(0, 5)}
                  </Typography>
                </Box>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Appointment No.</TableCell>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Hospital</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>NIC</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {appts.map((appt, index) => (
                      <TableRow key={appt.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {appt.appointment_number}
                        </TableCell>
                        <TableCell>{appt.patient_name}</TableCell>
                        <TableCell>{appt.hospital}</TableCell>
                        <TableCell>
                          {appt.session_time.slice(0, 5)}
                        </TableCell>
                        <TableCell>{appt.email}</TableCell>
                        <TableCell>{appt.phone}</TableCell>
                        <TableCell>{appt.nic}</TableCell>
                        <TableCell>
                          <Chip
                            label="Completed"
                            size="small"
                            sx={{
                              backgroundColor: "rgba(34, 197, 94, 0.10)",
                              color: "success.main",
                              fontWeight: 600,
                            }}
                          />
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

export default PastAppointments;
