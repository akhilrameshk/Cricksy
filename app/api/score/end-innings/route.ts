/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ScoreInnings from "@/models/ScoreInnings";
import Match from "@/models/Match";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const innings: any = await ScoreInnings.findById(body.inningsId);

    if (!innings) {
      return NextResponse.json(
        { success: false, message: "Innings not found" },
        { status: 404 }
      );
    }

    let inningsList: any[] = await ScoreInnings.find({
      matchId: innings.matchId,
    }).sort({ createdAt: 1 });

    for (let i = 0; i < inningsList.length; i++) {
      if (!inningsList[i].inningNumber) {
        inningsList[i].inningNumber = i + 1;
        await inningsList[i].save();
      }
    }

    if (!innings.inningNumber) {
      innings.inningNumber =
        inningsList.findIndex(
          (i: any) => String(i._id) === String(innings._id)
        ) + 1 || 1;
    }

    innings.isCompleted = true;
    await innings.save();

    inningsList = await ScoreInnings.find({
      matchId: innings.matchId,
    }).sort({ inningNumber: 1 });

    const first = inningsList.find((i: any) => i.inningNumber === 1);
    const second = inningsList.find((i: any) => i.inningNumber === 2);

    let result = "";

    if (first && second && second.isCompleted) {
      if (second.totalRuns > first.totalRuns) {
        const wicketsLeft = 10 - second.wickets;
        result = `${second.battingTeam} won by ${wicketsLeft} wicket${
          wicketsLeft === 1 ? "" : "s"
        }`;
      } else if (second.totalRuns < first.totalRuns) {
        const runsWin = first.totalRuns - second.totalRuns;
        result = `${first.battingTeam} won by ${runsWin} run${
          runsWin === 1 ? "" : "s"
        }`;
      } else {
        result = "Match tied";
      }

      await Match.findByIdAndUpdate(innings.matchId, {
        status: "Completed",
        result,
      });
    } else {
      await Match.findByIdAndUpdate(innings.matchId, {
        status: "Live",
      });
    }

    return NextResponse.json({
      success: true,
      data: innings,
      result,
      inningsList,
      message:
        innings.inningNumber === 1
          ? "First innings ended. Start second innings."
          : "Innings ended.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}