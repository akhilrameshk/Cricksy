/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId");
console.log(teamId,"Team ID from query params:");
  const data = await Player.find({ teamId }).sort({ createdAt: -1 });
console.log(data,"Players fetched from DB:");
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const data = await Player.create({
      tournamentId: body.tournamentId,
      teamId: body.teamId,
      team: body.team,
      name: body.name,
      role: body.role,
      battingStyle: body.battingStyle,
      bowlingStyle: body.bowlingStyle,
      status: body.status,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}