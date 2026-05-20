/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdCard from "../components/AdCard";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/home-matches")
      .then(async (res) => {
        if (!res.ok) return { data: [] };
        return res.json();
      })
      .then((res) => setMatches(res.data || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-[58px] pb-24 lg:max-w-5xl">
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 900,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0a58b8",
                boxShadow: "none",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>

        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: 950,
              color: "#0f172a",
              lineHeight: 1.15,
            }}
          >
            Matches
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 14,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            View all local tournament matches and live score updates.
          </Typography>
        </Box>

        <AdCard />

        {loading ? (
          <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress sx={{ color: "#0d6bde" }} />
              <Typography sx={{ mt: 2, fontWeight: 900, color: "#64748b" }}>
                Loading matches...
              </Typography>
            </Box>
          </Box>
        ) : matches.length === 0 ? (
          <EmptyMatches />
        ) : (
          <Box
            sx={{
              px: 2,
              pt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
            }}
          >
            {matches.map((match, index) => (
              <Box key={match._id}>
                <MatchCard match={match} />

                {(index + 1) % 4 === 0 && (
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <AdCard />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}

        {matches.length > 0 && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <AdCard />
          </Box>
        )}
      </main>

      <Footer />
    </div>
  );
}

function MatchCard({ match }: { match: any }) {
  const isLive = String(match.status || "").toLowerCase().includes("live");
  const isCompleted = String(match.status || "").toLowerCase().includes("completed");

  const teamAScore = `${match.teamAScore || "0/0"} (${match.teamAOvers || "0.0"})`;
  const teamBScore = `${match.teamBScore || "0/0"} (${match.teamBOvers || "0.0"})`;

  return (
    <Link
      href={`/tournaments/${match.tournamentId}/matches/${match._id}/score`}
      className="no-underline"
    >
      <Card
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #cbd5e1",
          boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
          transition: "0.25s ease",
          bgcolor: "#fff",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 10px 28px rgba(13,107,222,0.16)",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: isLive ? "#fff1f2" : isCompleted ? "#eff6ff" : "#f8fafc",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            <SportsCricketRoundedIcon
              sx={{
                color: isLive ? "#dc2626" : "#0d6bde",
                fontSize: 22,
                flexShrink: 0,
              }}
            />

            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 950,
                color: "#0f172a",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {match.teamA} vs {match.teamB}
            </Typography>
          </Box>

          <Chip
            label={match.status || "Upcoming"}
            size="small"
            sx={{
              flexShrink: 0,
              height: 24,
              fontSize: 10,
              fontWeight: 900,
              bgcolor: isLive ? "#dc2626" : isCompleted ? "#0d6bde" : "#e2e8f0",
              color: isLive || isCompleted ? "#fff" : "#334155",
            }}
          />
        </Box>

        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <ScoreLine
            team={match.teamA}
            score={teamAScore}
            color="#ef4444"
            active={match.result?.includes(match.teamA)}
          />

          <ScoreLine
            team={match.teamB}
            score={teamBScore}
            color="#16a34a"
            active={match.result?.includes(match.teamB)}
          />

          <Box
            sx={{
              mt: 2,
              borderRadius: "16px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              p: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <LocationOnRoundedIcon sx={{ fontSize: 16, color: "#64748b" }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {match.venue || "Venue TBD"}
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 1,
                fontSize: 13,
                fontWeight: 900,
                color: match.result ? "#0d6bde" : "#64748b",
                lineHeight: 1.5,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {match.result || "Match not started yet"}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              height: 42,
              borderRadius: "999px",
              bgcolor: "#0d6bde",
              fontSize: 12,
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0a58b8",
                boxShadow: "none",
              },
            }}
          >
            View Scorecard
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

function ScoreLine({
  team,
  score,
  color,
  active,
}: {
  team: string;
  score: string;
  color: string;
  active?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        columnGap: 1,
        mb: 1.25,
        borderRadius: "14px",
        px: 1,
        py: 0.9,
        bgcolor: active ? "rgba(13,107,222,0.08)" : "transparent",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 900,
            color: active ? "#0d6bde" : "#0f172a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {team}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 950,
          color: active ? "#0d6bde" : "#334155",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {score}
      </Typography>
    </Box>
  );
}

function EmptyMatches() {
  return (
    <Box sx={{ px: 2, pt: 2 }}>
      <Card
        sx={{
          borderRadius: "28px",
          p: 4,
          textAlign: "center",
          border: "1px solid #cbd5e1",
          boxShadow: "0 4px 14px rgba(15,23,42,0.08)",
        }}
      >
        <SportsCricketRoundedIcon sx={{ fontSize: 54, color: "#94a3b8" }} />

        <Typography sx={{ mt: 2, fontSize: 22, fontWeight: 950, color: "#0f172a" }}>
          No matches found
        </Typography>

        <Typography sx={{ mt: 1, fontSize: 14, color: "#64748b" }}>
          Create tournaments and matches to get started.
        </Typography>
      </Card>
    </Box>
  );
}