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
      match?.teamAPlayingXI?.length ||
      match?.teamBPlayingXI?.length ||
      match?.teamInfo?.length
  );
}

function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

function getPlayerName(player: any) {
  if (typeof player === "string") return player;
  return player?.name || player?.playerName || player?.shortname || "";
}

function normalizeName(name: string) {
  return String(name || "").toLowerCase().trim();
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

    const teamAName =
      match?.teamInfo?.[0]?.name ||
      match?.teams?.[0] ||
      match?.teamA ||
      "Team A";

    const teamBName =
      match?.teamInfo?.[1]?.name ||
      match?.teams?.[1] ||
      match?.teamB ||
      "Team B";

    const teamAPlayers = (
      match?.teamAPlayingXI ||
      match?.teamAPlayers ||
      match?.playingXI?.[teamAName] ||
      match?.squad?.[teamAName] ||
      []
    )
      .map(getPlayerName)
      .filter(Boolean);

    const teamBPlayers = (
      match?.teamBPlayingXI ||
      match?.teamBPlayers ||
      match?.playingXI?.[teamBName] ||
      match?.squad?.[teamBName] ||
      []
    )
      .map(getPlayerName)
      .filter(Boolean);

    const allowedPlayers = [...teamAPlayers, ...teamBPlayers];

    if (isSecondInnings && (!tossDone || !lineupDone)) {
      return Response.json(
        {
          success: false,
          locked: true,
          message:
            "Second innings fantasy team can be created only after toss and lineup are available.",
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

    if (isSecondInnings && !allowedPlayers.length) {
      return Response.json(
        {
          success: false,
          message:
            "No lineup players available. Please update playing XI before generating second innings team.",
        },
        { status: 400 }
      );
    }

    const hasAllowedPlayers = allowedPlayers.length > 0;

    const prompt = `
You are a fantasy cricket analyst.

Create fantasy cricket teams.

Important:
- Suggestions only. No winning guarantee.
- Do not mention betting or gambling.
- Return valid JSON only.
- Use recent scorecards, batting form, wickets, economy, all-round impact and venue if available.

${
  hasAllowedPlayers
    ? `
Allowed players:
${JSON.stringify(
  {
    [teamAName]: teamAPlayers,
    [teamBName]: teamBPlayers,
  },
  null,
  2
)}

STRICT:
- Select players ONLY from the allowed players list.
- Do NOT use memory or old squads.
- Do NOT include any player outside the allowed list.
`
    : `
No confirmed squad/lineup available.
PRE-TOSS RULE:
- Create teams using likely players only from these two teams:
  ${teamAName}
  ${teamBName}
- Clearly mention this is a pre-toss suggestion and may change after lineup.
`
}

Match:
${JSON.stringify(match, null, 2)}

Recent scorecards and performance:
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
`
    : tossDone && lineupDone
    ? `
FULL MATCH FINAL TEAM MODE:
- Toss and lineup are available.
- Create exactly 5 final teams.
- Each team must have exactly 11 players.
- Use actual player names only from allowed players.
`
    : `
FULL MATCH PRE-TOSS MODE:
- Toss and lineup are not available.
- Create exactly 5 pre-toss teams.
- DO NOT return player names.
- DO NOT guess player names.
- Return only role/team structure.
- Use actual team names in brackets.

For each team:
- captainRole must be like: "Opening Batter (${teamAName})"
- viceCaptainRole must be like: "All Rounder (${teamBName})"
- wk, bat, ar, bowl must total 11.
- teamACount and teamBCount must total 11.

Return this structure only:
{
  "teamName": "Safe Team",
  "risk": "Safe",
  "captainRole": "Opening Batter (${teamAName})",
  "viceCaptainRole": "All Rounder (${teamBName})",
  "wk": 1,
  "bat": 4,
  "ar": 3,
  "bowl": 3,
  "teamACount": 6,
  "teamBCount": 5,
  "reason": "Balanced pre-toss combination"
}
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
      temperature: isSecondInnings ? 0.35 : 0.55,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(cleanJson(text));

    if (hasAllowedPlayers) {
      const allowedSet = new Set(allowedPlayers.map(normalizeName));

      parsed.teams = (parsed.teams || []).map((team: any) => {
        const filteredPlayers = (team.players || []).filter((player: string) =>
          allowedSet.has(normalizeName(player))
        );

        const limit = isSecondInnings ? 5 : 11;

        return {
          ...team,
          players: filteredPlayers.slice(0, limit),
          captain: allowedSet.has(normalizeName(team.captain))
            ? team.captain
            : filteredPlayers[0] || "",
          viceCaptain: allowedSet.has(normalizeName(team.viceCaptain))
            ? team.viceCaptain
            : filteredPlayers[1] || "",
        };
      });
    } else {
      parsed.teams = (parsed.teams || []).map((team: any) => ({
        ...team,
        players: (team.players || []).slice(0, isSecondInnings ? 5 : 11),
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