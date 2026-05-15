/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    if (
      !Array.isArray(body.teamAPlayingXI) ||
      !Array.isArray(body.teamBPlayingXI)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid lineup data" },
        { status: 400 }
      );
    }

    if (body.teamAPlayingXI.length !== 11 || body.teamBPlayingXI.length !== 11) {
      return NextResponse.json(
        { success: false, message: "Select exactly 11 players from each team" },
        { status: 400 }
      );
    }

    const match = await Match.findByIdAndUpdate(
      id,
      {
        teamAPlayingXI: body.teamAPlayingXI,
        teamBPlayingXI: body.teamBPlayingXI,
        lineupUpdated: true,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: match });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}