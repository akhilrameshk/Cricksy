/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AdCard from "../components/AdCard";

export default function TournamentsPage() {
  const router = useRouter();
  const muiTheme = useTheme();

  const [data, setData] = useState<any[]>([]);
  const [statsOpen, setStatsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"batting" | "bowling">("batting");
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [stats, setStats] = useState<any>({ batsmen: [], bowlers: [] });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((res) => setData(res.data || []));
  }, []);

  const openStatsModal = async (tournament: any) => {
    setSelectedTournament(tournament);
    setStatsOpen(true);
    setActiveTab("batting");
    setLoadingStats(true);

    const res = await fetch(`/api/tournaments/${tournament._id}/stats`);
    const json = await res.json();

    if (json.success) {
      setStats(json.data);
    } else {
      alert(json.message || "Failed to load stats");
    }

    setLoadingStats(false);
  };

  const closeStatsModal = () => {
    setStatsOpen(false);
    setSelectedTournament(null);
    setStats({ batsmen: [], bowlers: [] });
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary }}>
      <Header />

      <Box component="main" sx={{ mx: "auto", maxWidth: { xs: "448px", lg: "1280px" }, pt: 7, pb: 24 }}>
        <Box
          sx={{
            px: 2,
            pt: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
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
            component={Link}
            href="/tournaments/add"
            startIcon={<AddRoundedIcon />}
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
            Add
          </Button>
        </Box>

        <Box sx={{ px: 2, pt: 2 }}>
          <Typography sx={{ fontSize: 32, fontWeight: 950, color: "#0f172a" }}>
            Tournaments
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            Manage tournaments, teams, matches and player stats.
          </Typography>
        </Box>

        <AdCard />

        {data.length === 0 ? (
          <Card
            sx={{
              m: 2,
              p: 5,
              borderRadius: "28px",
              textAlign: "center",
              border: "1px solid #cbd5e1",
            }}
          >
            <EmojiEventsRoundedIcon sx={{ fontSize: 60, color: "#94a3b8" }} />

            <Typography sx={{ mt: 2, fontSize: 24, fontWeight: 950 }}>
              No tournaments found
            </Typography>

            <Typography sx={{ mt: 1, fontSize: 14, color: "#64748b" }}>
              Create your first tournament to get started.
            </Typography>

            <Button
              component={Link}
              href="/tournaments/add"
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#0d6bde",
                borderRadius: "999px",
                fontWeight: 900,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
              }}
            >
              Add Tournament
            </Button>
          </Card>
        ) : (
          <Box
            sx={{
              px: 2,
              pt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "1fr 1fr 1fr",
                xl: "1fr 1fr 1fr 1fr",
              },
            }}
          >
            {data.map((t: any, index: number) => (
              <Box key={t._id}>
                <Card
                  sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
                    bgcolor: "#fff",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#0d6bde",
                      color: "#fff",
                      p: 2,
                      textAlign: "center",
                    }}
                  >
                    <EmojiEventsRoundedIcon sx={{ fontSize: 34 }} />

                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: 22,
                        fontWeight: 950,
                        lineHeight: 1.2,
                        minHeight: 54,
                      }}
                    >
                      {t.name}
                    </Typography>

                    <Box
                      sx={{
                        mt: 1.5,
                        display: "inline-flex",
                        borderRadius: "999px",
                        bgcolor: "rgba(255,255,255,0.18)",
                        px: 1.5,
                        py: 0.5,
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      {t.format || "T20"}
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "#f8fafc",
                        borderRadius: "14px",
                        p: 1.3,
                      }}
                    >
                      <LocationOnRoundedIcon
                        sx={{ fontSize: 18, color: "#64748b" }}
                      />

                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#334155",
                        }}
                      >
                        {t.venue || "Venue not added"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt: 1.5,
                        borderRadius: "14px",
                        bgcolor: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        p: 1.4,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#0d6bde",
                        }}
                      >
                        Tournament Duration
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#334155",
                        }}
                      >
                        {t.startDate
                          ? new Date(t.startDate).toLocaleDateString()
                          : "TBD"}{" "}
                        →{" "}
                        {t.endDate
                          ? new Date(t.endDate).toLocaleDateString()
                          : "TBD"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt: 2,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 1,
                      }}
                    >
                      <Button
                        onClick={() => router.push(`/tournaments/${t._id}/teams`)}
                        variant="contained"
                        startIcon={<GroupsRoundedIcon />}
                        sx={{
                          bgcolor: "#16a34a",
                          borderRadius: "14px",
                          fontSize: 11,
                          fontWeight: 900,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#15803d", boxShadow: "none" },
                        }}
                      >
                        Teams
                      </Button>

                      <Button
                        onClick={() => router.push(`/tournaments/${t._id}`)}
                        variant="contained"
                        startIcon={<SportsCricketRoundedIcon />}
                        sx={{
                          bgcolor: "#f97316",
                          borderRadius: "14px",
                          fontSize: 11,
                          fontWeight: 900,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#ea580c", boxShadow: "none" },
                        }}
                      >
                        Match
                      </Button>

                      <Button
                        onClick={() => openStatsModal(t)}
                        variant="contained"
                        startIcon={<BarChartRoundedIcon />}
                        sx={{
                          bgcolor: "#7c3aed",
                          borderRadius: "14px",
                          fontSize: 11,
                          fontWeight: 900,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#6d28d9", boxShadow: "none" },
                        }}
                      >
                        Stats
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                {(index + 1) % 4 === 0 && <AdCard />}
              </Box>
            ))}
          </Box>
        )}

        <AdCard />
      </Box>

      <Dialog
        open={statsOpen}
        onClose={closeStatsModal}
        fullWidth
        maxWidth="lg"
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
            bgcolor: "#0d6bde",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 950 }}>
              Tournament Stats
            </Typography>

            <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
              {selectedTournament?.name}
            </Typography>
          </Box>

          <IconButton onClick={closeStatsModal} sx={{ color: "#fff" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button
              onClick={() => setActiveTab("batting")}
              variant={activeTab === "batting" ? "contained" : "outlined"}
              sx={{
                borderRadius: "999px",
                fontWeight: 900,
                textTransform: "none",
              }}
            >
              Batting
            </Button>

            <Button
              onClick={() => setActiveTab("bowling")}
              variant={activeTab === "bowling" ? "contained" : "outlined"}
              sx={{
                borderRadius: "999px",
                fontWeight: 900,
                textTransform: "none",
              }}
            >
              Bowling
            </Button>
          </Box>

          {loadingStats ? (
            <Card sx={{ borderRadius: "20px", p: 5, textAlign: "center" }}>
              <Typography sx={{ fontWeight: 900 }}>Loading stats...</Typography>
            </Card>
          ) : (
            <StatsTable activeTab={activeTab} stats={stats} />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
}

function StatsTable({ activeTab, stats }: any) {
  return (
    <Card
      sx={{
        borderRadius: "22px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
      }}
    >
      <Box
        sx={{
          bgcolor: activeTab === "batting" ? "#16a34a" : "#7c3aed",
          color: "#fff",
          px: 2,
          py: 1.5,
        }}
      >
        <Typography sx={{ fontWeight: 950 }}>
          {activeTab === "batting" ? "Top Batsmen" : "Top Bowlers"}
        </Typography>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <table className="w-full min-w-[850px] text-sm">
          <thead className="bg-slate-100 text-slate-700">
            {activeTab === "batting" ? (
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Player</th>
                <th className="px-3 py-3 text-left">Team</th>
                <th className="px-3 py-3 text-center">M</th>
                <th className="px-3 py-3 text-center">Runs</th>
                <th className="px-3 py-3 text-center">Avg</th>
                <th className="px-3 py-3 text-center">SR</th>
              </tr>
            ) : (
              <tr>
                <th className="px-3 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Player</th>
                <th className="px-3 py-3 text-left">Team</th>
                <th className="px-3 py-3 text-center">M</th>
                <th className="px-3 py-3 text-center">Overs</th>
                <th className="px-3 py-3 text-center">W</th>
                <th className="px-3 py-3 text-center">Eco</th>
                <th className="px-3 py-3 text-center">SR</th>
              </tr>
            )}
          </thead>

          <tbody>
            {(activeTab === "batting" ? stats.batsmen : stats.bowlers)
              .length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center font-bold">
                  No stats found
                </td>
              </tr>
            ) : activeTab === "batting" ? (
              stats.batsmen.map((p: any, index: number) => (
                <tr key={`${p.team}-${p.name}`} className="border-b border-slate-200">
                  <td className="px-3 py-3 font-black">{index + 1}</td>
                  <td className="px-3 py-3 font-black text-[#0d6bde]">{p.name}</td>
                  <td className="px-3 py-3">{p.team}</td>
                  <td className="px-3 py-3 text-center">{p.matches}</td>
                  <td className="px-3 py-3 text-center font-black">{p.totalRuns}</td>
                  <td className="px-3 py-3 text-center">{p.average}</td>
                  <td className="px-3 py-3 text-center">{p.strikeRate}</td>
                </tr>
              ))
            ) : (
              stats.bowlers.map((p: any, index: number) => (
                <tr
                  key={`${p.team}-${p.name}-${index}`}
                  className="border-b border-slate-200"
                >
                  <td className="px-3 py-3 font-black">{index + 1}</td>
                  <td className="px-3 py-3 font-black text-[#0d6bde]">{p.name}</td>
                  <td className="px-3 py-3">{p.team}</td>
                  <td className="px-3 py-3 text-center">{p.matches}</td>
                  <td className="px-3 py-3 text-center">{p.overs}</td>
                  <td className="px-3 py-3 text-center font-black">{p.wickets}</td>
                  <td className="px-3 py-3 text-center">{p.economy}</td>
                  <td className="px-3 py-3 text-center">{p.strikeRate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}