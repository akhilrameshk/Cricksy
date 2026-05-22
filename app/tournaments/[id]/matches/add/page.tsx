/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";
import { useTheme } from "@/app/providers";

export default function AddMatchPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();

  const tournamentId = params.id as string;

  const isDark = theme === "dark";

  const [teams, setTeams] = useState<any[]>([]);

  const [form, setForm] = useState({
    teamA: "",
    teamB: "",
    venue: "",
    matchDate: "",
    status: "Upcoming",
    score: "0/0",
    overs: "0.0",
    result: "",
  });

  useEffect(() => {
    if (!tournamentId) return;

    fetch(`/api/teams?tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((res) => setTeams(res.data || []));
  }, [tournamentId]);

  const handleChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.teamA === form.teamB) {
      alert("Team A and Team B cannot be same");
      return;
    }

    const res = await fetch("/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        tournamentId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Match added successfully");
      router.push(`/tournaments/${tournamentId}`);
    } else {
      alert(data.message || "Failed to add match");
    }
  };

  const teamAOptions = teams.filter((t) => t.teamName !== form.teamB);
  const teamBOptions = teams.filter((t) => t.teamName !== form.teamA);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      bgcolor: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#ffffff" : "#0f172a",
      "& fieldset": {
        borderColor: isDark ? "#334155" : "#cbd5e1",
      },
      "&:hover fieldset": {
        borderColor: "#0d6bde",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0d6bde",
      },
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "#cbd5e1" : "#64748b",
      "&.Mui-focused": {
        color: "#0d6bde",
      },
    },
    "& .MuiSelect-icon": {
      color: isDark ? "#ffffff" : "#0f172a",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: isDark ? "#020617" : "#e9eef1",
        color: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          mx: "auto",
          maxWidth: 512,
          px: 2,
          pt: "58px",
          pb: 10,
          width: "100%",
        }}
      >
        <Box sx={{ pt: 2 }}>
          <Button
            component={Link}
            href={`/tournaments/${tournamentId}`}
            startIcon={<ArrowBackRoundedIcon />}
            variant="contained"
            sx={{
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0a58b8",
                boxShadow: "none",
              },
            }}
          >
            Back
          </Button>
        </Box>

        <AdCard />

        <Card
          sx={{
            mt: 2,
            borderRadius: "26px",
            overflow: "hidden",
            bgcolor: isDark ? "#0f172a" : "#ffffff",
            border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
            boxShadow: isDark
              ? "0 6px 24px rgba(0,0,0,0.35)"
              : "0 6px 24px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#0d6bde",
              color: "#fff",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SportsCricketRoundedIcon />

            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 950 }}>
                Add Match
              </Typography>

              <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
                Create a new tournament match
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ p: 2.5 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "grid", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Team A"
                name="teamA"
                value={form.teamA}
                onChange={handleChange}
                select
                required
                sx={inputSx}
              >
                <MenuItem value="">Select Team A</MenuItem>
                {teamAOptions.map((t) => (
                  <MenuItem key={t._id} value={t.teamName}>
                    {t.teamName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Team B"
                name="teamB"
                value={form.teamB}
                onChange={handleChange}
                select
                required
                sx={inputSx}
              >
                <MenuItem value="">Select Team B</MenuItem>
                {teamBOptions.map((t) => (
                  <MenuItem key={t._id} value={t.teamName}>
                    {t.teamName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                sx={inputSx}
              />

              <TextField
                fullWidth
                label="Match Date & Time"
                name="matchDate"
                type="datetime-local"
                value={form.matchDate}
                onChange={handleChange}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={inputSx}
              />

              <TextField
                fullWidth
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                select
                sx={inputSx}
              >
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Live">Live</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  height: 48,
                  bgcolor: "#0d6bde",
                  borderRadius: "16px",
                  fontSize: 15,
                  fontWeight: 950,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#0a58b8",
                    boxShadow: "none",
                  },
                }}
              >
                Add Match
              </Button>
            </Box>
          </CardContent>
        </Card>

        <AdCard />
      </Box>

      <Footer />
    </Box>
  );
}