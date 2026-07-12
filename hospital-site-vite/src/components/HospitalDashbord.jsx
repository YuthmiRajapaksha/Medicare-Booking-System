import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [date, setDate] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const isSearchDisabled = !doctorId && !specialization && !hospital && !date;


  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setUserName(user.name);
    }

    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/doctors");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.doctors);
          setSpecializations([...new Set(data.doctors.map(doc => doc.specialization))]);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = () => {
    const query = new URLSearchParams({
      doctorId,
      specialization,
      hospital,
      date,
    }).toString();

    navigate(`/results?${query}`);
  };

  return (
    <>
      <Box
        component="section"
        sx={{
          width: "100%",
          minHeight: { xs: 420, md: 620 },
          backgroundImage: "url(/img/Medicare-coverr.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", py: { xs: 6, md: 8 } }}>
          <Box sx={{ maxWidth: 640, color: "#fff" }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                mb: 3,
                color: "#fff",
                fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
                textShadow: "0 18px 40px rgba(0,0,0,0.24)",
              }}
            >
              Get a professional diagnosis in your neighborhood.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255,255,255,0.92)",
                mb: 4,
                fontWeight: 400,
                fontSize: { xs: "1rem", sm: "1.05rem", md: "1.12rem" },
                lineHeight: 1.75,
                textShadow: "0 16px 28px rgba(0,0,0,0.18)",
              }}
            >
              Leading experts in all major fields are just around the corner. Book your appointment today.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#19707a",
                fontSize: "1.1rem",
                fontWeight: 500,
                px: 2.5,
                py: 1.4,
                borderRadius: 1.3,
                border: "1px solid #fff",
                transition: "all 0.3s ease",
                boxShadow: "0 18px 40px rgba(43,144,155,0.22)",
                '&:hover': { backgroundColor: '#237d88', color: '#fff', border: '1px solid #ffffff82', boxShadow: '0 18px 40px rgba(43,144,155,0.32)' },
              }}
               onClick={() => {
    document
      .getElementById("appointment-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
            >
              Book an appointment
            </Button>
          </Box>
        </Container>
      </Box>

      {userName && (
        <Typography variant="h6" sx={{ position: "absolute", top: 20, right: 30, color: "#fff", fontWeight: "bold", zIndex: 2 }}>
          Hi, {userName}! Welcome back.
        </Typography>
      )}

      
      <Container sx={{ mt: 8, mb: 10, maxWidth: "lg" }} id="appointment-form">
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: 1120,
            mx: "auto",
            p: { xs: 3, md: 5 },
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.92)",
            boxShadow: "0 28px 68px rgba(15, 23, 42, 0.12)",
            borderRadius: 4,
            border: "1px solid rgba(43, 144, 155, 0.14)",
            backdropFilter: "blur(14px)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, mb: 4, bgcolor: "#eaf8fb", py: 3, px: 2, borderRadius: 3 }}>
            <Box sx={{ px: 3, py: 1, borderRadius: 3, bgcolor: "#176d77", color: "#fff", fontWeight: 500, fontSize: "0.85rem" }}>
              Find the right care faster
            </Box>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: "0.04em" }}>
              CHANNEL YOUR DOCTOR
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
              Search available specialists, choose your preferred branch, and schedule the nearest appointment with one click.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 3, maxWidth: 1080, mx: "auto" }}>
            <Grid item xs={12} sm={6} md="auto" sx={{ minWidth: 240 }}>
              <Autocomplete
                options={doctors}
                getOptionLabel={(option) => option.name || ""}
                value={doctors.find((doc) => doc.id === doctorId) || null}
                onChange={(e, newValue) => setDoctorId(newValue ? newValue.id : "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Doctor name"
                    fullWidth
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                )}
                ListboxProps={{ style: { maxHeight: "260px", overflow: "auto" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md="auto" sx={{ minWidth: 240 }}>
              <Autocomplete
                freeSolo
                options={specializations}
                value={specialization}
                onInputChange={(e, val) => setSpecialization(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Specialization"
                    fullWidth
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                )}
                ListboxProps={{ style: { maxHeight: "260px", overflow: "auto" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md="auto" sx={{ minWidth: 240 }}>
              <Autocomplete
                freeSolo
                options={["Piliyandala", "Maharagama", "Gampaha"]}
                value={hospital}
                onInputChange={(e, val) => setHospital(val)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hospital branch"
                    fullWidth
                    sx={{ backgroundColor: "#fff", borderRadius: 2 }}
                  />
                )}
                ListboxProps={{ style: { maxHeight: "260px", overflow: "auto" } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md="auto" sx={{ minWidth: 220 }}>
              <FormControl fullWidth variant="outlined" sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
                <InputLabel shrink htmlFor="appointment-date">
                  Date
                </InputLabel>
                <OutlinedInput
                  id="appointment-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  inputProps={{
                    min: new Date().toISOString().split("T")[0],
                    sx: { padding: "14px 14px 12px" },
                  }}
                  label="Date"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isSearchDisabled}
            sx={{
              width: { xs: "100%", sm: "190px" },
              backgroundColor: "#2B909B",
              mt: 1,
              fontSize: "0.96rem",
              fontWeight: 500,
              py: 1.5,
              borderRadius: 1.1,
              boxShadow: "0 18px 40px rgba(43,144,155,0.22)",
              '&:hover': { backgroundColor: '#237d88' },
              '&:disabled': { backgroundColor: "#cfd8dc", color: "rgba(0,0,0,0.45)" },
            }}
          >
            Search doctors
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default HospitalDashboard;


