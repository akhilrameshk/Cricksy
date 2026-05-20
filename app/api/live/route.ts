import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "cache-live.json");

//const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const TWO_MINUTES = 60 * 60 * 1000;
//const FIFTEEN_MINUTES = 15 * 60 * 1000;

export async function GET() {
  try {
    // check cache exists
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));

      const isValid =
        Date.now() - cached.timestamp < TWO_MINUTES;

      // return cached data
      if (isValid) {
        return Response.json(cached.data);
      }
    }

    // fetch new data
    const res = await fetch(
      `${process.env.CRIC_API_URL}/currentMatches?apikey=${process.env.CRIC_API_KEY}&offset=0`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    // save cache
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );

    return Response.json(data);
  } catch (error) {
    // fallback to old cache if api fails
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));

      return Response.json(cached.data);
    }

    return Response.json(
      {
        status: "error",
        data: [],
      },
      { status: 500 }
    );
  }
}