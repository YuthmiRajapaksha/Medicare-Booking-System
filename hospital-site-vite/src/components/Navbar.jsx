import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../context/AuthContext";
import ChangePassword from "../Pages/ChangePassword";

const Navbar = () => {
  // const { user, logout } = useContext(AuthContext);
  const { auth, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const user = auth?.user || auth?.doctor;

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const navButtonStyle = {
    mx: 1,
    textTransform: "capitalize",
    fontWeight: 600,
    fontSize: "16px",
    fontFamily: "Poppins",
    color: "#0f2f3a",
    "&:hover": {
      backgroundColor: "rgba(43,144,155,0.08)",
      color: "#2B909B",
      boxShadow: "none",
    },
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Lab Reports", path: "/lab-reports" },
    ...(user ? [{ text: "My Bookings", path: "/bookings" }] : []),
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        px: { xs: 2, md: 4 },
        py: { xs: 1, md: 1.25 },
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 76,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/img/mc.png"
              alt="MediCare"
              sx={{
                width: { xs: 140, sm: 160, md: 180 },
                maxHeight: 45,
                objectFit: "contain",
              }}
            />
          </Link>
        </Box>

        {isMobile ? (
          <>
            <IconButton onClick={toggleDrawer(true)} sx={{ color: "#2B909B" }}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 260, p: 2 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {navLinks.map((link) => (
                    <ListItem key={link.text} disablePadding>
                      <ListItemButton component={Link} to={link.path}>
                        <ListItemText primary={link.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {user ? (
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/signin">
                        <ListItemText primary="Sign In" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  component={Link}
                  to={link.path}
                  color="inherit"
                  sx={navButtonStyle}
                >
                  {link.text}
                </Button>
              ))}
            </Box>

            {user ? (
              <>
                <IconButton onClick={handleMenuOpen} sx={{ mx: 2 }}>
                  <Avatar sx={{ bgcolor: "#2B909B" }}>
                    {/* {user.firstName ? user.firstName[0] : 'U'} */}
                    {user?.firstName?.[0] || user?.name?.[0] || "U"}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { minWidth: 320, borderRadius: 3, p: 0 } }}
                >
                  <Box px={3} py={2} minWidth={220} textAlign="center">
                    <Typography fontWeight="bold">
                      {user?.firstName || user?.name || "User"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>

                    <Typography variant="caption" color="primary">
                      {auth?.role?.toUpperCase() || "USER"}
                    </Typography>
                  </Box>

                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleMenuClose();
                    }}
                  >
                    Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      navigate("/change-password");
                      handleMenuClose();
                    }}
                  >
                    Change Password
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/signin"
                color="inherit"
                sx={{
                  ...navButtonStyle,
                  color: "#fff",
                  fontWeight: 500,
                  border: "2px solid #3b9aa4",
                  color: "#3b9aa4",
                  '&:hover': {
                    backgroundColor: "#3b9aa4",
                    color: "#fff",
                  },
                  px: 3,
                  py: 0.8,
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
