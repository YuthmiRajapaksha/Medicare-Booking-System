

import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Settings from "./Pages/Settings/Settings";
import LabReports from "./Pages/LabReports/LabReports";
import AddLabReports from "./Pages/LabReports/AddLabReports";
import Login from "./Pages/Login/Login";
import DoctorsDetails from "./Pages/Doctors/Doctors";
import AddDoctor from "./Pages/Doctors/AddDoctor";
import DoctorDetails from "./Pages/Doctors/ViewDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import AllAppointments from "./Pages/Appointments/AllAppointments";
import UpdateAppointments from "./Pages/Appointments/UpdateAppointments";
import ViewAppointments from "./Pages/Appointments/ViewAppointments";
import PastAppointments from "./Pages/Appointments/PastAppointments";
import CancelledAppointments from "./Pages/Appointments/CancelledAppointments";
import BookingForm from './Pages/Appointments/BookingForm';
import Payment  from "./Pages/Payments/Payment";
import { Box } from "@mui/material";

function App() {
  const location = useLocation();

  // Show Sidebar/Navbar only if not on login page ("/")
  const isLoginPage = location.pathname === "/";

  return (
    <Box display="flex" minHeight="100vh">
      {!isLoginPage && <Sidebar />}
      <Box flex={1} display="flex" flexDirection="column">
        {!isLoginPage && <Navbar />}

        <Box p={3} flexGrow={1}>
          <Routes>
          
            <Route path="/" element={<Login />} />

           
            <Route
              path="/home"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab-reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LabReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-lab-reports"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddLabReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={[ "user"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <DoctorsDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-doctor"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-details/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <DoctorDetails />
                </ProtectedRoute>
              }
            />
           
            <Route
              path="/appointments"
              element={
                <ProtectedRoute allowedRoles={["admin","user"]}>
                  <AllAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update-appointments/:doctorId"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <UpdateAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment/:doctorId"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <BookingForm />
                </ProtectedRoute>
              }
            />
           <Route
        path="/view-appointments/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <ViewAppointments />
          </ProtectedRoute>
        }
      />

     
      <Route
        path="/cancelled/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <CancelledAppointments />
          </ProtectedRoute>
        }
      />

      
      <Route
        path="/past/:doctorId"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <PastAppointments />
          </ProtectedRoute>
        }
      />


      <Route
        path="/payments"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <Payment />
          </ProtectedRoute>
        }
      />



            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}


export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}




 




      

       

        