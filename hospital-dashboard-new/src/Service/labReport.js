import axios from 'axios';

export const getLabReportsToday = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/lab-reports/count-today");
    const data = await response.json();

    
    if (data && typeof data.count !== "undefined") {
      return { count: data.count };
    } else {
      return { count: 0 }; 
    }
  } catch (err) {
    console.error("Error in getLabReportsToday():", err);
    return { count: 0 }; 
  }
};
