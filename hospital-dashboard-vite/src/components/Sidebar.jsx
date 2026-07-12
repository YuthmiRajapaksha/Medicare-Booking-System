import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const menuItems = [
  { text: "Home", icon: <DashboardIcon />, path: "/home", roles: ["admin", "user"] },
  { text: "Appointments", icon: <EventNoteIcon />, path: "/appointments", roles: ["admin", "user"] },
  { text: "Lab Reports", icon: <DescriptionIcon />, path: "/lab-reports", roles: ["admin"] },
  { text: "Doctors", icon: <LocalHospitalIcon />, path: "/doctors", roles: ["admin", "user"] },
  { text: "Payments", icon: <PaymentIcon />, path: "/payments", roles: ["admin", "user"] },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings", roles: ["user"] },
];

const Sidebar = () => {
  const location = useLocation();
  const rawRole = localStorage.getItem("role");
  const userRole = rawRole ? rawRole.toLowerCase() : null;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
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
            mt: 5,
            mb: 5,
          }}
        >
          <img
            src="/image/New_Logo1.png"
            alt="Logo"
            style={{
              width: 90,
              height: 90,
              objectFit: "cover",
              marginBottom: 1,
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontFamily: "Cursive", color: "#000000" }}
          >
            Hospitals
          </Typography>
        </Toolbar>

        {!userRole ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" color="error">
              No role found. Please login.
            </Typography>
          </Box>
        ) : (
          <List>
            {visibleItems.map((item, index) => (
              <ListItemButton
                key={index}
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  backgroundColor:
                    location.pathname === item.path
                      ? "#bae1e6"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "#bae1e6",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: { fontFamily: "Poppins", fontSize: 18 },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>

      {/* 🔻 LOGOUT SECTION (BOTTOM) */}
      <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#ffe5e5",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#d32f2f" }} />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              sx: {
                fontWeight: "bold",
                color: "#d32f2f",
                fontFamily: "Poppins",
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* MOBILE APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#2B909B",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* DESKTOP DRAWER */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            boxShadow: 5,
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
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;