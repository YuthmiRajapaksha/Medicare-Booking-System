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
  Avatar,
  Chip,
} from "@mui/material";

import Charts from "./Charts";
import PageHeader from "./PageHeader";

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

  const role = localStorage.getItem("role");
  const doctor = JSON.parse(localStorage.getItem("doctor") || "null");
  const displayName = role === "user" && doctor?.name ? `Dr. ${doctor.name}` : "Admin";

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

        setStats([
          {
            label: "Total Appointments",
            value: formatCount(appointmentsTodayData.count),
            date: today,
            icon: <CalendarMonthIcon />,
            color: "#3B82F6",
            bg: "#E0ECFF",
          },
          {
            label: "Total Payments",
            value: `Rs. ${formatCount(appointmentsTodayData.count * 2500)}`,
            date: today,
            icon: <MonetizationOnIcon />,
            color: "#22C55E",
            bg: "#DCFCE7",
          },
          {
            label: "Lab Reports",
            value: formatCount(labReportsData.count),
            date: today,
            icon: <SummarizeIcon />,
            color: "#F59E0B",
            bg: "#FEF3C7",
          },
          {
            label: "Total Doctors",
            value: formatCount(doctorCount),
            date: today,
            icon: <GroupIcon />,
            color: "#8B5CF6",
            bg: "#EDE4FF",
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
    <Box sx={{ flexGrow: 1 }}>
      <PageHeader
        title={`Welcome back, ${displayName} 👋`}
        subtitle={`Here's your overview for ${today}`}
      />

      {/* Summary Cards */}
      <Grid container spacing={2.5}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2.25,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                background: stat.bg,
                border: "none",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
                },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {stat.label}
                </Typography>

                {loading ? (
                  <CircularProgress size={22} sx={{ mt: 0.5 }} />
                ) : (
                  <Typography sx={{ fontSize: 22, fontWeight: 700, color: "text.primary" }}>
                    {stat.value}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                }}
              >
                {React.cloneElement(stat.icon, {
                  sx: { color: stat.color, fontSize: 26 },
                })}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* CHART + CALENDAR + STATUS + NOTIFICATIONS */}
      <Box mt={3}>
        <Charts />
      </Box>

      {/* DOCTOR TABLE */}
      <Paper sx={{ mt: 3, p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Doctor Appointment Summary
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={56}>No</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialization</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {doctorStats.map((doc, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:hover": { backgroundColor: "rgba(43, 144, 155, 0.04)" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "text.secondary" }}>{i + 1}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            fontSize: 13,
                            bgcolor: "rgba(43, 144, 155, 0.14)",
                            color: "primary.main",
                            fontWeight: 700,
                          }}
                        >
                          {doc.name.replace("Dr. ", "").charAt(0)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                          {doc.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doc.specialization}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(139, 92, 246, 0.10)",
                          color: "#8B5CF6",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
