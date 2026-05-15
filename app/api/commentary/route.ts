import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Commentary from "@/models/Commentary";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get("matchId");

  const query = matchId ? { matchId } : {};
  const data = await Commentary.find(query).sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const data = await Commentary.create(body);

  return NextResponse.json({ success: true, data }, { status: 201 });
}