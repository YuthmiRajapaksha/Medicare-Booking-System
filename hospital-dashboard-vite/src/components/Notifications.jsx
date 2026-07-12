import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Divider,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import axios from "axios";

export default function Notifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notifications");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Paper
      sx={{
        p: 3,
        height: 190,
        borderRadius: "20px",
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        overflowY: "auto",
      }}
    >
      {/* HEADER */}
      <Box display="flex" alignItems="center" mb={2}>
        <NotificationsActiveIcon sx={{ color: "#2B909B", mr: 1 }} />
        <Typography
          sx={{
            // fontWeight: 700,
            fontWeight: "bold",
            // fontSize: "18px",
            fontFamily: "Poppins",
          }}
        >
          Recent Notifications
        </Typography>
      </Box>

      {data.length === 0 ? (
        <Typography sx={{ mt: 2, color: "#64748b" }}>
          No notifications yet
        </Typography>
      ) : (
        <List>
          {data.map((item, i) => (
            <React.Fragment key={i}>
              <ListItem
                sx={{
                  borderRadius: "12px",
                  mb: 1,
                  transition: "0.3s",
                  "&:hover": {
                    background: "#f1f5f9",
                    transform: "translateX(5px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: "#2B909B",
                    fontWeight: "bold",
                  }}
                >
                  {item.user_name?.charAt(0).toUpperCase()}
                </Avatar>

                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.message}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b" }}
                    >
                      {item.user_name} •{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>

              {i !== data.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
}