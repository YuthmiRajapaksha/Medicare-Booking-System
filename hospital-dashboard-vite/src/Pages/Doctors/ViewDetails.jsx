import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from "@mui/material";
import Swal from "sweetalert2";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const userRole = localStorage.getItem("role") || "user";

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/doctors/${id}`);
        const data = await response.json();
        if (response.ok) {
          setDoctor(data.doctor);
        } else {
          alert("Error fetching doctor details");
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        alert("An error occurred while fetching doctor details.");
      }
    };

    fetchDoctorDetails();
  }, [id]);

  // const handleUpdate = () => {
  //   Swal.fire({
  //     title: "Update Doctor",
  //     text: "Do you want to update this doctor's details?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, update",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       navigate("/add-doctor", { state: { doctor } });
  //     }
  //   });
  // };

  const handleUpdate = () => {
  Swal.fire({
    title: "Update Doctor",
    text: "Do you want to update this doctor's details?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, update",
  }).then((result) => {
    if (result.isConfirmed) {
      // Send only the safe fields
      const { id, name, email, specialization, contactNumber, photo } = doctor;

      navigate("/add-doctor", {
        state: { doctor: { id, name, email, specialization, contactNumber, photo } },
      });
    }
  });
};


   const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/doctors/delete/${id}`, {
          method: "DELETE",
        });
        const resData = await response.json();

        if (response.ok) {
          await Swal.fire("Deleted!", "Doctor has been deleted.", "success");
          navigate("/doctors");
        } else {
          Swal.fire("Failed", `Failed to delete: ${resData.message}`, "error");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        Swal.fire("Error", "An error occurred while deleting the doctor.", "error");
      }
    }
  };

  if (!doctor) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  // return (
  //   <Box p={4} mt={8} sx={{ maxWidth: 800, mx: "auto" }}>
  //     <Card elevation={3}>
  //       <CardContent>
  //         <Typography variant="h4" fontWeight="bold" gutterBottom>
  //           {`Dr. ${doctor.name}`}
  //         </Typography>

          
  //         {doctor.photo && (
  //           <Box textAlign="center" mb={4}>
  //             <Avatar
  //               alt={`Dr. ${doctor.name}`}
  //               src={`http://localhost:3000/uploads/${doctor.photo}`}  
  //               sx={{ width: 150, height: 150, margin: "0 auto" }}
  //             />
  //           </Box>
  //         )}

  //         <Grid container spacing={3}>
  //           <Grid item xs={12} sm={6}>
  //             <Typography variant="h6">Specialization:</Typography>
  //             <Typography>{doctor.specialization}</Typography>
  //           </Grid>
            
            
  //           <Grid item xs={12} sm={6}>
  //             <Typography variant="h6">Email:</Typography>
  //             <Typography>{doctor.email}</Typography>
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <Typography variant="h6">Contact Number:</Typography>
  //             <Typography>{doctor.contactNumber}</Typography>
  //           </Grid>

            
  //         </Grid>

  //         {userRole === "admin" && (
  //           <Grid item xs={12} sm={8} display="flex" justifyContent="center" gap={4} mt={4}>
  //             <Button
  //               variant="contained"
  //               onClick={handleDelete}
  //               sx={{ backgroundColor: "red", "&:hover": { backgroundColor: "#D32F2F" } }}
  //             >
  //               Delete
  //             </Button>
  //             <Button
  //               variant="contained"
  //               onClick={handleUpdate}
  //               sx={{ backgroundColor: "#2B909B", "&:hover": { backgroundColor: "#257E85" } }}
  //             >
  //               Update
  //             </Button>
  //           </Grid>
  //         )}
  //       </CardContent>
  //     </Card>
  //   </Box>
  // );


  return (
  <Box p={4} mt={8} sx={{ maxWidth: 900, mx: "auto" }}>
    <Card
      elevation={5}
      sx={{
        borderRadius: 4,
        p: 3,
      }}
    >
      <Grid container spacing={4} alignItems="center">

        {/* Doctor Avatar */}
        <Grid item xs={12} md={4} textAlign="center">
          <Avatar
            alt={`Dr. ${doctor.name}`}
            src={
              doctor.photo
                ? `http://localhost:3000/uploads/${doctor.photo}`
                : ""
            }
            sx={{
              width: 160,
              height: 160,
              margin: "0 auto",
              fontSize: 60,
              bgcolor: "#E6F4F5",
              color: "#2B909B",
            }}
          >
            {!doctor.photo && doctor.name.charAt(0)}
          </Avatar>

          <Typography
            variant="h5"
            fontWeight="bold"
            mt={2}
            sx={{ fontFamily: "Poppins" }}
          >
            Dr. {doctor.name}
          </Typography>

          <Typography color="text.secondary">
            {doctor.specialization}
          </Typography>
        </Grid>

        {/* Doctor Information */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>

            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">Email</Typography>
              <Typography color="text.secondary">
                {doctor.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">Contact Number</Typography>
              <Typography color="text.secondary">
                {doctor.contactNumber}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography fontWeight="bold">Specialization</Typography>
              <Typography color="text.secondary">
                {doctor.specialization}
              </Typography>
            </Grid>

          </Grid>

          {/* Admin Buttons */}
          {userRole === "admin" && (
            <Box mt={5} display="flex" gap={3}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{
                  backgroundColor: "#2B909B",
                  px: 4,
                  borderRadius: 3,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#257E85" },
                }}
              >
                Update
              </Button>

              <Button
                variant="contained"
                onClick={handleDelete}
                sx={{
                  backgroundColor: "#e53935",
                  px: 4,
                  borderRadius: 3,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#c62828" },
                }}
              >
                Delete
              </Button>
            </Box>
          )}
        </Grid>

      </Grid>
    </Card>
  </Box>
 );
};

export default DoctorDetails;

