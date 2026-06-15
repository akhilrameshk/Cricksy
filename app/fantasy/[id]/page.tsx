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
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function FantasyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [match, setMatch] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [lockedMessage, setLockedMessage] = useState("");
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    "dream11" | "second-innings" | ""
  >("");

  const [tossInfo, setTossInfo] = useState<any>(null);
  const [lineupInfo, setLineupInfo] = useState<any>(null);
  const [checkingToss, setCheckingToss] = useState(false);
  const [checkingLineup, setCheckingLineup] = useState(false);

  const tossDone = tossInfo?.available === true;
  const lineupDone = lineupInfo?.available === true;

  useEffect(() => {
    fetch(`/api/fantasy-match?id=${id}`)
      .then((res) => res.json())
      .then((res) => setMatch(res.data || null))
      .finally(() => setLoadingMatch(false));
  }, [id]);

  const hasToss = Boolean(
    tossDone ||
      match?.tossWinner ||
      match?.tossChoice ||
      match?.toss ||
      String(match?.status || "").toLowerCase().includes("won the toss")
  );

  const hasLineup = Boolean(
    lineupDone ||
      match?.lineupUpdated ||
      match?.hasSquad ||
      match?.playingXI ||
      match?.teamAPlayingXI?.length ||
      match?.teamBPlayingXI?.length
  );

  const canCreateSecondInnings = hasToss && hasLineup;

 const generateSuggestion = async (
  option: "dream11" | "second-innings"
) => {
  if (!match) return;

  setSelectedOption(option);
  setSuggestion(null);
  setLockedMessage("");

  // Only second innings needs toss + lineup
  if (option === "second-innings" && !canCreateSecondInnings) {
    setLockedMessage(
      "Second innings team can be generated only after toss and lineup are available."
    );
    return;
  }

  setLoadingAI(true);

  try {
    const analysisRes = await fetch("/api/fantasy-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        match,
        limit: 5,
      }),
    });

    const analysisJson = await analysisRes.json();

    const res = await fetch("/api/fantasy-suggestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        match,
        option,
        tossInfo,
        lineupInfo,
        recentPerformance: analysisJson?.data || null,

        // Needed only for second innings
        secondBattingTeam:
          option === "second-innings"
            ? tossInfo?.secondBattingTeam ||
              tossInfo?.secondInningsBattingTeam ||
              match?.teams?.[1]
            : undefined,

        secondBowlingTeam:
          option === "second-innings"
            ? tossInfo?.secondBowlingTeam ||
              tossInfo?.secondInningsBowlingTeam ||
              match?.teams?.[0]
            : undefined,
      }),
    });

    const json = await res.json();

    if (json.success) {
      setSuggestion(json.data);
    } else {
      setLockedMessage(
        json.message || "Failed to generate fantasy suggestion"
      );
    }
  } catch (error) {
    console.error(error);
    setLockedMessage("Failed to generate fantasy suggestion");
  }

  setLoadingAI(false);
};

  const checkToss = async () => {
    if (!match) return;

    setCheckingToss(true);

    try {
      const res = await fetch("/api/fantasy-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match,
          type: "toss",
        }),
      });

      const json = await res.json();

      if (json.success) {
        setTossInfo(json.data);
      } else {
        alert(json.message || "Failed to check toss");
      }
    } catch {
      alert("Failed to check toss");
    }

    setCheckingToss(false);
  };

  const checkLineup = async () => {
    if (!match) return;

    setCheckingLineup(true);

    try {
      const res = await fetch("/api/fantasy-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match,
          type: "lineup",
        }),
      });

      const json = await res.json();

      if (json.success) {
        setLineupInfo(json.data);
      } else {
        alert(json.message || "Failed to check lineup");
      }
    } catch {
      alert("Failed to check lineup");
    }

    setCheckingLineup(false);
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
            href="/fantasy"
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

                  <Chip
                    label={hasToss ? "Toss Done" : "Pre Toss"}
                    size="small"
                    sx={{
                      bgcolor: hasToss ? "#16a34a" : "#f97316",
                      color: "#fff",
                      fontWeight: 900,
                    }}
                  />

                  <Chip
                    label={hasLineup ? "Lineup Available" : "Lineup Pending"}
                    size="small"
                    sx={{
                      bgcolor: hasLineup ? "#16a34a" : "#f97316",
                      color: "#fff",
                      fontWeight: 900,
                    }}
                  />
                </Box>
              </Box>

              <CardContent sx={{ p: 2 }}>
                <InfoBox label="Venue" value={match.venue || "Venue TBD"} />

                <InfoBox
                  label="Date"
                  value={
                    match.dateTimeGMT
                      ? `${new Date(match.dateTimeGMT + "Z").toLocaleString(
                          "en-IN",
                          {
                            timeZone: "Asia/Kolkata",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )} IST`
                      : "Date TBD"
                  }
                />

                <InfoBox label="Status" value={match.status || "Upcoming"} />

                {match.tossWinner && (
                  <InfoBox
                    label="Toss"
                    value={`${match.tossWinner} ${
                      match.tossChoice ? `chose to ${match.tossChoice}` : ""
                    }`}
                  />
                )}
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
                  Teams are generated using allowed squad/lineup and recent
                  scorecard performance.
                </Typography>

                {tossInfo && (
                  <InfoBox
                    label="Toss Check"
                    value={
                      tossInfo.available
                        ? tossInfo.summary
                        : "Toss not available yet"
                    }
                  />
                )}

                {lineupInfo && (
                  <InfoBox
                    label="Lineup Check"
                    value={
                      lineupInfo.available
                        ? lineupInfo.summary
                        : "Lineup not available yet"
                    }
                  />
                )}

                <Box sx={{ mt: 2, display: "grid", gap: 1.5 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 1,
                    }}
                  >
                    <Button
                      fullWidth
                      onClick={checkToss}
                      variant="contained"
                      sx={{
                        height: 46,
                        bgcolor: tossDone ? "#16a34a" : "#0d6bde",
                        borderRadius: "16px",
                        fontWeight: 900,
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      {checkingToss
                        ? "Checking..."
                        : tossDone
                        ? "Toss Available"
                        : "Check Toss"}
                    </Button>

                    <Button
                      fullWidth
                      onClick={checkLineup}
                      variant="contained"
                      sx={{
                        height: 46,
                        bgcolor: lineupDone ? "#16a34a" : "#0d6bde",
                        borderRadius: "16px",
                        fontWeight: 900,
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      {checkingLineup
                        ? "Checking..."
                        : lineupDone
                        ? "Lineup Available"
                        : "Check Lineup"}
                    </Button>
                  </Box>

                  <Button
                    fullWidth
                    startIcon={<AutoAwesomeRoundedIcon />}
                    onClick={() => generateSuggestion("dream11")}
                    variant="contained"
                    sx={{
                      height: 52,
                      bgcolor:
                        selectedOption === "dream11" ? "#0a58b8" : "#0d6bde",
                      borderRadius: "18px",
                      fontWeight: 950,
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    {hasToss && hasLineup
                      ? "Dream11 Final Teams"
                      : "Dream11 Pre-Toss Teams"}
                  </Button>

                  <Button
                    fullWidth
                    startIcon={
                      canCreateSecondInnings ? (
                        <BoltRoundedIcon />
                      ) : (
                        <LockRoundedIcon />
                      )
                    }
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
                      opacity: canCreateSecondInnings ? 1 : 0.85,
                      "&:hover": {
                        bgcolor:
                          selectedOption === "second-innings"
                            ? "#166534"
                            : "#15803d",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {canCreateSecondInnings
                      ? "Second Innings 5-Player Teams"
                      : "Second Innings Team Locked"}
                  </Button>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    borderRadius: "16px",
                    bgcolor: canCreateSecondInnings ? "#ecfdf5" : "#fff7ed",
                    border: canCreateSecondInnings
                      ? "1px solid #bbf7d0"
                      : "1px solid #fed7aa",
                    p: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: canCreateSecondInnings ? "#166534" : "#9a3412",
                    }}
                  >
                    {canCreateSecondInnings
                      ? `Second innings teams will use selected second innings batting and bowling teams only.`
                      : "Second innings team is locked until toss and lineup are available."}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {lockedMessage && (
              <Card
                sx={{
                  m: 2,
                  borderRadius: "20px",
                  bgcolor: "#fff7ed",
                  border: "1px solid #fed7aa",
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 900, color: "#9a3412" }}
                  >
                    {lockedMessage}
                  </Typography>
                </CardContent>
              </Card>
            )}

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
                  Analyzing recent scorecards and generating teams...
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
        mt: 1.2,
        borderRadius: "16px",
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
        p: 1.5,
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#64748b" }}>
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.4,
          fontSize: 14,
          fontWeight: 850,
          color: "#0f172a",
          lineHeight: 1.5,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function SuggestionResult({ suggestion }: { suggestion: any }) {
  return (
    <Box sx={{ px: 2, display: "grid", gap: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 950, color: "#0f172a" }}>
        {suggestion.matchTitle || "Fantasy Suggestions"}
      </Typography>

      {suggestion.mode && (
        <Chip
          label={suggestion.mode}
          sx={{
            width: "fit-content",
            bgcolor: "#0d6bde",
            color: "#fff",
            fontWeight: 900,
          }}
        />
      )}

      {suggestion.disclaimer && (
        <Box
          sx={{
            borderRadius: "16px",
            bgcolor: "#fff7ed",
            border: "1px solid #fed7aa",
            p: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#9a3412" }}>
            {suggestion.disclaimer}
          </Typography>
        </Box>
      )}

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
              Risk: {team.risk || "Balanced"}
            </Typography>
          </Box>

          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <CaptainBox label="Captain" value={team.captain} />
              <CaptainBox label="Vice Captain" value={team.viceCaptain} />
            </Box>

            <PlayerGroup title="Players" players={team.players || []} />

            <Box
              sx={{
                mt: 2,
                borderRadius: "16px",
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                p: 1.5,
              }}
            >
              <Typography
                sx={{ fontSize: 13, fontWeight: 800, color: "#334155" }}
              >
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

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 13,
          fontWeight: 950,
          color: "#0f172a",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}

function PlayerGroup({ title, players }: { title: string; players?: string[] }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 950, color: "#0f172a" }}>
        {title}
      </Typography>

      <Box sx={{ mt: 0.8, display: "flex", flexWrap: "wrap", gap: 0.8 }}>
        {(players || []).length === 0 ? (
          <Chip label="Not available" size="small" />
        ) : (
          (players || []).map((player, index) => (
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