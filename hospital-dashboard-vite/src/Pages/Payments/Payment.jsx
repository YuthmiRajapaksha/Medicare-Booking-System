import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Box,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";


const drawerWidth = 240;

const Payment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const role = localStorage.getItem("role");
  // useMemo keeps a stable reference across renders — JSON.parse alone
  // returns a new object every render, which previously made the
  // useEffect below re-fire on every render (infinite fetch loop).
  const doctor = useMemo(() => JSON.parse(localStorage.getItem("doctor")), []);

  const [dailyStats, setDailyStats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  

  const summaryCard = {
  flex: 1,
  minWidth: 120,
  p: 2,
  borderRadius: 3,
  background: "#ffffff",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = [];

        if (role === "admin") {
          const res = await fetch("http://localhost:3000/api/appointments/api/doctors-with-patient-count");
          const data = await res.json();
          if (!res.ok) throw new Error("Failed to fetch all doctors");
          console.log ("error");
          result = data.doctors;
        } else if (role === "user" && doctor?.id) {
          const res = await fetch(`http://localhost:3000/api/doctors/${doctor.id}/patient-count`);
          const data = await res.json();
          if (!res.ok) throw new Error("Failed to fetch doctor's patients");

          result = [
            {
              id: doctor.id,
              name: doctor.name,
              patientCount: data.patientCount,
              totalRevenue: data.patientCount * 2500,
            },
          ];
        }

        setDoctors(result);
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load doctor data.");
      }
    };

    fetchData();
  }, [role, doctor]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const paginatedDoctors = doctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );



const handleShowDailyStats = async (doctorId) => {
  try {
    // const res = await fetch(`http://localhost:3000/api/doctors/${doctorId}/daily-stats`);
     const res = await fetch(
      `http://localhost:3000/api/appointments/api/doctors/${doctorId}/daily-stats`
    );
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch daily stats");

    setDailyStats(data.dailyStats); 
    setOpenDialog(true);
  } catch (error) {
    console.error(error);
    alert("Error fetching daily stats.");
  }
};


  const handleCloseDialog = () => {
    setOpenDialog(false);
   setDailyStats([]);
  };

  return (
    <Box p={3} mt={8}>
      <Grid container spacing={3}>
        {paginatedDoctors.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>


            {/* <Card
              elevation={3}
              sx={{
                textAlign: "center",
                height: 220,
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                },
              }}
            > */}

            <Card
  elevation={0}
  sx={{
    borderRadius: 4,
    p: 2,
    height: 230,
    background: "#ffffff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
    },
  }}
>
              {/* <CardContent>
                <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  Dr. {doc.name}
                </Typography> */}
                {/* <Typography
                  variant="h6"
                  sx={{ mt: 2, fontFamily: "Poppins", fontWeight: 500 }}
                >
                  Patients: {doc.patientCount}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mt: 1, fontFamily: "Poppins", color: "#555" }}
                >
                  Amount: LKR {doc.totalRevenue}
                </Typography> */}
                
                        {/* <Typography
                          variant="h6"
                          sx={{ mt: 2, fontFamily: "Poppins", fontWeight: 500 }}
                        >
                          Patients: {doc.totalAppointments}
                        </Typography>

                        <Typography
                          variant="h6"
                          sx={{ mt: 1, fontFamily: "Poppins", color: "#555" }}
                        >
                          Amount: LKR {doc.totalAppointments * 2500}
                        </Typography>

                

                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#2B909B"}}
                  onClick={() => handleShowDailyStats(doc.id)}
                >
                  VIEW DETAILS
                </Button>
              </CardContent> */}

                           <CardContent>

    {/* 🔹 Top Section (Avatar + Name) */}
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        sx={{
          width: 55,
          height: 55,
          borderRadius: "50%",
          backgroundColor: "#E6F4F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 22,
          color: "#2B909B",
        }}
      >
        {doc.name.charAt(0)}
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontFamily: "Poppins" }}
        >
          Dr. {doc.name}
        </Typography>

        {/* <Typography variant="body2" sx={{ color: "#64748b" }}>
          Doctor
        </Typography> */}

         <Typography
  variant="body2"
  sx={{ color: "gray" }}
>
  {doc.specialization || "General Physician"}
</Typography>

      </Box>
    </Box>

    {/* 🔹 Stats Section */}
    <Box
      mt={3}
      display="flex"
      justifyContent="space-between"
      sx={{
        background: "#f8fafc",
        p: 2,
        borderRadius: 3,
      }}
    >
      <Box textAlign="center">
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Patients
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {doc.totalAppointments}
        </Typography>
      </Box>

      <Box textAlign="center">
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Revenue
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="#2B909B">
          LKR {doc.totalAppointments * 2500}
        </Typography>
      </Box>
    </Box>

    {/* 🔹 Button */}
    <Button
      variant="contained"
      fullWidth
      sx={{
        mt: 2,
        borderRadius: 3,
        fontWeight: "bold",
        backgroundColor: "#2B909B",
        textTransform: "none",
        "&:hover": { backgroundColor: "#237e88" },
      }}
      onClick={() => handleShowDailyStats(doc.id)}
    >
      View Details →
    </Button>

  </CardContent>

            </Card>
          </Grid>
        ))}
      </Grid>

      {role === "admin" && (
        <Box display="flex" justifyContent="center" mt={4}>
          <TablePagination
            component="div"
            count={doctors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            labelRowsPerPage=""
          />
        </Box>
      )}



  <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
    maxWidth="md"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 5,
        overflow: "hidden",
        background: "linear-gradient(145deg, #f8fafc, #eef2f7)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      },
    }}
  >

  {/* HEADER */}
  <DialogTitle
    sx={{
      background: "linear-gradient(135deg, #2B909B, #1f6f78)",
      color: "white",
      fontWeight: 700,
      fontFamily: "Poppins",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: 3,
      py: 2,
    }}
  >
    <Box>
      <Typography variant="h6" fontWeight="bold">
        Last 30 Days Patient Stats
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        Overview of daily performance
      </Typography>
    </Box>

    <Button
      onClick={handleCloseDialog}
      sx={{
        color: "white",
        fontSize: 18,
        minWidth: "auto",
        borderRadius: "50%",
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.15)",
        },
      }}
    >
      ✕
    </Button>
  </DialogTitle>

  {/* CONTENT */}
  <DialogContent sx={{ p: 3 }}>
    {dailyStats.length > 0 ? (
      <>
        {/* QUICK SUMMARY */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            mt: 2,
            
          }}
        >
          <Box sx={{...summaryCard,background: "linear-gradient(135deg, #82c5cc, #47cedd)",color: "black",}}>
            <Typography variant="subtitle2" sx={{ fontSize: 16 }}>Total Patients</Typography>
            <Typography variant="h6" fontWeight="bold">
              {dailyStats.reduce((a, b) => a + b.patientCount, 0)}
            </Typography>
          </Box>

          {/* <Box sx={summaryCard}> */}
             <Box sx={{...summaryCard,background: "linear-gradient(135deg, #82c5cc, #47cedd)",color: "black",}}>
            <Typography variant="subtitle2" sx={{ fontSize: 16 }}>Total Patients</Typography>
            <Typography variant="h6" fontWeight="bold">
              LKR{" "}
              {dailyStats.reduce((a, b) => a + b.totalRevenue, 0)}
            </Typography>
          </Box>

          {/* <Box sx={summaryCard}> */}
              <Box sx={{...summaryCard,background: "linear-gradient(135deg, #82c5cc, #47cedd)",color: "black",}}>
            <Typography variant="subtitle2" sx={{ fontSize: 16 }}>Total Patients</Typography>
            <Typography variant="h6" fontWeight="bold">
              {dailyStats.length}
            </Typography>
          </Box>
        </Box>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  // background: "linear-gradient(90deg, #7fc6ce, #1eb6c7)",
                  background: "#bae1e6",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>
                  Date
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Patients
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Amount (LKR)
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dailyStats.map((day, index) => (
                <TableRow
                  key={day.date}
                  sx={{
                    transition: "0.2s",
                    // backgroundColor:
                    //   index % 2 === 0 ? "#fff" : "#f8fafc",
                    "&:hover": {
                      backgroundColor: "#e6f7ff",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <TableCell>
                    {new Date(day.date).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="right">
                    {day.patientCount}
                  </TableCell>

                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    LKR {day.totalRevenue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    ) : (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          color: "gray",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          No Data Found
        </Typography>
        <Typography variant="body2">
          No patient activity in the last 30 days
        </Typography>
      </Box>
    )}
  </DialogContent>

  {/* FOOTER */}
  <DialogActions sx={{ p: 2, background: "#f8fafc" }}>
    <Button
      onClick={handleCloseDialog}
      variant="contained"
      sx={{
        background: "linear-gradient(135deg, #ef4444, #dc2626)",
        borderRadius: 3,
        px: 3,
        fontWeight: "bold",
        textTransform: "none",
        boxShadow: "0 8px 20px rgba(239,68,68,0.3)",
        "&:hover": {
          transform: "translateY(-1px)",
        },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      

      {/* <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      overflow: "hidden",
      background: "#f8fafc",
    },
  }}
> */}
  {/* HEADER */}
  {/* <DialogTitle
    sx={{
      background: "#2B909B",
      color: "white",
      fontWeight: "bold",
      fontFamily: "Poppins",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: 3,
      py: 2,
    }}
  >
    Last 30 Days Patient Stats

    <Button
      onClick={handleCloseDialog}
      sx={{
        color: "white",
        fontWeight: "bold",
        minWidth: "auto",
        fontSize: 18,
      }}
    >
      ✕
    </Button>
  </DialogTitle> */}

  {/* CONTENT */}
  {/* <DialogContent sx={{ p: 3 }}>
    {dailyStats.length > 0 ? (
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0f7fa" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Patients
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Amount (LKR)
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dailyStats.map((day, index) => (
              <TableRow
                key={day.date}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f1f5f9",
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                  },
                }}
              >
                <TableCell>
                  {new Date(day.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">{day.patientCount}</TableCell>
                <TableCell align="right">
                  LKR {day.totalRevenue}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          color: "gray",
        }}
      >
        <Typography>No data available</Typography>
      </Box>
    )}
  </DialogContent> */}

  {/* FOOTER */}
  {/* <DialogActions sx={{ p: 2, background: "#f1f5f9" }}>
    <Button
      onClick={handleCloseDialog}
      variant="contained"
      sx={{
        backgroundColor: "#ef4444",
        borderRadius: 2,
        px: 3,
        fontWeight: "bold",
        "&:hover": { backgroundColor: "#dc2626" },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog> */}



    {/* <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
  <DialogTitle>Last 30 Days Patient Stats</DialogTitle>
  <DialogContent>
    {dailyStats.length > 0 ? (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="daily stats table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Patients</TableCell>
              <TableCell align="right">Amount (LKR)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailyStats.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">{day.patientCount}</TableCell>
                <TableCell align="right">{day.totalRevenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography>No data available.</Typography>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog} variant="contained" 
               
                  sx={{ mt: 2}} color="error">Close</Button>
  </DialogActions>
</Dialog> */}


    </Box>
  );
};

export default Payment;

