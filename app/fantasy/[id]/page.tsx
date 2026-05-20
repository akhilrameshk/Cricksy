/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function FantasyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [match, setMatch] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    "dream11" | "second-innings" | ""
  >("");

  useEffect(() => {
    fetch(`/api/fantasy-match?id=${id}`)
      .then((res) => res.json())
      .then((res) => setMatch(res.data || null))
      .finally(() => setLoadingMatch(false));
  }, [id]);

  const generateSuggestion = async (
    option: "dream11" | "second-innings"
  ) => {
    if (!match) return;

    setSelectedOption(option);
    setSuggestion(null);
    setLoadingAI(true);

    const res = await fetch("/api/fantasy-suggestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ match, option }),
    });

    const json = await res.json();

    if (json.success) {
      setSuggestion(json.data);
    } else {
      alert(json.message || "Failed to generate fantasy suggestion");
    }

    setLoadingAI(false);
  };

  const teamA =
    match?.teamInfo?.[0]?.shortname || match?.teams?.[0] || "Team A";

  const teamB =
    match?.teamInfo?.[1]?.shortname || match?.teams?.[1] || "Team B";

  return (
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-[58px] pb-24 lg:max-w-5xl">
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            component={Link}
            href="/scorecards"
            startIcon={<HomeRoundedIcon />}
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
            Back to Fantasy
          </Button>
        </Box>

        <AdCard />

        {loadingMatch ? (
          <Card sx={{ m: 2, p: 4, borderRadius: "24px", textAlign: "center" }}>
            <CircularProgress sx={{ color: "#0d6bde" }} />
            <Typography sx={{ mt: 2, fontWeight: 900, color: "#64748b" }}>
              Loading match...
            </Typography>
          </Card>
        ) : !match ? (
          <Card sx={{ m: 2, p: 4, borderRadius: "24px", textAlign: "center" }}>
            <Typography sx={{ fontSize: 20, fontWeight: 950 }}>
              Match not found
            </Typography>
          </Card>
        ) : (
          <>
            <Card
              sx={{
                m: 2,
                borderRadius: "26px",
                overflow: "hidden",
                border: "1px solid #cbd5e1",
                boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
              }}
            >
              <Box sx={{ bgcolor: "#0d6bde", color: "#fff", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SportsCricketRoundedIcon />

                  <Typography sx={{ fontSize: 22, fontWeight: 950 }}>
                    {teamA} vs {teamB}
                  </Typography>
                </Box>

                <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.9 }}>
                  {match.name}
                </Typography>

                <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={match.matchType?.toUpperCase() || "T20"}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.18)",
                      color: "#fff",
                      fontWeight: 900,
                    }}
                  />

                  {match.fantasyEnabled && (
                    <Chip
                      label="Fantasy Enabled"
                      size="small"
                      sx={{
                        bgcolor: "#16a34a",
                        color: "#fff",
                        fontWeight: 900,
                      }}
                    />
                  )}
                </Box>
              </Box>

              <CardContent sx={{ p: 2 }}>
                <InfoBox label="Venue" value={match.venue || "Venue TBD"} />

                <InfoBox
                  label="Date"
                  value={
                    match.dateTimeGMT
                      ? new Date(match.dateTimeGMT).toLocaleString()
                      : "Date TBD"
                  }
                />

                <InfoBox label="Status" value={match.status || "Upcoming"} />
              </CardContent>
            </Card>

            <Card
              sx={{
                m: 2,
                borderRadius: "26px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography sx={{ fontSize: 20, fontWeight: 950 }}>
                  Select Fantasy Option
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748b" }}>
                  Choose the suggestion type you want to generate.
                </Typography>

                <Box sx={{ mt: 2, display: "grid", gap: 1.5 }}>
                  <Button
                    fullWidth
                    startIcon={<AutoAwesomeRoundedIcon />}
                    onClick={() => generateSuggestion("dream11")}
                    variant="contained"
                    sx={{
                      height: 52,
                      bgcolor: selectedOption === "dream11" ? "#0a58b8" : "#0d6bde",
                      borderRadius: "18px",
                      fontWeight: 950,
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Dream11 Full Match Teams
                  </Button>

                  <Button
                    fullWidth
                    startIcon={<BoltRoundedIcon />}
                    onClick={() => generateSuggestion("second-innings")}
                    variant="contained"
                    sx={{
                      height: 52,
                      bgcolor:
                        selectedOption === "second-innings"
                          ? "#15803d"
                          : "#16a34a",
                      borderRadius: "18px",
                      fontWeight: 950,
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    Second Innings 5-Min Teams
                  </Button>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    borderRadius: "16px",
                    bgcolor: "#fff7ed",
                    border: "1px solid #fed7aa",
                    p: 1.5,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 800, color: "#9a3412" }}
                  >
                    AI fantasy teams are suggestions only. No winning guarantee.
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {loadingAI && (
              <Card
                sx={{
                  m: 2,
                  p: 4,
                  borderRadius: "24px",
                  textAlign: "center",
                }}
              >
                <CircularProgress sx={{ color: "#0d6bde" }} />
                <Typography sx={{ mt: 2, fontWeight: 900 }}>
                  Generating AI teams...
                </Typography>
              </Card>
            )}

            {suggestion && <SuggestionResult suggestion={suggestion} />}
          </>
        )}

        <AdCard />
      </main>

      <Footer />
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        mb: 1.2,
        borderRadius: "16px",
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
        p: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#64748b" }}>
        {label}
      </Typography>

      <Typography sx={{ mt: 0.4, fontSize: 14, fontWeight: 850, color: "#0f172a" }}>
        {value}
      </Typography>
    </Box>
  );
}

function SuggestionResult({ suggestion }: { suggestion: any }) {
  return (
    <Box sx={{ px: 2, display: "grid", gap: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 950, color: "#0f172a" }}>
        {suggestion.matchTitle || "AI Fantasy Suggestions"}
      </Typography>

      {(suggestion.teams || []).map((team: any, index: number) => (
        <Card
          key={index}
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid #cbd5e1",
            boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              bgcolor:
                team.risk === "Safe"
                  ? "#16a34a"
                  : team.risk === "Balanced"
                  ? "#0d6bde"
                  : "#f97316",
              color: "#fff",
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 950 }}>
              {team.teamName}
            </Typography>

            <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
              Risk: {team.risk}
            </Typography>
          </Box>

          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <CaptainBox label="Captain" value={team.captain} />
              <CaptainBox label="Vice Captain" value={team.viceCaptain} />
            </Box>

            <PlayerGroup title="WK" players={team.wicketKeeper} />
            <PlayerGroup title="Batters" players={team.batters} />
            <PlayerGroup title="All Rounders" players={team.allRounders} />
            <PlayerGroup title="Bowlers" players={team.bowlers} />

            <Box
              sx={{
                mt: 2,
                borderRadius: "16px",
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                p: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>
                {team.reason}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

function CaptainBox({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        borderRadius: "16px",
        bgcolor: "#eff6ff",
        border: "1px solid #bfdbfe",
        p: 1.4,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#0d6bde" }}>
        {label}
      </Typography>

      <Typography sx={{ mt: 0.5, fontSize: 13, fontWeight: 950, color: "#0f172a" }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

function PlayerGroup({ title, players }: { title: string; players: string[] }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 950, color: "#0f172a" }}>
        {title}
      </Typography>

      <Box sx={{ mt: 0.8, display: "flex", flexWrap: "wrap", gap: 0.8 }}>
        {(players || []).length === 0 ? (
          <Chip label="Not available" size="small" />
        ) : (
          players.map((player, index) => (
            <Chip
              key={index}
              label={player}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#334155",
                fontWeight: 800,
              }}
            />
          ))
        )}
      </Box>
    </Box>
  );
}