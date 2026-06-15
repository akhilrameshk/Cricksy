"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { useTheme } from "../providers";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Box
      component="div"
      sx={{
        width: "100%",
        py: 4,
        pb: "80px", // Extra padding so content isn't blocked by your 56px fixed footer
        textAlign: "center",
        bgcolor: isDark ? "#0a0a0a" : "#f8fafc",
        borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      }}
    >
      <Typography variant="body2" color={isDark ? "rgba(255,255,255,0.6)" : "text.secondary"} sx={{ mb: 1 }}>
        &copy; {new Date().getFullYear()} Cricksy. All rights reserved.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Link href="/privacy-policy" style={{ color: isDark ? "#38bdf8" : "#0d6bde", fontSize: "14px", textDecoration: "none" }}>
          Privacy Policy
        </Link>
        <Link href="/terms" style={{ color: isDark ? "#38bdf8" : "#0d6bde", fontSize: "14px", textDecoration: "none" }}>
          Terms & Conditions
        </Link>
      </Box>
    </Box>
  );
}