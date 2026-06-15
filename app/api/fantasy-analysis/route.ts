/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  try {
    const { match, limit = 5 } = await req.json();

    if (!match) {
      return Response.json(
        { success: false, message: "Match required" },
        { status: 400 }
      );
    }

    const teamA = match?.teams?.[0] || match?.teamA;
    const teamB = match?.teams?.[1] || match?.teamB;

    const seriesId =
      match?.series_id ||
      match?.seriesId ||
      match?.seriesInfo?.id ||
      "87c62aac-bc3c-4738-ab93-19da0690488f";

    const res = await fetch(
      `${process.env.CRIC_API_URL}/series_info?apikey=${process.env.CRIC_API_KEY}&id=${seriesId}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    const allMatches = json?.data?.matchList || [];

    const recentMatches = allMatches
      .filter((m: any) => {
        const teams = m.teams || [];
        const status = String(m.status || "").toLowerCase();

        return (
          (teams.includes(teamA) || teams.includes(teamB)) &&
          (m.matchEnded === true ||
            status.includes("won") ||
            status.includes("match ended"))
        );
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.dateTimeGMT || b.date).getTime() -
          new Date(a.dateTimeGMT || a.date).getTime()
      )
      .slice(0, limit);

    const scorecards = await Promise.all(
      recentMatches.map(async (m: any) => {
        try {
          const scoreRes = await fetch(
            `${process.env.CRIC_API_URL}/match_scorecard?apikey=${process.env.CRIC_API_KEY}&id=${m.id}`,
            { cache: "no-store" }
          );

          const scoreJson = await scoreRes.json();

          return {
            id: m.id,
            name: m.name,
            status: m.status,
            venue: m.venue,
            date: m.date,
            teams: m.teams,
            scorecard: scoreJson?.data || null,
          };
        } catch {
          return {
            id: m.id,
            name: m.name,
            status: m.status,
            venue: m.venue,
            date: m.date,
            teams: m.teams,
            scorecard: null,
          };
        }
      })
    );

    return Response.json({
      success: true,
      data: {
        teamA,
        teamB,
        recentMatches,
        scorecards,
      },
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Failed to fetch fantasy analysis",
        data: null,
      },
      { status: 500 }
    );
  }
}