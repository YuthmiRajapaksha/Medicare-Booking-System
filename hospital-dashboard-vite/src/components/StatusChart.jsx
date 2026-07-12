
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Paper, Typography } from "@mui/material";
import { getStatusCounts } from "../Service/appointmentStats";

// const COLORS_MAP = ["#3db9df", "#F59E0B", "#EF4444"];
const COLORS_MAP = {
  Confirmed: "#3db9df",
  Pending: "#F59E0B",
  Cancelled: "#f55959"
}

function StatusChart() {
  const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await getStatusCounts(); // 👈 no doctorId argument

      console.log("Raw API response:", res);

      const formatted = res.map(item => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: Number(item.count)
      }));

      setData(formatted);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  fetchData();
}, []);
  return (
    <Paper sx={{ p: 2 ,borderRadius: 4,
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",}}>
      {/* <Typography fontWeight="bold">Appointment Status</Typography> */}

       <Typography sx={{
          fontWeight: "bold",
          fontFamily: "Poppins",
        }}>Appointment Status</Typography>

      <ResponsiveContainer width="100%" height={185}>
        <PieChart>
        <Pie data={data} dataKey="value"
         outerRadius={80} innerRadius={50} >
  {data.map((entry, i) => (
    <Cell
      key={i}
      fill={COLORS_MAP[entry.name] || "#3cadb9"}
    />
  ))}
</Pie>


 <text
    x="50%"
    y="50%"
    textAnchor="middle"
    dominantBaseline="middle"
    style={{ fontSize: "17px", fontWeight: "bold", fontFamily: "Poppins", }}
  >
    Status
  </text>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default StatusChart;