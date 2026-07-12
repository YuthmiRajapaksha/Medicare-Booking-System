import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Paper,
} from "@mui/material";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const doctorId = params.get("doctorId") || "";
  const hospital = params.get("hospital") || "";
  const sessionDate = params.get("date") || "";
  const specialization = params.get("specialization") || "";
  const doctorName = params.get("doctor_name") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const query = new URLSearchParams();
        if (doctorId) query.append("doctorId", doctorId);
        if (hospital) query.append("hospital", hospital);
        if (sessionDate) query.append("session_date", sessionDate);
        if (specialization) query.append("specialization", specialization);
        if (doctorName) query.append("doctor_name", doctorName);

        const res = await fetch(
          `http://localhost:3000/api/bookingform/search?${query.toString()}`
        );

        const data = await res.json();

        if (res.ok) {
          const now = new Date();

          // Filter out sessions that have already passed
          const upcoming = data.filter((booking) => {
            if (!booking.session_date || !booking.session_time) return false;

            const [hours, minutes] = booking.session_time.split(":");
            const bookingDateTime = new Date(booking.session_date);
            bookingDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

            return bookingDateTime >= now;
          });

          setResults(upcoming);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setResults([]);
      }
    };

    fetchBookings();
  }, [doctorId, hospital, sessionDate, specialization, doctorName]);

  return (
    <Container sx={{ mt: 5, pb: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 5 }}>
        Search Results
      </Typography>

      {results.length === 0 ? (
        <Paper
          sx={{
            p: 2,
            textAlign: "center",
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#808080",
          }}
        >
          No Matching Bookings Found.
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {results.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <Card
                sx={{
                  maxWidth: 300,
                  boxShadow: 8,
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={
                    booking.photo
                      ? `http://localhost:3000/uploads/${booking.photo}`
                      : "/img/doc.png"
                  }
                  alt={booking.doctor_name || "Doctor"}
                />
                <CardContent sx={{ backgroundColor: "#CFEFF1" }}>
                  <Typography gutterBottom variant="h6" sx={{ fontWeight: "bold" }}>
                    Dr. {booking.doctor_name || "Not Available"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Specialization: {booking.specialization || "Unknown"}
                  </Typography>
                  <Typography variant="body2">Hospital: {booking.hospital}</Typography>
                  <Typography variant="body2">
                    Date: {new Date(booking.session_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Time: {booking.session_time?.slice(0, 5)}
                  </Typography>
                  {/* <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
                    Appointments Booked: {booking.assigned_count || 0} / {booking.max_appointments || 0}
                  </Typography> */}

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: "#2B909B" }}
                    onClick={() =>
                      navigate(`/channel/${booking.doctor_id}`, {
                        state: {
                          doctorName: booking.doctor_name,
                          hospital: booking.hospital,
                          sessionDate: booking.session_date,
                          sessionTime: booking.session_time,
                          maxAppointments: booking.max_appointments,
                          bookingformId: booking.id,
                        },
                      })
                    }
                  >
                    Channel
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
