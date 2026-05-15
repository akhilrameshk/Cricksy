/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";
import ScoreInnings from "@/models/ScoreInnings";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const match = await Match.findById(body.matchId)
      .populate("teamAPlayingXI")
      .populate("teamBPlayingXI");

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      );
    }

    if (!match.lineupUpdated) {
      return NextResponse.json(
        { success: false, message: "Please update lineup first" },
        { status: 400 }
      );
    }

    const inningsCount = await ScoreInnings.countDocuments({
      matchId: body.matchId,
    });

    const inningNumber = inningsCount + 1;

    if (inningNumber > 2) {
      return NextResponse.json(
        { success: false, message: "Both innings already completed" },
        { status: 400 }
      );
    }

    const existingActive = await ScoreInnings.findOne({
      matchId: body.matchId,
      isCompleted: false,
    });

    if (existingActive) {
      return NextResponse.json({ success: true, data: existingActive });
    }

    const battingPlayers =
      body.battingTeam === match.teamA
        ? match.teamAPlayingXI
        : match.teamBPlayingXI;

    const bowlingPlayers =
      body.bowlingTeam === match.teamA
        ? match.teamAPlayingXI
        : match.teamBPlayingXI;

    const innings = await ScoreInnings.create({
      tournamentId: body.tournamentId,
      matchId: body.matchId,
      inningNumber,
      isCompleted: false,

      battingTeam: body.battingTeam,
      bowlingTeam: body.bowlingTeam,

      striker: body.striker,
      nonStriker: body.nonStriker,
      currentBowler: body.currentBowler,

      batsmen: battingPlayers.map((p: any) => ({
        playerId: p._id,
        name: p.name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
        outText: "",
      })),

      bowlers: [
        {
          playerId: body.currentBowlerId,
          name: body.currentBowler,
          balls: 0,
          runs: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
        },
      ],

      balls: [],
    });

    return NextResponse.json({ success: true, data: innings }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}