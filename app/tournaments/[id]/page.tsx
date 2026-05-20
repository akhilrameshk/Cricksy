/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

    const teamA = teams.find(
      (t) =>
        t.teamName?.trim().toLowerCase() === match.teamA?.trim().toLowerCase()
    );

    const teamB = teams.find(
      (t) =>
        t.teamName?.trim().toLowerCase() === match.teamB?.trim().toLowerCase()
    );

    if (!teamA || !teamB) {
      alert("Team not found. Please check team names are matching.");
      return;
    }

    const [resA, resB] = await Promise.all([
      fetch(`/api/players?teamId=${teamA._id}`),
      fetch(`/api/players?teamId=${teamB._id}`),
    ]);

    const dataA = await resA.json();
    const dataB = await resB.json();

    setTeamAPlayers(dataA.data || []);
    setTeamBPlayers(dataB.data || []);

    setTeamAPlayingXI((match.teamAPlayingXI || []).map(getPlayerId));
    setTeamBPlayingXI((match.teamBPlayingXI || []).map(getPlayerId));
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
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-[58px] pb-24 lg:max-w-6xl">
        <Box sx={{ px: 2, pt: 2, display: "flex", justifyContent: "space-between", gap: 1 }}>
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
            Add
          </Button>
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
                />

                {(index + 1) % 4 === 0 && <AdCard />}
              </Box>
            ))}
          </Box>
        )}

        {matches.length > 0 && <AdCard />}
      </main>

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
        bgcolor: "#f8fafc",
      },
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
    </div>
  );
}

function MatchCard({ match, tournamentId, openLineupModal }: any) {
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
        <Box
          sx={{
            borderRadius: "18px",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            p: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <LocationOnRoundedIcon sx={{ fontSize: 17, color: "#64748b" }} />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
              {match.venue || "Venue not added"}
            </Typography>
          </Box>

          <Typography sx={{ mt: 1.5, fontSize: 32, fontWeight: 950, color: "#0d6bde", textAlign: "center" }}>
            {match.score || "0/0"}
          </Typography>

          <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 800, color: match.result ? "#16a34a" : "#64748b", textAlign: "center" }}>
            {match.result || "Match not completed"}
          </Typography>
        </Box>

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
            component={Link}
            href={`/tournaments/${tournamentId}/matches/${match._id}/score`}
            variant="contained"
            sx={{
              bgcolor: "#f97316",
              borderRadius: "14px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
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
  return (
    <Card sx={{ borderRadius: "20px", border: "1px solid #cbd5e1" }}>
      <Box sx={{ bgcolor: "#f8fafc", p: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Typography sx={{ fontSize: 18, fontWeight: 950 }}>{title}</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>
          Selected: {selected.length}/11
        </Typography>
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        {players.length === 0 ? (
          <Typography sx={{ p: 2, color: "#64748b", fontWeight: 800 }}>
            No players found
          </Typography>
        ) : (
          players.map((player: any) => {
            const checked = selected.includes(player._id);

            return (
              <Box
                key={player._id}
                onClick={() => togglePlayer(player._id, selected, setSelected)}
                sx={{
                  mb: 1,
                  p: 1.25,
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: viewOnlyLineup ? "default" : "pointer",
                  bgcolor: checked ? "#eff6ff" : "#fff",
                  border: checked ? "1px solid #0d6bde" : "1px solid #e2e8f0",
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 900 }}>
                    {player.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>
                    {player.role || "-"}
                  </Typography>
                </Box>

                <Checkbox checked={checked} disabled={viewOnlyLineup} />
              </Box>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}