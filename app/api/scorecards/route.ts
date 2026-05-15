import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Scorecard from "@/models/Scorecard";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  const query = matchId ? { matchId } : {};
  const data = await Scorecard.find(query).sort({ innings: 1 });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const data = await Scorecard.create(body);

  return NextResponse.json({ success: true, data }, { status: 201 });
}