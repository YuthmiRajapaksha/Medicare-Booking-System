import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

/**
 * Shared teal banner used at the top of each page for a consistent,
 * modern "medical dashboard" identity across the app.
 */
export default function PageHeader({ title, subtitle, action, onBack }) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 1,
        px: { xs: 2.5, sm: 3.25 },
        py: { xs: 1.75, sm: 2.25 },
        mb: 3,
        background: "linear-gradient(135deg, #4AA9AF 0%, #2B909B 100%)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 1.25 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        )}

        <Box>
          <Typography
            sx={{ fontWeight: 500, fontSize: { xs: 16, sm: 18 } }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{ mt: 0.5, opacity: 0.9, fontSize: { xs: 12, sm: 13 } }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {action && <Box sx={{ position: "relative", zIndex: 1 }}>{action}</Box>}

      {/* Decorative medical icon cluster */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: -20, sm: 10 },
          top: "50%",
          transform: "translateY(-50%)",
          display: { xs: "none", sm: "flex" },
          gap: 1,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      >
        <LocalHospitalIcon sx={{ fontSize: 44 }} />
        <MonitorHeartIcon sx={{ fontSize: 56, mt: 1.25 }} />
        <VaccinesIcon sx={{ fontSize: 44 }} />
      </Box>
    </Box>
  );
}
