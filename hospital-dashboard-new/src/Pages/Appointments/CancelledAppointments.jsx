
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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CancelledAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterHospital, setFilterHospital] = useState("");

//   const [reportAppointments, setReportAppointments] = useState([]);
// const [reportDate, setReportDate] = useState("");

// const handleGenerateReport = () => {
//   if (!filterDate) {
//     alert("Please select a date.");
//     return;
//   }

//   const report = cancelledAppointments.filter(
//     (appt) => appt.session_date === filterDate
//   );

//   if (report.length === 0) {
//     alert("No cancelled appointments found for this date.");
//     return;
//   }

//   setReportAppointments(report);
//   setReportDate(filterDate);
// };


const handleGenerateReport = () => {
  if (!filterDate) {
    alert("Please select a date.");
    return;
  }

  const report = cancelledAppointments.filter(
    (appt) => appt.session_date.slice(0, 10) === filterDate
  );

  if (report.length === 0) {
    alert("No cancelled appointments found.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Cancelled Appointment Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Doctor: Dr. ${doctor?.name}`, 14, 30);
  doc.text(`Date: ${filterDate}`, 14, 38);

  autoTable(doc, {
    startY: 48,
    head: [[
      "Patient",
      "NIC",
      "Hospital",
      "Time",
      "Email",
      "Phone"
    ]],
    body: report.map((appt) => [
      appt.patient_name,
      appt.nic,
      appt.hospital,
      appt.session_time.slice(0, 5),
      appt.email,
      appt.phone,
    ]),
  });

  doc.save(`Cancelled_Report_${filterDate}.pdf`);
};

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
        {/* <TextField
          label="Filter by Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        /> */}
        <TextField
  label="Filter by Date"
  type="date"
  value={filterDate}
  onChange={(e) => {
    console.log("Selected date:", e.target.value);
    setFilterDate(e.target.value);
  }}
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

        <Button
  variant="contained"
  onClick={handleGenerateReport}
  sx={{ height: "56px" }}
>
  Generate Report
</Button>
      </Stack>


       {/* 👇 ADD THE REPORT HERE */}
    {/* {reportAppointments.length > 0 && (
      <Box mt={4} mb={4}>
        <Typography variant="h6" fontWeight={600}>
          Cancelled Appointment Report
        </Typography>

        <Typography mb={2}>
          Report Date: {new Date(reportDate).toDateString()}
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>NIC</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Hospital</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reportAppointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell>{appt.patient_name}</TableCell>
                  <TableCell>{appt.nic}</TableCell>
                  <TableCell>{appt.email}</TableCell>
                  <TableCell>{appt.phone}</TableCell>
                  <TableCell>{appt.hospital}</TableCell>
                  <TableCell>{appt.session_time?.slice(0, 5)}</TableCell>
                  <TableCell>Cancelled</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    )} */}

  

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
