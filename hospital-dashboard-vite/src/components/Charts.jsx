import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
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
      .then(res => res.json())
      .then(setData);
  }, []);

return (
  <Grid container spacing={2}>

    {/* ===== TOP LEFT (BIG CHART) ===== */}
    <Grid item xs={12} md={8}>
      <Paper sx={{ p: 2, height: 320 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontFamily: "Poppins",
            // textAlign: "center"
            // color: "#2B909B",
          }}
        >
          Appointments This Week
        </Typography>

        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#2B909B" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* ===== BELOW CHART (LEFT SIDE) ===== */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <StatusChart />
        </Grid>

        <Grid item xs={12} md={6}>
          <Notifications />
        </Grid>
      </Grid>
    </Grid>

    {/* ===== RIGHT SIDE ===== */}
    <Grid item xs={12} md={4}>
      {/* CALENDAR */}
      <Paper sx={{ p: 2, height: 320 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "Poppins",
            // textAlign: "left"
            // color: "#2B909B",
            
          }}
        >
          C A L E N D A R
        </Typography>

        <Calendar onChange={setDate} value={date} />
      </Paper>

      {/* QUICK ACTIONS UNDER CALENDAR */}
      <Box mt={2}>
        <QuickActions />
      </Box>
    </Grid>

  </Grid>
);


  // return (
  //   <Grid container spacing={2}>

  //     <Grid item xs={12} md={8}>
  //       <Paper sx={{ p: 2, height: 320 }}>
  //         <Typography variant="h5"
  //     sx={{
  //       fontWeight: "bold",
  //       fontFamily: "Poppins",
  //       // background: "#bae1e6",
  //       color: "#2B909B"
  //     }}> Appointments This Week</Typography>

  //         <ResponsiveContainer width="100%" height="90%">
  //           <LineChart data={data}>
  //             <CartesianGrid strokeDasharray="3 3" />
  //             <XAxis dataKey="date" />
  //             <YAxis />
  //             <Tooltip />
  //             <Line dataKey="count" stroke="#84cbce" />
  //           </LineChart>
  //         </ResponsiveContainer>
  //       </Paper>
  //     </Grid>

  //     <Grid item xs={12} md={4}>
  //       <Paper sx={{ p: 2, height: 320 }}>
  //         <Typography variant="h6"
  //              sx={{ fontWeight: "bold", textAlign: "center",fontFamily: "Poppins",color: "#2B909B"}}>
  //           C A L E N D A R
  //         </Typography>
  //         <Calendar onChange={setDate} value={date} />
  //       </Paper>

  //       <QuickActions />

  //       {/* <StatusChart />
  //       <Notifications /> */}

        
  //     </Grid>

  //   </Grid>
  // );
}