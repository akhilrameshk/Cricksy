"use client";

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function MatchScorePage() {
    const params = useParams();

    const tournamentId = params.id as string;
    const matchId = params.matchId as string;

    const [match, setMatch] = useState<any>(null);
    const [innings, setInnings] = useState<any>(null);
    const [inningsList, setInningsList] = useState<any[]>([]);
    const [showCompletedScorecard, setShowCompletedScorecard] = useState(false);
    const [activeTab, setActiveTab] = useState("commentary");

    const [battingTeam, setBattingTeam] = useState("");
    const [bowlingTeam, setBowlingTeam] = useState("");

    const [battingPlayers, setBattingPlayers] = useState<any[]>([]);
    const [bowlingPlayers, setBowlingPlayers] = useState<any[]>([]);

    const [striker, setStriker] = useState("");
    const [nonStriker, setNonStriker] = useState("");
    const [currentBowler, setCurrentBowler] = useState("");

    const [ball, setBall] = useState({
        runs: 0,
        extraType: "none",
        extraRuns: 0,
        isWicket: false,
        wicketType: "catch",
        outBatsman: "",
        fielder: "",
        nextBatsman: "",
        nextBowler: "",
    });

    const getOvers = (legalBalls: number) =>
        `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;

    const getPlayerId = (value: any) =>
        typeof value === "string" ? value : value?._id;

    const getPlayerName = (value: any) =>
        typeof value === "string" ? value : value?.name;

    const getStrikeRate = (runs: number, balls: number) =>
        balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";

    const getEconomy = (runs: number, balls: number) =>
        balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00";

    const loadMatch = async () => {
        const res = await fetch(`/api/matches/${matchId}`);
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
            alert(data?.message || "Failed to load match");
            return;
        }

        setMatch(data.data);
    };

    const loadScore = async () => {
        const res = await fetch(`/api/score/${matchId}`);
        const data = await res.json().catch(() => null);

        if (data?.success) {
            setInnings(data.data);
            setInningsList(data.inningsList || []);

            if (data.data) {
                setStriker(data.data.striker || "");
                setNonStriker(data.data.nonStriker || "");
                setCurrentBowler(data.data.currentBowler || "");
            }
        }
    };

    useEffect(() => {
        loadMatch();
        loadScore();
    }, []);

    useEffect(() => {
        if (!match || !innings) return;

        if (innings.battingTeam === match.teamA) {
            setBattingTeam(match.teamA);
            setBowlingTeam(match.teamB);
            setBattingPlayers(match.teamAPlayingXI || []);
            setBowlingPlayers(match.teamBPlayingXI || []);
        } else {
            setBattingTeam(match.teamB);
            setBowlingTeam(match.teamA);
            setBattingPlayers(match.teamBPlayingXI || []);
            setBowlingPlayers(match.teamAPlayingXI || []);
        }
    }, [match, innings]);

    const firstInnings = inningsList.find((i: any) => i.inningNumber === 1);
    const secondInnings = inningsList.find((i: any) => i.inningNumber === 2);
    const target =
        firstInnings && innings?.inningNumber === 2
            ? firstInnings.totalRuns + 1
            : null;

    const runsToWin =
        target && innings ? Math.max(target - innings.totalRuns, 0) : null;

    const resetBall = () => {
        setBall({
            runs: 0,
            extraType: "none",
            extraRuns: 0,
            isWicket: false,
            wicketType: "catch",
            outBatsman: "",
            fielder: "",
            nextBatsman: "",
            nextBowler: "",
        });
    };

    const selectTeamPlayers = (teamName: string) => {
        setBattingTeam(teamName);

        if (teamName === match.teamA) {
            setBowlingTeam(match.teamB);
            setBattingPlayers(match.teamAPlayingXI || []);
            setBowlingPlayers(match.teamBPlayingXI || []);
        } else {
            setBowlingTeam(match.teamA);
            setBattingPlayers(match.teamBPlayingXI || []);
            setBowlingPlayers(match.teamAPlayingXI || []);
        }
    };

    const handleBattingTeamChange = (teamName: string) => {
        selectTeamPlayers(teamName);
        setStriker("");
        setNonStriker("");
        setCurrentBowler("");
    };

    const startInnings = async () => {
        if (!match?.lineupUpdated) return alert("Please update lineup first");

        if (!battingTeam || !bowlingTeam) {
            return alert("Please select batting team");
        }

        if (!striker || !nonStriker || !currentBowler) {
            return alert("Please select striker, non-striker and bowler");
        }

        const bowlerObj = bowlingPlayers.find(
            (p) => getPlayerName(p) === currentBowler
        );

        const res = await fetch("/api/score/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tournamentId,
                matchId,
                battingTeam,
                bowlingTeam,
                striker,
                nonStriker,
                currentBowler,
                currentBowlerId: bowlerObj?._id,
            }),
        });

        const data = await res.json();

        if (data.success) {
            setInnings(data.data);
            setStriker(data.data.striker);
            setNonStriker(data.data.nonStriker);
            setCurrentBowler(data.data.currentBowler);
            await loadScore();
        } else {
            alert(data.message || "Failed to start innings");
        }
    };

    const endInnings = async () => {
        if (!innings) return;

        if (!confirm("Are you sure you want to end this innings?")) return;

        const endedInnings = innings;

        const res = await fetch("/api/score/end-innings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inningsId: endedInnings._id }),
        });

        const data = await res.json();

        if (data.success) {
            alert(data.result || data.message || "Innings ended");

            setInnings(null);
            setStriker("");
            setNonStriker("");
            setCurrentBowler("");
            resetBall();

            await loadMatch();
            await loadScore();

            if (endedInnings.inningNumber === 1 && match) {
                const nextBattingTeam =
                    endedInnings.battingTeam === match.teamA ? match.teamB : match.teamA;
                console.log("Next batting team:", nextBattingTeam);
                selectTeamPlayers(nextBattingTeam);
            }
        } else {
            alert(data.message || "Failed to end innings");
        }
    };

    const setRunButton = (runs: number) => {
        setBall({
            ...ball,
            runs,
            extraType: "none",
            extraRuns: 0,
            isWicket: false,
            wicketType: "catch",
            outBatsman: "",
            fielder: "",
            nextBatsman: "",
        });
    };

    const setExtraButton = (type: string) => {
        setBall({
            ...ball,
            runs: 0,
            extraType: type,
            extraRuns: 1,
            isWicket: false,
            wicketType: "catch",
            outBatsman: "",
            fielder: "",
            nextBatsman: "",
            nextBowler: "",
        });
    };

    const setWicketButton = () => {
        setBall({
            ...ball,
            runs: 0,
            extraType: "none",
            extraRuns: 0,
            isWicket: true,
            wicketType: "catch",
            outBatsman: "",
            fielder: "",
            nextBatsman: "",
        });
    };

    const addBall = async () => {
        if (!innings) return;

        if (!striker || !nonStriker || !currentBowler) {
            alert("Please select striker, non-striker and bowler");
            return;
        }

        if (ball.isWicket) {
            if (!ball.outBatsman) return alert("Please select out batsman");

            if (ball.wicketType === "catch" && !ball.fielder) {
                return alert("Please select fielder");
            }

            if (ball.wicketType === "runout" && !ball.fielder) {
                return alert("Please select fielder");
            }

            if (!ball.nextBatsman) return alert("Please select next batsman");
        }

        const isLegalBall =
            ball.extraType !== "wide" && ball.extraType !== "noBall";

        const currentBallInOver = innings.legalBalls % 6;
        const willOverComplete = isLegalBall && currentBallInOver === 5;

        if (willOverComplete && !ball.nextBowler) {
            alert("Please select next bowler");
            return;
        }

        const res = await fetch("/api/score/ball", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inningsId: innings._id,
                striker,
                nonStriker,
                currentBowler,
                runs: ball.runs,
                extraType: ball.extraType,
                extraRuns: ball.extraRuns,
                isWicket: ball.isWicket,
                wicketType: ball.wicketType,
                outBatsman: ball.outBatsman,
                fielder: ball.fielder,
                nextBatsman: ball.nextBatsman,
                nextBowler: ball.nextBowler,
            }),
        });

        const data = await res.json();

        if (data.success) {
            setInnings(data.data);
            setStriker(data.data.striker);
            setNonStriker(data.data.nonStriker);
            setCurrentBowler(data.data.currentBowler);
            resetBall();

            await loadMatch();
            await loadScore();
        } else {
            alert(data.message || "Failed to update score");
        }
    };

    if (!match) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 text-white">
                Loading match...
            </div>
        );
    }

    const legalBalls = innings?.legalBalls || 0;
    const overs = getOvers(legalBalls);

    const isLegalSelected =
        ball.extraType !== "wide" && ball.extraType !== "noBall";

    const currentBallInOver = legalBalls % 6;
    const isOverLastBall =
        innings && isLegalSelected && currentBallInOver === 5;

    const liveBatsmen = innings
        ? innings.batsmen.filter((b: any) => !b.isOut)
        : [];

    const nextBatsmen = innings
        ? innings.batsmen.filter(
            (b: any) => !b.isOut && b.name !== striker && b.name !== nonStriker
        )
        : [];

    const didNotBat =
        innings?.batsmen?.filter(
            (b: any) =>
                b.balls === 0 &&
                !b.isOut &&
                b.name !== striker &&
                b.name !== nonStriker
        ) || [];

    const nextBattingTeam =
        inningsList.length === 1 && match
            ? inningsList[0].battingTeam === match.teamA
                ? match.teamB
                : match.teamA
            : "";
    const scoreLine = (inn: any) => {
        if (!inn) return "-";
        return `${inn.totalRuns}-${inn.wickets} (${getOvers(inn.legalBalls)} Ov)`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-5 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex w-fit items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:border-orange-500 hover:bg-slate-800"
                    >
                        ← Back
                    </button>
<Navbar />
                    <div className="text-center sm:text-right">
                        <h1 className="text-[28px] font-black text-white sm:text-[34px]">
                            Live Score
                        </h1>
                        <p className="mt-1 text-sm text-slate-300">
                            Score update, commentary and scorecard
                        </p>
                    </div>
                </div>

                {!innings && inningsList.length === 1 && (
                    <div className="mb-4 rounded-lg bg-orange-500 p-3 text-center font-bold text-white">
                        First innings ended. Start second innings. Target:{" "}
                        {inningsList[0].totalRuns + 1}
                    </div>
                )}

                {!innings && match.status === "Completed" && (
                    <>
                        <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900 shadow-xl">
                            <div className="grid grid-cols-2 gap-3 p-4">
                                <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-center">
                                    <p className="text-sm font-bold text-slate-300">
                                        {firstInnings?.battingTeam || match.teamA}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black text-orange-400 sm:text-3xl">
                                        {scoreLine(firstInnings)}
                                    </h3>
                                </div>

                                <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 text-center">
                                    <p className="text-sm font-bold text-slate-300">
                                        {secondInnings?.battingTeam || match.teamB}
                                    </p>

                                    <h3 className="mt-2 text-2xl font-black text-orange-400 sm:text-3xl">
                                        {scoreLine(secondInnings)}
                                    </h3>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 bg-emerald-600 px-5 py-4 text-center">
                                <h2 className="text-xl font-black text-white sm:text-2xl">
                                    Match Completed
                                </h2>

                                <p className="mt-1 text-sm font-bold text-white sm:text-base">
                                    {match.result || "Result not updated"}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCompletedScorecard(!showCompletedScorecard)
                                    }
                                    className="mt-4 rounded-xl bg-white px-5 py-2 text-sm font-black text-emerald-700 transition hover:bg-slate-200"
                                >
                                    {showCompletedScorecard
                                        ? "Hide Full Scorecard"
                                        : "View Full Scorecard"}
                                </button>
                            </div>
                        </div>

                       {showCompletedScorecard && (
  <div className="grid gap-6 lg:grid-cols-2">
    {/* FIRST INNINGS */}
    <div className="overflow-hidden rounded-2xl bg-white text-black shadow-2xl">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-emerald-600 px-4 py-3 text-white">
        <h2 className="text-xl font-black">
          {firstInnings?.battingTeam}
        </h2>

        <h2 className="text-2xl font-black">
          {scoreLine(firstInnings)}
        </h2>
      </div>

      {/* BATSMAN HEADER */}
      <div className="grid grid-cols-[2fr_1fr_50px_50px_50px_70px] border-b bg-gray-100 px-4 py-3 text-sm font-black text-gray-700">
        <div>Batter</div>
        <div></div>
        <div className="text-center">R</div>
        <div className="text-center">B</div>
        <div className="text-center">4s</div>
        <div className="text-center">6s</div>
      </div>

      {/* BATSMAN ROWS */}
      {(firstInnings?.batsmen || []).map((b: any) => {
        const played = b.isOut || b.balls > 0;

        if (!played) return null;

        return (
          <div
            key={b.name}
            className="grid grid-cols-[2fr_1fr_50px_50px_50px_70px] items-center border-b px-4 py-3 text-sm"
          >
            <div className="font-semibold text-blue-700">
              {b.name}
            </div>

            <div className="text-xs text-gray-500">
              {b.isOut ? b.outText : "not out"}
            </div>

            <div className="text-center font-black">
              {b.runs}
            </div>

            <div className="text-center">
              {b.balls}
            </div>

            <div className="text-center">
              {b.fours}
            </div>

            <div className="text-center">
              {b.sixes}
            </div>
          </div>
        );
      })}

      {/* EXTRAS */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="font-black">Extras</div>

        <div className="font-bold">
          {firstInnings?.extras || 0}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="font-black">Total</div>

        <div className="font-black">
          {scoreLine(firstInnings)}
        </div>
      </div>

      {/* DID NOT BAT */}
      <div className="border-b px-4 py-4">
        <span className="font-black">Did not Bat </span>

        <span className="text-blue-700">
          {(firstInnings?.batsmen || [])
            .filter(
              (b: any) =>
                !b.isOut &&
                b.balls === 0 &&
                b.runs === 0
            )
            .map((b: any) => b.name)
            .join(", ") || "-"}
        </span>
      </div>

      {/* BOWLING HEADER */}
      <div className="bg-gray-100 px-4 py-3 text-lg font-black text-gray-700">
        Bowler
      </div>

      {/* BOWLER HEADER */}
      <div className="grid grid-cols-[2fr_50px_50px_50px_50px_50px_70px] border-b bg-gray-100 px-4 py-3 text-sm font-black text-gray-700">
        <div></div>
        <div className="text-center">O</div>
        <div className="text-center">R</div>
        <div className="text-center">W</div>
        <div className="text-center">NB</div>
        <div className="text-center">WD</div>
        <div className="text-center">ECO</div>
      </div>

      {/* BOWLER ROWS */}
      {(firstInnings?.bowlers || []).map((b: any) => (
        <div
          key={b.name}
          className="grid grid-cols-[2fr_50px_50px_50px_50px_50px_70px] items-center border-b px-4 py-3 text-sm"
        >
          <div className="font-semibold text-blue-700">
            {b.name}
          </div>

          <div className="text-center">
            {getOvers(b.balls || 0)}
          </div>

          <div className="text-center">
            {b.runs}
          </div>

          <div className="text-center font-black">
            {b.wickets}
          </div>

          <div className="text-center">
            {b.noBalls || 0}
          </div>

          <div className="text-center">
            {b.wides || 0}
          </div>

          <div className="text-center">
            {getEconomy(b.runs, b.balls)}
          </div>
        </div>
      ))}
    </div>

    {/* SECOND INNINGS */}
    <div className="overflow-hidden rounded-2xl bg-white text-black shadow-2xl">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-orange-600 px-4 py-3 text-white">
        <h2 className="text-xl font-black">
          {secondInnings?.battingTeam}
        </h2>

        <h2 className="text-2xl font-black">
          {scoreLine(secondInnings)}
        </h2>
      </div>

      {/* BATSMAN HEADER */}
      <div className="grid grid-cols-[2fr_1fr_50px_50px_50px_70px] border-b bg-gray-100 px-4 py-3 text-sm font-black text-gray-700">
        <div>Batter</div>
        <div></div>
        <div className="text-center">R</div>
        <div className="text-center">B</div>
        <div className="text-center">4s</div>
        <div className="text-center">6s</div>
      </div>

      {/* BATSMAN ROWS */}
      {(secondInnings?.batsmen || []).map((b: any) => {
        const played = b.isOut || b.balls > 0;

        if (!played) return null;

        return (
          <div
            key={b.name}
            className="grid grid-cols-[2fr_1fr_50px_50px_50px_70px] items-center border-b px-4 py-3 text-sm"
          >
            <div className="font-semibold text-blue-700">
              {b.name}
            </div>

            <div className="text-xs text-gray-500">
              {b.isOut ? b.outText : "not out"}
            </div>

            <div className="text-center font-black">
              {b.runs}
            </div>

            <div className="text-center">
              {b.balls}
            </div>

            <div className="text-center">
              {b.fours}
            </div>

            <div className="text-center">
              {b.sixes}
            </div>
          </div>
        );
      })}

      {/* EXTRAS */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="font-black">Extras</div>

        <div className="font-bold">
          {secondInnings?.extras || 0}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <div className="font-black">Total</div>

        <div className="font-black">
          {scoreLine(secondInnings)}
        </div>
      </div>

      {/* DID NOT BAT */}
      <div className="border-b px-4 py-4">
        <span className="font-black">Did not Bat </span>

        <span className="text-blue-700">
          {(secondInnings?.batsmen || [])
            .filter(
              (b: any) =>
                !b.isOut &&
                b.balls === 0 &&
                b.runs === 0
            )
            .map((b: any) => b.name)
            .join(", ") || "-"}
        </span>
      </div>

      {/* BOWLING HEADER */}
      <div className="bg-gray-100 px-4 py-3 text-lg font-black text-gray-700">
        Bowler
      </div>

      {/* BOWLER HEADER */}
      <div className="grid grid-cols-[2fr_50px_50px_50px_50px_50px_70px] border-b bg-gray-100 px-4 py-3 text-sm font-black text-gray-700">
        <div></div>
        <div className="text-center">O</div>
        <div className="text-center">R</div>
        <div className="text-center">W</div>
        <div className="text-center">NB</div>
        <div className="text-center">WD</div>
        <div className="text-center">ECO</div>
      </div>

      {/* BOWLER ROWS */}
      {(secondInnings?.bowlers || []).map((b: any) => (
        <div
          key={b.name}
          className="grid grid-cols-[2fr_50px_50px_50px_50px_50px_70px] items-center border-b px-4 py-3 text-sm"
        >
          <div className="font-semibold text-blue-700">
            {b.name}
          </div>

          <div className="text-center">
            {getOvers(b.balls || 0)}
          </div>

          <div className="text-center">
            {b.runs}
          </div>

          <div className="text-center font-black">
            {b.wickets}
          </div>

          <div className="text-center">
            {b.noBalls || 0}
          </div>

          <div className="text-center">
            {b.wides || 0}
          </div>

          <div className="text-center">
            {getEconomy(b.runs, b.balls)}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
                    </>
                )}
                {!innings && match.status !== "Completed" && (
                    <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
                        <h2 className="mb-4 text-xl font-bold text-white">
                            Start Innings
                        </h2>

                        {!match.lineupUpdated ? (
                            <p className="text-red-400">
                                Please update playing 11 before scoring.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                <select
                                    value={battingTeam}
                                    onChange={(e) => handleBattingTeamChange(e.target.value)}
                                    className="input"
                                >
                                    <option value="">Select Batting Team</option>

                                    {inningsList.length === 1 ? (
                                        <option value={nextBattingTeam}>{nextBattingTeam}</option>
                                    ) : (
                                        <>
                                            <option value={match.teamA}>{match.teamA}</option>
                                            <option value={match.teamB}>{match.teamB}</option>
                                        </>
                                    )}
                                </select>

                                <select
                                    value={striker}
                                    onChange={(e) => setStriker(e.target.value)}
                                    className="input"
                                >
                                    <option value="">Select Striker</option>
                                    {battingPlayers.map((p) => (
                                        <option key={getPlayerId(p)} value={getPlayerName(p)}>
                                            {getPlayerName(p)}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={nonStriker}
                                    onChange={(e) => setNonStriker(e.target.value)}
                                    className="input"
                                >
                                    <option value="">Select Non-Striker</option>
                                    {battingPlayers
                                        .filter((p) => getPlayerName(p) !== striker)
                                        .map((p) => (
                                            <option key={getPlayerId(p)} value={getPlayerName(p)}>
                                                {getPlayerName(p)}
                                            </option>
                                        ))}
                                </select>

                                <select
                                    value={currentBowler}
                                    onChange={(e) => setCurrentBowler(e.target.value)}
                                    className="input"
                                >
                                    <option value="">Select Bowler</option>
                                    {bowlingPlayers.map((p) => (
                                        <option key={getPlayerId(p)} value={getPlayerName(p)}>
                                            {getPlayerName(p)}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={startInnings}
                                    className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white"
                                >
                                    Start Innings
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {innings && (
                    <>
                        <div className="mb-6 rounded-xl bg-slate-900 p-5 text-center">
                            <h2 className="text-[36px] font-bold text-orange-400">
                                {innings.totalRuns}-{innings.wickets}
                            </h2>

                            <p>Overs: {overs}</p>

                            <p>
                                {innings.battingTeam} vs {innings.bowlingTeam}
                            </p>

                            {innings?.inningNumber === 2 && target && (
                                <p className="mt-2 font-bold text-yellow-300">
                                    Target: {target} | Need {runsToWin} runs to win
                                </p>
                            )}

                            <p className="mt-2">Striker: {striker}</p>
                            <p>Non-Striker: {nonStriker}</p>
                            <p>Bowler: {currentBowler}</p>

                            <button
                                type="button"
                                onClick={endInnings}
                                className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700"
                            >
                                End Innings
                            </button>
                        </div>

                        <div className="mb-6 grid gap-6 lg:grid-cols-2">
                            <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-5">
                                <h2 className="text-xl font-bold text-white">Add Ball</h2>

                                <select
                                    value={striker}
                                    onChange={(e) => setStriker(e.target.value)}
                                    className="input"
                                >
                                    {liveBatsmen.map((b: any) => (
                                        <option key={b.name} value={b.name}>
                                            Striker: {b.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={nonStriker}
                                    onChange={(e) => setNonStriker(e.target.value)}
                                    className="input"
                                >
                                    {liveBatsmen
                                        .filter((b: any) => b.name !== striker)
                                        .map((b: any) => (
                                            <option key={b.name} value={b.name}>
                                                Non-Striker: {b.name}
                                            </option>
                                        ))}
                                </select>

                                <select
                                    value={currentBowler}
                                    onChange={(e) => setCurrentBowler(e.target.value)}
                                    className="input"
                                >
                                    {bowlingPlayers.length > 0
                                        ? bowlingPlayers.map((p) => (
                                            <option key={getPlayerId(p)} value={getPlayerName(p)}>
                                                Bowler: {getPlayerName(p)}
                                            </option>
                                        ))
                                        : innings.bowlers.map((b: any) => (
                                            <option key={b.name} value={b.name}>
                                                Bowler: {b.name}
                                            </option>
                                        ))}
                                </select>

                              <div className="grid grid-cols-4 gap-3">
  {[0, 1, 2, 3, 4, 6].map((r) => (
    <button
      type="button"
      key={r}
      onClick={() => setRunButton(r)}
      className={`cursor-pointer rounded-xl py-3 text-lg font-black text-white transition-all duration-200 hover:scale-105 hover:bg-orange-400 ${
        ball.runs === r &&
        ball.extraType === "none" &&
        !ball.isWicket
          ? "bg-orange-500 shadow-lg shadow-orange-500/40"
          : "bg-slate-800 hover:bg-slate-700"
      }`}
      style={{ backgroundColor: ball.runs === r && ball.extraType === "none" && !ball.isWicket ? "#16f947ff" : undefined }}      
    >
      {r} 
    </button>
  ))}

  {/* WICKET */}
  <button
    type="button"
    onClick={setWicketButton}
    className={`cursor-pointer rounded-xl py-3 text-lg font-black text-white transition-all duration-200 hover:scale-105 ${
      ball.isWicket
        ? "bg-red-600 shadow-lg shadow-red-500/40"
        : "bg-slate-800 hover:bg-slate-700"
    }`}
  >
    W
  </button>

  {/* WIDE */}
  <button
    type="button"
    onClick={() => setExtraButton("wide")}
    className={`cursor-pointer rounded-xl py-3 text-sm font-black text-white transition-all duration-200 hover:scale-105 ${
      ball.extraType === "wide"
        ? "bg-blue-600 shadow-lg shadow-blue-500/40"
        : "bg-slate-800 hover:bg-slate-700"
    }`}
  >
    Wide
  </button>

  {/* NO BALL */}
  <button
    type="button"
    onClick={() => setExtraButton("noBall")}
    className={`cursor-pointer rounded-xl py-3 text-sm font-black text-white transition-all duration-200 hover:scale-105 ${
      ball.extraType === "noBall"
        ? "bg-blue-600 shadow-lg shadow-blue-500/40"
        : "bg-slate-800 hover:bg-slate-700"
    }`}
  >
    No Ball
  </button>

  {/* LEG BYE */}
  <button
    type="button"
    onClick={() => setExtraButton("legBye")}
    className={`cursor-pointer rounded-xl py-3 text-sm font-black text-white transition-all duration-200 hover:scale-105 ${
      ball.extraType === "legBye"
        ? "bg-blue-600 shadow-lg shadow-blue-500/40"
        : "bg-slate-800 hover:bg-slate-700"
    }`}
  >
    Leg Bye
  </button>
</div>

                               {ball.extraType !== "none" && (
  <input
    type="number"
    className="input"
    value={ball.extraType === "noBall" ? ball.runs : ball.extraRuns}
    onChange={(e) => {
      const value = Number(e.target.value);

      if (ball.extraType === "noBall") {
        setBall({
          ...ball,
          runs: value,
          extraRuns: 1,
        });
      } else {
        setBall({
          ...ball,
          runs: 0,
          extraRuns: value,
        });
      }
    }}
    placeholder={
      ball.extraType === "noBall"
        ? "Batsman runs on no ball"
        : "Extra runs"
    }
  />
)}

                                {ball.isWicket && (
                                    <div className="space-y-3">
                                        <select
                                            value={ball.wicketType}
                                            onChange={(e) =>
                                                setBall({
                                                    ...ball,
                                                    wicketType: e.target.value,
                                                    outBatsman: "",
                                                    fielder: "",
                                                })
                                            }
                                            className="input"
                                        >
                                            <option value="catch">Catch</option>
                                            <option value="bowled">Bowled</option>
                                            <option value="lbw">LBW</option>
                                            <option value="runout">Run Out</option>
                                        </select>

                                        <select
                                            value={ball.outBatsman}
                                            onChange={(e) =>
                                                setBall({ ...ball, outBatsman: e.target.value })
                                            }
                                            className="input"
                                        >
                                            <option value="">
                                                {ball.wicketType === "runout"
                                                    ? "Select Run Out Batsman"
                                                    : "Select Out Batsman"}
                                            </option>

                                            {[striker, nonStriker].map((name) => (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>

                                        {(ball.wicketType === "catch" ||
                                            ball.wicketType === "runout") && (
                                                <select
                                                    value={ball.fielder}
                                                    onChange={(e) =>
                                                        setBall({ ...ball, fielder: e.target.value })
                                                    }
                                                    className="input"
                                                >
                                                    <option value="">Select Fielder</option>

                                                    {bowlingPlayers.map((p) => (
                                                        <option key={getPlayerId(p)} value={getPlayerName(p)}>
                                                            {getPlayerName(p)}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}

                                        <select
                                            value={ball.nextBatsman}
                                            onChange={(e) =>
                                                setBall({ ...ball, nextBatsman: e.target.value })
                                            }
                                            className="input"
                                        >
                                            <option value="">Select Next Batsman</option>

                                            {nextBatsmen.map((b: any) => (
                                                <option key={b.name} value={b.name}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {isOverLastBall && (
                                    <select
                                        value={ball.nextBowler}
                                        onChange={(e) =>
                                            setBall({ ...ball, nextBowler: e.target.value })
                                        }
                                        className="input"
                                    >
                                        <option value="">Select Next Bowler</option>

                                        {bowlingPlayers
                                            .filter((p) => getPlayerName(p) !== currentBowler)
                                            .map((p) => (
                                                <option key={getPlayerId(p)} value={getPlayerName(p)}>
                                                    {getPlayerName(p)}
                                                </option>
                                            ))}
                                    </select>
                                )}

                                <button
                                    type="button"
                                    onClick={addBall}
                                    className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white"
                                >
                                    Add Ball →
                                </button>
                            </div>

                            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                                <h2 className="mb-4 text-xl font-bold text-white">
                                    Current Match
                                </h2>
                                <p>Innings: {innings.inningNumber}</p>
                                <p>Batting: {innings.battingTeam}</p>
                                <p>Bowling: {innings.bowlingTeam}</p>
                                <p>
                                    Score: {innings.totalRuns}-{innings.wickets}
                                </p>
                                <p>Overs: {overs}</p>
                                {innings?.inningNumber === 2 && target && (
                                    <p className="mt-2 font-bold text-yellow-300">
                                        Need {runsToWin} runs to win
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mb-5 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab("commentary")}
                                className={`rounded-full px-5 py-2 font-bold ${activeTab === "commentary"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white text-black"
                                    }`}
                            >
                                Commentary
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab("scorecard")}
                                className={`rounded-full px-5 py-2 font-bold ${activeTab === "scorecard"
                                        ? "bg-emerald-600 text-white"
                                        : "bg-white text-black"
                                    }`}
                            >
                                Scorecard
                            </button>
                        </div>

                        {activeTab === "commentary" && (
                            <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                                <h2 className="mb-4 text-xl font-bold text-white">
                                    Ball by Ball Commentary
                                </h2>

                                <div className="space-y-2">
                                    {[...(innings.balls || [])]
                                        .reverse()
                                        .map((b: any, index: number) => (
                                            <div
                                                key={index}
                                                className="rounded-lg bg-slate-800 p-3 text-white"
                                            >
                                                {b.over}.{b.ball} - {b.text}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "scorecard" && (
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="overflow-hidden rounded-xl bg-white text-black">
                                    <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
                                        <h2 className="font-bold">{innings.battingTeam}</h2>
                                        <h2 className="font-bold">
                                            {innings.totalRuns}-{innings.wickets} ({overs} Ov)
                                        </h2>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[650px] text-sm">
                                            <thead className="bg-gray-200 text-gray-800">
                                                <tr>
                                                    <th className="px-3 py-3 text-left">Batter</th>
                                                    <th className="px-3 py-3 text-center">R</th>
                                                    <th className="px-3 py-3 text-center">B</th>
                                                    <th className="px-3 py-3 text-center">4s</th>
                                                    <th className="px-3 py-3 text-center">6s</th>
                                                    <th className="px-3 py-3 text-center">SR</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {(innings.batsmen || []).map((b: any) => {
                                                    const played =
                                                        b.isOut ||
                                                        b.balls > 0 ||
                                                        b.name === striker ||
                                                        b.name === nonStriker;

                                                    if (!played) return null;

                                                    return (
                                                        <tr
                                                            key={b.name}
                                                            className="border-b border-gray-200"
                                                        >
                                                            <td className="px-3 py-3">
                                                                <div className="font-semibold text-blue-600">
                                                                    {b.name}
                                                                </div>

                                                                {b.isOut ? (
                                                                    <div className="text-xs text-gray-600">
                                                                        {b.outText}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-xs text-gray-600">
                                                                        not out
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td className="px-3 py-3 text-center font-bold">
                                                                {b.runs}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                {b.balls}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                {b.fours}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                {b.sixes}
                                                            </td>
                                                            <td className="px-3 py-3 text-center">
                                                                {getStrikeRate(b.runs, b.balls)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                <tr className="border-b border-gray-200">
                                                    <td className="px-3 py-3 font-bold">Extras</td>
                                                    <td colSpan={5} className="px-3 py-3 font-bold">
                                                        {innings.extras || 0}
                                                    </td>
                                                </tr>

                                                <tr className="border-b border-gray-200">
                                                    <td className="px-3 py-3 font-bold">Total</td>
                                                    <td colSpan={5} className="px-3 py-3 font-bold">
                                                        {innings.totalRuns}-{innings.wickets} ({overs}{" "}
                                                        Overs)
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td className="px-3 py-3 font-bold">Did not Bat</td>
                                                    <td colSpan={5} className="px-3 py-3 text-blue-600">
                                                        {didNotBat.map((b: any) => b.name).join(", ") ||
                                                            "-"}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-xl bg-white text-black">
                                    <div className="bg-gray-200 px-4 py-3 font-bold text-gray-800">
                                        Bowling - {innings.bowlingTeam}
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[650px] text-sm">
                                            <thead className="bg-gray-200 text-gray-800">
                                                <tr>
                                                    <th className="px-3 py-3 text-left">Bowler</th>
                                                    <th className="px-3 py-3 text-center">O</th>
                                                    <th className="px-3 py-3 text-center">R</th>
                                                    <th className="px-3 py-3 text-center">W</th>
                                                    <th className="px-3 py-3 text-center">NB</th>
                                                    <th className="px-3 py-3 text-center">WD</th>
                                                    <th className="px-3 py-3 text-center">ECO</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {(innings.bowlers || []).map((b: any) => (
                                                    <tr
                                                        key={b.name}
                                                        className="border-b border-gray-200"
                                                    >
                                                        <td className="px-3 py-3 font-semibold text-blue-600">
                                                            {b.name}
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            {getOvers(b.balls || 0)}
                                                        </td>
                                                        <td className="px-3 py-3 text-center">{b.runs}</td>
                                                        <td className="px-3 py-3 text-center font-bold">
                                                            {b.wickets}
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            {b.noBalls || 0}
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            {b.wides || 0}
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            {getEconomy(b.runs, b.balls)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}