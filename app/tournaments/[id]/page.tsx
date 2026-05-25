/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useAdmin } from "../../hooks/useAdmin";

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SportsCricketRoundedIcon from "@mui/icons-material/SportsCricketRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

const getStatusColor = (status: string) => {
  if (status === "Live") return "#dc2626";
  if (status === "Completed") return "#16a34a";
  return "#f59e0b";
};

export default function TournamentDetailsPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const muiTheme = useTheme();
  const { isAdmin, loading } = useAdmin();

  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const [lineupModal, setLineupModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [viewOnlyLineup, setViewOnlyLineup] = useState(false);

  const [teamAPlayers, setTeamAPlayers] = useState<any[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<any[]>([]);

  const [teamAPlayingXI, setTeamAPlayingXI] = useState<string[]>([]);
  const [teamBPlayingXI, setTeamBPlayingXI] = useState<string[]>([]);

  const loadMatches = async () => {
    const res = await fetch(`/api/matches?tournamentId=${tournamentId}`);
    const data = await res.json();
    setMatches(data.data || []);
  };
const router = useRouter();
const handleScoreClick = async (match: any) => {
  try {
    const res = await fetch(`/api/matches/${match._id}`);

    let data = null;

    try {
      data = await res.json();
    } catch {
      data = null;
    }

    const fullMatch = data?.data || match;

    if (!fullMatch.lineupUpdated) {
      alert("Please update playing 11 before scoring");
      openLineupModal(match, false);
      return;
    }else{
      
       openLineupModal(match, false);
           router.push(
      `/tournaments/${tournamentId}/matches/${match._id}/score`
    );
    }


  } catch (error) {
    console.error(error);
    alert("Failed to load match");
  }
};
  const loadTeams = async () => {
    const res = await fetch(`/api/teams?tournamentId=${tournamentId}`);
    const data = await res.json();
    setTeams(data.data || []);
  };

  useEffect(() => {
    if (tournamentId) {
      loadMatches();
      loadTeams();
    }
  }, [tournamentId]);

  const getPlayerId = (value: any) => {
    if (typeof value === "string") return value;
    if (value?._id) return String(value._id);
    return String(value);
  };

  const openLineupModal = async (match: any, viewOnly = false) => {
    setSelectedMatch(match);
    setViewOnlyLineup(viewOnly);
    setLineupModal(true);
    await loadMatchPlayers(match);

  };
const loadMatchPlayers = async (match: any) => {
  try {
    const teamA = teams.find(
      (t) =>
        t.teamName?.trim().toLowerCase() ===
        match.teamA?.trim().toLowerCase()
    );

    const teamB = teams.find(
      (t) =>
        t.teamName?.trim().toLowerCase() ===
        match.teamB?.trim().toLowerCase()
    );

    if (!teamA || !teamB) {
      alert("Team not found. Please check team names are matching.");
      return null;
    }

    const [resA, resB] = await Promise.all([
      fetch(`/api/players?teamId=${teamA._id}`),
      fetch(`/api/players?teamId=${teamB._id}`),
    ]);

    let dataA = null;
    let dataB = null;

    try {
      dataA = await resA.json();
    } catch {
      dataA = { data: [] };
    }

    try {
      dataB = await resB.json();
    } catch {
      dataB = { data: [] };
    }

    const teamAData = dataA?.data || [];
    const teamBData = dataB?.data || [];

    setTeamAPlayers(teamAData);
    setTeamBPlayers(teamBData);

    setTeamAPlayingXI(
      (match.teamAPlayingXI || []).map(getPlayerId)
    );

    setTeamBPlayingXI(
      (match.teamBPlayingXI || []).map(getPlayerId)
    );

    return {
      teamA,
      teamB,
      teamAPlayers: teamAData,
      teamBPlayers: teamBData,
    };
  } catch (error) {
    console.error(error);
    alert("Failed to load players");
    return null;
  }
};
  const closeLineupModal = () => {
    setLineupModal(false);
    setSelectedMatch(null);
    setViewOnlyLineup(false);
    setTeamAPlayers([]);
    setTeamBPlayers([]);
    setTeamAPlayingXI([]);
    setTeamBPlayingXI([]);
  };

  const togglePlayer = (
    playerId: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (viewOnlyLineup) return;

    if (selected.includes(playerId)) {
      setSelected(selected.filter((id) => id !== playerId));
      return;
    }

    if (selected.length >= 11) {
      alert("Only 11 players allowed from each team");
      return;
    }

    setSelected([...selected, playerId]);
  };

  const saveLineup = async () => {
    if (!selectedMatch) return;

    if (selectedMatch.lineupUpdated) {
      alert("Lineup already updated. You cannot update it again.");
      return;
    }

    if (teamAPlayingXI.length !== 11 || teamBPlayingXI.length !== 11) {
      alert("Please select exactly 11 players from each team");
      return;
    }

    const res = await fetch(`/api/matches/${selectedMatch._id}/lineup`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamAPlayingXI, teamBPlayingXI }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Lineup updated successfully");
      closeLineupModal();
      loadMatches();
    } else {
      alert(data.message || "Failed to update lineup");
    }
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary }}>
      <Header />

      <Box component="main" sx={{ mx: "auto", maxWidth: { xs: "448px", lg: "1280px" }, pt: 7, pb: 24 }}>
        <Box sx={{ px: 2, pt: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<HomeRoundedIcon />}
            variant="contained"
            sx={{
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
            }}
          >
            Home
          </Button>

          {isAdmin && !loading && (
            <Button
              component={Link}
              href={`/tournaments/${tournamentId}/matches/add`}
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
              Add Match
            </Button>
          )}
        </Box>

        <Box sx={{ px: 2, pt: 2 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 950, color: "#0f172a" }}>
            Match List
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: 14, fontWeight: 600, color: "#64748b" }}>
            View matches, update lineup, add score and manage match status.
          </Typography>
        </Box>

        <AdCard />

        {matches.length === 0 ? (
          <Card sx={{ m: 2, p: 4, borderRadius: "28px", textAlign: "center" }}>
            <SportsCricketRoundedIcon sx={{ fontSize: 56, color: "#94a3b8" }} />
            <Typography sx={{ mt: 2, fontSize: 22, fontWeight: 950 }}>
              No matches added yet
            </Typography>
            <Button
              component={Link}
              href={`/tournaments/${tournamentId}/matches/add`}
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#0d6bde",
                borderRadius: "999px",
                fontWeight: 900,
                textTransform: "none",
              }}
            >
              Add Match
            </Button>
          </Card>
        ) : (
          <Box
            sx={{
              px: 2,
              pt: 2,
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" },
            }}
          >
            {matches.map((m, index) => (
              <Box key={m._id}>
              <MatchCard
  match={m}
  tournamentId={tournamentId}
  openLineupModal={openLineupModal}
  handleScoreClick={handleScoreClick}
/>

                {(index + 1) % 4 === 0 && <AdCard />}
              </Box>
            ))}
          </Box>
        )}

        {matches.length > 0 && <AdCard />}
      </Box>

      <Footer />

<Dialog
  open={lineupModal}
  onClose={closeLineupModal}
  fullWidth
  maxWidth="md"
  slotProps={{
    paper: {
      sx: {
        borderRadius: "24px",
        bgcolor:
          muiTheme.palette.mode === "dark"
            ? "#020617"
            : "#f8fafc",
        color:
          muiTheme.palette.mode === "dark"
            ? "#ffffff"
            : "#0f172a",
        border:
          muiTheme.palette.mode === "dark"
            ? "1px solid #1e293b"
            : "1px solid #e2e8f0",
      },
    },
  }}
>
        <DialogTitle
         sx={{
    p: 2,
    bgcolor:
      muiTheme.palette.mode === "dark"
        ? "#020617"
        : "#f8fafc",
         color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
  }}
         
        >
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 950 }}>
              {viewOnlyLineup ? "Selected Playing 11" : "Update Playing 11"}
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.9 }}>
              {selectedMatch?.teamA} vs {selectedMatch?.teamB}
            </Typography>
          </Box>

          <IconButton onClick={closeLineupModal} sx={{ color: "#fff" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <PlayersBox
              title={selectedMatch?.teamA}
              players={teamAPlayers}
              selected={teamAPlayingXI}
              setSelected={setTeamAPlayingXI}
              togglePlayer={togglePlayer}
              viewOnlyLineup={viewOnlyLineup}
            />

            <PlayersBox
              title={selectedMatch?.teamB}
              players={teamBPlayers}
              selected={teamBPlayingXI}
              setSelected={setTeamBPlayingXI}
              togglePlayer={togglePlayer}
              viewOnlyLineup={viewOnlyLineup}
            />
          </Box>

          {!viewOnlyLineup && (
            <Button
              fullWidth
              onClick={saveLineup}
              disabled={teamAPlayingXI.length !== 11 || teamBPlayingXI.length !== 11}
              variant="contained"
              sx={{
                mt: 2,
                height: 48,
                borderRadius: "16px",
                bgcolor: "#0d6bde",
                fontWeight: 900,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
              }}
            >
              Save Playing 11
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
function TeamScoreRow({
  team,
  score,
  overs,
  active,
}: {
  team: string;
  score: string;
  overs: string;
  active?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 1,
        borderRadius: "14px",
        bgcolor: active ? "#eff6ff" : "#ffffff",
        border: active ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
        px: 1.3,
        py: 1.1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 950,
            color: "#0f172a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {team}
        </Typography>

        <Typography sx={{ mt: 0.3, fontSize: 11, fontWeight: 800, color: "#64748b" }}>
          {overs} Ov
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 950,
          color: active ? "#0d6bde" : "#334155",
          whiteSpace: "nowrap",
        }}
      >
        {score}
      </Typography>
    </Box>
  );
}
function MatchCard({ match, openLineupModal, handleScoreClick }: any) {
  const statusColor = getStatusColor(match.status);

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
      <Box sx={{ bgcolor: "#0d6bde", color: "#fff", p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Chip
            label={match.status || "Upcoming"}
            size="small"
            sx={{ bgcolor: statusColor, color: "#fff", fontWeight: 900 }}
          />
          <Chip
            label={`${match.overs || "0.0"} overs`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 900 }}
          />
        </Box>

        <Typography sx={{ mt: 2, fontSize: 21, fontWeight: 950, textAlign: "center" }}>
          {match.teamA} vs {match.teamB}
        </Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>
       <TeamScoreRow
  team={match.teamA}
  score={match.teamAScore || "0/0"}
  overs={match.teamAOvers || "0.0"}
  active={match.battingTeam === "A"}
/>
       <TeamScoreRow
  team={match.teamB}
  score={match.teamBScore || "0/0"}
  overs={match.teamBOvers || "0.0"}
  active={match.battingTeam === "B"}
/>

        {match?.status === "Completed" && (
  <Box
    sx={{
      mt: 2,
      borderRadius: "16px",
      bgcolor: match.result ? "#dcfce7" : "#f8fafc",
      border: `1px solid ${
        match.result ? "#86efac" : "#e2e8f0"
      }`,
      px: 1.5,
      py: 1.25,
      textAlign: "center",
    }}
  >
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: match.result ? "#166534" : "#64748b",
      }}
    >
      Result
    </Typography>

    <Typography
      sx={{
        mt: 0.7,
        fontSize: 14,
        fontWeight: 900,
        lineHeight: 1.5,
        color: match.result ? "#166534" : "#0f172a",
      }}
    >
      {match.result || "Match not completed"}
    </Typography>
  </Box>
)}

        <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <Button
            onClick={() => openLineupModal(match, Boolean(match.lineupUpdated))}
            variant="contained"
            sx={{
              bgcolor: match.lineupUpdated ? "#0d6bde" : "#16a34a",
              borderRadius: "14px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {match.lineupUpdated ? "Lineup" : "Update XI"}
          </Button>

          <Button
  onClick={() => handleScoreClick(match)}
  variant="contained"
  sx={{
    bgcolor: "#f97316",
    borderRadius: "14px",
    fontWeight: 900,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": {
      bgcolor: "#ea580c",
      boxShadow: "none",
    },
  }}
>
  Score
</Button>
        </Box>

        <Box sx={{ mt: 1.5, textAlign: "center" }}>
          <Chip
            icon={<GroupsRoundedIcon />}
            label={match.lineupUpdated ? "Lineup updated" : "Lineup pending"}
            size="small"
            sx={{
              bgcolor: match.lineupUpdated ? "#dcfce7" : "#fffbeb",
              color: match.lineupUpdated ? "#166534" : "#92400e",
              fontWeight: 800,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

function PlayersBox({
  title,
  players,
  selected,
  setSelected,
  togglePlayer,
  viewOnlyLineup,
}: any) {
  const muiTheme = useTheme();

  const isDark = muiTheme.palette.mode === "dark";

  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: isDark
          ? "1px solid #334155"
          : "1px solid #cbd5e1",
        bgcolor: isDark ? "#0f172a" : "#ffffff",
        color: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      <Box
        sx={{
          bgcolor: isDark ? "#111827" : "#f8fafc",
          p: 2,
          borderBottom: isDark
            ? "1px solid #334155"
            : "1px solid #e2e8f0",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 950 }}>
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 800,
            color: isDark ? "#94a3b8" : "#64748b",
          }}
        >
          Selected: {selected.length}/11
        </Typography>
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        {players.length === 0 ? (
          <Typography
            sx={{
              p: 2,
              color: isDark ? "#94a3b8" : "#64748b",
              fontWeight: 800,
            }}
          >
            No players found
          </Typography>
        ) : (
          players.map((player: any) => {
            const checked = selected.includes(player._id);

            return (
              <Box
                key={player._id}
                onClick={() =>
                  togglePlayer(player._id, selected, setSelected)
                }
                sx={{
                  mb: 1,
                  p: 1.25,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: viewOnlyLineup ? "default" : "pointer",
                  bgcolor: checked
                    ? isDark
                      ? "rgba(13,107,222,0.18)"
                      : "#eff6ff"
                    : isDark
                    ? "#111827"
                    : "#ffffff",
                  border: checked
                    ? "1px solid #0d6bde"
                    : isDark
                    ? "1px solid #334155"
                    : "1px solid #e2e8f0",
                  transition: "0.2s",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  >
                    {player.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: isDark ? "#94a3b8" : "#64748b",
                    }}
                  >
                    {player.role || "-"}
                  </Typography>
                </Box>

                <Checkbox
                  checked={checked}
                  disabled={viewOnlyLineup}
                />
              </Box>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}