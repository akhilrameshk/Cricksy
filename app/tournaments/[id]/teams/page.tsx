/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

  // LOAD TEAMS
  const loadTeams = async () => {
    const res = await fetch(`/api/teams?tournamentId=${tournamentId}`);
    const data = await res.json();
    setTeams(data.data);
  };

  // LOAD PLAYERS
  const loadPlayers = async (teamId: string) => {
    const res = await fetch(`/api/players?teamId=${teamId}`);
    const data = await res.json();
    setPlayers(data.data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // ADD TEAM
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

  // SELECT TEAM
  const handleSelect = (id: string) => {
    setSelectedTeamId(id);
    const t = teams.find((x) => x._id === id);
    setSelectedTeamName(t?.teamName);
    loadPlayers(id);
  };

  // SAVE PLAYER
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push(`/tournaments/${tournamentId}`)}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 font-semibold text-gray-300 transition hover:bg-slate-700 hover:text-white cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Teams & Players
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Manage teams and build your squad
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Teams Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Team Form */}
            <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">
                <i className="fa-solid fa-plus mr-2 text-orange-400"></i>
                Add Team
              </h2>

              <form onSubmit={addTeam} className="space-y-4">
                <input
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="input"
                  required
                />
                <input
                  placeholder="Captain Name"
                  value={captain}
                  onChange={(e) => setCaptain(e.target.value)}
                  className="input"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:shadow-orange-500/50 hover:shadow-xl cursor-pointer"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  Add Team
                </button>
              </form>
            </div>

            {/* Select Team */}
            <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">
                <i className="fa-solid fa-people-group mr-2 text-emerald-400"></i>
                Select Team
              </h2>

              <select
                onChange={(e) => handleSelect(e.target.value)}
                value={selectedTeamId}
                className="input"
              >
                <option value="">Choose a team...</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.teamName} {t.captain && `(${t.captain})`}
                  </option>
                ))}
              </select>

              {teams.length === 0 && (
                <p className="mt-4 text-center text-gray-400">No teams yet. Create one above!</p>
              )}
            </div>
          </div>

          {/* Players Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add/Edit Player Form - Always show when team selected */}
            {selectedTeamId && (
              <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-white">
                  <i className={`fa-solid mr-2 ${player._id ? "fa-user-pen" : "fa-user-plus"} text-blue-400`}></i>
                  {player._id ? "Edit Player" : "Add Player"} - {selectedTeamName}
                </h2>

                <form onSubmit={savePlayer} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      placeholder="Player Name"
                      value={player.name}
                      onChange={(e) => setPlayer({ ...player, name: e.target.value })}
                      className="input"
                      required
                    />
                    <select
                      value={player.role}
                      onChange={(e) => setPlayer({ ...player, role: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Batsman">Batsman</option>
                      <option value="Bowler">Bowler</option>
                      <option value="All-rounder">All-rounder</option>
                      <option value="Wicket-keeper">Wicket-keeper</option>
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      value={player.battingStyle}
                      onChange={(e) => setPlayer({ ...player, battingStyle: e.target.value })}
                      className="input"
                    >
                      <option value="">Batting Style</option>
                      <option value="Right">Right Handed</option>
                      <option value="Left">Left Handed</option>
                    </select>
                    <select
                      value={player.bowlingStyle}
                      onChange={(e) => setPlayer({ ...player, bowlingStyle: e.target.value })}
                      className="input"
                    >
                      <option value="">Bowling Style</option>
                      <option value="Fast">Fast</option>
                      <option value="Spin">Spin</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>

                  <select
                    value={player.status}
                    onChange={(e) => setPlayer({ ...player, status: e.target.value })}
                    className="input"
                  >
                    <option value="Playing">Playing</option>
                    <option value="Bench">Bench</option>
                    <option value="Injured">Injured</option>
                  </select>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:shadow-emerald-500/50 hover:shadow-xl cursor-pointer"
                    >
                      <i className={`fa-solid mr-2 ${player._id ? "fa-save" : "fa-plus"}`}></i>
                      {player._id ? "Update Player" : "Add Player"}
                    </button>
                    {player._id && (
                      <button
                        type="button"
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
                        className="rounded-lg bg-slate-700 px-4 py-3 font-semibold text-gray-300 transition hover:bg-slate-600 cursor-pointer"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Players List */}
            {selectedTeamId && (
              <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-white">
                  <i className="fa-solid fa-users mr-2 text-blue-400"></i>
                  Squad ({players.length})
                </h2>

                {players.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No players added yet. Add one above!</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {players.map((p) => (
                      <div
                        key={p._id}
                        className="rounded-lg border border-slate-600 bg-slate-700/30 p-4 transition hover:border-orange-500/50 hover:bg-slate-700/50 cursor-pointer"
                        onClick={() => setPlayer(p)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-white">{p.name}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="inline-block rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-400">
                                {p.role}
                              </span>
                              <span
                                className={`inline-block rounded-full px-2 py-1 text-xs ${
                                  p.status === "Playing"
                                    ? "bg-green-500/20 text-green-400"
                                    : p.status === "Bench"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>
                            {(p.battingStyle || p.bowlingStyle) && (
                              <p className="mt-2 text-xs text-gray-400">
                                {p.battingStyle && `Batting: ${p.battingStyle}`}
                                {p.battingStyle && p.bowlingStyle && " • "}
                                {p.bowlingStyle && `Bowling: ${p.bowlingStyle}`}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayer(p);
                            }}
                            className="rounded-lg bg-orange-500/20 px-3 py-2 text-xs font-semibold text-orange-400 transition hover:bg-orange-500/40 cursor-pointer hover:scale-110 duration-200"
                            title="Edit player"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!selectedTeamId && (
              <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-12 text-center backdrop-blur">
                <div className="mb-4 text-5xl">👥</div>
                <h3 className="mb-2 text-xl font-bold text-white">Select a Team</h3>
                <p className="text-gray-400">Choose a team from the left panel to manage players</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}