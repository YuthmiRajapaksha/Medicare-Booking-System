import React, { useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  Container,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";
import PageHeader from "../../components/PageHeader";

const Settings = () => {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = values;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    if (newPassword.length < 6 || !/[!@$%]/.test(newPassword)) {
      Swal.fire(
    "Error",
    "New password must be at least 6 characters and include a special character (!$@%).",
    "error"
  );
  return;
}

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "New password and confirmation do not match.", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);
      const response = await fetch(
        "http://localhost:3000/api/doctors/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      let result = {};
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Could not parse JSON:", parseError);
        result = {};
      }

      console.log("Server response:", result, "Status:", response.status);

     if (response.ok) {
        Swal.fire("Success", "Password changed successfully!", "success");
        setValues({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          showPassword: false,
        });
      } else {
        Swal.fire(
          "Failed",
          `Failed to change password: ${result.message || "Unknown error"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Network or server error:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };


  return (
    <Box>
      <PageHeader title="Settings" subtitle="Manage your account security" />

      <Container maxWidth="sm" disableGutters>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            p: { xs: 3, sm: 4 },
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Your password must be at least 6 characters and include a combination of
            numbers, letters, and special characters (!$@%).
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="normal"
                type={values.showPassword ? "text" : "password"}
                label={
                  field === "currentPassword"
                    ? "Current password"
                    : field === "newPassword"
                    ? "New password"
                    : "Retype new password"
                }
                value={values[field]}
                onChange={handleChange(field)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              sx={{ width: 160, mt: 3, fontWeight: 600 }}
            >
              Save
            </Button>
          </Box>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            message={snackbarMessage}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Settings;

