"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, IconButton, Typography } from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ScoreboardRoundedIcon from "@mui/icons-material/ScoreboardRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import { useTheme } from "../providers";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    {
      href: "/matches",
      label: "Matches",
      icon: <SportsCricketRoundedIcon fontSize="small" />,
    },
    {
      href: "/tournaments",
      label: "Series",
      icon: <EmojiEventsRoundedIcon fontSize="small" />,
    },
    
    {
      href: "/news",
      label: "News",
      icon: <FeedRoundedIcon fontSize="small" />,
    },
  ];

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        insetInline: 0,
        top: 0,
        zIndex: 999999,
        height: 56,
        width: "100%",
        bgcolor: "#0d6bde",
        color: "#fff",
        borderBottom: "1px solid #0a58b8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Box
        sx={{
          height: 56,
          maxWidth: { xs: 448, lg: 1280 },
          mx: "auto",
          px: { xs: 1, sm: 2, lg: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <IconButton size="small" sx={{ color: "#fff", width: 38, height: 38 }}>
            <MenuRoundedIcon />
          </IconButton>

          <Link href="/" className="no-underline">
            <Typography
              component="span"
              sx={{
                color: "#fff",
                fontSize: 24,
                fontWeight: 900,
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              cri
              <Box
                component="span"
                sx={{
                  bgcolor: "#ef4444",
                  color: "#fff",
                  px: 0.5,
                  borderRadius: "999px",
                }}
              >
                ck
              </Box>
              sy
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          

          <Link href="/" className="no-underline">
            <Typography
              component="span"
              sx={{
                color: "#fff",
                fontSize: 26,
                fontWeight: 900,
                fontStyle: "italic",
              }}
            >
              cri
              <Box
                component="span"
                sx={{
                  bgcolor: "#ef4444",
                  color: "#fff",
                  px: 0.5,
                  borderRadius: "999px",
                }}
              >
                ck
              </Box>
              sy
            </Typography>
          </Link>
        </Box>

        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link key={link.href} href={link.href} className="no-underline">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    color: active ? "#ffffff" : "rgba(255,255,255,0.8)",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  {link.icon}
                  {link.label}
                </Box>
              </Link>
            );
          })}
        </Box>

        <IconButton
          onClick={toggleTheme}
          size="small"
          sx={{
            color: "#fff",
            width: 38,
            height: 38,
            bgcolor: "rgba(255,255,255,0.14)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.22)",
            },
          }}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <LightModeRoundedIcon fontSize="small" />
          ) : (
            <DarkModeRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}