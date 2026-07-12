import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2B909B",
      dark: "#237d88",
      light: "#4eb5bf",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#102a35",
    },
    background: {
      default: "#f5fafa",
      paper: "#ffffff",
    },
    text: {
      primary: "#102a35",
      secondary: "#5a7a85",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.03em", color: "#102a35" },
    h2: { fontWeight: 800, letterSpacing: "-0.03em", color: "#102a35" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    button: { fontWeight: 600, letterSpacing: "0.01em" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          fontSize: "0.95rem",
          padding: "10px 28px",
          boxShadow: "none",
        },
        contained: {
          boxShadow: "0 8px 24px rgba(43, 144, 155, 0.22)",
          "&:hover": {
            boxShadow: "0 12px 28px rgba(43, 144, 155, 0.3)",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            backgroundColor: "rgba(43, 144, 155, 0.06)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default theme;
