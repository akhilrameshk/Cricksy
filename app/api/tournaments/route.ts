import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tournament from "@/models/Tournament";

export async function GET() {
  await connectDB();

  const tournaments = await Tournament.find().sort({ createdAt: -1 });

  return NextResponse.json({
    success: true,
    data: tournaments,
  });
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const tournament = await Tournament.create(body);

  return NextResponse.json(
    {
      success: true,
      data: tournament,
    },
    { status: 201 }
  );
}