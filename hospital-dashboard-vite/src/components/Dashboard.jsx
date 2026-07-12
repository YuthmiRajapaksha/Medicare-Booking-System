import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Charts from "./Charts";
import StatusChart from "./StatusChart";
import Notifications from "./Notifications";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SummarizeIcon from "@mui/icons-material/Summarize";
import GroupIcon from "@mui/icons-material/Group";

import { getLabReportsToday } from "../Service/labReport";
import { getTodayAppointments } from "../Service/appointment";
import { getDoctors } from "../Service/getDoctors";

const today = new Date().toLocaleDateString();


const formatCount = (count) => {
  if (typeof count !== "number") return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(2)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsTodayData = await getTodayAppointments();
        const labReportsData = await getLabReportsToday();
        const doctorsData = await getDoctors();

        const doctorCount = doctorsData.doctors?.length || 0;

        const doctorsWithCount =
          doctorsData.doctors?.map((d, i) => ({
            id: i + 1,
            name: `Dr. ${d.name}`,
            specialization: d.specialization || "-",
            hospital: d.hospital || "-",
            totalAppointments: d.totalAppointments || 0,
            revenue: (d.totalAppointments || 0) * 2500,
          })) || [];

        setDoctorStats(doctorsWithCount);

      
//         setStats([
//   {
//     label: "TOTAL APPOINTMENTS",
//     value: formatCount(appointmentsTodayData.count),
//     date: today,
//      icon: <CalendarMonthIcon />,
//     // icon: (
//     //   <img
//     //     src="/image/appoint.png"
//     //     alt="appointments"
//     //     style={{ width: 80, height: 80 }}
//     //   />
//     // ),
//   },
//   {
//     label: "TOTAL PAYMENTS",
//     value: `Rs. ${formatCount(appointmentsTodayData.count * 2500)}`,
//     date: today,
//     icon: <MonetizationOnIcon />,
//     // icon: (
//     //   <img
//     //     src="/image/payment-icon.png"
//     //     alt="payments"
//     //     style={{ width: 80, height: 80 }}
//     //   />
//     // ),
//   },
//   {
//     label: "LAB REPORTS",
//     value: formatCount(labReportsData.count),
//     date: today,
//     icon: <SummarizeIcon />,
//     // icon: (
//     //   <img
//     //     src="/image/report-icon.png"
//     //     alt="reports"
//     //     style={{ width: 80, height: 80 }}
//     //   />
//     // ),
//   },
//   {
//     label: "TOTAL DOCTORS",
//     value: formatCount(doctorCount),
//     date: today,
//      icon: <GroupIcon />,
//     // icon: (
//     //   <img
//     //     src="/image/dctr.png"
//     //     alt="doctors"
//     //     style={{ width: 80, height: 80 }}
//     //   />
//     // ),
//   },
// ]);

    setStats([
      {
        label: "Total Appointments",
        value: formatCount(appointmentsTodayData.count),
        date: today,
        icon: <CalendarMonthIcon />,
        color: "#3B82F6", // icon color
        bg: "#cfe0fd",    // icon backgroundcolor
        cardBg: "#ecf4ff",   // card backgroundcolor
      },
      {
        label: "Total Payments",
        value: `Rs. ${formatCount(appointmentsTodayData.count * 2500)}`,
        date: today,
        icon: <MonetizationOnIcon />,
        color: "#22C55E",
        bg: "#b4f0ca",
        cardBg: "#e9fcf1",
      },
      {
        label: "Lab Reports",
        value: formatCount(labReportsData.count),
        date: today,
        icon: <SummarizeIcon />,
        color: "#F59E0B",
        bg: "#fde3a9",
        cardBg: "#fdfaeb",
      },
      {
        label: "Total Doctors",
        value: formatCount(doctorCount),
        date: today,
        icon: <GroupIcon />,
        color: "#8B5CF6",
        bg: "#e8d2ff",
        cardBg: "#f3f0ff",
      },
    ]);
    
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ 
     flexGrow: 1,
     p: 5,
     mt: 3,
     minHeight: "100vh",
     background: "#eef5f4", 
    //  background: "linear-gradient(135deg, #e0f2f1, #f8fafc)", 
     }}>
      {/* Summary Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            {/* <Paper
              sx={{
                p: 3,
                height: 150,
                borderRadius: 4,
                background: "#ffffff",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                  background: "#84cbceff",
                },
              }}
            > */}

            
<Paper
  sx={{
    p: 3,
    height: 100,
    borderRadius: 4,
    // background: "#ffffff",
    background: stat.cardBg,
    // backgroundImage: "url('/image/background-dash.jpeg')",
    // backgroundImage: "url('/image/1.jpg')",
    backgroundSize: "cover", //background image size
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right bottom",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
      // background: "#84cbceff",
    },
  }}
>
  {/* LEFT SIDE (Text Content) */}
  
  {/* <Box>
    <Typography
      sx={{
        fontSize: 15,
        fontWeight: 600,
        color: "#000000",
        letterSpacing: 1,
        // mb: 1,
      }}
    >
      {stat.label}
    </Typography>

    {loading ? (
      <CircularProgress size={28} />
    ) : (
      <Typography
        sx={{
          fontSize: 32,
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {stat.value}
      </Typography>
    )}

    <Typography
      sx={{
        fontSize: 14,
        color: "#757677",
          mt: "auto", 
      }}
    >
      {stat.date}
    </Typography>
  </Box> */}

  <Box
  sx={{
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }}
>
  <Typography
    sx={{
      fontSize: 17,
      fontWeight: 600,
      color: "#000000",
      letterSpacing: 1,
    }}
  >
    {stat.label}
  </Typography>

  {loading ? (
    <CircularProgress size={28} />
  ) : (
    <Typography
      sx={{
        fontSize: 30,
        fontWeight: "bold",
        color: "#111827",
      }}
    >
      {stat.value}
    </Typography>
  )}

  {/* DATE */}
  <Typography
    sx={{
      fontSize: 14,
      color: "#3a3a3a",
      mt: "auto",   // pushes the date to the bottom
    }}
  >
    {stat.date}
  </Typography>
</Box>

  {/* RIGHT SIDE (Image/Icon) */}
    {/* <Box>
      {stat.icon}
    </Box> */}

   <Box
  sx={{
    background: stat.bg,
    p: 1.5,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 40,  //card
    height: 40,  
  }}
>
  {React.cloneElement(stat.icon, {
    sx: { color: stat.color, fontSize: 34 }, //icon size
  })}
</Box>

</Paper>
          </Grid>
        ))}
      </Grid>

      {/* ===== CHART + CALENDAR ===== */}
      <Box mt={4}>
        <Charts />
      </Box>

      {/* ===== DOCTOR TABLE ===== */}
      <Box mt={5}>
        <Typography variant="h5" fontWeight="bold" mb={2}
        sx={{
            fontWeight: "bold",
            fontFamily: "Poppins",
            // color: "#2B909B",
          }}
        >
          Doctor Appointment Summary
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              {/* <TableHead sx={{ background: "#79c8ca" }}> */}
              <TableHead
                sx={{
                  background: "#bae1e6",
                  "& .MuiTableCell-root": {
                    fontWeight: "bold",
                  },
                }}
              >
                <TableRow >
                  <TableCell>No</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Hospital</TableCell>
                  <TableCell>Appointments</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {doctorStats.map((doc, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.specialization}</TableCell>
                    <TableCell>{doc.hospital}</TableCell>
                    <TableCell>{doc.totalAppointments}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* ===== PIE + NOTIFICATIONS ===== */}
      {/* <Box mt={5}>
        <Grid container spacing={2}> 
          <Grid item xs={12} md={6}>
            <StatusChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <Notifications />
          </Grid>
        </Grid>
      </Box> */}


    </Box>
  );
};

export default Dashboard;