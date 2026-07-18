import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  FormControlLabel,
  TextField,
  Divider,
  Paper,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";
import PageHeader from "../../components/PageHeader";

const hospitals = ["Piliyandala", "Maharagama", "Gampaha"];

const BookingForm = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [hospitalData, setHospitalData] = useState({});

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/doctors/${doctorId}`);
        const data = await res.json();
        if (res.ok) setDoctor(data.doctor);
      } catch (err) {
        console.error("Error fetching doctor:", err);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (doctor && Object.keys(hospitalData).length === 0) {
      const initData = {};
      hospitals.forEach((h) => {
        initData[h] = { checked: false, datesTime: {} };
      });
      setHospitalData(initData);
    }
  }, [doctor, hospitalData]);

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  const handleHospitalCheck = (hospitalName, checked) => {
    setHospitalData((prev) => ({
      ...prev,
      [hospitalName]: { ...prev[hospitalName], checked },
    }));
  };

  const handleDateCheck = (hospitalName, date, checked) => {
    setHospitalData((prev) => ({
      ...prev,
      [hospitalName]: {
        ...prev[hospitalName],
        datesTime: {
          ...prev[hospitalName].datesTime,
          [date]: {
            ...(prev[hospitalName].datesTime[date] || {}),
            checked,
            time: prev[hospitalName].datesTime[date]?.time || "",
            max_appointments: prev[hospitalName].datesTime[date]?.max_appointments || 5,
          },
        },
      },
    }));
  };

  const handleTimeChange = (hospitalName, date, time) => {
    setHospitalData((prev) => ({
      ...prev,
      [hospitalName]: {
        ...prev[hospitalName],
        datesTime: {
          ...prev[hospitalName].datesTime,
          [date]: {
            ...(prev[hospitalName].datesTime[date] || {}),
            time,
          },
        },
      },
    }));
  };

  const handleMaxAppointmentsChange = (hospitalName, date, value) => {
    setHospitalData((prev) => ({
      ...prev,
      [hospitalName]: {
        ...prev[hospitalName],
        datesTime: {
          ...prev[hospitalName].datesTime,
          [date]: {
            ...(prev[hospitalName].datesTime[date] || {}),
            max_appointments: Number(value),
          },
        },
      },
    }));
  };

  const handleSubmit = async () => {
    const sessions = [];

    Object.entries(hospitalData).forEach(([hospitalName, hospData]) => {
      if (hospData.checked) {
        Object.entries(hospData.datesTime).forEach(
          ([date, { checked, time, max_appointments }]) => {
            if (checked && time && time !== "") {
              sessions.push({
                hospital: hospitalName,
                date,
                time,
                max_appointments: max_appointments || 5,
              });
            }
          }
        );
      }
    });

    if (sessions.length === 0) {
      Swal.fire("Error", "Please select at least one hospital, date, and time.", "error");
      return;
    }

    const confirmHtml = `
      <table style="width:100%; border-collapse:collapse; text-align:left">
        <tr style="background:#2B909B; color:#fff">
          <th style="padding:8px;">Hospital</th>
          <th style="padding:8px;">Date</th>
          <th style="padding:8px;">Time</th>
          <th style="padding:8px;">Max Appointments</th>
        </tr>
        ${sessions
          .map(
            (s) => `
              <tr>
                <td style="padding:8px;">${s.hospital}</td>
                <td style="padding:8px;">${s.date}</td>
                <td style="padding:8px;">${s.time}</td>
                <td style="padding:8px;">${s.max_appointments}</td>
              </tr>
            `
          )
          .join("")}
      </table>
    `;

    const confirm = await Swal.fire({
      title: "Confirm Sessions?",
      html: confirmHtml,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      width: 700,
      confirmButtonColor: "#2B909B",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:3000/api/bookingForm/multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, sessions }),
      });

      if (res.ok) {
        await Swal.fire("Success", "Appointments saved successfully!", "success");
        navigate("/appointments");
      } else {
        const data = await res.json();
        Swal.fire("Error", data.message || "Failed to save appointments", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Server error while saving appointments", "error");
    }
  };

  if (!doctor) return <Typography>Loading doctor info...</Typography>;

  return (
    <Box>
      <PageHeader
        title={`Schedule Sessions for Dr. ${doctor.name}`}
        subtitle="Select hospitals, dates, and time slots"
        onBack={() => navigate(-1)}
      />

      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Box>
          {hospitals.map((hospitalName) => {
            const hosp = hospitalData[hospitalName] || { checked: false, datesTime: {} };
            return (
              <Paper
                key={hospitalName}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: 1.5,
                  transition: "0.3s",
                  "&:hover": { boxShadow: "0 8px 20px rgba(15,23,42,0.08)" },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hosp.checked}
                      onChange={(e) => handleHospitalCheck(hospitalName, e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500, fontSize: "1.05rem" }}>
                      {hospitalName}
                    </Typography>
                  }
                />

                {hosp.checked && (
                  <Box mt={1.5}>
                    <Typography sx={{ fontWeight: 500, fontSize: "0.85rem", color: "text.secondary", mb: 1.5 }}>
                      Select Date(s), Time, and Max Appointments
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />

                    {getNext7Days().map((day) => (
                      <Box
                        key={day}
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          background: "rgba(43, 144, 155, 0.04)",
                          transition: "0.3s",
                          "&:hover": { background: "rgba(43, 144, 155, 0.08)" },
                        }}
                      >
                        <Checkbox
                          size="small"
                          sx={{ p: 0.5, flexShrink: 0 }}
                          checked={hosp.datesTime[day]?.checked || false}
                          onChange={(e) => handleDateCheck(hospitalName, day, e.target.checked)}
                        />

                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            flex: "1 1 100px",
                            minWidth: 100,
                          }}
                        >
                          {day}
                        </Typography>

                        <TextField
                          type="time"
                          size="small"
                          value={hosp.datesTime[day]?.time || ""}
                          onChange={(e) => handleTimeChange(hospitalName, day, e.target.value)}
                          disabled={!hosp.datesTime[day]?.checked}
                          sx={{ flex: "1 1 130px" }}
                        />

                        <TextField
                          type="number"
                          size="small"
                          label="Max Appointments"
                          value={hosp.datesTime[day]?.max_appointments || 5}
                          onChange={(e) =>
                            handleMaxAppointmentsChange(hospitalName, day, e.target.value)
                          }
                          inputProps={{ min: 1, max: 50 }}
                          disabled={!hosp.datesTime[day]?.checked}
                          sx={{ flex: "1 1 150px" }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            );
          })}
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<SaveIcon />}
          sx={{ py: 1.5, fontSize: "1rem", mt: 2, fontWeight: 600 }}
          onClick={handleSubmit}
        >
          Save Appointment(s)
        </Button>
      </Box>
    </Box>
  );
};

export default BookingForm;
