import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HospitalDashboard from "./components/HospitalDashbord";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Bookings from "./Pages/Bookings";
import LabReports from "./Pages/LabReports";
import SearchResults from "./components/SearchResults";
// import HospitalDashboards from './Pages/ChannelDoctor/HospitalDashboards';
import ChannelDoctor from "./Pages/ChannelDoctor/ChannelDoctor";
import { AuthProvider } from "./context/AuthContext";
import ChangePassword from "./Pages/ChangePassword";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Navbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<HospitalDashboard />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/lab-reports" element={<LabReports />} />

                <Route path="/signup" element={<SignUp />} />
                {/* <Route path="/channel-doctor" element={<HospitalDashboards />} /> */}
                <Route path="/results" element={<SearchResults />} />
                <Route path="/channel/:id" element={<ChannelDoctor />} />

                <Route path="/change-password" element={<ChangePassword />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
