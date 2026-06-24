"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import { useTheme } from "../providers";

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "100px", // Accommodates fixed header
        pb: "80px",  // Accommodates footer
        bgcolor: isDark ? "#050b14" : "#f8fafc",
        color: isDark ? "#94a3b8" : "#475569",
        transition: "background-color 0.2s, color 0.2s",
      }}
    >
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 950,
              fontStyle: "italic",
              letterSpacing: "-0.04em",
              color: isDark ? "#ffffff" : "#0d6bde",
              mb: 2,
            }}
          >
            About cricksy
          </Typography>
          <Typography variant="h6" sx={{ color: isDark ? "#38bdf8" : "#2563eb", fontWeight: 600 }}>
            Your premium, real-time cricket companion.
          </Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.8 }}>
            Welcome to <strong>cricksy</strong>, a platform designed for true cricket enthusiasts who crave clean layouts, smart statistics, and deep real-time updates. We eliminate the clutter found on typical sports news sites to give you a highly intuitive, incredibly fast interface.
          </Typography>

          <Grid container spacing={3} sx={{ my: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 3, borderRadius: "16px", bgcolor: isDark ? "#0f172a" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? "#f1f5f9" : "#1e293b", mb: 1 }}>
                  Live Match Tracking
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Track ball-by-ball actions, deep situational updates, and detailed player scorecards in real time.
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: 3, borderRadius: "16px", bgcolor: isDark ? "#0f172a" : "#ffffff", border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: isDark ? "#f1f5f9" : "#1e293b", mb: 1 }}>
                  Fantasy Analytics
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Empower your game choices with advanced metric projections, performance form tools, and analytical trend spotting.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.8 }}>
            Whether you are following an intense international test tournament, looking up a dynamic domestic league schedule, or evaluating player form vectors for your fantasy draft leagues, cricksy organizes everything seamlessly at your fingertips.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}