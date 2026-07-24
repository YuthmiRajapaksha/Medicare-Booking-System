import React, { useState, useEffect } from "react";
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
  Paper,
  IconButton,
 
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaidIcon from "@mui/icons-material/Paid";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PageHeader from "../../components/PageHeader";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Payment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const role = localStorage.getItem("role");
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  const [dailyStats, setDailyStats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [paymentOpen, setPaymentOpen] = useState(false);
const [paymentDetails, setPaymentDetails] = useState([]);

const [selectedDoctorId, setSelectedDoctorId] = useState(null);
// const [detailsOpen, setDetailsOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState("");
// const [appointmentDetails, setAppointmentDetails] = useState([]);

const [selectedDoctorName, setSelectedDoctorName] = useState("");


const downloadPDF = () => {
  // const doc = new jsPDF();

  // doc.setFontSize(16);
  // doc.text("Appointment Payment Report", 14, 15);

  // doc.setFontSize(11);
  // doc.text(`Date : ${selectedDate}`, 14, 25);
  const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Appointment Payment Report", 14, 15);

doc.setFontSize(12);
doc.text(`Doctor : Dr. ${selectedDoctorName}`, 14, 25);
doc.text(`Date : ${selectedDate}`, 14, 32);

  autoTable(doc, {
    startY: 35,
    head: [[
      "Appointment",
      "Patient",
      "Hospital",
      "Email",
      "Phone",
      "Amount"
    ]],
    body: paymentDetails.map((row) => [
      row.appointment_number,
      row.patient_name,
      row.hospital,
      row.email,
      row.phone,
      row.amount
    ])
  });

  const total = paymentDetails.reduce(
    (sum, row) => sum + Number(row.amount),
    0
  );

  doc.text(
    `Total : LKR ${total}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.save(`Payment_Report_${selectedDate}.pdf`);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = [];

        if (role === "admin") {
          const res = await fetch("http://localhost:3000/api/appointments/api/doctors-with-patient-count");
          const data = await res.json();
          if (!res.ok) throw new Error("Failed to fetch all doctors");
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

  // const handleShowDailyStats = async (doctorId) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:3000/api/appointments/api/doctors/${doctorId}/daily-stats`
  //     );
  //     const data = await res.json();
  //     if (!res.ok) throw new Error("Failed to fetch daily stats");

  //     setDailyStats(data.dailyStats);
  //     setOpenDialog(true);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error fetching daily stats.");
  //   }
  // };

  const handleShowDailyStats = async (doctorId) => {
  try {

    setSelectedDoctorId(doctorId);

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

  const summaryStats = [
    {
      label: "Total Patients",
      value: dailyStats.reduce((a, b) => a + b.patientCount, 0),
      icon: <PeopleAltIcon />,
      color: "#3B82F6",
      bg: "#E0ECFF",
    },
    {
      label: "Total Revenue",
      value: `LKR ${dailyStats.reduce((a, b) => a + b.totalRevenue, 0)}`,
      icon: <PaidIcon />,
      color: "#22C55E",
      bg: "#DCFCE7",
    },
    {
      label: "Active Days",
      value: dailyStats.length,
      icon: <EventAvailableIcon />,
      color: "#8B5CF6",
      bg: "#EDE4FF",
    },
  ];


//   const handleShowPaymentDetails = async (date) => {
//   try {
//     const res = await fetch(
//       `http://localhost:3000/api/appointments/payments/doctor/${doctorId}/${date}`
//     );

//     const data = await res.json();

//     setPaymentDetails(data);
//     setSelectedDate(date);
//     setPaymentOpen(true);

//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleShowPaymentDetails = async (doctorId, date) => {
//   try {

//     const res = await fetch(
//       `http://localhost:3000/api/appointments/payments/doctor/${doctorId}/${date}`
//     );

//     const data = await res.json();

//     setPaymentDetails(data);
//     setSelectedDate(date);
//     setPaymentOpen(true);

//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleShowPaymentDetails = async (doctorId, date) => {
//   try {

//     console.log("Opening details");

//     const res = await fetch(
//       `http://localhost:3000/api/appointments/payment-details/${doctorId}/${date}`
//     );

//     const data = await res.json();

//     console.log(data);

//     setPaymentDetails(data);
//     setSelectedDate(date);

//     console.log("Before opening dialog");

//     setPaymentOpen(true);

//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleShowPaymentDetails = async (doctorId, date) => {
//   try {

//     setSelectedDoctorId(doctorId);

//     const res = await fetch(
//       `http://localhost:3000/api/appointments/payment-details/${doctorId}/${date}`
//     );

//     const data = await res.json();

//     setPaymentDetails(data);
//     setSelectedDate(date);
//     setPaymentOpen(true);

//   } catch (err) {
//     console.error(err);
//   }
// };

// const handleShowPaymentDetails = async (doctorId, date) => {
//   try {

//     console.log("Fetching payment details:");
//     console.log("Doctor ID:", doctorId);
//     console.log("Date:", date);

//     const res = await fetch(
//       `http://localhost:3000/api/appointments/payment-details/${doctorId}/${date}`
//     );

//     const data = await res.json();

//     console.log("API RESPONSE:", data);

//     setPaymentDetails(data);
//     setSelectedDate(date);
//     setPaymentOpen(true);

//   } catch (err) {
//     console.error("Payment error:", err);
//   }
// };

// const handleShowPaymentDetails = async (doctorId, date) => {
//   try {
//     console.log("Doctor ID:", doctorId);
//     console.log("Date:", date);

//     const formattedDate = date.split("T")[0];

//     const url = `http://localhost:3000/api/appointments/payment-details/${doctorId}/${formattedDate}`;

//     console.log("URL:", url);

//     const res = await fetch(url);

//     if (!res.ok) {
//       throw new Error("Failed to fetch payment details");
//     }

//     const data = await res.json();

//     console.log("API Response:", data);

//     setPaymentDetails(Array.isArray(data) ? data : []);
//     setSelectedDate(formattedDate);
//     setPaymentOpen(true);
//   } catch (err) {
//     console.error(err);
//     alert("Failed to load payment details.");
//   }
// };

const handleShowPaymentDetails = async (doctorId, date) => {
  try {
    console.log("doctorId =", doctorId);
    console.log("date =", date);

    const formattedDate = date.substring(0, 10);

    const url = `http://localhost:3000/api/appointments/payment-details/${doctorId}/${formattedDate}`;

    console.log("URL =", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("Returned Data =", data);

    setPaymentDetails(data);
    setSelectedDate(formattedDate);
    setPaymentOpen(true);

  } catch (err) {
    console.error(err);
  }
};


const handleShowDetails = async (date) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/appointments/payment-details/${doctorId}/${date}`
    );

    const data = await res.json();

    setAppointmentDetails(data);
    setSelectedDate(date);
    setDetailsOpen(true);

  } catch (err) {
    console.error(err);
  }
};

console.log("paymentOpen:", paymentOpen);

  return (
    <Box>
      <PageHeader
        title="Payments for Doctors"
        subtitle="Patient counts and revenue for the last 30 days"
      />

      <Grid container spacing={3}>
        {paginatedDoctors.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc.id}>
            <Card
              sx={{
                borderRadius: 1.5,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5, pb: "20px !important" }}>
                {/* Top Section (Avatar + Name) */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      flexShrink: 0,
                      borderRadius: "50%",
                      backgroundColor: "#E6F4F5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "primary.main",
                    }}
                  >
                    {doc.name.charAt(0)}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "1rem" }} noWrap>
                      Dr. {doc.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                      {doc.specialization || "General Physician"}
                    </Typography>
                  </Box>
                </Box>

                {/* Stats Section */}
                <Box
                  mt={2.5}
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    background: "rgba(43, 144, 155, 0.05)",
                    p: 1.75,
                    borderRadius: 1,
                  }}
                >
                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Patients
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                      {doc.totalAppointments}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Revenue
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "primary.main" }}>
                      LKR {doc.totalAppointments * 2500}
                    </Typography>
                  </Box>
                </Box>

                {/* Button */}
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 2.5, fontWeight: 600 }}
                  // onClick={() => handleShowDailyStats(doc.id)}
                  onClick={() => {
  setSelectedDoctorId(doc.id);
   setSelectedDoctorName(doc.name);
  handleShowDailyStats(doc.id);
}}
                >
                  View Details
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
            borderRadius: 1.5,
            overflow: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #4AA9AF 0%, #2B909B 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.05rem" }}>
              Last 30 Days Patient Stats
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Overview of daily performance
            </Typography>
          </Box>

          <IconButton
            onClick={handleCloseDialog}
            size="small"
            sx={{
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ p: 3, backgroundColor: "background.default" }}>
          {dailyStats.length > 0 ? (
            <>
              {/* QUICK SUMMARY */}
              <Box sx={{ display: "flex", gap: 2, mt: 1.5, mb: 3, flexWrap: "wrap" }}>
                {summaryStats.map((stat) => (
                  <Paper
                    key={stat.label}
                    sx={{
                      flex: 1,
                      minWidth: 150,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      background: stat.bg,
                      border: "none",
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "text.secondary" }}>
                        {stat.label}
                      </Typography>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "text.primary" }}>
                        {stat.value}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fff",
                      }}
                    >
                      {React.cloneElement(stat.icon, {
                        sx: { color: stat.color, fontSize: 20 },
                      })}
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* TABLE */}
              <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Patients</TableCell>
                      <TableCell align="right">Amount (LKR)</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {dailyStats.map((day) => (
                      // <TableRow
                      //   key={day.date}
                      //   sx={{
                      //     transition: "0.2s",
                      //     "&:hover": { backgroundColor: "rgba(43, 144, 155, 0.05)" },
                      //     "&:last-child td": { borderBottom: 0 },
                      //   }}
                      // >
  //                     <TableRow
  // key={day.date}
  // hover
  // onClick={() => handleShowPaymentDetails(day.date)}
  // sx={{
  //   cursor: "pointer",
  //   transition: "0.2s",
  //   "&:hover": {
  //     backgroundColor: "rgba(43,144,155,0.08)",
  //   },
  // }}
// >
<TableRow
key={day.date}
  hover
  sx={{ cursor: "pointer" }}
  onClick={() =>
    handleShowPaymentDetails(
      selectedDoctorId,
      day.date
    )
  }
  >
                        <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{day.patientCount}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {day.totalRevenue}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
              <Typography sx={{ fontWeight: 700 }}>No Data Found</Typography>
              <Typography variant="body2">
                No patient activity in the last 30 days
              </Typography>
            </Box>
          )}
        </DialogContent>

        {/* FOOTER */}
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            sx={{ fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={paymentOpen}
  onClose={() => setPaymentOpen(false)}
  fullWidth
  maxWidth="lg"
>
  <DialogTitle>
    Appointment Details - {selectedDate}
  </DialogTitle>

  <DialogContent>

    <TableContainer component={Paper}>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell>Appointment No</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Hospital</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            {/* <TableCell>NIC</TableCell> */}
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>


        {/* <TableBody>

        {paymentDetails.map((row)=>(
          // <TableRow key={row.id}>
          <TableRow key={row.appointment_number}>

            <TableCell>
              {row.appointment_number}
            </TableCell>

            <TableCell>
              {row.patient_name}
            </TableCell>

            <TableCell>
              {row.hospital}
            </TableCell>

            <TableCell>
              {row.email}
            </TableCell>

            <TableCell>
              {row.phone}
            </TableCell>

            <TableCell>
              {row.nic}
            </TableCell>

            <TableCell>
              LKR {row.amount}
            </TableCell>

          </TableRow>
        ))}

        </TableBody> */}

        <TableBody>
  {paymentDetails.length > 0 ? (
    paymentDetails.map((row) => (
      <TableRow key={row.appointment_number}>
        <TableCell>{row.appointment_number}</TableCell>
        <TableCell>{row.patient_name}</TableCell>
        <TableCell>{row.hospital}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.phone}</TableCell>
        {/* <TableCell>{row.nic || "-"}</TableCell> */}
        <TableCell>LKR {row.amount}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No payment details found
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </TableContainer>


    <Typography
      sx={{
        mt:2,
        fontWeight:"bold",
        textAlign:"right"
      }}
    >
      Total: LKR{" "}
      {
        paymentDetails.reduce(
          (sum,row)=>sum+Number(row.amount),
          0
        )
      }
    </Typography>


  </DialogContent>


  <DialogActions>

    <Button
  variant="contained"
  onClick={downloadPDF}
>
  Download PDF
</Button>


    <Button
      color="error"
      onClick={()=>setPaymentOpen(false)}
    >
      Close
    </Button>

  </DialogActions>

</Dialog>
    </Box>
  );
};

export default Payment;
