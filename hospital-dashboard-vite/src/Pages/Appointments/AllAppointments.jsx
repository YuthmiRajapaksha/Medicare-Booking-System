// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   Button,
//   Typography,
//   Grid,
//   Box,
//   TablePagination,
//   TextField,
// } from "@mui/material";

// import InputAdornment from "@mui/material/InputAdornment";
// import SearchIcon from "@mui/icons-material/Search";

// const AllAppointment = () => {
//   const [doctors, setDoctors] = useState([]);
//   const [nameSearch, setNameSearch] = useState("");
//   const [specSearch, setSpecSearch] = useState("");
//   const [page, setPage] = useState(0);
//   const rowsPerPage = 6;
//   const navigate = useNavigate();

//   const role = localStorage.getItem("role");
//   const doctor = JSON.parse(localStorage.getItem("doctor"));

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/doctors");
//         const data = await res.json();
//         if (res.ok) {
//           setDoctors(data.doctors);
//         } else {
//           alert("Error loading doctors");
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Failed to fetch doctors");
//       }
//     };

//     if (role === "admin") {
//       fetchDoctors();
//     }
//   }, [role]);

  
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

  
//   const filteredDoctors = doctors.filter((doc) => {
//     const nameMatch = doc.name.toLowerCase().includes(nameSearch.toLowerCase().trim());
//     const specMatch = doc.specialization.toLowerCase().includes(specSearch.toLowerCase().trim());
//     return nameMatch && specMatch;
//   });

  
//   const paginatedDoctors = filteredDoctors.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

 
//   // const renderDoctorCard = (doctor) => (
//   //   <Grid item xs={12} sm={6} md={4} key={doctor.id}>
//   //     <Card elevation={4}>
//   //       <CardContent>
//   //         <Typography
//   //           variant="h6"
//   //           gutterBottom
//   //           sx={{ fontWeight: "bold", color: "black" }}
//   //         >
//   //           Dr. {doctor.name}
//   //         </Typography>
//   //         <Typography color="text.secondary" gutterBottom>
//   //           {doctor.specialization}
//   //         </Typography>

//   //         <Box
//   //           sx={{
//   //             display: "flex",
//   //             flexDirection: "column",
//   //             alignItems: "center",
//   //             gap: 1,
//   //             mt: 2,
//   //           }}
//   //         >
//   //           <Button
//   //             variant="contained"
//   //             fullWidth
//   //             sx={{ mt: 2, backgroundColor: "#2B909B", width: 300 }}
//   //             onClick={() => navigate(`/book-appointment/${doctor.id}`)}
//   //           >
//   //             Schedule Appointment
//   //           </Button>
//   //           <Button
//   //             variant="outlined"
//   //             fullWidth
//   //             sx={{
//   //               mt: 1,
//   //               color: "#2B909B",
//   //               width: 300,
//   //               border: "2px solid #2B909B",
//   //               "&:hover": {
//   //                 backgroundColor: "#E0F7FA",
//   //                 borderColor: "#2B909B",
//   //               },
//   //             }}
//   //             onClick={() => navigate(`/update-appointments/${doctor.id}`)}
//   //           >
//   //             Update Appointments
//   //           </Button>
//   //           <Button
//   //             variant="outlined"
//   //             fullWidth
//   //             sx={{
//   //               mt: 1,
//   //               color: "#2B909B",
//   //               width: 300,
//   //               border: "2px solid #2B909B",
//   //               "&:hover": {
//   //                 backgroundColor: "#E0F7FA",
//   //                 borderColor: "#2B909B",
//   //               },
//   //             }}
//   //             onClick={() => navigate(`/view-appointments/${doctor.id}`)}
//   //           >
//   //             View Appointments
//   //           </Button>
//   //         </Box>
//   //       </CardContent>
//   //     </Card>
//   //   </Grid>
//   // );



//   const renderDoctorCard = (doctor) => (
//   <Grid item xs={12} sm={6} md={4} key={doctor.id}>
//     <Card
//       elevation={5}
//       sx={{
//         borderRadius: 4,
//         p: 2,
//         textAlign: "center",
//         transition: "0.3s",
//         "&:hover": {
//           transform: "translateY(-6px)",
//           boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
//         },
//       }}
//     >
//       <CardContent>

//         {/* Doctor Avatar */}
//         {/* <Box
//           sx={{
//             width: 70,
//             height: 70,
//             borderRadius: "50%",
//             backgroundColor: "#E6F4F5",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto",
//             mb: 1,
//             fontSize: 28,
//             fontWeight: "bold",
//             color: "#2B909B",
//           }}
//         >
//           {doctor.name.charAt(0)}
//         </Box> */}

//         {/* Doctor Name */}
//         <Typography
//           variant="h6"
//           sx={{ fontWeight: "bold", fontFamily: "Poppins", mt: 1 }}
//         >
//           Dr. {doctor.name}
//         </Typography>

//         {/* Specialization */}
//         <Typography color="text.secondary" mb={2}>
//           {doctor.specialization}
//         </Typography>

//         {/* Buttons */}
//         <Box display="flex" flexDirection="column" gap={1.5} mt={2}>

//           <Button
//             variant="contained"
//             fullWidth
//             sx={{
//               backgroundColor: "#2B909B",
//               borderRadius: 3,
//               fontWeight: "bold",
//               "&:hover": { backgroundColor: "#257E85" },
//             }}
//             onClick={() => navigate(`/book-appointment/${doctor.id}`)}
//           >
//             Schedule Appointment
//           </Button>

//           <Button
//             variant="outlined"
//             fullWidth
//             sx={{
//               borderRadius: 3,
//               fontWeight: "bold",
//               color: "#2B909B",
//               border: "2px solid #2B909B",
//               "&:hover": {
//                 backgroundColor: "#E0F7FA",
//                 borderColor: "#2B909B",
//               },
//             }}
//             onClick={() => navigate(`/update-appointments/${doctor.id}`)}
//           >
//             Update Appointments
//           </Button>

//           <Button
//             variant="outlined"
//             fullWidth
//             sx={{
//               borderRadius: 3,
//               fontWeight: "bold",
//               color: "#2B909B",
//               border: "2px solid #2B909B",
//               "&:hover": {
//                 backgroundColor: "#E0F7FA",
//                 borderColor: "#2B909B",
//               },
//             }}
//             onClick={() => navigate(`/view-appointments/${doctor.id}`)}
//           >
//             View Appointments
//           </Button>

//         </Box>
//       </CardContent>
//     </Card>
//   </Grid>
// );

//   return (
//     // <Box p={3} mt={5}>
//     <Box p={3} mt={5}
//     sx={{
//       minHeight: "100vh",
//       width: "100%",
//       // background: "linear-gradient(135deg, #e0f2f1, #f8fafc)",
//     }}
//   >
//       <Typography
//         variant="h4"
//         mb={4}
//         fontWeight="bold"
//         sx={{ color: "black", fontFamily: "Poppins" }}
//       >
//         {role === "admin" ? "Appointments for Doctors" : "Your Appointment Panel"}
//       </Typography>

//       {/* {role === "admin" && (
//         <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
//           <TextField
//             label="Search by Doctor Name"
//             variant="outlined"
//             value={nameSearch}
//             onChange={(e) => {
//               setNameSearch(e.target.value);
//               setPage(0); 
//             }}
//           />
//           <TextField
//             label="Search by Specialization"
//             variant="outlined"
//             value={specSearch}
//             onChange={(e) => {
//               setSpecSearch(e.target.value);
//               setPage(0);
//             }}
//           />
//         </Box>
//       )} */}

//       {role === "admin" && (
//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               mb: 4,
//               flexWrap: "wrap",
//               background: "#ffffff",
//               p: 2,
//               borderRadius: 3,
//               boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
//             }}
//           >
//     {/* Search by Name */}
//     <TextField
//       placeholder="Search doctor name..."
//       variant="outlined"
//       value={nameSearch}
//       onChange={(e) => {
//         setNameSearch(e.target.value);
//         setPage(0);
//       }}
//       sx={{
//         flex: 1,
//         minWidth: 250,
//         "& .MuiOutlinedInput-root": {
//           borderRadius: "30px",
//           backgroundColor: "#f8fafc",
//         },
//       }}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <SearchIcon sx={{ color: "#94a3b8" }} />
//           </InputAdornment>
//         ),
//       }}
//     />

//     {/* Search by Specialization */}
//     <TextField
//       placeholder="Search specialization..."
//       variant="outlined"
//       value={specSearch}
//       onChange={(e) => {
//         setSpecSearch(e.target.value);
//         setPage(0);
//       }}
//       sx={{
//         flex: 1,
//         minWidth: 250,
//         "& .MuiOutlinedInput-root": {
//           borderRadius: "30px",
//           backgroundColor: "#f8fafc",
//         },
//       }}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <SearchIcon sx={{ color: "#94a3b8" }} />
//           </InputAdornment>
//         ),
//       }}
//     />
//   </Box>
// )}

//       <Grid container spacing={3}>
//         {role === "admin" ? (
//           paginatedDoctors.length > 0 ? (
//             paginatedDoctors.map((doc) => renderDoctorCard(doc))
//           ) : (
//             <Typography sx={{ mt: 2, ml: 2 }}>No doctors found.</Typography>
//           )
//         ) : doctor ? (
//           renderDoctorCard(doctor)
//         ) : (
//           <Typography sx={{ mt: 2, ml: 2 }}>
//             Doctor details not found. Please log in.
//           </Typography>
//         )}
//       </Grid>

//       {role === "admin" && (
//         <Box display="flex" justifyContent="center" mt={4}>
//           <TablePagination
//             component="div"
//             count={filteredDoctors.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             rowsPerPageOptions={[]} 
//             labelRowsPerPage=""
//           />
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default AllAppointment;




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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const AllAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [specSearch, setSpecSearch] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/doctors");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (role === "admin") fetchDoctors();
  }, [role]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const filteredDoctors = doctors.filter((doc) => {
    return (
      doc.name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      doc.specialization.toLowerCase().includes(specSearch.toLowerCase())
    );
  });

  const paginatedDoctors = filteredDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 🔥 MODERN CARD
  const renderDoctorCard = (doctor) => (
    <Grid item xs={12} sm={6} md={4} key={doctor.id}>
      <Card
        sx={{
          borderRadius: 4,
          p: 2.5,
          background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* HEADER */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2B909B, #6dd5ed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {doctor.name.charAt(0)}
            </Box>

            <Box>
              <Typography fontWeight="bold" fontFamily="Poppins" sx={{fontSize: 20}}>
                Dr. {doctor.name}
              </Typography>
              <Typography fontSize={13} color="#64748b">
                {doctor.specialization}
              </Typography>
            </Box>
          </Box>

          {/* BUTTONS */}
          <Box display="flex" flexDirection="column" gap={1.2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(135deg, #2B909B, #237e88)",
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={() => navigate(`/book-appointment/${doctor.id}`)}
            >
              Schedule Appointment
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "none",
                color: "#2B909B",
                border: "1.5px solid #2B909B",
                "&:hover": {
                  backgroundColor: "#f0f9fa",
                },
              }}
              onClick={() => navigate(`/update-appointments/${doctor.id}`)}
            >
              Update Appointments
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                color: "#476469",
              }}
              onClick={() => navigate(`/view-appointments/${doctor.id}`)}
            >
              View Appointments →
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        mt: 6,
        background: "linear-gradient(135deg, #eef5f4, #f8fafc)",
      }}
    >
      {/* TITLE */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ fontFamily: "Poppins" }}
      >
        {role === "admin"
          ? "Appointments for Doctors"
          : "Your Appointment Panel"}
      </Typography>

      {/* SEARCH */}
      {role === "admin" && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            background: "#ffffff",
            p: 2,
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          }}
        >
          <TextField
            placeholder="Search doctor name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                backgroundColor: "#f8fafc",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            placeholder="Search specialization..."
            value={specSearch}
            onChange={(e) => setSpecSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                backgroundColor: "#f8fafc",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* CARDS */}
      <Grid container spacing={3}>
        {role === "admin" ? (
          paginatedDoctors.length > 0 ? (
            paginatedDoctors.map((doc) => renderDoctorCard(doc))
          ) : (
            <Typography>No doctors found.</Typography>
          )
        ) : doctor ? (
          renderDoctorCard(doctor)
        ) : (
          <Typography>Doctor not found.</Typography>
        )}
      </Grid>

      {/* PAGINATION */}
      {role === "admin" && (
        <Box display="flex" justifyContent="center" mt={4}>
          <TablePagination
            component="div"
            count={filteredDoctors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Box>
      )}
    </Box>
  );
};

export default AllAppointment;