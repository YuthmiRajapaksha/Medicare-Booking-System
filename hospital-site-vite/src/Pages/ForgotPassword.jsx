import React, { useState } from "react";
import { Box, Button, Typography, TextField, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Send request to backend
        const res = await axios.post("http://localhost:3000/api/forgot-password", {
          email: values.email,
        });

        Swal.fire({
          icon: "success",
          title: "Check your email",
          text: res.data.message || "Password reset link sent!",
          confirmButtonColor: "#2B909B",
        });

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
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
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(120deg, #2B909B, #77C8C6)",
      }}
    >
      <Paper elevation={10} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Forgot Password
        </Typography>

        <Typography variant="body2" textAlign="center" mt={1}>
          Enter your registered email to receive a password reset link.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            sx={{ mt: 3 }}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, p: 1.2, backgroundColor: "#2B909B", fontSize: "16px" }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
