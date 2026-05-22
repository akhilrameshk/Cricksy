/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";
import Score from "@/models/ScoreInnings";
import "@/models/Player";

function getOvers(legalBalls: number) {
  return `${Math.floor((legalBalls || 0) / 6)}.${(legalBalls || 0) % 6}`;
}

function scoreLine(inn: any) {
  if (!inn) return "0/0";
  return `${inn.totalRuns || 0}/${inn.wickets || 0}`;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get("tournamentId");

    const query: any = {};

    if (tournamentId) {
      query.tournamentId = tournamentId;
    }

    const matches = await Match.find(query)
      .populate("teamAPlayingXI")
      .populate("teamBPlayingXI")
      .sort({ createdAt: -1 })
      .lean();

    const data = await Promise.all(
      matches.map(async (match: any) => {
        const inningsList = await Score.find({ matchId: match._id })
          .sort({ inningNumber: 1 })
          .lean();

        const firstInnings = inningsList.find(
          (i: any) => i.inningNumber === 1
        );

        const secondInnings = inningsList.find(
          (i: any) => i.inningNumber === 2
        );

        const teamAInnings =
          firstInnings?.battingTeam === match.teamA
            ? firstInnings
            : secondInnings?.battingTeam === match.teamA
            ? secondInnings
            : null;

        const teamBInnings =
          firstInnings?.battingTeam === match.teamB
            ? firstInnings
            : secondInnings?.battingTeam === match.teamB
            ? secondInnings
            : null;

        return {
          ...match,
          teamAScore: scoreLine(teamAInnings),
          teamAOvers: getOvers(teamAInnings?.legalBalls || 0),
          teamBScore: scoreLine(teamBInnings),
          teamBOvers: getOvers(teamBInnings?.legalBalls || 0),
          inningsList,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load matches",
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const data = await Match.create(body);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create match",
      },
      { status: 500 }
    );
  }
}