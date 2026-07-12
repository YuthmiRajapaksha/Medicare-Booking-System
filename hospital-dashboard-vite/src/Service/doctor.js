// src/Service/doctor.js
import axios from "axios";
// Option A: Get all doctors
export const getDoctors = async () => {
  const response = await fetch("http://localhost:3000/api/doctors");
  if (!response.ok) throw new Error("Failed to fetch doctors");
  return response.json();
};

// Option B: Direct count endpoint
export const getDoctorCount = async () => {
  const response = await fetch("http://localhost:3000/api/doctors/count/all");
  if (!response.ok) throw new Error("Failed to fetch doctor count");
  return response.json(); // { count: number }
};


// export const getDoctors = async () => {
//   const res = await axios.get("http://localhost:3000/api/doctors"); // <-- matches backend route
//   return res.data; // should include { doctors: [...] }
// };