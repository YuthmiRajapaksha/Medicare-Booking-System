
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
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PageHeader from "../../components/PageHeader";

const DoctorCards = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameSearch, setNameSearch] = useState("");
    const [specSearch, setSpecSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/doctors");
        const data = await response.json();
        if (response.ok) {
          setDoctors(data.doctors || []);
        } else {
          alert("Error fetching doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("An error occurred while fetching doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const filteredDoctors = doctors.filter((doctor) =>
  //   doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredDoctors = doctors.filter((doctor) => {
  const matchesName = doctor.name
    ?.toLowerCase()
    .includes(nameSearch.toLowerCase());

  const matchesSpec = doctor.specialization
    ?.toLowerCase()
    .includes(specSearch.toLowerCase());

  return matchesName && matchesSpec;
});

  const paginatedDoctors = filteredDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <PageHeader title="All Doctors" subtitle="Manage and search doctor records" />

      {/* SEARCH SECTION */}
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "stretch", md: "flex-end" },
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search doctor name..."
          value={nameSearch}
          onChange={(e) => {
            setNameSearch(e.target.value);
            setPage(0);
          }}
          sx={{ width: { xs: "100%", sm: 260 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          placeholder="Search specialization..."
          value={specSearch}
          onChange={(e) => {
            setSpecSearch(e.target.value);
            setPage(0);
          }}
          sx={{ width: { xs: "100%", sm: 260 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        {role === "admin" && (
          <Button
            variant="contained"
            sx={{ height: 56, px: 3, width: { xs: "100%", sm: "auto" } }}
            onClick={() => navigate("/add-doctor")}
          >
            + Add Doctor
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
  {paginatedDoctors.map((doctor) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.id}>
      <Card
        elevation={4}
        sx={{
          textAlign: "center",
          borderRadius: 1.5,
          p: 2,
          transition: "0.3s",
          height: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
          },
        }}
      >
        <CardContent>

          {/* Doctor Avatar */}
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: "#E6F4F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 1,
              fontSize: 30,
              fontWeight: "bold",
              color: "#2B909B",
            }}
          >
            {doctor.name.charAt(0)}
          </Box>

          {/* Doctor Name */}
          <Typography
            variant="h6"
            sx={{ fontFamily: "Poppins", fontWeight: 600 }}
          >
            Dr. {doctor.name}
          </Typography>

          {/* Specialization */}
          <Typography
            variant="body2"
            sx={{ color: "gray", mb: 2 }}
          >
            {doctor.specialization || "General Physician"}
          </Typography>

          {/* View Button */}
          <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: "#2B909B",
              borderRadius: 1,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#237e88" },
            }}
            onClick={() => navigate(`/doctor-details/${doctor.id}`)}
          >
            View Details
          </Button>

        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      <Box display="flex" justifyContent="center" mt={4}>
        <TablePagination
          component="div"
          count={filteredDoctors.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          labelRowsPerPage=""
        />
      </Box>
    </Box>
  );
};

export default DoctorCards;

