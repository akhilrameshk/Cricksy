/* eslint-disable react-hooks/static-components */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";

import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useTheme } from "../providers";
import { useAdmin } from "@/app/hooks/useAdmin";
import AdminLogin from "./AdminLogin";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdmin();
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const muiTheme = useMuiTheme();
  const [open, setOpen] = useState(false);

  const isDark = theme === "dark";

  // "Home" link removed as requested since the Logo component acts as the homepage redirect
  const links = [
    { href: "/matches", label: "Matches", icon: <SportsCricketRoundedIcon /> },
    { href: "/tournaments", label: "Series", icon: <EmojiEventsRoundedIcon /> },
    { href: "/fantasy", label: "Fantasy", icon: <AutoAwesomeRoundedIcon /> },
    { href: "/news", label: "News", icon: <FeedRoundedIcon /> },
  ];

  const Logo = () => (
    <Link href="/" className="no-underline">
      <Box sx={{ display: "flex", alignItems: "center", height: 36 }}>
        <Typography
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            height: 36,
            fontSize: { xs: 28, lg: 30 },
            fontWeight: 950,
            fontStyle: "italic",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: "#ffffff",
            textDecoration: "none",
            textShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          cri
          <Box
            component="span"
            sx={{
              ml: 0.7,
              width: 36,
              height: 36,
              borderRadius: "999px",
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #ffffff 0%, #dbeafe 45%, #bfdbfe 100%)",
              border: "2px solid rgba(255,255,255,0.7)",
              boxShadow:
                "0 4px 14px rgba(255,255,255,0.22), inset 0 2px 4px rgba(255,255,255,0.85)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 45%, transparent 72%)",
                opacity: 0.9,
              }}
            />
            <Typography
              component="span"
              sx={{
                position: "relative",
                zIndex: 2,
                fontSize: 28,
                fontWeight: 700,
                fontStyle: "italic",
                background:
                  theme === "dark"
                    ? "linear-gradient(180deg, #000000 0%, #111827 45%, #1e293b 100%)"
                    : "linear-gradient(180deg, #1d4ed8 0%, #0d6bde 45%, #2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow:
                  theme === "dark"
                    ? "0 1px 4px rgba(0,0,0,0.45)"
                    : "0 1px 2px rgba(13,107,222,0.28)",
              }}
            >
              ck
            </Typography>
          </Box>
          sy
        </Typography>
      </Box>
    </Link>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "fixed",
          insetInline: 0,
          top: 0,
          zIndex: 999999,
          height: 56,
          width: "100%",
          bgcolor: isDark ? "#000000" : muiTheme.palette.primary.main,
          color: "#fff",
          borderBottom: isDark
            ? "1px solid #1e293b"
            : `1px solid ${muiTheme.palette.primary.dark}`,
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
          {/* Mobile Shell Menu Trigger */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <IconButton
              onClick={() => setOpen(true)}
              size="small"
              sx={{ color: "#fff", width: 38, height: 38 }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Logo />
          </Box>

          {/* Desktop Logo Wrapper */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
            }}
          >
            <Logo />
          </Box>

          {/* Desktop Right Actions Container */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { lg: 4, xl: 5 },
            }}
          >
            {/* Desktop Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 3.5,
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
                        color: active ? "#fff" : "rgba(255,255,255,0.78)",
                        fontSize: 14,
                        fontWeight: 900,
                        transition: "0.2s",
                        "&:hover": { color: "#fff" },
                      }}
                    >
                      {link.icon}
                      {link.label}
                    </Box>
                  </Link>
                );
              })}
            </Box>

            {/* Desktop Only Action Controls (Theme and Login hidden on mobile header view) */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Tooltip title={isAdmin ? "Admin (Logged in)" : "Admin Login"}>
                <IconButton
                  onClick={() => setAdminDialogOpen(true)}
                  size="small"
                  sx={{
                    color: "#fff",
                    width: 38,
                    height: 38,
                    bgcolor: isAdmin ? "#10b981" : "rgba(255,255,255,0.14)",
                    "&:hover": { bgcolor: isAdmin ? "#059669" : "rgba(255,255,255,0.22)" },
                  }}
                >
                  <SecurityRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
                <IconButton
                  onClick={toggleTheme}
                  size="small"
                  sx={{
                    color: "#fff",
                    width: 38,
                    height: 38,
                    bgcolor: "rgba(255,255,255,0.14)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                  }}
                >
                  {isDark ? (
                    <LightModeRoundedIcon fontSize="small" />
                  ) : (
                    <DarkModeRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Mobile Side Drawer Container */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: "75vw",
              maxWidth: 340,
              bgcolor: isDark ? "#0f172a" : "#ffffff",
              color: isDark ? "#ffffff" : "#0f172a",
              borderTopRightRadius: "22px",
              borderBottomRightRadius: "22px",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            bgcolor: isDark ? "#000000" : "#0d6bde",
            color: "#fff",
            px: 2,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: isDark ? "1px solid #1e293b" : "none",
          }}
        >
          <Logo />

          <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <List sx={{ p: 1.5 }}>
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setOpen(false)}
                sx={{
                  mb: 1,
                  borderRadius: "16px",
                  bgcolor: active
                    ? isDark
                      ? "#1e293b"
                      : "#0d6bde"
                    : "transparent",
                  color: active ? "#fff" : "inherit",
                  "&:hover": {
                    bgcolor: active
                      ? isDark
                        ? "#1e293b"
                        : "#0d6bde"
                      : isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(13,107,222,0.10)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active ? "#fff" : isDark ? "#93c5fd" : "#0d6bde",
                  }}
                >
                  {link.icon}
                </ListItemIcon>

                <ListItemText
                  primary={link.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 15,
                        fontWeight: 900,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* Action Controls Footer Component Inside Mobile Menu */}
        <Box sx={{ borderTop: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0", px: 1.5, py: 1.5, display: "flex", gap: 1 }}>
          <Tooltip title={isAdmin ? "Admin (Logged in)" : "Admin Login"}>
            <IconButton
              onClick={() => {
                setAdminDialogOpen(true);
                setOpen(false);
              }}
              sx={{
                flex: 1,
                color: "#fff",
                bgcolor: isAdmin ? "#10b981" : "#0d6bde",
                borderRadius: "12px",
                fontWeight: 900,
                fontSize: 13,
                textTransform: "none",
                "&:hover": { bgcolor: isAdmin ? "#059669" : "#0a58b8" },
              }}
            >
              <SecurityRoundedIcon sx={{ mr: 1 }} />
              {isAdmin ? "Admin" : "Login"}
            </IconButton>
          </Tooltip>

          <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: "#fff",
                bgcolor: "#0d6bde",
                borderRadius: "12px",
                "&:hover": { bgcolor: "#0a58b8" },
              }}
            >
              {isDark ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>

      <AdminLogin open={adminDialogOpen} onClose={() => setAdminDialogOpen(false)} />
    </>
  );
}