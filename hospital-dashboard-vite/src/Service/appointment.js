export const getTodayAppointments = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/appointments/count-today");
    const data = await response.json();
    return { count: data.count };
  } catch (err) {
    console.error("Error getting today's appointments:", err);
    return { count: 0 };
  }
};