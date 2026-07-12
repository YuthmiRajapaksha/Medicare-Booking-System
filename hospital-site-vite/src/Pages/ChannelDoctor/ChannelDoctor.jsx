import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LocalHospital, CalendarToday, AccessTime, People } from "@mui/icons-material";

const countries = [
  "Sri Lanka",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

const validationSchema = Yup.object().shape({
  patientName: Yup.string().required("Patient name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  country: Yup.string().required("Country is required"),
  nic: Yup.string()
    .matches(/^([0-9]{9}[vV]|[0-9]{12})$/, "NIC must be 9 digits + V/v or 12 digits")
    .required("NIC is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const primaryColor = "#2B909B";

const DoctorChannel = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const {
    doctorName,
    hospital,
    sessionDate,
    sessionTime,
    bookingformId,
    maxAppointments = 5,
  } = state || {};

  const [doctor, setDoctor] = useState(null);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    if (!doctorName || !hospital || !sessionDate || !sessionTime || !bookingformId) {
      Swal.fire("Error", "Missing session data.", "error").then(() => navigate("/search"));
    }
  }, [doctorName, hospital, sessionDate, sessionTime, bookingformId, navigate]);

  const formattedSessionTime = sessionTime.length === 5 ? `${sessionTime}:00` : sessionTime;

  // Fetch doctor info
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/api/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data.doctor || data))
      .catch(() => Swal.fire("Error", "Doctor fetch failed.", "error"))
      .finally(() => setLoadingDoctor(false));
  }, [id]);

  // Fetch active appointments count
  const fetchAppointmentCount = () => {
    if (!hospital || !sessionDate || !formattedSessionTime) return;
    setLoadingCount(true);
    fetch(
      `http://localhost:3000/api/appointments/count/${id}?hospital=${encodeURIComponent(
        hospital
      )}&sessionDate=${sessionDate}&sessionTime=${formattedSessionTime}`
    )
      .then((res) => res.json())
      .then((data) => setAppointmentsCount(data.count))
      .catch(() => Swal.fire("Error", "Failed to load count", "error"))
      .finally(() => setLoadingCount(false));
  };

  useEffect(() => {
    fetchAppointmentCount();
  }, [id, hospital, sessionDate, formattedSessionTime]);

  const handleConfirmBooking = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user")); // ✅ ADD THIS

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          doctorName,
          hospital,
          sessionDate,
          sessionTime: formattedSessionTime,
          date: new Date().toISOString().slice(0, 19).replace("T", " "),
          ...submittedValues,
          paymentId: "FAKE_PAYMENT_ID",
          bookingformId,
          userId: user?.id, // ✅ safe access
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          Swal.fire("Duplicate Booking", data.error, "warning");
          setShowForm(false);
          setStep(1);
          fetchAppointmentCount();
        } else {
          throw new Error(data.error || "Booking failed");
        }
        return;
      }

      Swal.fire("Success", `Appointment booked successfully!`, "success");
      setShowForm(false);
      setStep(1);
      fetchAppointmentCount();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) return <CircularProgress />;
  if (!doctor) return <Typography>Doctor not found</Typography>;

  const appointmentRatio = appointmentsCount / maxAppointments;
  const appointmentColor =
    appointmentRatio >= 1 ? "#e74c3c" : appointmentRatio >= 0.7 ? "#f39c12" : "#2ecc71";

  return (
    <Box p={8} maxWidth="500px" mx="auto">
      {/* Modern Doctor Card */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          p: 0,
          mb: 4,
          transition: "0.3s all",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
          },
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${primaryColor}, #237d88)`,
            borderRadius: "16px 16px 0 0",
            p: 2,
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Dr. {doctorName}
          </Typography>
        </Box>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <LocalHospital sx={{ color: primaryColor, mr: 1 }} />
            <Typography variant="body1">{hospital}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <CalendarToday sx={{ color: primaryColor, mr: 1 }} />
            <Typography variant="body1">{sessionDate}</Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <AccessTime sx={{ color: primaryColor, mr: 1 }} />
            <Typography variant="body1">{formattedSessionTime}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <People sx={{ color: appointmentColor, mr: 1 }} />
              <Typography fontWeight={500}>
                {loadingCount ? "..." : `${appointmentsCount} / ${maxAppointments}  Active`}
              </Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: appointmentColor,
                color: "white",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              {appointmentRatio >= 1
                ? "Full"
                : appointmentRatio >= 0.7
                ? "Filling Fast"
                : "Available"}
            </Box>
          </Box>

          <Button
            disabled={appointmentsCount >= maxAppointments}
            variant="contained"
            onClick={() => setShowForm(true)}
            sx={{
              mt: 3,
              background: `linear-gradient(135deg, ${primaryColor}, #237d88)`,
              fontWeight: "bold",
              borderRadius: 3,
              px: 4,
              py: 1.2,
              boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              "&:hover": { opacity: 0.9 },
              width: "100%",
            }}
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>

      {/* Booking Form Dialog */}
      <Dialog
        open={showForm}
        onClose={(event, reason) => {
          if (submitting) return;
          if (reason === "backdropClick" || reason === "escapeKeyDown") return;
          setShowForm(false);
          setStep(1);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ pt: 4, pb: 3, px: 3, bgcolor: "#f5f8fa" }}>
          {/* Step Indicator */}
          <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: primaryColor,
                borderBottom: `3px solid ${primaryColor}`,
                pb: 0.5,
              }}
            >
              {step === 1 ? "Step 1: Patient Information" : "Step 2: Confirm Booking"}
            </Typography>
          </Box>

          {/* Step 1: Patient Info */}
          {step === 1 && (
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                p: 3,
                backgroundColor: "white",
                transition: "0.3s ease",
              }}
            >
              <Formik
                initialValues={{
                  patientName: "",
                  phone: "",
                  country: "",
                  nic: "",
                  email: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  setSubmittedValues(values);
                  setStep(2);
                }}
              >
                {({ values, handleChange, touched, errors }) => (
                  <Form>
                    <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}>
                      {[
                        { name: "patientName", label: "Patient Name", type: "text", icon: "👤" },
                        { name: "phone", label: "Phone Number", type: "text", icon: "📞" },
                        { name: "country", label: "Country", type: "select", options: countries },
                        { name: "nic", label: "NIC", type: "text", icon: "🆔" },
                        { name: "email", label: "Email Address", type: "email", icon: "✉️" },
                      ].map((field) =>
                        field.type === "select" ? (
                          <TextField
                            key={field.name}
                            select
                            name={field.name}
                            label={field.label}
                            value={values[field.name]}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            error={touched[field.name] && Boolean(errors[field.name])}
                            helperText={touched[field.name] && errors[field.name]}
                            sx={{
                              mt: 1,
                              borderRadius: 3,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                bgcolor: "#f3f6f9",
                                px: 1.5,
                                py: 0.5,
                                transition: "0.3s all",
                                "&:hover fieldset": { borderColor: primaryColor },
                                "&.Mui-focused fieldset": { borderColor: primaryColor, borderWidth: 2 },
                              },
                              "& .MuiInputLabel-root": { fontWeight: 500 },
                            }}
                          >
                            {field.options.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : (
                          <TextField
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            value={values[field.name]}
                            onChange={handleChange}
                            fullWidth
                            margin="dense"
                            type={field.type}
                            error={touched[field.name] && Boolean(errors[field.name])}
                            helperText={touched[field.name] && errors[field.name]}
                            InputProps={{
                              startAdornment: field.icon && <Box sx={{ mr: 1 }}>{field.icon}</Box>,
                            }}
                            sx={{
                              mt: 1,
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                bgcolor: "#f3f6f9",
                                px: 1.5,
                                py: 0.5,
                                transition: "0.3s all",
                                "&:hover fieldset": { borderColor: primaryColor },
                                "&.Mui-focused fieldset": { borderColor: primaryColor, borderWidth: 2 },
                              },
                              "& .MuiInputLabel-root": { fontWeight: 500 },
                            }}
                          />
                        )
                      )}
                    </Box>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                      <Button
                        onClick={() => setShowForm(false)}
                        disabled={submitting}
                        sx={{
                          color: "red",
                          fontWeight: "bold",
                          "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={submitting}
                        sx={{
                          background: `linear-gradient(135deg, ${primaryColor}, #237d88)`,
                          fontWeight: "bold",
                          px: 4,
                          py: 1.2,
                          borderRadius: 3,
                          "&:hover": { opacity: 0.9 },
                        }}
                      >
                        Next →
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Card>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && submittedValues && (
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 4,
                p: 3,
                backgroundColor: "white",
                transition: "0.3s ease",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    textAlign: "center",
                    color: primaryColor,
                  }}
                >
                  Confirm Your Booking
                </Typography>

                <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={4}>
                  <Box flex="1" minWidth="220px">
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, borderBottom: `2px solid ${primaryColor}`, pb: 1 }}>
                      Doctor Details
                    </Typography>
                    <Typography><strong>Date:</strong> {sessionDate}</Typography>
                    <Typography><strong>Time:</strong> {sessionTime}</Typography>
                    <Typography><strong>Doctor:</strong> Dr. {doctorName}</Typography>
                    <Typography><strong>Hospital:</strong> {hospital}</Typography>
                  </Box>

                  <Box flex="1" minWidth="220px">
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, borderBottom: `2px solid ${primaryColor}`, pb: 1 }}>
                      Patient Details
                    </Typography>
                    <Typography><strong>Name:</strong> {submittedValues.patientName}</Typography>
                    <Typography><strong>Phone:</strong> {submittedValues.phone}</Typography>
                    <Typography><strong>NIC:</strong> {submittedValues.nic}</Typography>
                    <Typography><strong>Email:</strong> {submittedValues.email}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#eef9fa", borderRadius: 2, p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Total Charge:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: primaryColor }}>LKR 2,500.00</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Button
                    sx={{
                      width: "120px",
                      color: primaryColor,
                      border: `2px solid ${primaryColor}`,
                      fontWeight: "bold",
                      borderRadius: 3,
                      "&:hover": { backgroundColor: "#d1e7eb" },
                    }}
                    onClick={() => setStep(1)}
                    disabled={submitting}
                  >
                    ← Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleConfirmBooking}
                    disabled={submitting}
                    sx={{
                      background: `linear-gradient(135deg, ${primaryColor}, #237d88)`,
                      px: 4,
                      fontWeight: "bold",
                      borderRadius: 3,
                      "&:hover": { opacity: 0.9 },
                    }}
                  >
                    {submitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorChannel;
