/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdCard from "./components/AdCard";

export default function HomePage() {
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [localMatches, setLocalMatches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((res) => setLiveMatches(res.data || []))
      .catch(() => setLiveMatches([]));

    fetch("/api/matches")
      .then((res) => res.json())
      .then((res) => setLocalMatches(res.data || []))
      .finally(() => setLoading(false));

    fetch("/api/news")
      .then((res) => res.json())
      .then((res) => setNews(res.articles || []))
      .catch(() => setNews([]));
  }, []);

  return (
    <main className="min-h-screen bg-[#e9eef1] pb-20 text-black dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-50 bg-[#009270] text-white shadow-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
          <button>
            <i className="fa-solid fa-bars text-xl" />
          </button>

          <Link href="/" className="text-2xl font-black italic no-underline">
            cri<span className="rounded-full bg-white px-1 text-[#009270]">c</span>ksy
          </Link>

         
        </div>
      </header>

      <div className="mx-auto max-w-md">
        
        {/* Caution */}
        <section className="px-2 py-2">
          <div className="rounded-xl bg-orange-50 p-4 text-xs leading-5 text-slate-800">
            <div className="mb-2 flex items-center justify-between text-orange-700">
              <b>
                <i className="fa-solid fa-circle-exclamation mr-2" />
                CAUTION
              </b>
              <i className="fa-solid fa-xmark text-lg" />
            </div>
            Cricksy is not associated with betting or gambling platforms. Enjoy
            live cricket scores safely on the official Cricksy platform.
          </div>
        </section>
       <AdCard />
        {/* Live Matches */}
        <section className="px-2 pt-[5px]">
  <div className="flex gap-5 overflow-x-auto px-1 pb-3" style={{gap:"20px !important",margin:"10px 20px"}}>
    {liveMatches.length === 0 ? (
      <EmptyCard text="No live matches available" />
    ) : (
      liveMatches.slice(0, 8).map((match) => (
        <LiveMatchCard key={match.id} match={match} />
      ))
    )}
  </div>
</section>
         <AdCard />

      


       {/* Local Matches */}
<section className="px-2 pt-[5px]">
  <SectionTitle title="Local Matches" href="/matches" />

  <div
    className="flex overflow-x-auto pb-3"
    style={{ gap: "20px", margin: "10px 20px" }}
  >
    {loading ? (
      <EmptyCard text="Loading matches..." />
    ) : localMatches.length === 0 ? (
      <EmptyCard text="No local matches found" />
    ) : (
      localMatches.slice(0, 8).map((match) => (
        <LocalMatchCard key={match._id} match={match} />
      ))
    )}
  </div>
</section>
 <AdCard />
{/* News */}
<section className="px-2 pt-[5px]">
  <SectionTitle title="Cricket News" href="/news" />

  <div
    className="flex overflow-x-auto pb-3"
    style={{ gap: "20px", margin: "10px 20px" }}
  >
    {news.length === 0 ? (
      <EmptyCard text="No news available" />
    ) : (
      news.slice(0, 8).map((item, index) => (
        <NewsCard key={index} item={item} />
      ))
    )}
  </div>
</section>
 <AdCard />
      </div>

      <BottomMenu />
    </main>
  );
}



function LiveMatchCard({ match }: any) {
  const teamA =
    match.teamInfo?.[0]?.shortname ||
    match.teams?.[0] ||
    "Team A";

  const teamB =
    match.teamInfo?.[1]?.shortname ||
    match.teams?.[1] ||
    "Team B";

  const scoreA = match.score?.[0]
    ? `${match.score[0].r}/${match.score[0].w} (${match.score[0].o})`
    : "-";

  const scoreB = match.score?.[1]
    ? `${match.score[1].r}/${match.score[1].w} (${match.score[1].o})`
    : "-";

  return (
    <div className="min-w-[260px] overflow-hidden rounded-[20px] border border-slate-300 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-[11px] font-medium leading-4 text-slate-500 dark:text-slate-400">
            {match.name || "Live Match"}
          </p>

         
        </div>
      </div>

      {/* Match Scores */}
      <div className="space-y-4 px-4 py-4">
        {/* Team A */}
        <div className="flex items-center justify-evenly">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />

            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {teamA}
            </span>
          </div>

          <span className="text-sm font-black text-slate-900 dark:text-white">
            {scoreA}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-evenly">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-600" />

            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {teamB}
            </span>
          </div>

          <span className="text-sm font-black text-slate-700 dark:text-slate-300">
            {scoreB}
          </span>
        </div>

        {/* Status */}
        <div className="rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800">
          <p className="line-clamp-2 text-xs font-semibold leading-5 text-red-600 dark:text-red-400">
            {match.status || "Match in progress"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
       

        <button className="rounded-full bg-[#009270] px-4 py-1.5 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#00795d]">
          Scorecard
        </button>
      </div>
    </div>
  );
}
function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="mx-5 mb-1 flex items-center justify-between">
      <h2 className="text-lg font-black">{title}</h2>
      <Link href={href} className="text-sm font-bold text-[#009270]">
        View All
      </Link>
    </div>
  );
}
function LocalMatchCard({ match }: any) {
  return (
    <Link
      href={`/tournaments/${match.tournamentId}/matches/${match._id}/score`}
      className="min-w-[260px] overflow-hidden rounded-[20px] border border-slate-300 bg-white p-4 shadow-sm no-underline dark:border-slate-700 dark:bg-slate-900"
    >
      <p className="mb-3 line-clamp-1 text-xs text-slate-500">
        {match.venue || "Venue TBD"} • {match.status || "Upcoming"}
      </p>

      <div className="flex justify-evenly text-sm">
        <b>{match.teamA}</b>
        <b>{match.score || "0/0"}</b>
      </div>

      <div className="mt-3 flex justify-evenly text-sm text-slate-500">
        <span>{match.teamB}</span>
        <span>{match.result || "Yet to bat"}</span>
      </div>
      {match?.result && (
         <div className="mt-3 flex justify-evenly text-sm text-slate-500">
       
        <span>{match.result || "Yet to bat"}</span>
      </div>
      )}
      
    </Link>
  );
}
function NewsCard({ item }: any) {
  return (
    <a
      href={item.url}
      target="_blank"
      className="min-w-[260px] overflow-hidden rounded-[20px] border border-slate-300 bg-white shadow-sm no-underline dark:border-slate-700 dark:bg-slate-900"
    >
      {item.image && (
        <img src={item.image} alt={item.title} className="h-32 w-full object-cover" />
      )}

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-black text-black dark:text-white">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs text-slate-500">
          {item.description}
        </p>
      </div>
    </a>
  );
}
function ScoreLine({ team, score, active }: any) {
  return (
    <div className="mb-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`h-5 w-5 rounded-sm ${
            active ? "bg-red-500" : "bg-green-700"
          }`}
        />
        <span className={active ? "font-bold" : "text-slate-500"}>{team}</span>
      </div>
      <span className={active ? "font-bold" : "text-slate-500"}>{score}</span>
    </div>
  );
}

function QuickTab({ icon, label }: any) {
  return (
    <button className="flex min-w-max items-center gap-2 rounded-md bg-white px-4 py-3 text-sm shadow-sm dark:bg-slate-900">
      <i className={`fa-solid ${icon}`} />
      {label}
    </button>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="min-w-[295px] rounded-md bg-white p-5 text-center text-sm text-slate-500 shadow-sm dark:bg-slate-900">
      {text}
    </div>
  );
}

function BottomMenu() {
  const links = [
    { href: "/", label: "Home", icon: "fa-house" },
    { href: "/matches", label: "Matches", icon: "fa-baseball" },
    { href: "/tournaments", label: "Series", icon: "fa-trophy" },
    { href: "/scorecards", label: "Scorecards", icon: "fa-clipboard-list" },
    { href: "/news", label: "News", icon: "fa-newspaper" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center justify-center text-xs text-slate-600 no-underline dark:text-slate-400"
          >
            <i className={`fa-solid ${link.icon} mb-1 text-lg`} />
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}