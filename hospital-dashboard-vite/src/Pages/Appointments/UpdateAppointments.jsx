import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import Swal from "sweetalert2";

const UpdateAppointments = () => {
  const { doctorId } = useParams();
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

  // GROUP BY DATE
  const groupedByDate = appointments.reduce((acc, appt) => {
    const date = appt.session_date.split("T")[0];
    if (!acc[date]) acc[date] = [];
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

  if (loading) return <CircularProgress />;

  return (
    <Box p={4} sx={{ background: "#f6f9fb", minHeight: "100vh" }} mt={5}>

      <Typography
        variant="h4"
        sx={{ fontWeight: 700, fontFamily: "Poppins", mb: 4 }}
      >
        Dr. {doctor?.name} - Sessions
      </Typography>

      {/* TABLES PER DAY */}
      {Object.keys(groupedByDate).map((date) => (
        <Box key={date} mb={5}>

          {/* DATE HEADER */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#2B909B",
              fontFamily: "Poppins",
            }}
          >
            📅 {new Date(date).toDateString()}
          </Typography>

          {/* TABLE */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 3 }}
          >
            <Table>

              <TableHead sx={{ backgroundColor: "#B0E0E6" }}>
                <TableRow>
                  <TableCell><b>No</b></TableCell>
                  <TableCell><b>Hospital</b></TableCell>
                  <TableCell><b>Time</b></TableCell>
                  <TableCell><b>Booked</b></TableCell>
                  <TableCell><b>Limit</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {groupedByDate[date].map((a, index) => {
                  const booked = a.assigned_count || 0;
                  const isFull = booked >= a.max_appointments;

                  return (
                    <TableRow key={a.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{a.hospital}</TableCell>
                      <TableCell>{a.session_time.slice(0, 5)}</TableCell>
                      <TableCell>{booked}</TableCell>
                      <TableCell>{a.max_appointments}</TableCell>

                      <TableCell>
                        <Chip
                          label={isFull ? "FULL" : "AVAILABLE"}
                          color={isFull ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                          onClick={() => handleEditOpen(a)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDelete(a.id)}
                        >
                          Delete
                        </Button>
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