import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  const data = await Match.findById(id)
    .populate("teamAPlayingXI")
    .populate("teamBPlayingXI");

  if (!data) {
    return NextResponse.json(
      { success: false, message: "Match not found in DB" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}