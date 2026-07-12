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

  // useEffect(() => {
  //   if (doctorToEdit) {
  //     setFormData({
  //       ...doctorToEdit,
  //       password: "",
  //     });
  //     if (doctorToEdit.photo) setPhotoPreview(doctorToEdit.photo);
  //   }
  // }, [doctorToEdit]);

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

  // const handleSave = async () => {
  //   if (!formData.name || !formData.specialization || !formData.userName || !formData.password || !formData.email) {
  //     Swal.fire("Error!", "Please fill in all required fields.", "error");
  //     return;
  //   }

  //   try {
  //     const formDataToSend = new FormData();
  //     Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
  //     if (photo) formDataToSend.append("photo", photo);

  //     const response = await axios.post("http://localhost:3000/api/doctors/add", formDataToSend, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     Swal.fire("Success!", response.data.message, "success");
  //     navigate("/doctors");
  //   } catch (error) {
  //     console.error("Error saving doctor:", error);
  //     Swal.fire(
  //       "Error!",
  //       error.response?.data?.message || "Failed to save doctor. Please try again.",
  //       "error"
  //     );
  //   }
  // };

const handleSave = async () => {
  // Required fields for everyone
  if (!formData.name || !formData.specialization || !formData.email) {
    Swal.fire("Error!", "Please fill in all required fields.", "error");
    return;
  }

  // Additional required fields only for new doctors
  if (!doctorToEdit && (!formData.userName || !formData.password)) {
    Swal.fire("Error!", "Username and Password are required for new doctors.", "error");
    return;
  }

  try {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Only append password if it exists (prevents overwriting with empty string on update)
      if (key !== "password" || value) formDataToSend.append(key, value);
    });
    if (photo) formDataToSend.append("photo", photo);

    const url = doctorToEdit 
      ? `http://localhost:3000/api/doctors/update/${doctorToEdit.id}` 
      : "http://localhost:3000/api/doctors/add";

      const method = doctorToEdit ? "put" : "post";

    // const response = await axios.post(url, formDataToSend, {
    //   headers: { "Content-Type": "multipart/form-data" },
    // });

    const response = await axios({
  method: doctorToEdit ? "put" : "post",
  url: url,
  data: formDataToSend,
  headers: { "Content-Type": "multipart/form-data" },
});

    Swal.fire("Success!", response.data.message, "success");
    navigate("/doctors");
  } catch (error) {
    console.error("Error saving doctor:", error);
    Swal.fire(
      "Error!",
      error.response?.data?.message || "Failed to save doctor. Please try again.",
      "error"
    );
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 850,
          borderRadius: 6,
          p: { xs: 3, md: 5 },
          backgroundColor: "white",
        }}
      >

        {/* <Paper
    elevation={0}
    sx={{
      width: "100%",
      maxWidth: 850,
      borderRadius: "24px",
      p: { xs: 3, md: 5 },

      // 🔥 Gradient background
      background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",

      // 🔥 Glass effect
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",

      // 🔥 Border for modern look
      border: "1px solid rgba(255,255,255,0.3)",

      // 🔥 Soft shadow
      boxShadow: "0 20px 50px rgba(0,0,0,0.08)",

      position: "relative",
      overflow: "hidden",
    }}
  > */}


        <Typography
          variant="h4"
          textAlign="center"
          mb={4}
          sx={{ fontWeight: 700, color: "#0f766e", letterSpacing: 1 }}
        >
          {doctorToEdit ? "Update Doctor" : "Add Doctor"}
        </Typography>

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
                backgroundColor: "#0f766e",
                borderRadius: 3,
                px: 3,
                "&:hover": { backgroundColor: "#115e59" },
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
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ backgroundColor: "#f1f5f9", borderRadius: 2 }}
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
                <TextField
                  {...params}
                  label="Specialization"
                  sx={{ backgroundColor: "#f1f5f9", borderRadius: 2 }}
                />
              )}
            />
            <Button
              startIcon={<Add />}
              onClick={handleAddSpecialization}
              sx={{ mt: 1, color: "#0f766e", fontWeight: 600 }}
            >
              Add Specialization
            </Button>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ backgroundColor: "#f1f5f9", borderRadius: 2 }}
            />
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              sx={{ backgroundColor: "#f1f5f9", borderRadius: 2 }}
            />
          </Grid>

          {/* Username / Password */}
          {!doctorToEdit && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  sx={{ backgroundColor: "#f1f5f9", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: "#f1f5f9", borderRadius: 2 }}
                />
              </Grid>
            </>
          )}

          {/* ACTION BUTTONS */}
          <Grid item xs={12} display="flex" justifyContent="center" gap={2} mt={2}>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#0f766e",
                color: "#0f766e",
                borderRadius: 3,
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
                backgroundColor: "#0f766e",
                px: 4,
                borderRadius: 3,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#115e59" },
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
