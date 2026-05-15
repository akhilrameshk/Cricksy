/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ScoreInnings from "@/models/ScoreInnings";
import Match from "@/models/Match";

function getOvers(legalBalls: number) {
  return `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
}

function getOutText(data: any) {
  const { batsman, bowler, fielder, wicketType, runs, balls } = data;

  if (wicketType === "catch") {
    return `${batsman} c ${fielder} b ${bowler} ${runs}(${balls})`;
  }

  if (wicketType === "bowled") {
    return `${batsman} b ${bowler} ${runs}(${balls})`;
  }

  if (wicketType === "lbw") {
    return `${batsman} lbw b ${bowler} ${runs}(${balls})`;
  }

  if (wicketType === "runout") {
    return `${batsman} run out (${fielder}) ${runs}(${balls})`;
  }

  return `${batsman} out ${runs}(${balls})`;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const innings: any = await ScoreInnings.findById(body.inningsId);

    if (!innings) {
      return NextResponse.json(
        { success: false, message: "Innings not found" },
        { status: 404 }
      );
    }

    if (innings.isCompleted) {
      return NextResponse.json(
        { success: false, message: "This innings is already completed" },
        { status: 400 }
      );
    }

    innings.striker = body.striker;
    innings.nonStriker = body.nonStriker;
    innings.currentBowler = body.currentBowler;

    const strikerName = body.striker;
    const bowlerName = body.currentBowler;

    const batsman = innings.batsmen.find((b: any) => b.name === strikerName);

    if (!batsman) {
      return NextResponse.json(
        { success: false, message: "Batsman not found" },
        { status: 400 }
      );
    }

    let bowler = innings.bowlers.find((b: any) => b.name === bowlerName);

    if (!bowler) {
      innings.bowlers.push({
        name: bowlerName,
        balls: 0,
        runs: 0,
        wickets: 0,
        wides: 0,
        noBalls: 0,
      });

      bowler = innings.bowlers.find((b: any) => b.name === bowlerName);
    }

    const batsmanRuns = Number(body.runs || 0);
    const extraType = body.extraType || "none";

    let extraRuns = Number(body.extraRuns || 0);

    if (extraType === "noBall" && extraRuns < 1) {
      extraRuns = 1;
    }

    if (extraType === "wide" && extraRuns < 1) {
      extraRuns = 1;
    }

    const isWide = extraType === "wide";
    const isNoBall = extraType === "noBall";
    const isLegBye = extraType === "legBye";
    const isLegalBall = !isWide && !isNoBall;

    const over = Math.floor(innings.legalBalls / 6);
    const ball = (innings.legalBalls % 6) + 1;

    const totalBallRuns = batsmanRuns + extraRuns;

    innings.totalRuns += totalBallRuns;

    if (isLegalBall) {
      innings.legalBalls += 1;
      batsman.balls += 1;
      bowler.balls += 1;
    }

    // Batsman runs:
    // Normal ball: yes
    // No ball: yes, but ball not counted
    // Wide: no
    // Leg bye: no
    if (!isWide && !isLegBye) {
      batsman.runs += batsmanRuns;

      if (batsmanRuns === 4) batsman.fours += 1;
      if (batsmanRuns === 6) batsman.sixes += 1;
    }

    if (extraType !== "none") {
      innings.extras += extraRuns;
    }

    if (isWide) {
      bowler.wides += extraRuns;
      bowler.runs += totalBallRuns;
    } else if (isNoBall) {
      bowler.noBalls += extraRuns;
      bowler.runs += totalBallRuns;
    } else if (!isLegBye) {
      bowler.runs += totalBallRuns;
    }

    let ballText = "";

    if (isNoBall) {
      ballText = `${over}.${ball} No ball + ${strikerName} scored ${batsmanRuns}, total ${totalBallRuns}`;
    } else if (isWide) {
      ballText = `${over}.${ball} Wide ${totalBallRuns}`;
    } else if (isLegBye) {
      ballText = `${over}.${ball} Leg bye ${totalBallRuns}`;
    } else {
      ballText = `${over}.${ball} ${strikerName} scored ${batsmanRuns}`;
    }

    let dismissedName = "";

    if (body.isWicket) {
      innings.wickets += 1;
      dismissedName = body.outBatsman || strikerName;

      const dismissedBatsman = innings.batsmen.find(
        (b: any) => b.name === dismissedName
      );

      if (dismissedBatsman) {
        dismissedBatsman.isOut = true;

        dismissedBatsman.outText = getOutText({
          batsman: dismissedBatsman.name,
          bowler: bowlerName,
          fielder: body.fielder,
          wicketType: body.wicketType,
          runs: dismissedBatsman.runs,
          balls: dismissedBatsman.balls,
        });

        ballText = dismissedBatsman.outText;
      }

      if (["catch", "bowled", "lbw"].includes(body.wicketType)) {
        bowler.wickets += 1;
      }

      if (body.nextBatsman) {
        if (dismissedName === innings.striker) {
          innings.striker = body.nextBatsman;
        } else if (dismissedName === innings.nonStriker) {
          innings.nonStriker = body.nextBatsman;
        }
      }
    }

    if (!body.isWicket && batsmanRuns % 2 === 1) {
      const temp = innings.striker;
      innings.striker = innings.nonStriker;
      innings.nonStriker = temp;
    }

    if (isLegalBall && innings.legalBalls % 6 === 0) {
      const temp = innings.striker;
      innings.striker = innings.nonStriker;
      innings.nonStriker = temp;

      if (body.nextBowler) {
        innings.currentBowler = body.nextBowler;
      }
    }

    innings.balls.push({
      over,
      ball,
      batsman: strikerName,
      bowler: bowlerName,
      runs: totalBallRuns,
      batsmanRuns,
      extraType,
      extraRuns,
      isWicket: body.isWicket,
      wicketType: body.wicketType,
      fielder: body.fielder,
      outBatsman: dismissedName,
      scoreAtWicket: body.isWicket
        ? `${innings.totalRuns}-${innings.wickets}`
        : "",
      text: ballText,
    });

    let matchUpdate: any = {
      score: `${innings.totalRuns}/${innings.wickets}`,
      overs: getOvers(innings.legalBalls),
      status: "Live",
    };

    const inningsList: any[] = await ScoreInnings.find({
      matchId: innings.matchId,
    }).sort({ inningNumber: 1 });

    const firstInnings = inningsList.find((i: any) => i.inningNumber === 1);

    if (
      innings.inningNumber === 2 &&
      firstInnings &&
      innings.totalRuns > firstInnings.totalRuns
    ) {
      innings.isCompleted = true;

      const wicketsLeft = 10 - innings.wickets;

      matchUpdate = {
        score: `${innings.totalRuns}/${innings.wickets}`,
        overs: getOvers(innings.legalBalls),
        status: "Completed",
        result: `${innings.battingTeam} won by ${wicketsLeft} wicket${
          wicketsLeft === 1 ? "" : "s"
        }`,
      };
    }

    if (innings.wickets >= 10) {
      innings.isCompleted = true;

      if (innings.inningNumber === 2 && firstInnings) {
        let result = "";

        if (innings.totalRuns > firstInnings.totalRuns) {
          const wicketsLeft = 10 - innings.wickets;
          result = `${innings.battingTeam} won by ${wicketsLeft} wicket${
            wicketsLeft === 1 ? "" : "s"
          }`;
        } else if (innings.totalRuns < firstInnings.totalRuns) {
          const runsWin = firstInnings.totalRuns - innings.totalRuns;
          result = `${firstInnings.battingTeam} won by ${runsWin} run${
            runsWin === 1 ? "" : "s"
          }`;
        } else {
          result = "Match tied";
        }

        matchUpdate = {
          score: `${innings.totalRuns}/${innings.wickets}`,
          overs: getOvers(innings.legalBalls),
          status: "Completed",
          result,
        };
      }
    }

    await innings.save();

    await Match.findByIdAndUpdate(innings.matchId, matchUpdate);

    return NextResponse.json({
      success: true,
      data: innings,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}