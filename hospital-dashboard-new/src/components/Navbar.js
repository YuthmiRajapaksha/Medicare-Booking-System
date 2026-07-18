import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { drawerWidth } from "./Sidebar";

const Navbar = ({ onMenuClick = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const role = localStorage.getItem("role");
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  const displayName = role === "user" && doctor?.name ? doctor.name : "Admin";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "background.paper",
        color: "text.primary",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1.5, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          onClick={handleMenuOpen}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            borderRadius: 1,
            px: 1,
            py: 0.5,
            "&:hover": { backgroundColor: "rgba(43, 144, 155, 0.08)" },
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontSize: 16 }}>
            {avatarLetter}
          </Avatar>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}
          >
            {displayName}
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: { mt: 1, minWidth: 180, borderRadius: 2 },
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{ fontWeight: 600, color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
