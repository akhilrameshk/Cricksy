/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  BellRing,
  CalendarDays,
  ChevronRight,
  Flame,
  Radio,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";

type Match = {
  _id: string;
  tournamentId: string;
  teamA: string;
  teamB: string;
  venue?: string;
  status?: string;
  score?: string;
  result?: string;
};

const caption = "Cricksy — Where cricket never stops scoring.";

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then((res) => res.json())
      .then((res) => setMatches(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const liveCount = matches.filter((m) =>
    String(m.status || "").toLowerCase().includes("live")
  ).length;

  return (
    <div className="min-h-screen overflow-hidden bg-[#031008] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,255,94,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,168,0,0.18),transparent_30%),linear-gradient(180deg,#06180d_0%,#020403_70%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-lime-300 to-emerald-500 shadow-lg shadow-emerald-500/30">
            <Trophy className="h-6 w-6 text-emerald-950" />
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight text-white">Cricksy</p>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-lime-300">Live cricket</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur md:flex">
          <Radio className="h-4 w-4 text-red-400" />
          {liveCount || 0} live now
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-4 py-2 text-sm font-bold text-lime-200">
              <Sparkles className="h-4 w-4" />
              {caption}
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Your cricket world, <span className="bg-gradient-to-r from-lime-300 via-emerald-300 to-yellow-200 bg-clip-text text-transparent">live in every moment.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Follow live scores, match results, tournament updates, and every big cricket moment with a fast, modern, fan-first experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#matches"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 px-7 py-4 font-black text-emerald-950 shadow-2xl shadow-emerald-500/20 transition hover:scale-105"
              >
                View Matches <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/7 px-7 py-4 font-bold text-white no-underline backdrop-blur transition hover:bg-white/12"
              >
                Browse Tournaments
              </Link>
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.75rem] bg-[#07160d] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-lime-300">Match Pulse</p>
                  <h2 className="mt-1 text-2xl font-black">Today on Cricksy</h2>
                </div>
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black">LIVE</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <StatCard icon={Radio} label="Live" value={String(liveCount)} />
                <StatCard icon={CalendarDays} label="Matches" value={String(matches.length)} />
                <StatCard icon={BellRing} label="Alerts" value="On" />
              </div>

              <div className="mt-5 rounded-3xl bg-gradient-to-br from-lime-300 to-emerald-500 p-5 text-emerald-950">
                <p className="text-sm font-black uppercase tracking-[0.25em]">Cricksy</p>
                <p className="mt-2 text-3xl font-black leading-tight">{caption}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Activity} title="Fast Scores" text="Real-time score updates directly from your API." />
          <Feature icon={Flame} title="Live Moments" text="Live wickets, overs, and match status updates." />
          <Feature icon={Shield} title="Tournament Ready" text="Supports your tournament and score routes dynamically." />
          <Feature icon={Trophy} title="Responsive UI" text="Optimized for mobile, tablet, and desktop devices." />
        </section>

        <section id="matches" className="pt-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="font-black uppercase tracking-[0.3em] text-lime-300">Live Center</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Cricksy Live Matches</h2>
            </div>
            <p className="text-sm text-white/50">Scores, venues, status, and scorecards in one place.</p>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-72 animate-pulse rounded-[2rem] border border-white/10 bg-white/[0.06]" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center">
              <p className="text-2xl font-black">No matches available</p>
              <p className="mt-2 text-white/55">Create or schedule matches to see them here.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((m) => (
                <MatchCard
                  key={m._id}
                  title={`${m.teamA} vs ${m.teamB}`}
                  match={`${m.venue || "Venue TBD"} • ${m.status || "Upcoming"}`}
                  teamA={m.teamA}
                  teamAScore={m.score || "0/0"}
                  teamB={m.teamB}
                  teamBScore={m.result || "Yet to bat"}
                  status={m.result || m.status || "Upcoming"}
                  href={`/tournaments/${m.tournamentId}/matches/${m._id}/score`}
                />
              ))}
            </div>
          )}
        </section>
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
  const isLive = String(status || "").toLowerCase().includes("live");

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-lime-300/30 hover:bg-white/[0.1]">
      <div className="relative border-b border-white/10 bg-gradient-to-r from-white/10 to-transparent px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isLive ? "bg-red-500" : "bg-lime-300"}`} />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-white/45">Match</p>
            </div>
            <h2 className="text-lg font-black leading-tight text-white">{title}</h2>
          </div>
          <Link href={href} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime-300 text-emerald-950 transition group-hover:scale-110">
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-5 line-clamp-1 text-sm font-medium text-white/50">{match}</p>

        <div className="space-y-3">
          <ScoreRow team={teamA} score={teamAScore} active />
          <ScoreRow team={teamB} score={teamBScore} />
        </div>

        <div className="mt-5 rounded-2xl border border-lime-300/15 bg-lime-300/10 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-lime-300">Status</p>
          <p className="mt-1 text-sm font-bold text-white">{status}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <Link href={href} className="rounded-full bg-white px-4 py-3 text-center font-black text-emerald-950 no-underline transition hover:bg-lime-300">
            Scorecard
          </Link>
          <Link href={href} className="rounded-full border border-white/10 bg-white/8 px-4 py-3 text-center font-bold text-white no-underline transition hover:bg-orange-500 hover:text-white">
            Live Score
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ team, score, active }: any) {
  return (
    <div className={`flex items-center justify-between rounded-2xl px-4 py-4 ${active ? "bg-emerald-400/15 text-white" : "bg-black/30 text-white/70"}`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-black ${active ? "bg-lime-300 text-emerald-950" : "bg-white/10 text-white"}`}>
          {String(team || "T").slice(0, 2).toUpperCase()}
        </div>
        <span className="font-black">{team}</span>
      </div>
      <span className="font-black text-lime-200">{score}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
      <Icon className="h-5 w-5 text-lime-300" />
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">{label}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.1]">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-300/15 text-lime-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}
