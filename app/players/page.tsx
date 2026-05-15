/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/api/players")
      .then(res => res.json())
      .then(res => setPlayers(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-grow w-full">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Players</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Manage and view all players in the system</p>

        {players.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-12 text-center">
            <i className="fa-solid fa-users text-4xl text-gray-400 dark:text-gray-600 mb-4 block"></i>
            <p className="text-xl font-bold text-gray-900 dark:text-white">No players found</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Add players through tournament management</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {players.map((p: any) => (
              <div
                key={p._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-lg dark:shadow-2xl dark:shadow-orange-500/5 hover:shadow-2xl dark:hover:shadow-orange-500/20 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{p.name}</h2>
                  <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
                    {p.role || "Player"}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">Status:</span> {p.status || "Active"}
                  </p>
                  {p.battingStyle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Batting:</span> {p.battingStyle}
                    </p>
                  )}
                  {p.bowlingStyle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Bowling:</span> {p.bowlingStyle}
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