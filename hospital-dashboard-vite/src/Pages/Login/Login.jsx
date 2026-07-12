import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/doctor-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      setSuccessMessage("Login successful!");

     
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("Saved token:", data.token);
      }

      // Store role
      const normalizedRole = data.role?.toLowerCase();
      localStorage.setItem("role", normalizedRole);

      
      if (normalizedRole === "user" && data.doctor) {
        localStorage.setItem("doctor", JSON.stringify(data.doctor));
        localStorage.setItem("doctorId", data.doctor.id);
      } else {
        localStorage.removeItem("doctor");
        localStorage.removeItem("doctorId");
      }

      
      navigate("/home");
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundImage: "url('/image/background_img.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ ml: "auto", mr: 30 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: 4,
            boxShadow: 8,
          }}
        >
          <Box display="flex" gap={1} mb={2}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ fontFamily: "Cursive", color: "black" }}
            >
              MediCare
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontFamily: "Cursive", color: "#2B909B" }}
            >
              Hospitals
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Login
          </Typography>

          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {successMessage && (
            <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
              {successMessage}
            </Typography>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                display: "flex",
                justifyContent: "center",
                margin: "0 auto",
                height: 40,
                width: 100,
                padding: 1,
                fontSize: 15,
                mt: 2,
                backgroundColor: "#2B909B",
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;



