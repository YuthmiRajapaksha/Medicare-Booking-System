import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
      });
      return;
    }

    try {
    //   const token = localStorage.getItem("token");

    const token = localStorage.getItem("token");
console.log("TOKEN:", token);



   await axios.put(
  "http://localhost:3000/api/auth/change-user-password",
  {
    currentPassword: formData.currentPassword,
    newPassword: formData.newPassword,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      Swal.fire({
        icon: "success",
        title: "Password changed successfully",
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    // } catch (err) {
    //   Swal.fire({
    //     icon: "error",
    //     title:
    //       err.response?.data?.message || "Failed to change password",
    //   });
    // }

     } catch (err) {
  console.log("ERROR RESPONSE:", err.response);
  console.log("ERROR:", err);

  Swal.fire({
    icon: "error",
    title: err.response?.data?.message || "Failed to change password",
  });
}
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 10 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 1.2 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Change Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              bgcolor: "#2B909B",
            }}
          >
            Update Password
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword;