"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Tooltip, IconButton, Typography, Container } from "@mui/material";
import { useTheme } from "../providers";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

export default function Footer() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Navigation array used for standard page links mapping
  const desktopLinks = [
    { href: "/matches", label: "Matches", icon: <SportsCricketRoundedIcon /> },
    { href: "/tournaments", label: "Series", icon: <EmojiEventsRoundedIcon /> },
    { href: "/fantasy", label: "Fantasy", icon: <AutoAwesomeRoundedIcon /> },
    { href: "/news", label: "News", icon: <FeedRoundedIcon /> },
  ];

  // Mobile navigation array including the requested Home icon
  const mobileLinks = [
    { href: "/", label: "Home", icon: <HomeRoundedIcon /> },
    ...desktopLinks,
  ];

  return (
    <>
      {/* 1. DESKTOP / NORMAL VIEW FOOTER */}
      <Box
        component="footer"
        sx={{
          display: { xs: "none", md: "block" },
          width: "100%",
          mt: "auto",
          py: 3,
          bgcolor: isDark ? "#050b14" : "#f8fafc",
          borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
          color: isDark ? "#94a3b8" : "#475569",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { sm: "row", xs: "column" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
            }}
          >
            {/* Left Side: Brand Identity */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 950,
                  fontStyle: "italic",
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#0d6bde",
                  lineHeight: 1,
                }}
              >
                cricksy
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  borderLeft: isDark ? "1px solid #334155" : "1px solid #cbd5e1", 
                  pl: 2, 
                  color: isDark ? "#64748b" : "#94a3b8" 
                }}
              >
                &copy; {new Date().getFullYear()} All rights reserved.
              </Typography>
            </Box>

            {/* Right Side: Consolidated Grouped Navigation Links */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                columnGap: 4,
                rowGap: 1.5,
              }}
            >
              {desktopLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} className="no-underline">
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13.5,
                        fontWeight: active ? 700 : 500,
                        color: active
                          ? isDark ? "#38bdf8" : "#0d6bde"
                          : "inherit",
                        "&:hover": { color: isDark ? "#f1f5f9" : "#0f172a" },
                        transition: "color 0.2s",
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                );
              })}

              {/* Utility Section */}
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 3,
                  borderLeft: isDark ? "1px solid #334155" : "1px solid #cbd5e1",
                  pl: 4
                }}
              >
                <Link href="/privacy" className="no-underline">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: 13.5,
                      color: "inherit", 
                      "&:hover": { color: isDark ? "#f1f5f9" : "#0f172a" } 
                    }}
                  >
                    Privacy
                  </Typography>
                </Link>
                <Link href="/terms" className="no-underline">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: 13.5,
                      color: "inherit", 
                      "&:hover": { color: isDark ? "#f1f5f9" : "#0f172a" } 
                    }}
                  >
                    Terms
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 2. MOBILE VIEW FOOTERBAR (With Home Icon Included) */}
      <Box
        component="footer"
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999999,
          height: "56px",
          width: "100%",
          px: "20px", // Margins adjusted slightly to make room for all 5 layout icons nicely
          bgcolor: isDark ? "#000000" : "#0d6bde",
          borderTop: isDark ? "1px solid #1e293b" : "1px solid #0a58b8",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            mx: "auto",
            height: "100%",
            maxWidth: 448,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)", // Expanded to 5 columns for fluid mobile layouts
            alignItems: "center",
          }}
        >
          {mobileLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Tooltip key={link.href} title={link.label} arrow>
                <IconButton
                  component={Link}
                  href={link.href}
                  sx={{
                    mx: "auto",
                    width: 42,
                    height: 42,
                    color: active ? "#ffffff" : "rgba(255,255,255,0.72)",
                    bgcolor: active
                      ? isDark
                        ? "#1e293b"
                        : "rgba(255,255,255,0.16)"
                      : "transparent",
                    transition: "0.2s ease",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.22)",
                      color: "#fff",
                    },
                  }}
                >
                  {link.icon}
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </>
  );
}