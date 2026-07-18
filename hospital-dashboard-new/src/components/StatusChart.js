import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { getStatusCounts } from "../Service/appointmentStats";

const COLORS_MAP = {
  Confirmed: "#3DB9DF",
  Pending: "#F59E0B",
  Cancelled: "#EF4444",
};

function StatusChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStatusCounts();
        const formatted = res.map((item) => ({
          name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          value: Number(item.count),
        }));
        setData(formatted);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
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
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Appointment Status</Typography>

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={80} innerRadius={50}>
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS_MAP[entry.name] || "#3DB9DF"} />
              ))}
            </Pie>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "15px", fontWeight: 700, fontFamily: "Poppins" }}
            >
              Status
            </text>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default StatusChart;
