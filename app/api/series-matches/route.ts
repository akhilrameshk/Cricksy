/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";

const SERIES_ID = "f3e5c7dd-332c-4893-9067-aa2bfe6d2b85";

const CACHE_DIR = path.join(process.cwd(), "cache");
const CACHE_FILE = path.join(CACHE_DIR, "series-matches.json");

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getNext7DaysMatches(matchList: any[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);
  next7Days.setHours(23, 59, 59, 999);

  return (matchList || [])
    .filter((match: any) => {
      const matchDate = new Date(match.dateTimeGMT);
      return matchDate >= today && matchDate <= next7Days;
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.dateTimeGMT).getTime() -
        new Date(b.dateTimeGMT).getTime()
    );
}

export async function GET() {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const todayKey = getTodayKey();

    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));

      if (cached.date === todayKey) {
        return Response.json({
          success: true,
          cached: true,
          date: cached.date,
          data: cached.data || [],
        });
      }
    }

    const res = await fetch(
      `${process.env.CRIC_API_URL}/series_info?apikey=${process.env.CRIC_API_KEY}&id=${SERIES_ID}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    const matches = getNext7DaysMatches(json.data?.matchList || []);

    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({
        date: todayKey,
        timestamp: Date.now(),
        data: matches,
      })
    );

    return Response.json({
      success: true,
      cached: false,
      date: todayKey,
      data: matches,
    });
  } catch {
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));

      return Response.json({
        success: true,
        cached: true,
        fallback: true,
        date: cached.date,
        data: cached.data || [],
      });
    }

    return Response.json(
      {
        success: false,
        message: "Failed to load series matches",
        data: [],
      },
      { status: 500 }
    );
  }
}