"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Chip = ({ label, type = "default" }: any) => {
  const styles: any = {
    default: "bg-white/5 text-white border-white/10",
    live: "bg-red-500/15 text-white border-red-400/20",
    upcoming: "bg-amber-500/15 text-white border-amber-400/20",
    completed: "bg-emerald-500/15 text-white border-emerald-400/20",
    over: "bg-sky-500/15 text-white border-sky-400/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
        styles[type] || styles.default
      }`}
    >
      {label}
    </span>
  );
};

const getStatusType = (status: string) => {
  if (status === "Live") return "live";
  if (status === "Completed") return "completed";
  return "upcoming";
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
    console.log("Teams response:", res);
    const data = await res.json();
    console.log("Teams data:", data?.data);
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
console.log(match,"Selected match for lineup:");
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

  const renderPlayerRow = (
    player: any,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const checked = selected.includes(player._id);

    return (
      <div
        key={player._id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          borderBottom: "1px solid #1e293b",
          background: checked ? "#064e3b" : "transparent",
          borderRadius: 8,
          marginBottom: 6,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: "white" }}>{player.name}</div>
          <div style={{ fontSize: 12, color: "white" }}>
            {player.role || "-"}
          </div>
        </div>

        <input
          type="checkbox"
          disabled={viewOnlyLineup}
          checked={checked}
          onChange={() => togglePlayer(player._id, selected, setSelected)}
        />
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/tournaments"
                className="text-sm font-bold text-orange-400 no-underline hover:text-orange-300"
              >
                ← Back to Tournaments
              </Link>

              <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
                Match List
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white sm:text-base">
                View matches, update lineup, add score and manage match status.
              </p>
            </div>

            <Link
              href={`/tournaments/${tournamentId}/matches/add`}
              className="rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white no-underline hover:bg-orange-600"
            >
              + Add Match
            </Link>
          </div>

          {matches.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
              <h2 className="text-2xl font-bold text-white">
                No matches added yet
              </h2>

              <Link
                href={`/tournaments/${tournamentId}/matches/add`}
                className="mt-5 inline-block rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white no-underline hover:bg-orange-600"
              >
                + Add Match
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((m) => (
                <div
                  key={m._id}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <Chip
                      label={m.status || "Upcoming"}
                      type={getStatusType(m.status)}
                    />
                    <Chip label={`${m.overs || "0.0"} overs`} type="over" />
                  </div>

                  <h2 className="text-center text-[24px] font-bold text-white">
                    {m.teamA} vs {m.teamB}
                  </h2>

                  <p className="mt-3 text-center text-sm text-white">
                    📍 {m.venue || "Venue not added"}
                  </p>

                  <div className="mt-5 rounded-xl bg-slate-950 p-4 text-center">
                    <p className="text-xs font-bold uppercase text-white">
                      Current Score
                    </p>

                    <p className="mt-2 text-4xl font-black text-orange-400">
                      {m.score || "0/0"}
                    </p>
                  </div>

                  <p className="mt-4 text-center text-sm text-white">
                    {m.result || "Match not completed"}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openLineupModal(m, Boolean(m.lineupUpdated))
                      }
                      className={`rounded-md px-3 py-2 text-sm font-semibold text-white ${
                        m.lineupUpdated
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {m.lineupUpdated ? "View Lineup" : "Update Lineup"}
                    </button>

                    <Link
                      href={`/tournaments/${tournamentId}/matches/${m._id}/score`}
                      className="rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white no-underline hover:bg-orange-600"
                    >
                      Add Score →
                    </Link>
                    
                  </div>

                  <div className="mt-3 text-center text-xs text-white">
                    {m.lineupUpdated ? "Lineup updated ✅" : "Lineup pending"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lineupModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            color: "white",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              borderRadius: 16,
              padding: 20,
              width: "100%",
              maxWidth: 1100,
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                gap: 10,
              }}
            >
              <div>
                <h2 style={{ fontSize: 24, fontWeight: "bold" }}>
                  {viewOnlyLineup ? "Selected Playing 11" : "Update Playing 11"}
                </h2>
                <p style={{ fontSize: 14 }}>
                  {selectedMatch?.teamA} vs {selectedMatch?.teamB}
                </p>
              </div>

              <button
                type="button"
                onClick={closeLineupModal}
                style={{
                  background: "red",
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Close
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              <div
                style={{
                  background: "#020617",
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: "bold" }}>
                  {selectedMatch?.teamA}
                </h3>

                <p style={{ fontSize: 12, marginBottom: 10 }}>
                  Selected: {teamAPlayingXI.length}/11
                </p>

                {teamAPlayers.length === 0 ? (
                  <p>No players found</p>
                ) : (
                  teamAPlayers.map((player) =>
                    renderPlayerRow(player, teamAPlayingXI, setTeamAPlayingXI)
                  )
                )}
              </div>

              <div
                style={{
                  background: "#020617",
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: "bold" }}>
                  {selectedMatch?.teamB}
                </h3>

                <p style={{ fontSize: 12, marginBottom: 10 }}>
                  Selected: {teamBPlayingXI.length}/11
                </p>

                {teamBPlayers.length === 0 ? (
                  <p>No players found</p>
                ) : (
                  teamBPlayers.map((player) =>
                    renderPlayerRow(player, teamBPlayingXI, setTeamBPlayingXI)
                  )
                )}
              </div>
            </div>

            {!viewOnlyLineup && (
              <button
                type="button"
                onClick={saveLineup}
                disabled={
                  teamAPlayingXI.length !== 11 || teamBPlayingXI.length !== 11
                }
                style={{
                  marginTop: 20,
                  width: "100%",
                  background:
                    teamAPlayingXI.length === 11 && teamBPlayingXI.length === 11
                      ? "#f97316"
                      : "#64748b",
                  padding: 12,
                  borderRadius: 10,
                  fontWeight: "bold",
                  color: "white",
                  cursor:
                    teamAPlayingXI.length === 11 && teamBPlayingXI.length === 11
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Save Playing 11
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}