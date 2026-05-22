/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AddTournament() {
  const router = useRouter();
  const muiTheme = useTheme();

  const [form, setForm] = useState({
    name: "",
    format: "T20",
    venue: "",
    startDate: "",
    endDate: "",
    status: "Upcoming",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Tournament created ✅");
      router.push("/tournaments");
    } else {
      alert("Error creating tournament ❌");
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary, display: "flex", flexDirection: "column" }}>
      <Header />

      <Box component="main" sx={{ mx: "auto", maxWidth: "512px", px: 2, py: 3, flexGrow: 1, width: "100%" }}>
        <Button component={Link} href="/tournaments" variant="outlined" sx={{ mb: 3 }}>
          ← Back
        </Button>

        <Typography sx={{ fontSize: 28, fontWeight: 900, mb: 4 }}>Add Tournament</Typography>

        <Card sx={{ borderRadius: "16px", border: `1px solid ${muiTheme.palette.divider}` }}>
          <CardContent sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Tournament Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Format"
                name="format"
                value={form.format}
                onChange={handleChange}
                select
                variant="outlined"
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
              </TextField>

              <TextField
                fullWidth
                label="Venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                fullWidth
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                select
                variant="outlined"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
              </TextField>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, py: 1.5, fontSize: 15, fontWeight: 900 }}>
                Create Tournament
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Footer />
    </Box>
  );
}