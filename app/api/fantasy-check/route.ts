/* eslint-disable @typescript-eslint/no-explicit-any */

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const { match, type } = await req.json();

    if (!match) {
      return Response.json(
        { success: false, message: "Match data required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a cricket match analyst.

Check whether ${type} information is available for this match.

Match:
${JSON.stringify(match, null, 2)}

Task:
${
  type === "toss"
    ? `
Find if toss has happened.
If available, identify:
- tossWinner
- tossDecision
- firstBattingTeam
- secondBattingTeam
- firstBowlingTeam
- secondBowlingTeam
`
    : `
Find if confirmed playing XI / lineup is available.
If available, identify player names team-wise.
`
}

Return valid JSON only:

${
  type === "toss"
    ? `
{
  "available": true,
  "summary": "",
  "tossWinner": "",
  "tossDecision": "",
  "firstBattingTeam": "",
  "secondBattingTeam": "",
  "firstBowlingTeam": "",
  "secondBowlingTeam": ""
}
`
    : `
{
  "available": true,
  "summary": "",
  "teams": [
    {
      "team": "",
      "players": []
    }
  ]
}
`
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(cleanJson(text));

    return Response.json({
      success: true,
      provider: "groq",
      data,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Failed to check match information",
      },
      { status: 500 }
    );
  }
}