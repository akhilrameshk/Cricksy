/* eslint-disable @typescript-eslint/no-explicit-any */

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { match, option } = await req.json();

    if (!match) {
      return Response.json(
        { success: false, message: "Match data required" },
        { status: 400 }
      );
    }

    const isSecondInnings = option === "second-innings";

    const prompt = `
You are an AI fantasy cricket assistant.

Create ${isSecondInnings ? "3" : "5"} Dream11-style fantasy teams.

Important rules:
- Suggestions only. No winning guarantee.
- Do not promote betting or gambling.
- Use only the match data provided.
- If player/squad names are missing, use team roles and clearly say final playing XI is needed.
- Captain and vice-captain should be different.
- Prefer balanced combinations.

Mode:
${isSecondInnings ? "Second innings 5-minute quick team suggestions" : "Full match Dream11 team suggestions"}

Match data:
${JSON.stringify(match, null, 2)}

Return ONLY valid JSON:
{
  "matchTitle": "",
  "option": "${isSecondInnings ? "second-innings" : "dream11"}",
  "disclaimer": "AI fantasy teams are suggestions only. No winning guarantee.",
  "teams": [
    {
      "teamName": "Safe Team 1",
      "risk": "Safe",
      "captain": "",
      "viceCaptain": "",
      "wicketKeeper": [],
      "batters": [],
      "allRounders": [],
      "bowlers": [],
      "reason": ""
    }
  ]
}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = response.output_text || "{}";

    return Response.json({
      success: true,
      data: JSON.parse(text),
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Failed to generate fantasy suggestion",
      },
      { status: 500 }
    );
  }
}