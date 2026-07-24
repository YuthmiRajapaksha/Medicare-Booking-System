

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Swal from "sweetalert2";
import PageHeader from "../../components/PageHeader";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const UpdateAppointments = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    hospital: "",
    session_date: "",
    session_time: "",
    max_appointments: 5,
  });
  

  const fetchDoctor = async () => {
    const res = await fetch(`http://localhost:3000/api/doctors/${doctorId}`);
    const data = await res.json();
    if (res.ok) setDoctor(data.doctor);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/bookingForm/doctor/${doctorId}`
    );
    const data = await res.json();
    setAppointments(data.appointments || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctor();
    fetchAppointments();
  }, [doctorId]);

  // Sort sessions by latest date and time first
const sortedAppointments = [...appointments].sort((a, b) => {
  const dateA = new Date(`${a.session_date} ${a.session_time}`);
  const dateB = new Date(`${b.session_date} ${b.session_time}`);

  return dateB - dateA; // Latest first
});

// Group by date
const groupedByDate = sortedAppointments.reduce((acc, appt) => {
  const date = appt.session_date.split("T")[0];

  if (!acc[date]) {
    acc[date] = [];
  }

  acc[date].push(appt);

  return acc;
}, {});

  const handleEditOpen = (a) => {
    setEditData({
      id: a.id,
      hospital: a.hospital,
      session_date: a.session_date.split("T")[0],
      session_time: a.session_time.slice(0, 5),
      max_appointments: a.max_appointments,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    await fetch(`http://localhost:3000/api/bookingForm/${editData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });

    Swal.fire("Updated!", "Session updated", "success");
    setEditOpen(false);
    fetchAppointments();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/bookingForm/${id}`, {
      method: "DELETE",
    });
    Swal.fire("Deleted!", "Session removed", "success");
    fetchAppointments();
  };


  const generateReport = () => {
  const doc = new jsPDF();

  const totalSessions = appointments.length;
  const totalSlots = appointments.reduce(
    (sum, s) => sum + Number(s.max_appointments),
    0
  );

  const totalBooked = appointments.reduce(
    (sum, s) => sum + Number(s.assigned_count || 0),
    0
  );

  const totalAvailable = totalSlots - totalBooked;

  doc.setFontSize(18);
  doc.text("Doctor Session Report", 14, 15);

  doc.setFontSize(12);
  doc.text(`Doctor : Dr. ${doctor?.name || ""}`, 14, 28);
  doc.text(`Generated : ${new Date().toLocaleDateString()}`, 14, 36);

  doc.text(`Total Sessions : ${totalSessions}`, 14, 48);
  doc.text(`Total Slots : ${totalSlots}`, 14, 56);
  doc.text(`Booked : ${totalBooked}`, 14, 64);
  doc.text(`Available : ${totalAvailable}`, 14, 72);

  autoTable(doc, {
    startY: 82,
    head: [[
      "Date",
      "Hospital",
      "Time",
      "Max",
      "Booked",
      "Available"
    ]],
    body: appointments.map((a) => [
      a.session_date.split("T")[0],
      a.hospital,
      a.session_time.slice(0,5),
      a.max_appointments,
      a.assigned_count,
      a.max_appointments - a.assigned_count,
    ]),
  });

  doc.save(`Doctor_Sessions_${doctor?.name}.pdf`);
};


const generatePatientReport = async (session) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appointments/session-patients/${session.id}`
    );

    const patients = await res.json();

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Session Patient Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`Doctor : Dr. ${doctor.name}`, 14, 28);
    doc.text(`Hospital : ${session.hospital}`, 14, 36);
    doc.text(`Date : ${session.session_date.split("T")[0]}`, 14, 44);
    doc.text(`Time : ${session.session_time.slice(0,5)}`, 14, 52);

    autoTable(doc, {
      startY: 60,
      head: [[
        "No",
        "Patient",
        "Phone",
        "Email",
        "NIC",
        "Estimated Time"
      ]],
      body: patients.map((p) => [
        p.appointment_number,
        p.patient_name,
        p.phone,
        p.email,
        p.nic,
        p.estimated_time
      ])
    });

    doc.save(
      `Session_${session.session_date.split("T")[0]}.pdf`
    );

  } catch (err) {
    console.error(err);
  }
};
  if (loading) return <CircularProgress />;

  return (
    <Box>
      <PageHeader
        title={`Dr. ${doctor?.name || ""} — Sessions`}
        subtitle="Update or remove upcoming appointment sessions"
        onBack={() => navigate(-1)}
      />

 <Button
    variant="contained"
    color="success"
    onClick={generateReport}
    sx={{background: "linear-gradient(135deg, #2B909B, #6dd5ed)"}}
  >
    Generate Report
  </Button>

      {/* TABLES PER DAY */}
      {Object.keys(groupedByDate).map((date) => (
        <Box key={date} mb={5}>

          {/* DATE HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2, color: "primary.main" }}>
            <CalendarMonthIcon fontSize="small" />
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              {new Date(date).toDateString()}
            </Typography>
          </Box>

          <TableContainer
  component={Paper}
  sx={{
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    border: "1px solid #e0e0e0",
  }}
>
  <Table>

    {/* TABLE HEADER */}
    <TableHead>
      <TableRow
        sx={{
          background:
            "linear-gradient(90deg, #2B909B 0%, #4bbdc9 100%)",
        }}
      >
        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          #
        </TableCell>

        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Hospital
        </TableCell>

        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Time
        </TableCell>

        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Bookings
        </TableCell>

        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Limit
        </TableCell>

        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Status
        </TableCell>

        <TableCell
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>

    {/* TABLE BODY */}
    <TableBody>
      {groupedByDate[date].map((a, index) => {


const booked = Number(a.assigned_count || 0);

const isFull = booked >= Number(a.max_appointments);

// Current date & time
const now = new Date();

// Session date
const sessionDate = new Date(a.session_date);

// Session time
const [hours, minutes] = a.session_time.split(":").map(Number);

sessionDate.setHours(hours);
sessionDate.setMinutes(minutes);
sessionDate.setSeconds(0);
sessionDate.setMilliseconds(0);

// Disable Edit/Delete if session has already started
const isPast = now >= sessionDate;

const percentage =
  (booked / Number(a.max_appointments)) * 100;

        return (
          <TableRow
            key={a.id}
            hover
            sx={{
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#f7fcfd",
              },

              "& td": {
                borderBottom:
                  "1px solid #f0f0f0",
              },
            }}
          >
            {/* NUMBER */}
            <TableCell>
              <Typography fontWeight={600}>
                {index + 1}
              </Typography>
            </TableCell>

            {/* HOSPITAL */}
            <TableCell>
              <Box>
                <Typography
                  fontWeight={700}
                  sx={{ color: "text.primary" }}
                >
                  {a.hospital}
                </Typography>
              </Box>
            </TableCell>

            {/* TIME */}
            <TableCell>
              <Chip
                label={a.session_time.slice(0, 5)}
                sx={{
                  backgroundColor: "#eef8fa",
                  color: "#2B909B",
                  fontWeight: 600,
                  borderRadius: "10px",
                }}
              />
            </TableCell>

            {/* BOOKINGS */}
            <TableCell sx={{ minWidth: 180 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                {booked} booked
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  height: 8,
                  backgroundColor: "#edf2f7",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: "100%",
                    background:
                      percentage >= 100
                        ? "#ef5350"
                        : "#2B909B",
                    borderRadius: 10,
                    transition: "0.3s",
                  }}
                />
              </Box>
            </TableCell>

            {/* LIMIT */}
            <TableCell>
              <Typography fontWeight={600}>
                {a.max_appointments}
              </Typography>
            </TableCell>

            {/* STATUS */}
            <TableCell>
              <Chip
                label={isFull ? "Fully Booked" : "Available"}
                size="small"
                sx={{
                  backgroundColor: isFull
                    ? "rgba(239, 68, 68, 0.10)"
                    : "rgba(34, 197, 94, 0.10)",
                  color: isFull ? "error.main" : "success.main",
                  fontWeight: 600,
                  px: 1,
                }}
              />
            </TableCell>

            {/* ACTIONS */}
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <Button
  size="small"
  variant="contained"
  disabled={isPast}
  onClick={() => handleEditOpen(a)}
  sx={{
    borderRadius: "10px",
    textTransform: "none",
    backgroundColor: isPast ? "#bdbdbd" : "#2B909B",
    "&:hover": {
      backgroundColor: isPast ? "#bdbdbd" : "#247b84",
    },
  }}
>
  Edit
</Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleDelete(a.id)
                  }
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                  }}
                >
                  Delete
                </Button>

                <Button
    variant="contained"
    color="success"
    onClick={() => generatePatientReport(a)}
     sx={{
    borderRadius: "10px",
    textTransform: "none",
    background: "linear-gradient(135deg, #2B909B, #6dd5ed)",
    "&:hover": {
     background: "linear-gradient(135deg, #2B909B, #6dd5ed)",
    },
  }}
>
    Patient Report
</Button>
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>



        </Box>
      ))}

      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Session</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Hospital"
            value={editData.hospital}
            onChange={(e) =>
              setEditData({ ...editData, hospital: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            type="date"
            value={editData.session_date}
            onChange={(e) =>
              setEditData({ ...editData, session_date: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            type="time"
            value={editData.session_time}
            onChange={(e) =>
              setEditData({ ...editData, session_time: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            type="number"
            label="Max Appointments"
            value={editData.max_appointments}
            onChange={(e) =>
              setEditData({
                ...editData,
                max_appointments: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default UpdateAppointments;