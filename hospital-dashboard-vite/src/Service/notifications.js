// src/Service/notifications.js
import axios from "axios";

export const getNotifications = async () => {
  const res = await axios.get("http://localhost:3000/api/notifications");
  return res.data;
};