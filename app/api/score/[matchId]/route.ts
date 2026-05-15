/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ScoreInnings from "@/models/ScoreInnings";

export async function GET(
  _req: Request,
  context: { params: Promise<{ matchId: string }> }
) {
  try {
    await connectDB();

    const { matchId } = await context.params;

    const inningsList = await ScoreInnings.find({ matchId }).sort({
      inningNumber: 1,
    });

    const activeInnings =
      inningsList.find((inn: any) => inn.isCompleted === false) || null;

    return NextResponse.json({
      success: true,
      data: activeInnings,
      inningsList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}