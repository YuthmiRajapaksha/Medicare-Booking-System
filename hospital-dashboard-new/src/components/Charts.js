import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import QuickActions from "./QuickActions";
import StatusChart from "./StatusChart";
import Notifications from "./Notifications";

export default function Charts() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:3000/api/appointments/count-week")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <Grid container spacing={2}>
      {/* LEFT COLUMN */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: 320 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Appointments This Week
          </Typography>

          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2B909B"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Grid container spacing={2} mt={0.1}>
          <Grid item xs={12} md={6}>
            <StatusChart />
          </Grid>

          <Grid item xs={12} md={6}>
            <Notifications />
          </Grid>
        </Grid>
      </Grid>

      {/* RIGHT COLUMN */}
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 2,
            height: 320,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}
          >
            Calendar
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              minHeight: 0,
              "& .react-calendar": {
                width: "100%",
                maxWidth: 300,
                border: "none",
                fontFamily: "inherit",
                lineHeight: 1.4,
              },
              "& .react-calendar__navigation": {
                mb: 1,
              },
              "& .react-calendar__navigation button": {
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: 14,
                color: "text.primary",
                minWidth: 32,
              },
              "& .react-calendar__navigation button:hover": {
                backgroundColor: "rgba(43, 144, 155, 0.08)",
              },
              "& .react-calendar__navigation button:disabled": {
                backgroundColor: "transparent",
                opacity: 0.35,
              },
              "& .react-calendar__month-view__weekdays": {
                textAlign: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
              },
              "& .react-calendar__month-view__weekdays abbr": {
                textDecoration: "none",
              },
              "& .react-calendar__tile": {
                borderRadius: "8px",
                padding: "8px 4px",
                fontSize: 13,
                color: "text.primary",
              },
              "& .react-calendar__tile:enabled:hover": {
                backgroundColor: "rgba(43, 144, 155, 0.10)",
              },
              "& .react-calendar__tile--now": {
                backgroundColor: "rgba(43, 144, 155, 0.12)",
                fontWeight: 700,
              },
              "& .react-calendar__tile--active": {
                backgroundColor: "primary.main",
                color: "#fff",
                fontWeight: 700,
              },
              "& .react-calendar__tile--active:enabled:hover": {
                backgroundColor: "primary.dark",
              },
              "& .react-calendar__month-view__days__day--neighboringMonth": {
                color: "text.disabled",
              },
            }}
          >
            <Calendar onChange={setDate} value={date} />
          </Box>
        </Paper>

        <Box mt={2}>
          <QuickActions />
        </Box>
      </Grid>
    </Grid>
  );
}
