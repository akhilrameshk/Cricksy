/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/matches")
      .then(res => res.json())
      .then(res => setMatches(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow w-full">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Matches</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">View all matches across tournaments</p>

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-12 text-center">
            <i className="fa-solid fa-baseball text-4xl text-gray-400 dark:text-gray-600 mb-4 block"></i>
            <p className="text-xl font-bold text-gray-900 dark:text-white">No matches found</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Create tournaments and matches to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {matches.map((m: any) => (
              <div
                key={m._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-lg dark:shadow-2xl dark:shadow-orange-500/5 hover:shadow-2xl dark:hover:shadow-orange-500/20 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {m.teamA} vs {m.teamB}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      String(m.status || "").toLowerCase().includes("live")
                        ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                        : "bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {m.status || "Upcoming"}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Venue:</span> {m.venue || "TBD"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Score:</span> {m.score || "Not started"}
                  </p>
                  {m.result && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Result:</span> {m.result}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}