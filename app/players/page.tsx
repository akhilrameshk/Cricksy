/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PlayersPage() {
  const muiTheme = useTheme();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then(res => res.json())
      .then(res => setPlayers(res.data));
  }, []);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary, display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" sx={{ mx: "auto", maxWidth: "1280px", px: { xs: 1, sm: 2, lg: 4 }, py: 3, flexGrow: 1, width: "100%" }}>
        <Typography sx={{ fontSize: 32, fontWeight: 900, mb: 2 }}>Players</Typography>
        <Typography sx={{ fontSize: 14, color: muiTheme.palette.text.secondary, mb: 3 }}>Manage and view all players in the system</Typography>

        {players.length === 0 ? (
          <Card sx={{ borderRadius: "16px", textAlign: "center", p: 6, border: `1px solid ${muiTheme.palette.divider}` }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: muiTheme.palette.text.primary, mb: 2 }}>👥 No players found</Typography>
            <Typography sx={{ fontSize: 14, color: muiTheme.palette.text.secondary }}>Add players through tournament management</Typography>
          </Card>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap: 3 }}>
            {players.map((p: any) => (
              <Card key={p._id} sx={{ borderRadius: "16px", border: `1px solid ${muiTheme.palette.divider}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 900 }}>{p.name}</Typography>
                    <Chip
                      label={p.role || "Player"}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: 12 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Typography sx={{ fontSize: 13, color: muiTheme.palette.text.secondary }}>
                      <strong>Status:</strong> {p.status || "Active"}
                    </Typography>
                    {p.battingStyle && (
                      <Typography sx={{ fontSize: 13, color: muiTheme.palette.text.secondary }}>
                        <strong>Batting:</strong> {p.battingStyle}
                      </Typography>
                    )}
                    {p.bowlingStyle && (
                      <Typography sx={{ fontSize: 13, color: muiTheme.palette.text.secondary }}>
                        <strong>Bowling:</strong> {p.bowlingStyle}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
}