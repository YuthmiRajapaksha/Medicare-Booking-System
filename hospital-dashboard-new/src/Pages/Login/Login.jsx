import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container, Alert } from "@mui/material";
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
        justifyContent: { xs: "center", md: "flex-end" },
        alignItems: "center",
        backgroundImage: "url('/image/wallpaperlogin.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ mr: { xs: "auto", md: 22 }, ml: { xs: "auto", md: 0 }, position: "relative" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: { xs: 3.5, sm: 4.5 },
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(10px)",
            borderRadius: 1.5,
            boxShadow: "0 20px 45px rgba(15, 42, 45, 0.20)",
          }}
        >
          <Box
            component="img"
            src="/image/mc.png"
            alt="MediCare — Care Beyond Compare"
            sx={{
              width: { xs: 200, sm: 150 },
              height: "auto",
              mb: 3,
            }}
          />

          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              mb: 3,
              textAlign: "center",
            }}
          >
            Sign in to manage appointments, records, and patient care
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2, borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ width: "100%", mb: 2, borderRadius: 1 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              label="Username"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ fontSize: 14.5, fontWeight: 600, py: 1.2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;



