// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// Auto logout time in milliseconds (e.g., 10 minutes)
// const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes

// const AutoLogout = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Function to log out
//     const logout = () => {
//       localStorage.removeItem("role");
//       localStorage.removeItem("isAuthenticated");
//       navigate("/");
//     };

//     // Start the logout timer
//     const timer = setTimeout(logout, AUTO_LOGOUT_TIME);

//     // Reset the timer on user activity (mousemove, keypress, click)
//     const resetTimer = () => {
//       clearTimeout(timer);
//       setTimeout(logout, AUTO_LOGOUT_TIME);
//     };

//     window.addEventListener("mousemove", resetTimer);
//     window.addEventListener("keydown", resetTimer);
//     window.addEventListener("click", resetTimer);

//     // Cleanup on unmount
//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener("mousemove", resetTimer);
//       window.removeEventListener("keydown", resetTimer);
//       window.removeEventListener("click", resetTimer);
//     };
//   }, [navigate]);

//   return <>{children}</>;
// };

// export default AutoLogout;
