/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import AdCard from "./components/AdCard";
import Footer from "./components/Footer";
import Header from "./components/Header";

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
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-14 pb-20">
        <section className="px-2 py-2">
          <Card sx={{ borderRadius: "14px", bgcolor: "#fff7ed" }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 900, color: "#c2410c" }}>
                  ⚠ CAUTION
                </Typography>
                <Typography sx={{ fontSize: 16, color: "#c2410c" }}>
                  ×
                </Typography>
              </Box>

              <Typography sx={{ fontSize: 12, lineHeight: 1.7, color: "#1f2937" }}>
                Cricksy is not associated with betting or gambling platforms.
                Enjoy live cricket scores safely on the official Cricksy
                platform.
              </Typography>
            </CardContent>
          </Card>
        </section>

        <section className="px-2 pt-[5px]">
          <ScrollRow>
            {liveMatches.length === 0 ? (
              <EmptyCard text="No live matches available" />
            ) : (
              liveMatches.slice(0, 8).map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))
            )}
          </ScrollRow>
        </section>

        {liveMatches.length > 0 && <AdCard />}

        <section className="px-2 pt-[5px]">
          <SectionTitle title="Local Matches" href="/matches" />

          <ScrollRow>
            {loading ? (
              <EmptyCard text="Loading matches..." />
            ) : localMatches.length === 0 ? (
              <EmptyCard text="No local matches found" />
            ) : (
              localMatches.slice(0, 8).map((match) => (
                <LocalMatchCard key={match._id} match={match} />
              ))
            )}
          </ScrollRow>
        </section>

        {localMatches.length > 0 && <AdCard />}

        <section className="px-2 pt-[5px]">
          <SectionTitle title="Cricket News" href="/news" />

          <ScrollRow>
            {news.length === 0 ? (
              <EmptyCard text="No news available" />
            ) : (
              news.slice(0, 8).map((item, index) => (
                <NewsCard key={index} item={item} />
              ))
            )}
          </ScrollRow>
        </section>

        {news.length > 0 && <AdCard />}
      </main>

      <Footer />
    </div>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: "20px",
        margin: "10px 20px",
        pb: 1.5,
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      {children}
    </Box>
  );
}

function LiveMatchCard({ match }: any) {
  const teamA =
    match.teamInfo?.[0]?.shortname || match.teams?.[0] || "Team A";

  const teamB =
    match.teamInfo?.[1]?.shortname || match.teams?.[1] || "Team B";

  const scoreA = match.score?.[0]
    ? `${match.score[0].r}/${match.score[0].w} (${match.score[0].o})`
    : "-";

  const scoreB = match.score?.[1]
    ? `${match.score[1].r}/${match.score[1].w} (${match.score[1].o})`
    : "-";

  return (
    <Card
      sx={{
        minWidth: 260,
        borderRadius: "20px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ borderBottom: "1px solid #e5e7eb", px: 2, py: 1.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>
          {match.name || "Live Match"}
        </Typography>
      </Box>

      <CardContent sx={{ px: 2, py: 2, "&:last-child": { pb: 2 } }}>
        <ScoreRow team={teamA} score={scoreA} color="#ef4444" />
        <ScoreRow team={teamB} score={scoreB} color="#16a34a" />

        <Box sx={{ mt: 2, bgcolor: "#f1f5f9", borderRadius: "12px", p: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#dc2626" }}>
            {match.status || "Match in progress"}
          </Typography>
        </Box>
      </CardContent>

      <Box
        sx={{
          borderTop: "1px solid #e5e7eb",
          bgcolor: "#f8fafc",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          size="small"
          variant="contained"
          sx={{
            bgcolor: "#009270",
            borderRadius: "999px",
            fontSize: 10,
            fontWeight: 900,
            textTransform: "uppercase",
            px: 2,
            "&:hover": { bgcolor: "#00795d" },
          }}
        >
          Scorecard
        </Button>
      </Box>
    </Card>
  );
}

function ScoreRow({
  team,
  score,
  color,
}: {
  team: string;
  score: string;
  color: string;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
          {team}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
        {score}
      </Typography>
    </Box>
  );
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <Box sx={{ mx: 2.5, mb: 0.5, display: "flex", justifyContent: "space-between" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 900 }}>
        {title}
      </Typography>

      <Link href={href} className="text-sm font-bold text-[#009270]">
        View All
      </Link>
    </Box>
  );
}

function LocalMatchCard({ match }: any) {
  return (
    <Link
      href={`/tournaments/${match.tournamentId}/matches/${match._id}/score`}
      className="no-underline"
    >
      <Card
        sx={{
          minWidth: 260,
          borderRadius: "20px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          p: 2,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1.5 }}>
          {match.venue || "Venue TBD"} • {match.status || "Upcoming"}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
            {match.teamA}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
            {match.score || "0/0"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 14, color: "#64748b" }}>
            {match.teamB}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#64748b" }}>
            {match.result || "Yet to bat"}
          </Typography>
        </Box>

        {match?.result && (
          <Typography sx={{ mt: 1.5, fontSize: 13, fontWeight: 700, color: "#009270" }}>
            {match.result}
          </Typography>
        )}
      </Card>
    </Link>
  );
}

function NewsCard({ item }: any) {
  return (
    <a href={item.url} target="_blank" className="no-underline">
      <Card
        sx={{
          minWidth: 260,
          borderRadius: "20px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {item.image && (
          <Box
            component="img"
            src={item.image}
            alt={item.title}
            sx={{
              width: "100%",
              height: 130,
              objectFit: "cover",
            }}
          />
        )}

        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
            {item.title}
          </Typography>

          <Typography sx={{ mt: 1, fontSize: 12, color: "#64748b" }}>
            {item.description}
          </Typography>
        </CardContent>
      </Card>
    </a>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <Card
      sx={{
        minWidth: 295,
        borderRadius: "12px",
        p: 2.5,
        textAlign: "center",
        color: "#64748b",
      }}
    >
      <Typography sx={{ fontSize: 14 }}>{text}</Typography>
    </Card>
  );
}