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
        p: 2.5,
        height: 300,
        display: "flex",
        flexDirection: "column",
        borderRadius: 1.5,
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <NotificationsActiveIcon sx={{ color: "primary.main", mr: 1 }} />
        <Typography sx={{ fontWeight: 700 }}>Recent Notifications</Typography>
      </Box>

      {data.length === 0 ? (
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          No notifications yet
        </Typography>
      ) : (
        <List disablePadding sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
          {data.map((item, i) => (
            <React.Fragment key={i}>
              <ListItem
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(43, 144, 155, 0.06)",
                  },
                }}
              >
                <Avatar sx={{ mr: 2, bgcolor: "primary.main", fontWeight: 700 }}>
                  {item.user_name?.charAt(0).toUpperCase()}
                </Avatar>

                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600 }}>{item.message}</Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {item.user_name} • {new Date(item.created_at).toLocaleString()}
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
