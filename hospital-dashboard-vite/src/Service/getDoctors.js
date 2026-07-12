// Service/doctor.js
import axios from "axios";

export const getDoctors = async () => {
  const res = await axios.get("http://localhost:3000/api/doctors"); // <-- matches backend route
  return res.data; // should include { doctors: [...] }
};