"use client";

import { Box, Container, Typography, Button } from "@mui/material";
import { useTheme } from "../providers";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Formatted link layout directly addressing user target setup
  const whatsappNumber = "919633134324"; // Prefixed with country code '91' for flawless redirect routing
  const message = encodeURIComponent("Hello cricksy team! I have an inquiry.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: "100px",
        pb: "80px",
        bgcolor: isDark ? "#050b14" : "#f8fafc",
        color: isDark ? "#94a3b8" : "#475569",
        transition: "background-color 0.2s, color 0.2s",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, sm: 6 },
            borderRadius: "24px",
            bgcolor: isDark ? "#0f172a" : "#ffffff",
            border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 950,
              fontStyle: "italic",
              letterSpacing: "-0.04em",
              color: isDark ? "#ffffff" : "#0d6bde",
              mb: 2,
            }}
          >
            Contact Us
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
            Got any questions, feedback, or business inquiries regarding cricksy? Reach out to us instantly! Click the link block below to chat with our technical support line on WhatsApp.
          </Typography>

          {/* Premium Custom WhatsApp Button View Layout */}
          <Button
            variant="contained"
            component="a"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<WhatsAppIcon sx={{ fontSize: "24px !important" }} />}
            sx={{
              bgcolor: "#25d366",
              color: "#ffffff",
              px: 4,
              py: 1.75,
              borderRadius: "14px",
              fontSize: 15,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
              transition: "0.2s ease-in-out",
              "&:hover": {
                bgcolor: "#20ba5a",
                boxShadow: "0 6px 20px rgba(37, 211, 102, 0.45)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(1px)",
              },
            }}
          >
            Chat on WhatsApp
          </Button>

          <Typography variant="caption" sx={{ display: "block", mt: 3, color: isDark ? "#475569" : "#94a3b8" }}>
            Typical response time: Within a few hours.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}