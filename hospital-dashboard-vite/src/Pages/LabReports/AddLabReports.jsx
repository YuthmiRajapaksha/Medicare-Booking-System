
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import Swal from "sweetalert2";



const capitalizeName = (name) => {
  return name
    .trim()
    .split(/\s+/)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

const AddLabReports = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [report, setReport] = useState({
    reference_number: `REF-${Date.now()}`,
    patient_name: "",
    test_name: "",
    report_date: "",
    status: "",
  });

  const [testTypes, setTestTypes] = useState([
    "X-Ray",
    "Blood Test",
    "Ultrasound",
    "MRI",
    "CT Scan",
  ]);

  // editing existing report
  useEffect(() => {
    if (location.state) {
      const reportToEdit = { ...location.state };

      if (
        reportToEdit.report_date &&
        reportToEdit.report_date.includes("T")
      ) {
        reportToEdit.report_date = reportToEdit.report_date.slice(0, 10);
      }

      setReport(reportToEdit);
    }
  }, [location.state]);

  // Handle Save
  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     if (report.id) {
  //       // UPDATE existing
  //       const response = await fetch(
  //         `http://localhost:3000/api/lab-reports/update/${report.id}`,
  //         {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(report),
  //         }
  //       );

  //       if (response.ok) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Success",
  //           text: "Lab report updated successfully!",
  //           confirmButtonColor: "#2B909B",
  //         }).then(() =>
  //           navigate("/lab-reports", { state: { reload: true } })
  //         );
  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Failed to update the report.",
  //           confirmButtonColor: "#d33",
  //         });
  //       }
  //     } else {
       
  //       const response = await fetch(
  //         "http://localhost:3000/api/lab-reports/add",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(report),
  //         }
  //       );

  //       if (response.ok) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Success",
  //           text: "Lab report added successfully!",
  //           confirmButtonColor: "#2B909B",
  //         }).then(() =>
  //           navigate("/lab-reports", { state: { reload: true } })
  //         );
  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Failed to add the report.",
  //           confirmButtonColor: "#d33",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error submitting report:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Something went wrong while submitting the report.",
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

  const handleSubmit = async (event) => {
  event.preventDefault();

  // Check all required fields
  const { reference_number, patient_name, test_name, report_date, status } = report;
  if (!reference_number || !patient_name || !test_name || !report_date || !status) {
    Swal.fire("Error!", "All fields are required.", "error");
    return;
  }

  try {
    const formData = new FormData();
    for (let key in report) {
      formData.append(key, report[key]);
    }
    if (file) formData.append("reportFile", file);

    const url = report.id
      ? `http://localhost:3000/api/lab-reports/update/${report.id}`
      : "http://localhost:3000/api/lab-reports/add";

    const response = await fetch(url, {
      method: report.id ? "PUT" : "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Lab report saved successfully!",
        confirmButtonColor: "#2B909B",
      }).then(() => navigate("/lab-reports", { state: { reload: true } }));
    } else {
      Swal.fire("Error!", data.message || "Failed to save report.", "error");
    }
  } catch (err) {
    console.error("Submit error:", err);
    Swal.fire("Error!", "Something went wrong.", "error");
  }
};



//  const handleSubmit = async (event) => {
//   event.preventDefault();
//   try {
//     const formData = new FormData();
//     for (let key in report) {
//       formData.append(key, report[key]);
//     }
//     if (file) formData.append("reportFile", file);

//     const url = report.id
//       ? `http://localhost:3000/api/lab-reports/update/${report.id}`
//       : "http://localhost:3000/api/lab-reports/add";

//     const response = await fetch(url, {
//       method: report.id ? "PUT" : "POST",
//       body: formData,
//     });

//     const data = await response.json();
//     if (response.ok) {
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Lab report saved successfully!",
//         confirmButtonColor: "#2B909B",
//       }).then(() => navigate("/lab-reports", { state: { reload: true } }));
//     } else {
//       Swal.fire("Error!", data.message || "Failed to save report.", "error");
//     }
//   } catch (err) {
//     console.error("Submit error:", err);
//     Swal.fire("Error!", "Something went wrong.", "error");
//   }
// };


  // Reset form
  const handleReset = () => {
    setReport({
      reference_number: `REF-${Date.now()}`,
      patient_name: "",
      test_name: "",
      report_date: "",
      status: "",
    });
  };

  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Paper
        sx={{
          padding: 4,
          width: "550px",
          textAlign: "center",
          boxShadow: 10,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {report.id ? "EDIT LAB REPORT" : "ADD LAB REPORT"}
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Reference Number"
              value={report.reference_number}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Patient Name"
              value={report.patient_name}
              onChange={(e) =>
                setReport({ ...report, patient_name: e.target.value })
              }
              onBlur={(e) =>
                setReport({
                  ...report,
                  patient_name: capitalizeName(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <FormControl fullWidth>
              <Autocomplete
                value={report.test_name}
                onChange={(e, newValue) =>
                  setReport({ ...report, test_name: newValue })
                }
                options={testTypes}
                renderInput={(params) => (
                  <TextField {...params} label="Test Name" />
                )}
                freeSolo
              />
            </FormControl>

            <Button
              variant="text"
              sx={{ mt: 1, color: "#2B909B" }}
              onClick={async () => {
                const { value: newType } = await Swal.fire({
                  title: "Add New Test Type",
                  input: "text",
                  inputLabel: "Test Type",
                  inputPlaceholder: "Enter new test type",
                  showCancelButton: true,
                });

                if (newType) {
                  const trimmed = newType.trim();
                  if (trimmed && !testTypes.includes(trimmed)) {
                    setTestTypes([...testTypes, trimmed]);
                    Swal.fire(
                      "Added!",
                      `"${trimmed}" has been added.`,
                      "success"
                    );
                  } else {
                    Swal.fire(
                      "Oops!",
                      "This type already exists or is invalid.",
                      "warning"
                    );
                  }
                }
              }}
            >
              + Add New Test Type
            </Button>
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={report.report_date}
              onChange={(e) =>
                setReport({ ...report, report_date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={report.status}
                onChange={(e) =>
                  setReport({ ...report, status: e.target.value })
                }
              >
                {/* <MenuItem value="Pending">Pending</MenuItem> */}
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={8}>
  <Button variant="outlined" component="label" >
    Upload file
    <input
      type="file"
      hidden
      accept=".pdf,.jpg,.jpeg,.png"
      onChange={(e) => setFile(e.target.files[0])}
    />
  </Button>
  {file && <Typography variant="body2" mt={1}>{file.name}</Typography>}
</Grid>

          <Grid
            item
            xs={12}
            sm={8}
            display="flex"
            justifyContent="center"
            gap={10}
            mt={3}
          >
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{
                width: "100px",
                color: "#2B909B",
                border: "2px solid #2B909B",
                "&:hover": {
                  backgroundColor: "#E0F7FA",
                  borderColor: "#2B909B",
                },
              }}
            >
              RESET
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#2B909B",
                width: "100px",
                "&:hover": {
                  backgroundColor: "#4da6a9",
                },
              }}
            >
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddLabReports;








