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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
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
    navigate('/'); 
  };

  
  const role = localStorage.getItem("role");
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  
  const avatarLetter =
    role === "user" && doctor?.name
      ? doctor.name.charAt(0).toUpperCase()
      : "A";

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fdfdfd",
        color: "#333",
        boxShadow: 2,
        borderBottom: "1px solid #ddd",
        
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}
        >
          MediCare Hospital
        </Typography>

        {/* <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton> */}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#2b909b", mr: 1 }}>
            {avatarLetter}
          </Avatar>

          {/* <IconButton color="inherit" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton> */}

          {/* <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout} sx ={{fontWeight: "bold"}}>Logout</MenuItem>
          </Menu> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;


