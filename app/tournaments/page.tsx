/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TournamentsPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [statsOpen, setStatsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"batting" | "bowling">("batting");
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [stats, setStats] = useState<any>({ batsmen: [], bowlers: [] });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((res) => setData(res.data || []));
  }, []);

  const openStatsModal = async (tournament: any) => {
    setSelectedTournament(tournament);
    setStatsOpen(true);
    setActiveTab("batting");
    setLoadingStats(true);

    const res = await fetch(`/api/tournaments/${tournament._id}/stats`);
    const json = await res.json();

    if (json.success) {
      setStats(json.data);
    } else {
      alert(json.message || "Failed to load stats");
    }

    setLoadingStats(false);
  };

  const closeStatsModal = () => {
    setStatsOpen(false);
    setSelectedTournament(null);
    setStats({ batsmen: [], bowlers: [] });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[28px] font-bold text-white">Tournaments</h1>
              <p className="mt-1 text-sm text-white">
                Manage tournaments, teams and matches
              </p>
            </div>

            <Link
              href="/tournaments/add"
              className="rounded-lg bg-orange-500 px-5 py-2.5 text-center text-sm font-semibold text-white no-underline transition hover:bg-orange-600"
            >
              + Add Tournament
            </Link>
          </div>

          {data.length === 0 ? (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">
              <h2 className="text-xl font-bold text-white">
                No tournaments found
              </h2>

              <Link
                href="/tournaments/add"
                className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-orange-600"
              >
                Add Tournament
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 xl:grid-cols-6">
              {data.map((t) => (
                <div
                  key={t._id}
                  className="flex h-full flex-col items-center rounded-xl border border-slate-700 bg-slate-900 p-5 text-center shadow-md transition hover:border-orange-500 hover:bg-slate-800"
                >
                  <h2 className="line-clamp-2 text-[24px] font-bold leading-tight text-white">
                    {t.name}
                  </h2>

                  <div className="mt-3 flex items-center justify-center gap-2 text-[14px] font-normal text-white">
                    <i className="fa-solid fa-location-dot text-red-500"></i>
                    <span>{t.venue || "Venue not added"}</span>
                  </div>

                  <div className="mt-4 rounded bg-orange-500 px-3 py-1 text-[13px] font-semibold text-white">
                    {t.format || "T20"}
                  </div>

                  <div className="mt-4 text-[14px] font-normal text-white">
                    {t.startDate
                      ? new Date(t.startDate).toLocaleDateString()
                      : "TBD"}{" "}
                    -{" "}
                    {t.endDate
                      ? new Date(t.endDate).toLocaleDateString()
                      : "TBD"}
                  </div>

                  <div className="mt-5 grid w-full grid-cols-1 gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/tournaments/${t._id}/teams`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600/20 px-2 py-2 text-center text-xs font-semibold text-emerald-400 transition duration-300 ease-in-out hover:bg-emerald-600/40 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 cursor-pointer"
                      >
                        <i className="fa-solid fa-people-group"></i>
                        Team
                      </button>

                      <button
                        type="button"
                        onClick={() => router.push(`/tournaments/${t._id}`)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-orange-600/20 px-2 py-2 text-center text-xs font-semibold text-orange-400 transition duration-300 ease-in-out hover:bg-orange-600/40 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50 cursor-pointer"
                      >
                        <i className="fa-solid fa-cricket"></i>
                        Matches
                      </button>

                      <button
                        type="button"
                        onClick={() => openStatsModal(t)}
                        className="flex items-center justify-center gap-1 rounded-lg bg-blue-600/20 px-2 py-2 text-xs font-semibold text-blue-400 transition duration-300 ease-in-out hover:bg-blue-600/40 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 cursor-pointer"
                      >
                        <i className="fa-solid fa-chart-bar"></i>
                        Stats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {statsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1000,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 16,
              padding: 20,
              color: "white",
            }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Player Stats
                </h2>
                <p className="text-sm text-white">
                  {selectedTournament?.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeStatsModal}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Close
              </button>
            </div>

            <div className="mb-5 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("batting")}
                className={`rounded-full px-5 py-2 font-bold ${
                  activeTab === "batting"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                Batsman
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bowling")}
                className={`rounded-full px-5 py-2 font-bold ${
                  activeTab === "bowling"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                Bowler
              </button>
            </div>

            {loadingStats ? (
              <div className="rounded-xl bg-slate-900 p-8 text-center text-white">
                Loading stats...
              </div>
            ) : activeTab === "batting" ? (
              <div className="overflow-hidden rounded-xl bg-white text-black">
                <div className="bg-emerald-700 px-4 py-3 font-bold text-white">
                  Top 10 Batsmen
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[750px] text-sm">
                    <thead className="bg-gray-200 text-gray-800">
                      <tr>
                        <th className="px-3 py-3 text-left">#</th>
                        <th className="px-3 py-3 text-left">Name</th>
                        <th className="px-3 py-3 text-left">Team</th>
                        <th className="px-3 py-3 text-center">Matches</th>
                        <th className="px-3 py-3 text-center">Total Runs</th>
                        <th className="px-3 py-3 text-center">Average</th>
                        <th className="px-3 py-3 text-center">Strike Rate</th>
                      </tr>
                    </thead>

                    <tbody>
                      {stats.batsmen.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-3 py-6 text-center">
                            No batting stats found
                          </td>
                        </tr>
                      ) : (
                        stats.batsmen.map((p: any, index: number) => (
                          <tr
                            key={`${p.team}-${p.name}`}
                            className="border-b border-gray-200"
                          >
                            <td className="px-3 py-3 font-bold">
                              {index + 1}
                            </td>
                            <td className="px-3 py-3 font-semibold text-blue-600">
                              {p.name}
                            </td>
                            <td className="px-3 py-3">{p.team}</td>
                            <td className="px-3 py-3 text-center">
                              {p.matches}
                            </td>
                            <td className="px-3 py-3 text-center font-bold">
                              {p.totalRuns}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {p.average}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {p.strikeRate}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl bg-white text-black">
                <div className="bg-emerald-700 px-4 py-3 font-bold text-white">
                  Top 10 Bowlers
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-gray-200 text-gray-800">
                      <tr>
                        <th className="px-3 py-3 text-left">#</th>
                        <th className="px-3 py-3 text-left">Name</th>
                        <th className="px-3 py-3 text-left">Team</th>
                        <th className="px-3 py-3 text-center">Matches</th>
                        <th className="px-3 py-3 text-center">Overs</th>
                        <th className="px-3 py-3 text-center">Wickets</th>
                        <th className="px-3 py-3 text-center">Economy</th>
                        <th className="px-3 py-3 text-center">Strike Rate</th>
                      </tr>
                    </thead>

                    <tbody>
                      {stats.bowlers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-3 py-6 text-center">
                            No bowling stats found
                          </td>
                        </tr>
                      ) : (
                        stats.bowlers.map((p: any, index: number) => (
                          <tr
                            key={`${p.team}-${p.name}-${index}`}
                            className="border-b border-gray-200"
                          >
                            <td className="px-3 py-3 font-bold">
                              {index + 1}
                            </td>
                            <td className="px-3 py-3 font-semibold text-blue-600">
                              {p.name}
                            </td>
                            <td className="px-3 py-3">{p.team}</td>
                            <td className="px-3 py-3 text-center">
                              {p.matches}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {p.overs}
                            </td>
                            <td className="px-3 py-3 text-center font-bold">
                              {p.wickets}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {p.economy}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {p.strikeRate}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}