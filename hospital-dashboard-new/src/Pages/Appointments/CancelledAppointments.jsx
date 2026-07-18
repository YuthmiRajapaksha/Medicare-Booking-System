
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
  Chip,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";

const CancelledAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
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
    <Box>
      <PageHeader
        title={`Cancelled Appointments`}
        subtitle={`Dr. ${doctor?.name || doctorId}`}
        onBack={() => navigate(-1)}
      />

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
              sx={{ fontWeight: 600, fontSize: "1rem", mb: 2 }}
            >
              Date: {new Date(date).toDateString()}
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
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
                      <TableCell>
                        <Chip
                          label="Cancelled"
                          size="small"
                          sx={{
                            backgroundColor: "rgba(239, 68, 68, 0.10)",
                            color: "error.main",
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
        ))
      )}
    </Box>
  );
};

export default CancelledAppointments;
