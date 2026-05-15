import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Match from "@/models/Match";

export async function GET() {
  await connectDB();
  const data = await Match.find().sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const data = await Match.create(body);

  return NextResponse.json({ success: true, data }, { status: 201 });
}