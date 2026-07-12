// import React, { useState } from "react";
// import { Box, Grid, Paper, Typography } from "@mui/material";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
// import dayjs from "dayjs";

// const Calendar = () => {
//   const [selectedDate, setSelectedDate] = useState(dayjs());

//   return (
//     <Box sx={{ flexGrow: 1, mt: 3 }}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//               Calendar
//             </Typography>
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <StaticDatePicker
//                 displayStaticWrapperAs="desktop"
//                 value={selectedDate}
//                 onChange={(newValue) => setSelectedDate(newValue)}
//               />
//             </LocalizationProvider>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Calendar;






