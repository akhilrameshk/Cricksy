/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Team";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get("tournamentId");
console.log("tournamentId", tournamentId);
  const data = await Team.find({ tournamentId }).sort({ createdAt: -1 });
console.log("teams", data);
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const data = await Team.create({
      tournamentId: body.tournamentId,
      teamName: body.teamName,
      captain: body.captain,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}