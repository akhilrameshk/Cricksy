/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function ScorecardPage() {
  const params = useParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/live-scorecard?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMatch(data.data || data);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Header />
        <main className="mx-auto flex min-h-dvh max-w-md items-center justify-center pb-20" style={{ marginTop: "65px" }}>
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={48} sx={{ color: "#0d6bde" }} />
            <Typography sx={{ mt: 3, fontSize: 16, fontWeight: 700, color: "#64748b" }}>
              Loading scorecard...
            </Typography>
          </Box>
        </main>
        <Footer />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Header />
        <main className="mx-auto max-w-md px-4 pb-20" style={{ marginTop: "65px" }}>
          <Card sx={{ mt: 3, borderRadius: "16px", p: 4, textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#64748b" }}>📋 Scorecard not found</Typography>
            <Typography sx={{ fontSize: 13, color: "#94a3b8", mt: 1 }}>The scorecard you&apos;re looking for doesn&apos;t exist.</Typography>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />

      <main className="mx-auto max-w-md px-3 pb-24 sm:px-4" style={{ marginTop: "65px" }}>
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Link href="/" className="no-underline">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 3,
                py: 1.5,
                borderRadius: "12px",
                bgcolor: "#eff6ff",
                color: "#0d6bde",
                fontWeight: 700,
                fontSize: 14,
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#dbeafe",
                  transform: "translateX(-4px)",
                },
                ".dark &": {
                  bgcolor: "#1e293b",
                  color: "#60a5fa",
                  "&:hover": {
                    bgcolor: "#334155",
                  },
                },
              }}
            >
              ← Back to Home
            </Box>
          </Link>
        </Box>

        <Box sx={{ mb: 3 }}>
          <AdCard />
        </Box>

        <MatchHeader match={match} />

        <section className="px-0 mb-6">
          <Typography sx={{ fontSize: 20, fontWeight: 900, mb: 2, color: "#0f172a", ".dark &": { color: "#f1f5f9" } }}>
            📊 Score Summary
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
            {match.score?.map((s: any, i: number) => (
              <ScoreSummaryCard key={i} score={s} />
            ))}
          </Box>
        </section>

        {match.scorecard?.map((inning: any, index: number) => (
          <InningScorecard key={index} inning={inning} />
        ))}

        <Box sx={{ mt: 3, mb: 1 }}>
          <AdCard />
        </Box>
      </main>

      <Footer />
    </div>
  );
}

function MatchHeader({ match }: { match: any }) {
  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: "20px",
        overflow: "hidden",
        border: "none",
        boxShadow: "0 8px 24px rgba(13, 107, 222, 0.15)",
      }}
    >
      <Box sx={{ background: "linear-gradient(135deg, #0d6bde 0%, #0a5cb8 100%)", color: "#fff", px: 3, py: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 950, lineHeight: 1.3, mb: 1.5 }}>
          🏏 {match.name || "Cricket Match"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          {match.matchType && (
            <Chip
              size="small"
              label={String(match.matchType).toUpperCase()}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 11,
                height: 28,
              }}
            />
          )}

          {match.venue && (
            <Chip
              size="small"
              label={`📍 ${match.venue}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 11,
                height: 28,
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #e2e8f0" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0d6bde", ".dark &": { color: "#60a5fa" } }}>
            ⏱️ {match.status || "Match status unavailable"}
          </Typography>
        </Box>

        {match.tossWinner && (
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", ".dark &": { color: "#cbd5e1" } }}>
              🎲 Toss: <strong>{match.tossWinner}</strong> chose to <strong>{match.tossChoice}</strong>
            </Typography>
          </Box>
        )}

        {match.matchWinner && (
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#16a34a", ".dark &": { color: "#86efac" }, display: "flex", alignItems: "center", gap: 1 }}>
              🏆 <strong>Winner: {match.matchWinner}</strong>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreSummaryCard({ score }: { score: any }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ px: 3, py: 2, bgcolor: "#f0f9ff", borderBottom: "2px solid #0d6bde" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#0d6bde" }}>
          🏏 {score.inning || "Innings"}
        </Typography>
      </Box>

      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 950, color: "#0d6bde", lineHeight: 1 }}>
            {score.r}/{score.w}
          </Typography>

          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#64748b", mt: 1 }}>
            Overs: {score.o}
          </Typography>
        </Box>

        <Box
          sx={{
            minWidth: 80,
            borderRadius: "14px",
            bgcolor: "#f0f9ff",
            border: "2px solid #0d6bde",
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#64748b", mb: 0.5 }}>
            RUNS
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 950, color: "#0d6bde" }}>
            {score.r}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function InningScorecard({ inning }: { inning: any }) {
  return (
    <Box sx={{ px: 3, pt: 4, pb: 3 }}>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 900,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#0d6bde",
        }}
      >
        📝 {inning.inning || "Innings"}
      </Typography>

      <ScoreTable
        title="Batting"
        columns={["Batter", "R", "B", "4s", "6s", "SR"]}
        rows={inning.batting || []}
        type="batting"
      />

      <Box sx={{ mt: 3 }}>
        <ScoreTable
          title="Bowling"
          columns={["Bowler", "O", "M", "R", "W", "Eco"]}
          rows={inning.bowling || []}
          type="bowling"
        />
      </Box>
    </Box>
  );
}

function ScoreTable({
  title,
  columns,
  rows,
  type,
}: {
  title: string;
  columns: string[];
  rows: any[];
  type: "batting" | "bowling";
}) {
  const headerGradient = type === "batting" 
    ? "linear-gradient(135deg, #0d6bde 0%, #0a5cb8 100%)" 
    : "linear-gradient(135deg, #059669 0%, #047857 100%)";

  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box
        sx={{
          background: headerGradient,
          color: "#fff",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 900 }}>
          {type === "batting" ? "🏏" : "🎯"} {title}
        </Typography>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-4 py-3 font-black text-slate-700 text-xs uppercase tracking-wider"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                {type === "batting" ? (
                  <>
                    <td className="px-4 py-3">
                      <p className="font-black text-slate-900 text-sm">
                        {row.batsman?.name || "-"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row["dismissal-text"] || "not out"}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900">{row.r}</td>
                    <td className="px-4 py-3 text-slate-700">{row.b}</td>
                    <td className="px-4 py-3 text-slate-700">{row["4s"]}</td>
                    <td className="px-4 py-3 text-slate-700">{row["6s"]}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{row.sr}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-black text-slate-900 text-sm">
                      {row.bowler?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.o}</td>
                    <td className="px-4 py-3 text-slate-700">{row.m}</td>
                    <td className="px-4 py-3 font-bold text-red-600">{row.r}</td>
                    <td className="px-4 py-3 font-black text-slate-900">{row.w}</td>
                    <td className="px-4 py-3 text-slate-700">{row.eco}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}