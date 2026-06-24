/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function FantasyPage() {
  const muiTheme = useTheme();
  const [cricketMatches, setCricketMatches] = useState<any[]>([]);
  const [footballMatches, setFootballMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/series-matches")
      .then((res) => res.json())
      .then((res) => {
        const data = res.data || [];
        setCricketMatches(data.filter((m: any) => m.sportType !== "football"));
        setFootballMatches(data.filter((m: any) => m.sportType === "football"));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary }}>
      <Header />

      {/* Expanded maxWidth on desktop to nicely fit all 5 columns without squeezing the cards */}
      <Box component="main" sx={{ mx: "auto", maxWidth: { xs: "448px", md: "100%", lg: "1440px" }, pt: 7, pb: 24 }}>
        <Box sx={{ px: 2, pt: 2, display: "flex", gap: 1 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<HomeRoundedIcon />}
            variant="contained"
            sx={{
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
            }}
          >
            Home
          </Button>

          <Button
            onClick={() => window.history.back()}
            startIcon={<ArrowBackRoundedIcon />}
            variant="contained"
            sx={{
              bgcolor: "#16a34a",
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#15803d", boxShadow: "none" },
            }}
          >
            Back
          </Button>
        </Box>

        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography sx={{ fontSize: 32, fontWeight: 950, color: "#0f172a" }}>
            AI Fantasy Teams
          </Typography>

          <Typography sx={{ mt: 0.7, fontSize: 14, fontWeight: 600, color: "#64748b" }}>
            AI-powered Dream11 style team suggestions.
          </Typography>
        </Box>

        <AdCard />

        {loading ? (
          <Card sx={{ m: 2, p: 4, borderRadius: "24px", textAlign: "center" }}>
            <Typography sx={{ fontWeight: 900, color: "#64748b" }}>
              Loading matches...
            </Typography>
          </Card>
        ) : (
          <>
            {/* --- CRICKET SECTION --- */}
            <Box sx={{ pt: 2 }}>
              <Typography sx={{ px: 2, fontSize: 20, fontWeight: 950, color: "#0f172a", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                <SportsCricketRoundedIcon sx={{ color: "#0d6bde" }} /> Cricket Matches
              </Typography>
              
              {cricketMatches.length === 0 ? (
                <Typography sx={{ px: 2, fontSize: 14, color: "#64748b" }}>No today or upcoming cricket matches available.</Typography>
              ) : (
                <Box
                  sx={{
                    display: { xs: "flex", md: "grid" },
                    // Configured to transition from 2 columns on tablets to 5 columns on large desktop viewports
                    gridTemplateColumns: { md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" },
                    gap: 2,
                    px: 2,
                    pb: 2,
                    overflowX: { xs: "auto", md: "visible" },
                    scrollSnapType: { xs: "x mandatory", md: "none" },
                    WebkitOverflowScrolling: "touch",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {cricketMatches.map((match) => (
                    <Box 
                      key={match.id} 
                      sx={{ 
                        flex: { xs: "0 0 82%", md: "1" }, 
                        scrollSnapAlign: "start" 
                      }}
                    >
                      <MatchFantasyCard
                        match={match}
                        onClick={() => setSelectedMatch(match)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <AdCard />

            {/* --- FOOTBALL SECTION --- */}
            <Box sx={{ pt: 2 }}>
              <Typography sx={{ px: 2, fontSize: 20, fontWeight: 950, color: "#0f172a", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                <SportsSoccerRoundedIcon sx={{ color: "#16a34a" }} /> Football Matches
              </Typography>

              {footballMatches.length === 0 ? (
                <Typography sx={{ px: 2, fontSize: 14, color: "#64748b" }}>No today or upcoming football matches available.</Typography>
              ) : (
                <Box
                  sx={{
                    display: { xs: "flex", md: "grid" },
                    // Set up matching 5 columns structure for desktop viewports
                    gridTemplateColumns: { md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(5, 1fr)" },
                    gap: 2,
                    px: 2,
                    pb: 2,
                    overflowX: { xs: "auto", md: "visible" },
                    scrollSnapType: { xs: "x mandatory", md: "none" },
                    WebkitOverflowScrolling: "touch",
                    "&::-webkit-scrollbar": { display: "none" },
                  }}
                >
                  {footballMatches.map((match) => (
                    <Box 
                      key={match.id} 
                      sx={{ 
                        flex: { xs: "0 0 82%", md: "1" }, 
                        scrollSnapAlign: "start" 
                      }}
                    >
                      <MatchFantasyCard
                        match={match}
                        onClick={() => setSelectedMatch(match)}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}

        <AdCard />
      </Box>

      <Footer />

      <FantasyOptionDialog
        match={selectedMatch}
        open={Boolean(selectedMatch)}
        onClose={() => setSelectedMatch(null)}
      />
    </Box>
  );
}

function MatchFantasyCard({ match, onClick }: any) {
  const teamA = match.teamInfo?.[0]?.shortname || match.teams?.[0] || "Team A";
  const teamB = match.teamInfo?.[1]?.shortname || match.teams?.[1] || "Team B";

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
        cursor: "pointer",
        transition: "0.25s ease",
        bgcolor: "#fff",
        height: "100%", 
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 28px rgba(13,107,222,0.16)",
        },
      }}
    >
      <Box sx={{ bgcolor: match.sportType === "football" ? "#16a34a" : "#0d6bde", color: "#fff", p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Chip
            label={match.matchType?.toUpperCase() || (match.sportType === "football" ? "MATCH" : "T20")}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontWeight: 900,
            }}
          />

          {match.fantasyEnabled && (
            <Chip
              label="Fantasy"
              size="small"
              sx={{ bgcolor: match.sportType === "football" ? "#0d6bde" : "#16a34a", color: "#fff", fontWeight: 900 }}
            />
          )}
        </Box>

        <Typography sx={{ mt: 2, fontSize: 22, fontWeight: 950, textAlign: "center" }}>
          {teamA} vs {teamB}
        </Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 900,
            color: "#0f172a",
            lineHeight: 1.45,
            minHeight: "40px", 
          }}
        >
          {match.name}
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            borderRadius: "16px",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            p: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
            {match.venue || "Venue TBD"}
          </Typography>

          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 16, color: match.sportType === "football" ? "#16a34a" : "#0d6bde" }} />

            <Typography sx={{ fontSize: 13, fontWeight: 800, color: match.sportType === "football" ? "#16a34a" : "#0d6bde" }}>
              {match.dateTimeGMT
                ? new Date(match.dateTimeGMT).toLocaleString()
                : "Date TBD"}
            </Typography>
          </Box>

          <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 800, color: "#64748b" }}>
            {match.status || "Upcoming"}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<AutoAwesomeRoundedIcon />}
          sx={{
            mt: 2,
            height: 44,
            bgcolor: match.sportType === "football" ? "#16a34a" : "#0d6bde",
            borderRadius: "999px",
            fontWeight: 900,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: match.sportType === "football" ? "#15803d" : "#0a58b8", boxShadow: "none" },
          }}
        >
          AI Fantasy Options
        </Button>
      </CardContent>
    </Card>
  );
}

function FantasyOptionDialog({ match, open, onClose }: any) {
  if (!match) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "28px",
          overflow: "hidden",
          bgcolor: "#f8fafc",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: match.sportType === "football" ? "#16a34a" : "#0d6bde",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 20, fontWeight: 950 }}>
            Fantasy Options
          </Typography>

          <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
            {match.teams?.[0]} vs {match.teams?.[1]}
          </Typography>
        </Box>

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "grid", gap: 2 }}>
          <OptionCard
            title={match.sportType === "football" ? "Dream11 Football Team" : "Dream11 Team"}
            description="Generate full-match AI suggested teams with captain and vice-captain."
            href={`/fantasy/${match.id}?option=dream11`}
            color={match.sportType === "football" ? "#16a34a" : "#0d6bde"}
          />

          <Box
            sx={{
              borderRadius: "18px",
              bgcolor: "#fff7ed",
              border: "1px solid #fed7aa",
              p: 1.5,
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#9a3412" }}>
              AI teams are suggestions only. No winning guarantee.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function OptionCard({ title, description, href, color }: any) {
  return (
    <Card
      component={Link}
      href={href}
      sx={{
        p: 2,
        borderRadius: "22px",
        border: "1px solid #cbd5e1",
        textDecoration: "none",
        bgcolor: "#fff",
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 22px ${color}33`,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "16px",
            bgcolor: color,
            color: "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          <AutoAwesomeRoundedIcon />
        </Box>

        <Box>
          <Typography sx={{ fontSize: 17, fontWeight: 950, color: "#0f172a" }}>
            {title}
          </Typography>

          <Typography sx={{ mt: 0.4, fontSize: 12, fontWeight: 600, color: "#64748b" }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}