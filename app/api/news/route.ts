import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "cache-news.json");

const ONE_HOUR = 60 * 60 * 1000;

export async function GET() {
  try {
    // check cache
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(
        fs.readFileSync(CACHE_FILE, "utf-8")
      );

      const isValid =
        Date.now() - cached.timestamp < ONE_HOUR;

      // return cached data
      if (isValid) {
        return Response.json(cached.data);
      }
    }

    // fetch fresh news
    const res = await fetch(
      `${process.env.GNEWS_API_URL}/search?q=cricket&lang=en&max=10&token=${process.env.GNEWS_API_KEY}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    // save cache locally
    fs.writeFileSync(
      CACHE_FILE,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );

    return Response.json(data);
  } catch (error) {
    // fallback old cache
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(
        fs.readFileSync(CACHE_FILE, "utf-8")
      );

      return Response.json(cached.data);
    }

    return Response.json(
      {
        articles: [],
      },
      { status: 500 }
    );
  }
}