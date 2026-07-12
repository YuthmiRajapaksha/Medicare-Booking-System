import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  // ✅ Validation
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("rememberedEmail") || "",
      password: "",
    },
    validationSchema,

    onSubmit: async (values) => {
      setLoading(true);

      try {
        const res = await axios.post("http://localhost:3000/api/login", {
          email: values.email,
          password: values.password,
        });

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", values.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // ✅ THIS IS THE FIX
        login({
          user: res.data.user,
          token: res.data.token,
          role: res.data.role,
        });

        Swal.fire({
          icon: "success",
          title: "Welcome back!",
          text: `Hi ${res.data.user.firstName || "User"}`,
          showConfirmButton: false,
          timer: 2000,
        });

        navigate("/");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response?.data?.message || "Invalid credentials",
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
        minHeight: "650px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "linear-gradient(120deg, #2B909B, #77C8C6)",
        background: "linear-gradient(135deg, #e0f2f1, #f8fafc)",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 1, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          SIGN IN
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* EMAIL */}
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

          {/* PASSWORD */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            sx={{ mt: 2 }}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ width: "100%", textAlign: "left" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />
          </Box>

          {/* LOGIN BUTTON */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              p: 1.2,
              backgroundColor: "#2B909B",
              fontSize: "16px",
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <Typography
            variant="body2"
            textAlign="right"
            sx={{ mt: 1, cursor: "pointer", color: "#2B909B" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </Typography>
        </form>

        {/* LINK */}
        <Typography textAlign="center" sx={{ mt: 2 }} >
          Don’t have an account?{" "}
          <span
            style={{
              color: "#2B909B",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignIn;
