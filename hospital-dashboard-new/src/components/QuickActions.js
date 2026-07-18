import React from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventIcon from "@mui/icons-material/Event";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Doctor",
      icon: <PersonAddIcon />,
      color: "#3B82F6",
      bg: "#E0ECFF",
      route: "/add-doctor",
    },
    {
      label: "Create Session",
      icon: <EventIcon />,
      color: "#22C55E",
      bg: "#E6F9F0",
      route: "/appointments",
    },
    {
      label: "Payment Details",
      icon: <GroupAddIcon />,
      color: "#8B5CF6",
      bg: "#F3E8FF",
      route: "/payments",
    },
    {
      label: "Add Lab Report",
      icon: <DescriptionIcon />,
      color: "#F97316",
      bg: "#FFF4E6",
      route: "/add-lab-reports",
    },
  ];

  return (
    <Paper
      sx={{
        p: 2,
        mt: 2,
        height: 300,
        borderRadius: 1.5,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>

      <Grid container spacing={2} sx={{ flex: 1, alignContent: "center" }}>
        {actions.map((action, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Box
              onClick={() => navigate(action.route)}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.2,
                minHeight: 60,
                borderRadius: 1,
                cursor: "pointer",
                border: `1px solid ${action.bg}`,
                background: action.bg,
                transition: "0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    background: "#fff",
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {React.cloneElement(action.icon, {
                    sx: { color: action.color, fontSize: 22 },
                  })}
                </Box>

                <Typography fontWeight={600} fontSize={14}>
                  {action.label}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
