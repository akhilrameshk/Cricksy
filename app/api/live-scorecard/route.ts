import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache");
const ONE_HOUR = 60 * 60 * 1000;

function getCacheFile(id: string) {
  return path.join(CACHE_DIR, `live-scorecard-${id}.json`);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (!id) {
    return Response.json(
      {
        status: "error",
        message: "Match id required",
      },
      { status: 400 }
    );
  }

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cacheFile = getCacheFile(id);

    // USE CACHE
    if (fs.existsSync(cacheFile)) {
      const cached = JSON.parse(
        fs.readFileSync(cacheFile, "utf-8")
      );

      const isExpired =
        Date.now() - cached.timestamp > ONE_HOUR;

      if (!isExpired) {
        return Response.json({
          ...cached.data,
          cached: true,
        });
      }
    }

    // FETCH API
    const res = await fetch(
      `${process.env.CRIC_API_URL}/match_scorecard?apikey=${process.env.CRIC_API_KEY}&id=${id}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    // SAVE CACHE
    fs.writeFileSync(
      cacheFile,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );

    return Response.json({
      ...data,
      cached: false,
    });
  } catch (error) {
    const cacheFile = getCacheFile(id);

    // FALLBACK CACHE
    if (fs.existsSync(cacheFile)) {
      const cached = JSON.parse(
        fs.readFileSync(cacheFile, "utf-8")
      );

      return Response.json({
        ...cached.data,
        cached: true,
      });
    }

    return Response.json(
      {
        status: "error",
        message: "Unable to fetch scorecard",
      },
      { status: 500 }
    );
  }
}