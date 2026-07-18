import { createTheme } from "@mui/material/styles";

// Brand palette derived from the app's existing teal identity (#2B909B)
// so the redesign keeps the same look-and-feel, just refined.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2B909B",
      light: "#5FB6BC",
      dark: "#1F6B73",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#8B5CF6",
      contrastText: "#ffffff",
    },
    success: {
      main: "#22C55E",
    },
    warning: {
      main: "#F59E0B",
    },
    error: {
      main: "#EF4444",
    },
    info: {
      main: "#3B82F6",
    },
    background: {
      default: "#F1F6F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F2937",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
  },
  // Base unit for the `borderRadius` sx shorthand (e.g. `borderRadius: 2` = 2 * this value).
  // Keep this modest — a large base here silently balloons every rounded corner in the app.
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 700 },
    h4: { fontSize: "1.375rem", fontWeight: 700 },
    h5: { fontSize: "1.125rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
    subtitle1: { fontSize: "0.95rem", fontWeight: 600 },
    subtitle2: { fontSize: "0.85rem", fontWeight: 600 },
    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.85rem" },
    caption: { fontSize: "0.75rem" },
    button: { fontSize: "0.875rem", fontWeight: 500, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F1F6F6",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 18,
          paddingRight: 18,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#237E88",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation0: {
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E2E8F0",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #E2E8F0",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: "0.85rem",
          color: "#1F6B73",
          borderBottom: "2px solid rgba(43, 144, 155, 0.25)",
        },
        root: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(43, 144, 155, 0.10)",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
