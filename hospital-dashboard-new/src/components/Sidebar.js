import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export const drawerWidth = 240;

const menuItems = [
  { text: "Home", icon: <DashboardIcon />, path: "/home", roles: ["admin", "user"] },
  { text: "Appointments", icon: <EventNoteIcon />, path: "/appointments", roles: ["admin", "user"] },
  { text: "Lab Reports", icon: <DescriptionIcon />, path: "/lab-reports", roles: ["admin"] },
  { text: "Doctors", icon: <LocalHospitalIcon />, path: "/doctors", roles: ["admin", "user"] },
  { text: "Payments", icon: <PaymentIcon />, path: "/payments", roles: ["admin", "user"] },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings", roles: ["user"] },
];

const Sidebar = ({ mobileOpen = false, onMobileClose = () => {} }) => {
  const location = useLocation();
  const rawRole = localStorage.getItem("role");
  const userRole = rawRole ? rawRole.toLowerCase() : null;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* TOP SECTION */}
      <Box>
        <Toolbar
          sx={{
            flexDirection: "column",
            textAlign: "center",
            mt: 4,
            mb: 1,
          }}
        >
          <img
            src="/image/mc.png"
            alt="MediCare Logo"
            style={{
              width: 150,
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        </Toolbar>

        {!userRole ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="error">
              No role found. Please login.
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 1.5 }}>
            {visibleItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={index}
                  component={Link}
                  to={item.path}
                  onClick={onMobileClose}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    py: 1.1,
                    color: isActive ? "primary.contrastText" : "text.secondary",
                    backgroundColor: isActive ? "primary.main" : "transparent",
                    boxShadow: isActive ? "0 8px 16px rgba(43, 144, 155, 0.35)" : "none",
                    "&:hover": {
                      backgroundColor: isActive ? "primary.dark" : "rgba(43, 144, 155, 0.06)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? "primary.contrastText" : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 500,
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>

      {/* LOGOUT SECTION (BOTTOM) */}
      <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon sx={{ color: "error.main" }} />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              sx: {
                fontWeight: 600,
                color: "error.main",
                fontSize: 15,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* DESKTOP DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* MOBILE DRAWER */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
