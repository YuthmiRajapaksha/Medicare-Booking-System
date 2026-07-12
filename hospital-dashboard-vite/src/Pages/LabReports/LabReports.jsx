import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, Box, TablePagination, FormControl, Autocomplete, TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from 'date-fns';


import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const LabReports = () => {
  const [labReportsData, setLabReportsData] = useState([]);
  const [referenceSearch, setReferenceSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const location = useLocation();

  
  const fetchLabReports = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/lab-reports");
    const data = await response.json();
    console.log("🧪 fetchLabReports data:", data);
    setLabReportsData(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
  useEffect(() => {
    fetchLabReports();
  }, [location.state]); 

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/lab-reports/delete/${id}`, {
          method: "DELETE",
        }).then((response) => {
          if (response.ok) {
            setLabReportsData((prev) => prev.filter((r) => r.id !== id));
            Swal.fire("Deleted!", "The report has been deleted.", "success");
          } else {
            Swal.fire("Error!", "Failed to delete the report.", "error");
          }
        });
      }
    });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const filteredReports = labReportsData.filter((report) => {
    const refMatch = report.reference_number?.toLowerCase().includes(referenceSearch.toLowerCase().trim());
    const nameMatch = report.patient_name?.toLowerCase().includes(nameSearch.toLowerCase().trim());
    const statusMatch = report.status?.toLowerCase().includes(statusSearch.toLowerCase().trim());
    return refMatch && nameMatch && statusMatch;
  });
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 10, mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{fontFamily: "Poppins"}}>
          Finalized Lab Reports
        </Typography>
        <Button variant="contained" sx={{ 
          // backgroundColor: '#2B909B',
          backgroundColor: '#187984',
        color: 'white', fontWeight: "bold",
          '&:hover': { backgroundColor: '#4da6a9' }, }} 
          onClick={() => navigate("/add-lab-reports")}>
          Add Report
        </Button>
      </Box>

     
      {/* <Box sx={{ display: "flex", gap: 5, flexWrap: "wrap", mb: 3 }}>
        <input
          type="text"
          placeholder="Search by Reference Number"
          value={referenceSearch}
          onChange={(e) => setReferenceSearch(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "220px" }}
        />
        <input
          type="text"
          placeholder="Search by Patient Name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", width: "220px" }}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <Autocomplete
            freeSolo
            options={["Completed", "In Progress"]}
            value={statusSearch}
            onChange={(e, newValue) => setStatusSearch(newValue || "")}
            renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
          />
        </FormControl>
      </Box> */}


<Box
  sx={{
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    mb: 4,
  }}
>
  {/* 🔍 Reference Number */}
  <TextField
    placeholder="Reference Number..."
    variant="outlined"
    value={referenceSearch}
    onChange={(e) => {
      setReferenceSearch(e.target.value);
      setPage(0);
    }}
    sx={{
      width: 260,
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
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

  {/* 🔍 Patient Name */}
  <TextField
    placeholder="Patient Name..."
    variant="outlined"
    value={nameSearch}
    onChange={(e) => {
      setNameSearch(e.target.value);
      setPage(0);
    }}
    sx={{
      width: 260,
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
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

  {/* 🔍 Status */}
  <Autocomplete
    options={["Completed", "In Progress"]}
    value={statusSearch}
    onChange={(e, newValue) => {
      setStatusSearch(newValue || "");
      setPage(0);
    }}
    sx={{
      width: 260,
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
      },
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Select Status..."
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <>
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8" }} />
              </InputAdornment>
              {params.InputProps.startAdornment}
            </>
          ),
        }}
      />
    )}
  />
</Box>
      
      <TableContainer component={Paper} sx={{ boxShadow: 5,overflowX: "auto", // This enables horizontal scroll on small screens
    width: "100%" }}>
        <Table stickyHeader aria-label="lab reports table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow >
              {["ID", "Reference Number", "Patient Name", "Test Name", "Date", "Status","File", "Action"].map((head, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold",backgroundColor: "#8fd5df" }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ fontStyle: "italic", color: "#888" }}>No Lab Reports Found</TableCell>
              </TableRow>
            ) : (
              filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.reference_number}</TableCell>
                  <TableCell>{row.patient_name}</TableCell>
                  <TableCell>{row.test_name}</TableCell>
                  <TableCell>{row.report_date && row.report_date.split("T")[0].split("-").reverse().join("/")}</TableCell>

                  <TableCell>{row.status}</TableCell>
<TableCell>
  {row.report_file_url ? (
    <Button
      variant="contained"
      color="primary"
      href={`http://localhost:3000${row.report_file_url}`}
      target="_blank"
      size="small"
    >
      Download PDF
    </Button>
  ) : (
    <Typography variant="body2" color="textSecondary">
      No file
    </Typography>
  )}
</TableCell>



                  <TableCell>
                    <Button color="primary" onClick={() => navigate("/add-lab-reports", { state: row })}>
                      <Edit />
                    </Button>
                    <Button color="error" onClick={() => handleDelete(row.id)}>
                      <Delete />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

     
      <TablePagination
        component="div"
        count={filteredReports.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </div>
  );
};

export default LabReports;


