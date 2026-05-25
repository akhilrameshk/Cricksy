/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "cache-current-matches.json");
const CACHE_TIME = 60 * 60 * 1000; // 1 hour

function getMatchDate(match: any) {
  return new Date(match.dateTimeGMT || match.date || match.matchDate);
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isEnded(match: any) {
  const status = String(match.status || "").toLowerCase();

  return (
    match.matchEnded === true ||
    match.ms === "result" ||
    status.includes("won") ||
    status.includes("match ended") ||
    status.includes("abandoned") ||
    status.includes("no result")
  );
}

function isLive(match: any) {
  const status = String(match.status || "").toLowerCase();

  return (
    match.matchStarted === true &&
    match.matchEnded !== true &&
    match.ms !== "result" &&
    !status.includes("won") &&
    !status.includes("match ended") &&
    !status.includes("abandoned") &&
    !status.includes("no result")
  );
}

function isUpcoming(match: any) {
  return !isLive(match) && !isEnded(match);
}

export async function GET() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));

      if (Date.now() - cached.timestamp < CACHE_TIME) {
        return Response.json(cached.data);
      }
    }

    const res = await fetch(
      `${process.env.CRIC_API_URL}/series?apikey=${process.env.CRIC_API_KEY}&offset=0`,
      { cache: "no-store" }
    );

    const json = await res.json();

    const allMatches = json.data || [];
    const today = new Date();

    const live = allMatches.filter(isLive);

    const todayUpcoming = allMatches
      .filter((match: any) => {
        const matchDate = getMatchDate(match);
        return  isUpcoming(match);
      })
      .sort(
        (a: any, b: any) =>
          getMatchDate(a).getTime() - getMatchDate(b).getTime()
      );

    const ended = allMatches
      .filter(isEnded)
      .sort(
        (a: any, b: any) =>
          getMatchDate(b).getTime() - getMatchDate(a).getTime()
      );

    const data = {
      success: true,
      live,
      todayUpcoming,
      ended,
      data: [...live, ...todayUpcoming, ...ended],
    };

    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );

    return Response.json(data);
  } catch (error: any) {
    console.error("Current matches API error:", error);

    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      return Response.json(cached.data);
    }

    return Response.json(
      {
        success: false,
        message: error?.message || "Failed to load current matches",
        live: [],
        todayUpcoming: [],
        ended: [],
        data: [],
      },
      { status: 500 }
    );
  }
}