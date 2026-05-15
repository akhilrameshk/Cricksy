/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-16 py-8">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-8 md:p-12 shadow-lg dark:shadow-2xl dark:shadow-orange-500/10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-500/20 px-4 py-2">
              <i className="fa-solid fa-cricket text-orange-600 dark:text-orange-400"></i>
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">Welcome to Tournament Hub</span>
            </div>

            <h1 className="mb-4 text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
              Cricket Tournament
              <span className="ml-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Management</span>
            </h1>

            <p className="mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Manage tournaments, teams, players, and live scores all in one place. Experience modern cricket tournament management like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tournaments"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-6 py-3 shadow-lg transition hover:shadow-orange-500/50 hover:scale-105"
              >
                <i className="fa-solid fa-trophy"></i>
                Browse Tournaments
              </Link>
              <Link
                href="/players"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-orange-500 dark:border-orange-400 bg-transparent text-orange-600 dark:text-orange-400 font-bold px-6 py-3 transition hover:bg-orange-50 dark:hover:bg-orange-500/10"
              >
                <i className="fa-solid fa-people-group"></i>
                Manage Players
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-lg dark:shadow-2xl dark:shadow-blue-500/5 transition hover:shadow-2xl dark:hover:shadow-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Total Matches</h3>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <i className="fa-solid fa-baseball text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{matches.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Across all tournaments</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-lg dark:shadow-2xl dark:shadow-red-500/5 transition hover:shadow-2xl dark:hover:shadow-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Live Now</h3>
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <i className="fa-solid fa-circle text-red-600 dark:text-red-400 text-xl animate-pulse"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{liveCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Matches in progress</p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-lg dark:shadow-2xl dark:shadow-emerald-500/5 transition hover:shadow-2xl dark:hover:shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 dark:text-gray-300 font-semibold">Tournaments</h3>
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <i className="fa-solid fa-trophy text-emerald-600 dark:text-emerald-400 text-xl"></i>
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">Active</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Tournament management</p>
          </div>
        </section>

        {/* Matches Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Latest Matches</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time updates from all tournaments</p>
          </div>


          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-12 text-center">
              <i className="fa-solid fa-inbox text-4xl text-gray-400 dark:text-gray-600 mb-4 block"></i>
              <p className="text-xl font-bold text-gray-900 dark:text-white">No matches available</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Create tournaments to see matches here.</p>
              <Link
                href="/tournaments"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-6 py-3"
              >
                <i className="fa-solid fa-plus"></i>
                Create Tournament
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {matches.map((m) => (
                <Link
                  key={m._id}
                  href={`/tournaments/${m.tournamentId}/matches/${m._id}/score`}
                  className="group no-underline"
                >
                  <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-lg dark:shadow-2xl dark:shadow-orange-500/5 transition hover:shadow-2xl dark:hover:shadow-orange-500/20 hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            String(m.status || "").toLowerCase().includes("live")
                              ? "bg-red-500 animate-pulse"
                              : "bg-gray-400"
                          }`}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
                          {m.status || "Upcoming"}
                        </span>
                      </div>
                      <i className="fa-solid fa-arrow-right text-orange-500 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition"></i>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                      {m.teamA}
                      <span className="mx-2 text-gray-400 dark:text-gray-600">vs</span>
                      {m.teamB}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <i className="fa-solid fa-location-dot mr-2"></i>
                      {m.venue || "Venue TBD"}
                    </p>

                    <div className="rounded-lg bg-slate-100 dark:bg-slate-700/50 p-4 mb-4">
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Score</p>
                      <p className="text-xl font-black text-orange-600 dark:text-orange-400">
                        {m.score || m.result || "Not started"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                        <i className="fa-solid fa-baseball mr-1"></i>Match
                      </span>
                      {String(m.status || "").toLowerCase().includes("live") && (
                        <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
                          <i className="fa-solid fa-circle mr-1"></i>Live
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
