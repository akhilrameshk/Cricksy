/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
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
  const muiTheme = useTheme();
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [localMatches, setLocalMatches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/live")
      .then((res) => res.json())
      .then((res) => setLiveMatches(res.data || []))
      .catch(() => setLiveMatches([]));

    fetch("/api/home-matches")
      .then((res) => res.json())
      .then((res) => setLocalMatches(res.data || []))
      .finally(() => setLoading(false));

    fetch("/api/news")
      .then((res) => res.json())
      .then((res) => setNews(res.articles || []))
      .catch(() => setNews([]));
  }, []);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary }}>
      <Header />

      <Box component="main" sx={{ mx: "auto", maxWidth: "448px", pt: 7, pb: 20 }}>
        <Box component="section" sx={{ px: 2, py: 2 }}>
          <Card sx={{ borderRadius: "14px", bgcolor: muiTheme.palette.mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "#fff7ed", mt: 7, border: `1px solid ${muiTheme.palette.divider}` }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
             

              <Typography sx={{ fontSize: 12, lineHeight: 1.7, color: "#1f2937" }}>
                Cricksy is not associated with betting or gambling platforms.
                Enjoy live cricket scores safely on the official Cricksy
                platform.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box component="section" sx={{ px: 2, pt: 0.5 }}>
          <ScrollRow>
            {liveMatches.length === 0 ? (
              <EmptyCard text="No live matches available" />
            ) : (
              liveMatches.slice(0, 8).map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))
            )}
          </ScrollRow>
        </Box>

        {liveMatches.length > 0 && <AdCard />}

        <Box component="section" sx={{ px: 2, pt: 0.5 }}>
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
        </Box>

        {localMatches.length > 0 && <AdCard />}

        <Box component="section" sx={{ px: 2, pt: 0.5 }}>
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
        </Box>

        {news.length > 0 && <AdCard />}
      </Box>

      <Footer />
    </Box>
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
    <Card
      sx={{
        minWidth: 260,
        maxWidth: 260,
        borderRadius: "20px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#fff",
      }}
    >
      {/* Match Title */}
      <Box
        sx={{
          borderBottom: "1px solid #e5e7eb",
          px: 2,
          py: 1.5,
          minHeight: 78,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: "#64748b",
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {match.name || "Live Match"}
        </Typography>
      </Box>

      {/* Scores */}
      <CardContent
        sx={{
          px: 2,
          py: 2,
          flex: 1,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <ScoreRow
          team={teamA}
          score={scoreA}
          color="#ef4444"
        />

        <ScoreRow
          team={teamB}
          score={scoreB}
          color="#16a34a"
        />

        {/* Result */}
        <Box
          sx={{
            bgcolor: "#f1f5f9",
            borderRadius: "14px",
            px: 1.5,
            py: 1.5,
            minHeight: 10,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#64748b",
              lineHeight: 1.55,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {match?.date ? new Date(match.date).toLocaleString() : "Date TBD"} •{" "}
          </Typography> 
       
        </Box>
         <Box
          sx={{
            bgcolor: "#f1f5f9",
            borderRadius: "14px",
            px: 1.5,
            py: 1.5,
            minHeight: 86,
            display: "flex",
            alignItems: "flex-start",
          }}
        >
         
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 800,
              color: "#dc2626",
              lineHeight: 1.55,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {match.status || "Match in progress"}
          </Typography>
        </Box>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          borderTop: "1px solid #e5e7eb",
          bgcolor: "#f8fafc",
          p: 1.8,
          display: "flex",
          justifyContent: "center",
        }}
      ><Link
  href={`/scorecards/${match.id}`}
  className="no-underline"
>
 <Button
          size="small"
          variant="contained"
          sx={{
            bgcolor: "#009270",
            borderRadius: "999px",
            fontSize: 12,
            fontWeight: 900,
            px: 2.5,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#00795d",
              boxShadow: "none",
            },
          }}
        >
          SCORECARD
        </Button>
</Link>
       
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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        columnGap: 1,
        mb: 2,
      }}
    >
      {/* Team */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 11,
            height: 11,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 900,
            color: "#0f172a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {team}
        </Typography>
      </Box>

      {/* Score */}
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 900,
          color: "#0f172a",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
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
  const teamAScore = `${match.teamAScore || "0/0"} (${match.teamAOvers || "0.0"})`;
  const teamBScore = `${match.teamBScore || "0/0"} (${match.teamBOvers || "0.0"})`;

  return (
    <Link
      href={`/tournaments/${match.tournamentId}/matches/${match._id}/score`}
      className="no-underline"
    >
      <Card
        sx={{
          minWidth: 260,
          maxWidth: 260,
          borderRadius: "20px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            minHeight: 72,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.45,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {match.teamA} vs {match.teamB}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {match.venue || "Venue TBD"} • {match.status || "Upcoming"}
          </Typography>
        </Box>

        <CardContent sx={{ px: 2, py: 2, "&:last-child": { pb: 2 } }}>
          <LocalScoreRow
            team={match.teamA}
            score={teamAScore}
            color="#ef4444"
            active={match.result?.includes(match.teamA)}
          />

          <LocalScoreRow
            team={match.teamB}
            score={teamBScore}
            color="#16a34a"
            active={match.result?.includes(match.teamB)}
          />

          <Box
            sx={{
              mt: 2,
              bgcolor: match.result ? "#eff6ff" : "#f1f5f9",
              borderRadius: "14px",
              px: 1.5,
              py: 1.5,
              minHeight: 72,
              border: match.result ? "1px solid #bfdbfe" : "none",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 900,
                color: match.result ? "#0d6bde" : "#64748b",
                lineHeight: 1.55,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {match.result || match.status || "Match not started yet"}
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
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              fontSize: 11,
              fontWeight: 900,
              px: 2.5,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0a58b8",
                boxShadow: "none",
              },
            }}
          >
            VIEW SCORE
          </Button>
        </Box>
      </Card>
    </Link>
  );
}

function LocalScoreRow({
  team,
  score,
  color,
  active,
}: {
  team: string;
  score: string;
  color: string;
  active?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        columnGap: 1,
        mb: 1.5,
        borderRadius: "12px",
        px: 1,
        py: 0.75,
        bgcolor: active ? "rgba(13,107,222,0.08)" : "transparent",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: color,
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 900,
            color: active ? "#0d6bde" : "#0f172a",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {team}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 900,
          color: active ? "#0d6bde" : "#334155",
          whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {score}
      </Typography>
    </Box>
  );
}


function NewsCard({ item }: any) {
  return (
    <Link
      href={`/news/${encodeURIComponent(item.title)}`}
      className="no-underline"
    >
      <Card
        sx={{
          minWidth: 260,
          maxWidth: 260,
          height: 310,
          borderRadius: "20px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ width: "100%", height: 130, bgcolor: "#e2e8f0" }}>
          {item.image ? (
            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "grid",
                placeItems: "center",
                bgcolor: "#eff6ff",
                color: "#0d6bde",
                fontWeight: 900,
              }}
            >
              CRICKSY NEWS
            </Box>
          )}
        </Box>

        <CardContent sx={{ px: 2, py: 2, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 900,
              color: "#0f172a",
              lineHeight: 1.45,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.title}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description || "Latest cricket news and updates from Cricksy."}
          </Typography>
        </CardContent>

        <Box
          sx={{
            borderTop: "1px solid #e5e7eb",
            bgcolor: "#f8fafc",
            px: 2,
            py: 1.25,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#0d6bde" }}>
            Cricket News
          </Typography>

          <Typography sx={{ fontSize: 11, fontWeight: 900, color: "#0f172a" }}>
            Read →
          </Typography>
        </Box>
      </Card>
    </Link>
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