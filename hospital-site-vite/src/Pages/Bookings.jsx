import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";

const MyBookings = () => {
  // const { token } = useContext(AuthContext);
  const { auth } = useContext(AuthContext);
  const token = auth?.token;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [isDisabled, setIsDisabled] = useState(false);
  const [disabledButtons, setDisabledButtons] = useState([]);

  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterHospital, setFilterHospital] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  //  Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    console.log("Token:", token);

    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/api/appointments/my", {
        headers: {
          // Authorization: `Bearer ${token}`,
          Authorization: `Bearer ${auth.token}`,
        },
      })
      .then((res) => {
        console.log("Appointments from API:", res.data);
        setAppointments(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err.response?.data || err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <Typography>Loading your appointments...</Typography>;
  }

  const hospitalOptions = [
    ...new Set(appointments.map((appt) => appt.hospital)),
  ];

  //  Apply filters
  // const filteredAppointments = appointments
  //   .filter((appt) =>
  //     appt.doctor_name.toLowerCase().includes(filterDoctor.toLowerCase()),
  //   )
  //   .filter((appt) =>
  //     filterHospital ? appt.hospital === filterHospital : true,
  //   )
  //   .filter((appt) =>
  //     filterStatus
  //       ? filterStatus === "active"
  //         ? appt.status !== "cancelled"
  //         : appt.status === "cancelled"
  //       : true,
  //   );

  const filteredAppointments = appointments
  .filter((appt) =>
    appt.doctor_name.toLowerCase().includes(filterDoctor.toLowerCase())
  )
  .filter((appt) =>
    filterHospital ? appt.hospital === filterHospital : true
  )
  .filter((appt) =>
    filterStatus
      ? filterStatus === "active"
        ? appt.status !== "cancelled"
        : appt.status === "cancelled"
      : true
  )
  .sort((a, b) => {
    const dateA = new Date(`${a.session_date}T${a.session_time}`);
    const dateB = new Date(`${b.session_date}T${b.session_time}`);

    // Latest first
    return dateB - dateA;
  });

  //  Paginate after filtering
  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const isCancelDisabled = (appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.session_date}T${appointment.session_time.substring(0, 5)}`,
    );

    const now = new Date();

    const diffInMilliseconds = appointmentDateTime - now;

    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    // Disable cancel when less than or equal to 2 hours remaining
    return diffInHours <= 2;
  };

  return (
    <div className="bookings-container" style={{ padding: "20px" }}>
    <Box p={5}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "Poppins", fontWeight: "bold", marginBottom: 3 }}
      >
        My Bookings
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Doctor Name / Specialization"
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: 50,
            },
          }}
        />

        <FormControl
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: 50,
            },
          }}
        >
          <InputLabel>Hospital</InputLabel>
          <Select
            value={filterHospital}
            label="Hospital"
            onChange={(e) => setFilterHospital(e.target.value)}
          >
            <MenuItem value="">All Hospitals</MenuItem>
            {hospitalOptions.map((hospital) => (
              <MenuItem key={hospital} value={hospital}>
                {hospital}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: 50,
            },
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<RestartAltIcon />}
          onClick={() => {
            setFilterDoctor("");
            setFilterHospital("");
            setFilterStatus("");
          }}
          sx={{
            flex: 0.5, // smaller than the others
            height: 50,
            whiteSpace: "nowrap",
            backgroundColor: "#187984",
          }}
        >
          Reset
        </Button>
      </Stack>

      {filteredAppointments.length === 0 ? (
        <Typography sx={{ fontStyle: "italic", color: "#888" }}>
          No appointments found.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#B0E0E6" }}>
                  {[
                    "Doctor",
                    "Specialization",
                    "Hospital",
                    "Date",
                    "Time",
                    "Status",
                    "Action",
                  ].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{`Dr. ${appt.doctor_name}`}</TableCell>
                    <TableCell>{appt.specialization}</TableCell>
                    <TableCell>{appt.hospital}</TableCell>
                    <TableCell>{appt.session_date}</TableCell>
                    <TableCell>{appt.session_time}</TableCell>
                    <TableCell>
                      {appt.status === "cancelled" ? (
                        <Chip
                          label="Cancelled"
                          sx={{
                            bgcolor: "#fdecea",
                            color: "#d32f2f",
                          }}
                        />
                      ) : (
                        <Chip
                          label="Active"
                          sx={{
                            bgcolor: "#e8f5e9",
                            color: "#388e3c",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        title={
                          isCancelDisabled(appt)
                            ? "Cancellation is not allowed within 2 hours of the appointment"
                            : "Cancel appointment"
                        }
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          // disabled={isDisabled} // disable when true
                          // disabled={disabledButtons.includes(appt.id)}
                          disabled={
                            disabledButtons.includes(appt.id) ||
                            isCancelDisabled(appt)
                          }
                          onClick={async () => {
                            const confirmed = await Swal.fire({
                              title: "Cancel Appointment?",
                              text: "Are you sure you want to cancel this appointment?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, cancel it",
                            });

                            if (confirmed.isConfirmed) {
                              const res = await fetch(
                                `http://localhost:3000/api/appointments/cancelByPatient/${appt.id}`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                },
                              );

                              // if (res.ok) {
                              //   Swal.fire("Cancelled!", "Your appointment was cancelled.", "success");
                              //   // setIsDisabled(true); //  disable button after success
                              //   setDisabledButtons((prev) => [...prev, appt.id]);
                              // }
                              if (res.ok) {
                                Swal.fire(
                                  "Cancelled!",
                                  "Your appointment was cancelled.",
                                  "success",
                                );

                                setAppointments((prev) =>
                                  prev.map((a) =>
                                    a.id === appt.id
                                      ? { ...a, status: "cancelled" }
                                      : a,
                                  ),
                                );
                              } else {
                                Swal.fire(
                                  "Error",
                                  "Could not cancel appointment.",
                                  "error",
                                );
                              }
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/*  Pagination Controls */}
          <TablePagination
            component="div"
            count={filteredAppointments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Box>
    </div>
  );
};

export default MyBookings;
