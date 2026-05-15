/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((res) => setMatches(res.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* keep your header same */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="mb-6 text-3xl font-black">Cricksy Live Matches</h1>

        <div className="space-y-5">
          {matches.map((m) => (
            <MatchCard
              key={m._id}
              title={`${m.teamA} vs ${m.teamB}`}
              match={`${m.venue || "Venue TBD"} • ${m.status}`}
              teamA={m.teamA}
              teamAScore={m.score || "0/0"}
              teamB={m.teamB}
              teamBScore={m.result || "Yet to bat"}
              status={m.result || m.status || "Upcoming"}
              href={`/tournaments/${m.tournamentId}/matches/${m._id}/score`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function MatchCard({
  title,
  match,
  teamA,
  teamAScore,
  teamB,
  teamBScore,
  status,
  href,
}: any) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
        <h2 className="text-sm font-black uppercase text-white sm:text-base">
          {title}
        </h2>
        <span className="text-2xl text-orange-400">›</span>
      </div>

      <div className="p-5">
        <p className="mb-4 text-sm text-slate-400">{match}</p>

        <div className="space-y-3">
          <ScoreRow team={teamA} score={teamAScore} active />
          <ScoreRow team={teamB} score={teamBScore} />
        </div>

        <p className="mt-4 text-sm font-bold text-orange-400">{status}</p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link
            href={href}
            className="rounded-full bg-slate-900 px-4 py-2 text-white no-underline transition hover:bg-orange-500"
          >
            Scorecard
          </Link>

          <Link
            href={href}
            className="rounded-full bg-slate-900 px-4 py-2 text-white no-underline transition hover:bg-orange-500"
          >
            Live Score
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ team, score, active }: any) {
  return (
    <div
      className={`flex justify-between rounded-xl px-4 py-3 ${
        active ? "bg-slate-900 text-white" : "bg-black text-slate-300"
      }`}
    >
      <span className="font-bold">{team}</span>
      <span className="font-black">{score}</span>
    </div>
  );
}