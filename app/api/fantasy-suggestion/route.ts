/* eslint-disable @typescript-eslint/no-explicit-any */

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function hasToss(match: any) {
  return Boolean(
    match?.tossWinner ||
      match?.tossChoice ||
      match?.toss ||
      match?.status?.toLowerCase?.().includes("won the toss")
  );
}

function hasLineup(match: any) {
  return Boolean(
    match?.lineupUpdated ||
      match?.hasSquad ||
      match?.playingXI ||
      match?.teamAPlayingXI ||
      match?.teamBPlayingXI
  );
}

function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const {
      match,
      option,
      recentPerformance,
      secondBattingTeam,
      secondBowlingTeam,
    } = await req.json();

    if (!match) {
      return Response.json(
        { success: false, message: "Match data required" },
        { status: 400 }
      );
    }

    const isSecondInnings = option === "second-innings";
    const tossDone = hasToss(match);
    const lineupDone = hasLineup(match);

    if (isSecondInnings && (!tossDone || !lineupDone)) {
      return Response.json(
        {
          success: false,
          locked: true,
          message:
            "Second innings fantasy team can be created only after toss and lineup are available.",
          requirements: {
            tossDone,
            lineupDone,
            secondBattingTeam: Boolean(secondBattingTeam),
            secondBowlingTeam: Boolean(secondBowlingTeam),
          },
        },
        { status: 400 }
      );
    }

    if (isSecondInnings && (!secondBattingTeam || !secondBowlingTeam)) {
      return Response.json(
        {
          success: false,
          locked: true,
          message:
            "Please select second batting team and second bowling team before creating second innings team.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are a fantasy cricket analyst.

Create fantasy cricket teams.

Important:
- Suggestions only. No winning guarantee.
- Do not mention betting or gambling.
- Return valid JSON only.
- Use recent performance, toss, pitch and lineup data if provided.

Match:
${JSON.stringify(match, null, 2)}

Recent performance:
${JSON.stringify(recentPerformance || {}, null, 2)}

Mode:
${
  isSecondInnings
    ? `
SECOND INNINGS MODE:
- Create exactly 3 teams.
- Each team must have exactly 5 players only.
- Players must be selected only from:
  1. Second batting team: ${secondBattingTeam}
  2. Second bowling team: ${secondBowlingTeam}
- Use batters/all-rounders from second batting team.
- Use bowlers/all-rounders from second bowling team.
- Do not include any other team player.
`
    : tossDone && lineupDone
    ? `
FULL MATCH FINAL TEAM MODE:
- Toss and lineup are available.
- Create exactly 5 updated final teams.
- Each team must have exactly 11 players.
- Use actual lineup and recent stats.
`
    : `
FULL MATCH PRE-TOSS MODE:
- Toss or lineup is not available.
- Create exactly 5 dummy/pre-toss teams.
- Each team must have exactly 11 players if possible.
- Clearly mention this is pre-toss dummy suggestion.
`
}

Return JSON only:
{
  "matchTitle": "",
  "mode": "${
    isSecondInnings
      ? "second-innings"
      : tossDone && lineupDone
      ? "final-after-toss"
      : "pre-toss-dummy"
  }",
  "disclaimer": "Fantasy teams are suggestions only. No winning guarantee.",
  "teams": [
    {
      "teamName": "",
      "risk": "Safe",
      "captain": "",
      "viceCaptain": "",
      "players": [],
      "reason": ""
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: isSecondInnings ? 0.4 : 0.6,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(cleanJson(text));

    if (isSecondInnings) {
      parsed.teams = (parsed.teams || []).map((team: any) => ({
        ...team,
        players: (team.players || []).slice(0, 5),
      }));
    }

    if (!isSecondInnings) {
      parsed.teams = (parsed.teams || []).map((team: any) => ({
        ...team,
        players: (team.players || []).slice(0, 11),
      }));
    }

    return Response.json({
      success: true,
      provider: "groq",
      tossDone,
      lineupDone,
      data: parsed,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Failed to generate fantasy teams",
      },
      { status: 500 }
    );
  }
}