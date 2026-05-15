/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ScoreInnings from "@/models/ScoreInnings";

function oversText(balls: number) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function playerKey(team: string, playerId: any, name: string) {
  return `${team}-${playerId ? String(playerId) : name}`;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const inningsList: any[] = await ScoreInnings.find({
      tournamentId: id,
    }).lean();

    const batsmanMap: Record<string, any> = {};
    const bowlerMap: Record<string, any> = {};

    inningsList.forEach((inn: any) => {
      const matchId = String(inn.matchId);

      inn.batsmen?.forEach((b: any) => {
        const key = playerKey(inn.battingTeam, b.playerId, b.name);

        if (!batsmanMap[key]) {
          batsmanMap[key] = {
            name: b.name,
            team: inn.battingTeam,
            matchesSet: new Set<string>(),
            totalRuns: 0,
            totalBalls: 0,
          };
        }

        if (b.balls > 0 || b.runs > 0 || b.isOut) {
          batsmanMap[key].matchesSet.add(matchId);
        }

        batsmanMap[key].totalRuns += Number(b.runs || 0);
        batsmanMap[key].totalBalls += Number(b.balls || 0);
      });

      inn.bowlers?.forEach((b: any) => {
        const key = playerKey(inn.bowlingTeam, b.playerId, b.name);

        if (!bowlerMap[key]) {
          bowlerMap[key] = {
            name: b.name,
            team: inn.bowlingTeam,
            matchesSet: new Set<string>(),
            balls: 0,
            runs: 0,
            wickets: 0,
          };
        }

        if (Number(b.balls || 0) > 0) {
          bowlerMap[key].matchesSet.add(matchId);
        }

        bowlerMap[key].balls += Number(b.balls || 0);
        bowlerMap[key].runs += Number(b.runs || 0);
        bowlerMap[key].wickets += Number(b.wickets || 0);
      });
    });

    const batsmen = Object.values(batsmanMap)
      .map((p: any) => {
        const matches = p.matchesSet.size;

        return {
          name: p.name,
          team: p.team,
          matches,
          totalRuns: p.totalRuns,
          totalBalls: p.totalBalls,
          average: matches > 0 ? Number((p.totalRuns / matches).toFixed(2)) : 0,
          strikeRate:
            p.totalBalls > 0
              ? Number(((p.totalRuns / p.totalBalls) * 100).toFixed(2))
              : 0,
        };
      })
      .sort((a: any, b: any) => {
        if (b.totalRuns !== a.totalRuns) return b.totalRuns - a.totalRuns;
        return b.strikeRate - a.strikeRate;
      })
      .slice(0, 10);

    const bowlers = Object.values(bowlerMap)
      .map((p: any) => {
        const matches = p.matchesSet.size;
        const overs = p.balls / 6;

        return {
          name: p.name,
          team: p.team,
          matches,
          balls: p.balls,
          overs: oversText(p.balls),
          wickets: p.wickets,
          economy: overs > 0 ? Number((p.runs / overs).toFixed(2)) : 0,
          strikeRate:
            p.wickets > 0 ? Number((p.balls / p.wickets).toFixed(2)) : 0,
        };
      })
      .sort((a: any, b: any) => {
        if (b.wickets !== a.wickets) return b.wickets - a.wickets;
        return a.economy - b.economy;
      })
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        batsmen,
        bowlers,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}