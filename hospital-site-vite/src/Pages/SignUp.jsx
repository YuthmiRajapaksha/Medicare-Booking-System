import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const SignUp = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [idType, setIdType] = useState("NIC");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const steps = ["Email", "Verify OTP", "Personal Info"];

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // =========================
  // SEND OTP (CHECK DUPLICATE FIRST)
  // =========================
  const sendOtpToEmail = async () => {
    try {
      // await axios.post("http://localhost:3000/api/check-email", {
      //   email: formik.values.email,
      // });

      await axios.post("http://localhost:3000/api/send-otp", {
        email: formik.values.email,
      });

      Swal.fire("OTP Sent", "Check your email", "success");
      setActiveStep(1);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Email already exists",
        "error",
      );
    }
  };

  // NEXT BUTTON
  const handleNext = async () => {
    if (activeStep === 0) {
      if (!formik.values.email) {
        Swal.fire({ icon: "error", title: "Enter your email" });
        return;
      }
      return sendOtpToEmail();
    }

    if (activeStep === 1) {
      try {
        // VERIFY OTP WITH BACKEND
        await axios.post("http://localhost:3000/api/verify-otp", {
          email: formik.values.email,
          otp,
        });

        Swal.fire({
          icon: "success",
          title: "OTP Verified!",
          confirmButtonColor: "#2B909B",
        });

        setActiveStep(2);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Invalid OTP",
          text: "Please enter the correct OTP.",
          confirmButtonColor: "#2B909B",
        });
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  // FORMIK (STEP 3)
  const formik = useFormik({
    initialValues: {
      title: "",
      firstName: "",
      lastName: "",
      nic: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      nic: Yup.string().required("NIC/Passport required"),
      // email: Yup.string().required("Email is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post("http://localhost:3000/api/register", {
          email: values.email,
          title: values.title,
          firstName: values.firstName,
          lastName: values.lastName,
          idType,
          nicOrPassport: values.nic,
          password: values.password,
        });

        Swal.fire({
          title: "Registration Complete!",
          text: "You have successfully registered.",
          icon: "success",
          confirmButtonColor: "#2B909B",
        }).then(() => navigate("/signin"));
      } catch (error) {
        Swal.fire({
          title: "Registration Failed",
          text: error.response?.data?.message || "Try again",
          icon: "error",
          confirmButtonColor: "#2B909B",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        pt: '100px',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "640px",
        background: "linear-gradient(135deg, #e0f2f1, #f8fafc)",
      }}
    >
      <Paper elevation={10} sx={{ p: 4, width: "40%", minWidth: "350px" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, idx) => (
            <Step key={idx}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* STEP 1 — ENTER EMAIL */}
        {activeStep === 0 && (
          <Box mt={4} textAlign="center">
            <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{marginTop: 2}}>
              SIGN UP
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{marginBottom: 2}}>
              Enter your Email
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
            />
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <Button
              variant="contained"
              sx={{ mt: 3, backgroundColor: "#2B909B" }}
              onClick={handleNext}
              disabled={!formik.values.email}
            >
              SEND OTP
            </Button>
            </div>
          </Box>
        )}

        {/* STEP 2 — OTP VERIFICATION */}
        {activeStep === 1 && (
          <Box mt={4} textAlign="center">
            <Typography variant="h5" fontWeight="bold">
              Verify Email
            </Typography>
            <Typography variant="body1" mt={2}>
              Enter the OTP sent to {formik.values.email}
            </Typography>

            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) =>
                /^\d{0,6}$/.test(e.target.value) && setOtp(e.target.value)
              }
              sx={{ mt: 2 }}
            />

           <Box sx={{ textAlign: "center", mt: 3 }}>
  <Button
    variant="outlined"
    onClick={handleBack}
    sx={{ mr: 3 }}
  >
    Back
  </Button>

  <Button
    variant="contained"
    onClick={handleNext}
    sx={{ ml: 3, bgcolor: "#2B909B" }}
  >
    VERIFY
  </Button>
</Box>

            {/* <Box display="flex" justifyContent="space-between" mt={3} >
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#2B909B" }}
                onClick={handleNext}
              >
                VERIFY
              </Button>
            </Box> */}
          </Box>
        )}

        {/* STEP 3 — PERSONAL INFO */}
        {activeStep === 2 && (
          <Box mt={4} textAlign="center">
            <Typography variant="h5" fontWeight="bold">
              Personal Info
            </Typography>

            <form onSubmit={formik.handleSubmit}>
              <Select
                fullWidth
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                sx={{ mt: 3 }}
              >
                <MenuItem value="Mr.">Mr.</MenuItem>
                <MenuItem value="Ms.">Ms.</MenuItem>
                <MenuItem value="Dr.">Dr.</MenuItem>
              </Select>

              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
              />

              <RadioGroup
                row
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                sx={{ mt: 2 }}
              >
                <FormControlLabel value="NIC" control={<Radio />} label="NIC" />
                <FormControlLabel
                  value="Passport"
                  control={<Radio />}
                  label="Passport"
                />
              </RadioGroup>

              <TextField
                fullWidth
                label={idType}
                name="nic"
                value={formik.values.nic}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <Box display="flex" justifyContent="space-between" mt={3}>
                <Button variant="outlined" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ backgroundColor: "#2B909B" }}
                >
                  {loading ? "Registering..." : "Submit"}
                </Button>
              </Box> */}

              <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    mt: 3,
  }}
>
  <Button
    variant="outlined"
    onClick={handleBack}
    sx={{
      minWidth: 120,
      borderRadius: 2,
    }}
  >
    Back
  </Button>

  <Button
    variant="contained"
    type="submit"
    sx={{
      backgroundColor: "#2B909B",
      minWidth: 120,
      borderRadius: 2,
      "&:hover": {
        backgroundColor: "#237d88",
      },
    }}
  >
    {loading ? "Registering..." : "Submit"}
  </Button>
</Box>
            </form>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SignUp;
