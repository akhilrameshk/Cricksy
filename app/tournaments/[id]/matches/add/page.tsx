/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AddMatchPage() {
  const router = useRouter();
  const params = useParams();

  const tournamentId = params.id as string;

  const [teams, setTeams] = useState<any[]>([]);

  const [form, setForm] = useState({
    teamA: "",
    teamB: "",
    venue: "",
    matchDate: "",
    status: "Upcoming",
    score: "0/0",
    overs: "0.0",
    result: "",
  });

  // LOAD TEAMS
  useEffect(() => {
    if (!tournamentId) return;

    fetch(`/api/teams?tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((res) => setTeams(res.data || []));
  }, [tournamentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.teamA === form.teamB) {
      alert("Team A and Team B cannot be same");
      return;
    }

    const res = await fetch("/api/matches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        tournamentId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Match added successfully");
      router.push(`/tournaments/${tournamentId}`);
    } else {
      alert(data.message || "Failed to add match");
    }
  };

  // FILTER TEAMS (prevent same selection)
  const teamAOptions = teams.filter((t) => t.teamName !== form.teamB);
  const teamBOptions = teams.filter((t) => t.teamName !== form.teamA);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-center text-[28px] font-bold text-white">
          Add Match
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-5"
        >
          {/* TEAM A */}
          <select
            name="teamA"
            value={form.teamA}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            required
          >
            <option value="">Select Team A</option>
            {teamAOptions.map((t) => (
              <option key={t._id} value={t.teamName}>
                {t.teamName}
              </option>
            ))}
          </select>

          {/* TEAM B */}
          <select
            name="teamB"
            value={form.teamB}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            required
          >
            <option value="">Select Team B</option>
            {teamBOptions.map((t) => (
              <option key={t._id} value={t.teamName}>
                {t.teamName}
              </option>
            ))}
          </select>

          {/* VENUE */}
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Venue"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />

          {/* DATE */}
          <input
            type="datetime-local"
            name="matchDate"
            value={form.matchDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />

          {/* STATUS */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Add Match →
          </button>
        </form>
      </div>
    </div>
  );
}