

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Autocomplete,
  Avatar,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, Add } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import PageHeader from "../../components/PageHeader";

const AddDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctorToEdit = location.state?.doctor || null;

  const initialFormData = {
    name: "",
    specialization: "",
    email: "",
    contactNumber: "",
    userName: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [specializations, setSpecializations] = useState([
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
  ]);

  useEffect(() => {
  if (doctorToEdit) {
    setFormData({
      name: doctorToEdit.name || "",
      specialization: doctorToEdit.specialization || "",
      email: doctorToEdit.email || "",
      contactNumber: doctorToEdit.contactNumber || "",
      userName: doctorToEdit.userName || "",
      password: "", // always empty for security
    });

    if (doctorToEdit.photo) {
      setPhotoPreview(doctorToEdit.photo);
    }
  }
}, [doctorToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleAddSpecialization = async () => {
    const { value: newSpec } = await Swal.fire({
      title: "Add Specialization",
      input: "text",
      inputPlaceholder: "Enter new specialization",
      showCancelButton: true,
    });

    if (newSpec) {
      const trimmed = newSpec.trim();
      if (trimmed && !specializations.includes(trimmed)) {
        setSpecializations([...specializations, trimmed]);
        Swal.fire("Added!", `"${trimmed}" added.`, "success");
      } else {
        Swal.fire("Oops!", "Already exists or invalid.", "warning");
      }
    }
  };

  const handleSave = async () => {
  // Validation
  if (!photo && !doctorToEdit?.photo) {
    Swal.fire("Error!", "Please upload a doctor photo.", "error");
    return;
  }

  if (!formData.name.trim()) {
    Swal.fire("Error!", "Doctor name is required.", "error");
    return;
  }

  if (!formData.specialization.trim()) {
    Swal.fire("Error!", "Specialization is required.", "error");
    return;
  }

  if (!formData.email.trim()) {
    Swal.fire("Error!", "Email is required.", "error");
    return;
  }

  if (!formData.contactNumber.trim()) {
    Swal.fire("Error!", "Contact number is required.", "error");
    return;
  }

  // Required only when adding a new doctor
  if (!doctorToEdit) {
    if (!formData.userName.trim()) {
      Swal.fire("Error!", "Username is required.", "error");
      return;
    }

    if (!formData.password.trim()) {
      Swal.fire("Error!", "Password is required.", "error");
      return;
    }
  }

  try {
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "password" || value) {
        formDataToSend.append(key, value);
      }
    });

    if (photo) {
      formDataToSend.append("photo", photo);
    }

    const url = doctorToEdit
      ? `http://localhost:3000/api/doctors/update/${doctorToEdit.id}`
      : "http://localhost:3000/api/doctors/add";

    const response = await axios({
      method: doctorToEdit ? "put" : "post",
      url,
      data: formDataToSend,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Success!", response.data.message, "success");
    navigate("/doctors");
  } catch (error) {
    console.error(error);

    Swal.fire(
      "Error!",
      error.response?.data?.message || "Failed to save doctor.",
      "error"
    );
  }
};

  return (
    <Box>
      <PageHeader
        title={doctorToEdit ? "Update Doctor" : "Add Doctor"}
        subtitle={
          doctorToEdit
            ? "Edit this doctor's profile and credentials"
            : "Create a new doctor profile"
        }
        onBack={() => navigate(-1)}
      />

      <Paper
        sx={{
          width: "100%",
          maxWidth: 850,
          mx: "auto",
          borderRadius: 1.5,
          p: { xs: 3, md: 5 },
        }}
      >
        <Grid container spacing={4}>
          {/* Profile Photo Section */}
          <Grid item xs={12} display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src={photoPreview}
              sx={{
                width: 130,
                height: 130,
                mb: 2,
                borderRadius: "50%",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
              }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<Add />}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: 1,
                px: 3,
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPhoto(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setPhotoPreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
          </Grid>

          {/* Name */}
          <Grid item xs={12} md={6}>
            <TextField
  fullWidth
  required
  label="Name"
  name="name"
  value={formData.name}
  onChange={handleChange}
  error={!formData.name.trim()}
  helperText={!formData.name.trim() ? "Name is required" : ""}
/>
          </Grid>

          {/* Specialization */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              freeSolo
              options={specializations}
              value={formData.specialization}
              onChange={(e, val) => setFormData({ ...formData, specialization: val || "" })}
              renderInput={(params) => (
                <TextField {...params} label="Specialization" />
              )}
            />
            <Button
              startIcon={<Add />}
              onClick={handleAddSpecialization}
              sx={{ mt: 1, color: "primary.main", fontWeight: 600 }}
            >
              Add Specialization
            </Button>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
  fullWidth
  required
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={!formData.email.trim()}
  helperText={!formData.email.trim() ? "Email is required" : ""}
/>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={6}>
            <TextField
  fullWidth
  required
  label="Contact Number"
  name="contactNumber"
  value={formData.contactNumber}
  onChange={handleChange}
  error={!formData.contactNumber.trim()}
  helperText={!formData.contactNumber.trim() ? "Contact number is required" : ""}
/>
          </Grid>

          {/* Username / Password */}
          {!doctorToEdit && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
  fullWidth
  required
  label="Username"
  name="userName"
  value={formData.userName}
  onChange={handleChange}
  error={!formData.userName.trim()}
  helperText={!formData.userName.trim() ? "Username is required" : ""}
/>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                   required
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                   error={!formData.password.trim()}
  helperText={!formData.password.trim() ? "Password is required" : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </>
          )}

          {/* ACTION BUTTONS */}
          <Grid item xs={12} display="flex" justifyContent="center" gap={2} mt={2}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                borderRadius: 1,
                px: 4,
                fontWeight: 600,
              }}
              onClick={handleReset}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                px: 4,
                borderRadius: 1,
                fontWeight: 600,
                "&:hover": { backgroundColor: "primary.dark" },
              }}
              onClick={handleSave}
            >
              {doctorToEdit ? "Update" : "Save"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddDoctor;
