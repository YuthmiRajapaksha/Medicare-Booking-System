

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Box,
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PageHeader from "../../components/PageHeader";

const AllAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [specSearch, setSpecSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/doctors");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (role === "admin") fetchDoctors();
  }, [role]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const filteredDoctors = doctors.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      doc.specialization.toLowerCase().includes(specSearch.toLowerCase())
    );
  });

  const paginatedDoctors = filteredDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 🔥 MODERN CARD
  const renderDoctorCard = (doctor) => (
    <Grid item xs={12} sm={6} md={4} key={doctor.id}>
      <Card
        sx={{
          borderRadius: 1.5,
          p: 2.5,
          background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* HEADER */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2B909B, #6dd5ed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {doctor.name.charAt(0)}
            </Box>

            <Box>
              <Typography fontWeight="bold" fontFamily="Poppins" sx={{fontSize: 20}}>
                Dr. {doctor.name}
              </Typography>
              <Typography fontSize={13} color="#64748b">
                {doctor.specialization}
              </Typography>
            </Box>
          </Box>

          {/* BUTTONS */}
          <Box display="flex" flexDirection="column" gap={1.2}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<EventIcon />}
              sx={{
                background: "linear-gradient(135deg, #2B909B, #237e88)",
                borderRadius: "12px",
                fontWeight: 600,
              }}
              onClick={() => navigate(`/book-appointment/${doctor.id}`)}
            >
              Schedule Appointment
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<EditCalendarIcon />}
              sx={{
                borderRadius: "12px",
                fontWeight: 600,
                color: "#2B909B",
                border: "1.5px solid #2B909B",
                "&:hover": {
                  backgroundColor: "#f0f9fa",
                },
              }}
              onClick={() => navigate(`/update-appointments/${doctor.id}`)}
            >
              Update Appointments
            </Button>

            <Button
              variant="text"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{
                fontWeight: 600,
                color: "#476469",
              }}
              onClick={() => navigate(`/view-appointments/${doctor.id}`)}
            >
              View Appointments
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box>
      <PageHeader
        title={
          role === "admin" ? "Appointments for Doctors" : "Your Appointment Panel"
        }
        subtitle="Schedule, update, and review appointments"
      />

      {/* SEARCH */}
      {role === "admin" && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            background: "#ffffff",
            p: 2,
            borderRadius: 1,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          }}
        >
          <TextField
            placeholder="Search doctor name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                backgroundColor: "#f8fafc",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            placeholder="Search specialization..."
            value={specSearch}
            onChange={(e) => setSpecSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                backgroundColor: "#f8fafc",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* CARDS */}
      <Grid container spacing={3}>
        {role === "admin" ? (
          paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doc) => renderDoctorCard(doc))
          ) : (
            <Typography align="center" >No doctors found.</Typography>
          )
        ) : doctor ? (
          renderDoctorCard(doctor)
        ) : (
          <Typography>Doctor not found.</Typography>
        )}
      </Grid>

      {/* PAGINATION */}
      {role === "admin" && (
        <Box display="flex" justifyContent="center" mt={4}>
          <TablePagination
            component="div"
            count={filteredDoctors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Box>
      )}
    </Box>
  );
};

export default AllAppointment;