import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Slide,
} from "@mui/material";

// Smooth dialog animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LabReports = () => {
  const [open, setOpen] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportStatusMessage, setReportStatusMessage] = useState("");
  const [reportFileUrl, setReportFileUrl] = useState("");

  const isFormValid = referenceNumber.trim() !== "";

  const handleCheckReport = async () => {
    setLoading(true);
    setReportStatusMessage("");
    setReportFileUrl("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/lab-reports/check/${referenceNumber.trim()}`
      );
      const data = await response.json();

      if (data && data.status) {
        let message = "";

        switch (data.status) {
          case "Completed":
            message = "✅ Status: Completed";
            break;
          case "In Progress":
            message = "⏳ Status: In Progress";
            break;
          case "Pending":
            message = "🕐 Status: Pending";
            break;
          default:
            message = `ℹ️ Status: ${data.status}`;
        }

        setReportStatusMessage(message);

        if (data.fileUrl) {
          setReportFileUrl(`http://localhost:3000${data.fileUrl}`);
        }
      } else {
        setReportStatusMessage(
          "❌ No lab report found for this reference number."
        );
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportStatusMessage("❌ There was an error fetching the report.");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        background: "linear-gradient(135deg, #e0f2f1, #f8fafc)",
        px: 2,
      }}
    >

      <Box
    sx={{
      width: "100%",
      maxWidth: 500,
      p: 5,
      borderRadius: "10px",
      background: "#ffffff",
      boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
      textAlign: "center",
      transition: "0.3s",
      "&:hover": {
        boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
      },
    }}
  >
      
      {/* TITLE */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          background: "linear-gradient(90deg, #177d8b, #176b76)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        LAB REPORTS
      </Typography>

      <Typography
        variant="h6"
        sx={{ color: "#64748b", mb: 5, fontWeight:500 }}
      >
        Verify your lab report status
      </Typography>

      {/* INPUT LINE */}
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <input
          type="text"
          placeholder="Enter Reference Number"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          style={{
            width: "100%",
            border: "none",
            borderBottom: "2px solid #94a3b8",
            outline: "none",
            padding: "12px 5px",
            fontSize: "16px",
            background: "transparent",
            textAlign: "center",
            transition: "0.3s",
          }}
          onFocus={(e) =>
            (e.target.style.borderBottom = "2px solid #2B909B")
          }
          onBlur={(e) =>
            (e.target.style.borderBottom = "2px solid #94a3b8")
          }
        />
      </Box>

      {/* BUTTON */}
      <Box mt={5}>
        <Button
          variant="contained"
          onClick={handleCheckReport}
          disabled={!isFormValid || loading}
           sx={{ width: "200px", backgroundColor: "#2B909B", mt: 3, fontSize: "14px", fontWeight: "500",
        "&:disabled": { backgroundColor: "#e0e0e0",  } }}
          
        >
          {loading ? "Checking..." : "🔍 Check Report"}
        </Button>
      </Box>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: 2,
            width: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Lab Report Status
        </DialogTitle>

        <DialogContent>
          {reportFileUrl && (
            <Box
              mt={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Button
                variant="contained"
                href={reportFileUrl}
                target="_blank"
                sx={{
                  background: "linear-gradient(135deg, #2B909B, #167781)",
                  borderRadius: "10px",
                  px: 3,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                📄 Download Report
              </Button>
            </Box>
          )}

          <Typography
            mt={3}
            sx={{
              fontWeight: 500,
              textAlign: "center",
              color:
                reportStatusMessage.includes("Completed")
                  ? "#2e7d32"
                  : reportStatusMessage.includes("In Progress")
                  ? "#f9a825"
                  : reportStatusMessage.includes("Pending")
                  ? "#d32f2f"
                  : "#555",
            }}
          >
            {reportStatusMessage}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              backgroundColor: "#2B909B",
              color: "#fff",
              px: 5,
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1f6f78",
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>


       </Box>
    </Box>
  );
};

export default LabReports;