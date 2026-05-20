"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Tooltip, IconButton } from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import ScoreboardRoundedIcon from "@mui/icons-material/ScoreboardRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
export default function Footer() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: <HomeRoundedIcon /> },
    { href: "/matches", label: "Matches", icon: <SportsCricketRoundedIcon /> },
    { href: "/tournaments", label: "Series", icon: <EmojiEventsRoundedIcon /> },
    { href: "/fantasy", label: "Fantasy", icon: <AutoAwesomeRoundedIcon /> },
    { href: "/news", label: "News", icon: <FeedRoundedIcon /> },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        height: "56px",
        width: "100%",
        px: "38px",
        bgcolor: "#0d6bde",
        borderTop: "1px solid #0a58b8",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          height: "100%",
          maxWidth: 448,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          alignItems: "center",
        }}
      >
        {links.map((link) => {
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
                  bgcolor: active ? "rgba(255,255,255,0.16)" : "transparent",
                  transition: "0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.22)",
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
  );
}