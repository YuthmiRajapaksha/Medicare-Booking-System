import { Typography, Box, Link, Stack, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#06464f", color: "#f8fbff", py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "center", alignItems: "center", gap: 3 }}>
           <Box component="img" src="/img/medicare-white.png" alt="MediCare" sx={{ width: 150, objectFit: "contain", marginBottom: 2 }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: { xs: "center", sm: "center" }, flexWrap: "wrap" }}>
           
          <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap", justifyContent: { xs: "center", sm: "center" }, gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link href="/" color="inherit" underline="none" sx={{ fontSize: 14, '&:hover': { color: '#7dd6e5' } }}>
              Home
            </Link>
            <Link href="/lab-reports" color="inherit" underline="none" sx={{ fontSize: 14, '&:hover': { color: '#7dd6e5' } }}>
              Lab Reports
            </Link>
            <Link href="/signin" color="inherit" underline="none" sx={{ fontSize: 14, '&:hover': { color: '#7dd6e5' } }}>
              Sign In
            </Link>
          </Stack>
        </Box>
        <Typography variant="body2" sx={{ mt: 4, textAlign: "center", color: "rgba(255,255,255,0.72)" }}>
          📍 Piliyandala | Maharagama | Gampaha • 📞 +94 7785 85858 • ✉️ info@medicare.com
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
          &copy; {new Date().getFullYear()} MediCare Hospital Site. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
