
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
    <Box p={3} mt={8}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >


       <Box sx={{ textAlign: "center", mb: 4 }}>
  
  {/* TITLE 1 */}
  <Typography
    variant="h4"
    fontWeight="bold"
    sx={{ fontFamily: "Poppins", color: "#111827" ,textAlign: "left"}}
  >
    All Doctors
  </Typography>

  {/* TITLE 2 */}
  <Typography
    variant="h6"
    sx={{ color: "#64748b", mt: 1 }}
  >
    Manage and search doctor records
  </Typography>

</Box>

{/* 🔍 SEARCH SECTION */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
    mb: 4,
  }}
>
  {/* Search by Name */}
  <TextField
    placeholder="Search doctor name..."
    variant="outlined"
    value={nameSearch}
    onChange={(e) => {
      setNameSearch(e.target.value);
      setPage(0);
    }}
   sx={{
      width: 280,
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
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

  {/* Search by Specialization */}
  <TextField
    placeholder="Search specialization..."
    variant="outlined"
    value={specSearch}
    onChange={(e) => {
      setSpecSearch(e.target.value);
      setPage(0);
    }}
    sx={{
      width: 280,
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
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
{/* </Box> */}
       
          {/* ➕ ADD DOCTOR BUTTON */}
  {role === "admin" && (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#2B909B",
        fontWeight: "bold",
        borderRadius: 2,
        height: 55, // same height as input
        px: 3,
        "&:hover": { backgroundColor: "#4da6a9" },
      }}
      onClick={() => navigate("/add-doctor")}
    >
      + Add Doctor
    </Button>
  )}
        
      </Box>
      </Box>

      {/* <Grid container spacing={3}>
        {paginatedDoctors.map((doctor) => (
          <Grid item xs={12} sm={4} key={doctor.id}>
            <Card
              elevation={3}
              sx={{
                textAlign: "center",
                height: 170,
                "&:hover": {
                  transform: "scale(1.1)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mt: 1, fontFamily: "Poppins" }}>
                  {`Dr. ${doctor.name}`}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 5, backgroundColor: "#2B909B" }}
                  onClick={() => navigate(`/doctor-details/${doctor.id}`)}
                >
                  VIEW DETAILS
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid> */}


      <Grid container spacing={3}>
  {paginatedDoctors.map((doctor) => (
    <Grid item xs={12} sm={3} key={doctor.id}>
      <Card
        elevation={4}
        sx={{
          textAlign: "center",
          borderRadius: 4,
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
              borderRadius: 3,
              fontWeight: "bold",
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

