/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const tournamentId = id as string;

  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTeamName, setSelectedTeamName] = useState("");

  const [teamName, setTeamName] = useState("");
  const [captain, setCaptain] = useState("");

  const [player, setPlayer] = useState<any>({
    _id: "",
    name: "",
    role: "",
    battingStyle: "",
    bowlingStyle: "",
    status: "Bench",
  });

  const loadTeams = async () => {
    const res = await fetch(`/api/teams?tournamentId=${tournamentId}`);
    const data = await res.json();
    setTeams(data.data || []);
  };

  const loadPlayers = async (teamId: string) => {
    const res = await fetch(`/api/players?teamId=${teamId}`);
    const data = await res.json();
    setPlayers(data.data || []);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const addTeam = async (e: any) => {
    e.preventDefault();

    await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tournamentId, teamName, captain }),
    });

    setTeamName("");
    setCaptain("");
    loadTeams();
  };

  const handleSelect = (id: string) => {
    setSelectedTeamId(id);
    const t = teams.find((x) => x._id === id);
    setSelectedTeamName(t?.teamName || "");
    loadPlayers(id);
  };

  const savePlayer = async (e: any) => {
    e.preventDefault();

    const payload = {
      ...player,
      tournamentId,
      teamId: selectedTeamId,
      team: selectedTeamName,
    };

    if (player._id) {
      await fetch(`/api/players/${player._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setPlayer({
      _id: "",
      name: "",
      role: "",
      battingStyle: "",
      bowlingStyle: "",
      status: "Bench",
    });

    loadPlayers(selectedTeamId);
  };

  return (
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-[58px] pb-24 lg:max-w-7xl">
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
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => router.push(`/tournaments/${tournamentId}`)}
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
            Back
          </Button>

          <Button
            startIcon={<HomeRoundedIcon />}
            onClick={() => router.push("/")}
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
            Home
          </Button>
        </Box>

        <Box sx={{ px: 2, pt: 2 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 950, color: "#0f172a" }}>
            Teams & Players
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 14,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            Manage teams and build your tournament squad.
          </Typography>
        </Box>

        <AdCard />

        <Box
          sx={{
            px: 2,
            pt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              lg: "360px 1fr",
            },
          }}
        >
          <Box sx={{ display: "grid", gap: 2 }}>
            <CardBox
              title="Add Team"
              icon={<AddRoundedIcon />}
              color="#16a34a"
            >
              <Box component="form" onSubmit={addTeam} sx={{ display: "grid", gap: 2 }}>
                <TextField
                  label="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label="Captain Name"
                  value={captain}
                  onChange={(e) => setCaptain(e.target.value)}
                  required
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  sx={{
                    height: 46,
                    bgcolor: "#0d6bde",
                    borderRadius: "16px",
                    fontWeight: 900,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
                  }}
                >
                  Add Team
                </Button>
              </Box>
            </CardBox>

            <CardBox
              title="Select Team"
              icon={<GroupsRoundedIcon />}
              color="#0d6bde"
            >
              <TextField
                select
                label="Choose a team"
                value={selectedTeamId}
                onChange={(e) => handleSelect(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Choose a team...</MenuItem>
                {teams.map((t) => (
                  <MenuItem key={t._id} value={t._id}>
                    {t.teamName} {t.captain && `(${t.captain})`}
                  </MenuItem>
                ))}
              </TextField>

              {teams.length === 0 && (
                <Typography
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#64748b",
                  }}
                >
                  No teams yet. Create one above.
                </Typography>
              )}
            </CardBox>
          </Box>

          <Box sx={{ display: "grid", gap: 2 }}>
            {selectedTeamId && (
              <CardBox
                title={`${player._id ? "Edit Player" : "Add Player"} - ${selectedTeamName}`}
                icon={player._id ? <EditRoundedIcon /> : <PersonAddRoundedIcon />}
                color="#7c3aed"
              >
                <Box component="form" onSubmit={savePlayer} sx={{ display: "grid", gap: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      label="Player Name"
                      value={player.name}
                      onChange={(e) =>
                        setPlayer({ ...player, name: e.target.value })
                      }
                      required
                      fullWidth
                    />

                    <TextField
                      select
                      label="Role"
                      value={player.role}
                      onChange={(e) =>
                        setPlayer({ ...player, role: e.target.value })
                      }
                      required
                      fullWidth
                    >
                      <MenuItem value="">Select Role</MenuItem>
                      <MenuItem value="Batsman">Batsman</MenuItem>
                      <MenuItem value="Bowler">Bowler</MenuItem>
                      <MenuItem value="All-rounder">All-rounder</MenuItem>
                      <MenuItem value="Wicket-keeper">Wicket-keeper</MenuItem>
                    </TextField>
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                  >
                    <TextField
                      select
                      label="Batting Style"
                      value={player.battingStyle}
                      onChange={(e) =>
                        setPlayer({ ...player, battingStyle: e.target.value })
                      }
                      fullWidth
                    >
                      <MenuItem value="">Batting Style</MenuItem>
                      <MenuItem value="Right">Right Handed</MenuItem>
                      <MenuItem value="Left">Left Handed</MenuItem>
                    </TextField>

                    <TextField
                      select
                      label="Bowling Style"
                      value={player.bowlingStyle}
                      onChange={(e) =>
                        setPlayer({ ...player, bowlingStyle: e.target.value })
                      }
                      fullWidth
                    >
                      <MenuItem value="">Bowling Style</MenuItem>
                      <MenuItem value="Fast">Fast</MenuItem>
                      <MenuItem value="Spin">Spin</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                    </TextField>
                  </Box>

                  <TextField
                    select
                    label="Status"
                    value={player.status}
                    onChange={(e) =>
                      setPlayer({ ...player, status: e.target.value })
                    }
                    fullWidth
                  >
                    <MenuItem value="Playing">Playing</MenuItem>
                    <MenuItem value="Bench">Bench</MenuItem>
                    <MenuItem value="Injured">Injured</MenuItem>
                  </TextField>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        flex: 1,
                        height: 46,
                        bgcolor: "#16a34a",
                        borderRadius: "16px",
                        fontWeight: 900,
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#15803d", boxShadow: "none" },
                      }}
                    >
                      {player._id ? "Update Player" : "Add Player"}
                    </Button>

                    {player._id && (
                      <Button
                        onClick={() =>
                          setPlayer({
                            _id: "",
                            name: "",
                            role: "",
                            battingStyle: "",
                            bowlingStyle: "",
                            status: "Bench",
                          })
                        }
                        variant="contained"
                        sx={{
                          minWidth: 46,
                          bgcolor: "#64748b",
                          borderRadius: "16px",
                          boxShadow: "none",
                        }}
                      >
                        <CloseRoundedIcon />
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardBox>
            )}

            {selectedTeamId ? (
              <CardBox
                title={`Squad (${players.length})`}
                icon={<GroupsRoundedIcon />}
                color="#f97316"
              >
                {players.length === 0 ? (
                  <Typography
                    sx={{
                      py: 4,
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: 800,
                    }}
                  >
                    No players added yet. Add one above.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.5,
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    }}
                  >
                    {players.map((p) => (
                      <PlayerCard key={p._id} player={p} setPlayer={setPlayer} />
                    ))}
                  </Box>
                )}
              </CardBox>
            ) : (
              <Card
                sx={{
                  borderRadius: "24px",
                  border: "1px solid #cbd5e1",
                  p: 5,
                  textAlign: "center",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
                }}
              >
                <GroupsRoundedIcon sx={{ fontSize: 64, color: "#94a3b8" }} />

                <Typography sx={{ mt: 2, fontSize: 22, fontWeight: 950 }}>
                  Select a Team
                </Typography>

                <Typography sx={{ mt: 1, color: "#64748b", fontWeight: 600 }}>
                  Choose a team from the left panel to manage players.
                </Typography>
              </Card>
            )}
          </Box>
        </Box>

        <AdCard />
      </main>

      <Footer />
    </div>
  );
}

function CardBox({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{
          bgcolor: color,
          color: "#fff",
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon}

        <Typography sx={{ fontSize: 18, fontWeight: 950 }}>{title}</Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>{children}</CardContent>
    </Card>
  );
}

function PlayerCard({ player, setPlayer }: any) {
  const statusColor =
    player.status === "Playing"
      ? "#16a34a"
      : player.status === "Bench"
      ? "#f59e0b"
      : "#dc2626";

  return (
    <Card
      onClick={() => setPlayer(player)}
      sx={{
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        cursor: "pointer",
        transition: "0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 22px rgba(13,107,222,0.14)",
        },
      }}
    >
      <CardContent sx={{ p: 1.8, "&:last-child": { pb: 1.8 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
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
              {player.name}
            </Typography>

            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.7 }}>
              <Chip
                label={player.role || "Player"}
                size="small"
                sx={{
                  bgcolor: "#eff6ff",
                  color: "#0d6bde",
                  fontWeight: 900,
                }}
              />

              <Chip
                label={player.status}
                size="small"
                sx={{
                  bgcolor: `${statusColor}22`,
                  color: statusColor,
                  fontWeight: 900,
                }}
              />
            </Box>

            {(player.battingStyle || player.bowlingStyle) && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: 12,
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                {player.battingStyle && `Batting: ${player.battingStyle}`}
                {player.battingStyle && player.bowlingStyle && " • "}
                {player.bowlingStyle && `Bowling: ${player.bowlingStyle}`}
              </Typography>
            )}
          </Box>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              setPlayer(player);
            }}
            variant="contained"
            sx={{
              minWidth: 36,
              width: 36,
              height: 36,
              borderRadius: "12px",
              bgcolor: "#f97316",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#ea580c",
                boxShadow: "none",
              },
            }}
          >
            <EditRoundedIcon sx={{ fontSize: 18 }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}