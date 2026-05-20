/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

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
    `${Math.floor((legalBalls || 0) / 6)}.${(legalBalls || 0) % 6}`;

  const getPlayerId = (value: any) =>
    typeof value === "string" ? value : value?._id;

  const getPlayerName = (value: any) =>
    typeof value === "string" ? value : value?.name;

  const getStrikeRate = (runs: number, balls: number) =>
    balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";

  const getEconomy = (runs: number, balls: number) =>
    balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00";

  const scoreLine = (inn: any) => {
    if (!inn) return "-";
    return `${inn.totalRuns}-${inn.wickets} (${getOvers(inn.legalBalls)} Ov)`;
  };

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

      if (
        (ball.wicketType === "catch" || ball.wicketType === "runout") &&
        !ball.fielder
      ) {
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
      <div className="min-h-dvh bg-[#e9eef1] dark:bg-slate-950">
        <Header />

        <main className="mx-auto max-w-md pt-[58px] pb-24">
          <Card sx={{ m: 2, p: 4, borderRadius: "24px", textAlign: "center" }}>
            <Typography sx={{ fontWeight: 900, color: "#64748b" }}>
              Loading match...
            </Typography>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  const legalBalls = innings?.legalBalls || 0;
  const overs = getOvers(legalBalls);

  const isLegalSelected =
    ball.extraType !== "wide" && ball.extraType !== "noBall";

  const currentBallInOver = legalBalls % 6;
  const isOverLastBall = innings && isLegalSelected && currentBallInOver === 5;

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

  return (
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-[58px] pb-24 lg:max-w-6xl">
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            variant="contained"
            sx={{
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 900,
              boxShadow: "none",
              "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
            }}
          >
            Back
          </Button>
        </Box>

        <AdCard />

        <Card
          sx={{
            m: 2,
            borderRadius: "26px",
            overflow: "hidden",
            border: "1px solid #cbd5e1",
            boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
          }}
        >
          <Box sx={{ bgcolor: "#0d6bde", color: "#fff", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SportsCricketIcon />
              <Typography sx={{ fontSize: 20, fontWeight: 950 }}>
                {match.teamA} vs {match.teamB}
              </Typography>
            </Box>

            <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.9 }}>
              {match.venue || "Venue TBD"}
            </Typography>

            <Chip
              label={match.status || "Upcoming"}
              size="small"
              sx={{
                mt: 1.5,
                bgcolor:
                  match.status === "Completed"
                    ? "#16a34a"
                    : match.status === "Live"
                    ? "#dc2626"
                    : "rgba(255,255,255,0.2)",
                color: "#fff",
                fontWeight: 900,
              }}
            />
          </Box>

          <CardContent sx={{ p: 2 }}>
            {match.status === "Completed" ? (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.5,
                  }}
                >
                  <ScoreBox
                    team={firstInnings?.battingTeam || match.teamA}
                    score={scoreLine(firstInnings)}
                  />

                  <ScoreBox
                    team={secondInnings?.battingTeam || match.teamB}
                    score={scoreLine(secondInnings)}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: "18px",
                    bgcolor: "#eff6ff",
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 16, fontWeight: 950, color: "#0d6bde" }}
                  >
                    Match Completed
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#334155",
                    }}
                  >
                    {match.result || "Result not updated"}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  onClick={() =>
                    setShowCompletedScorecard(!showCompletedScorecard)
                  }
                  variant="contained"
                  sx={{
                    mt: 2,
                    height: 44,
                    borderRadius: "999px",
                    bgcolor: "#0d6bde",
                    fontWeight: 900,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
                  }}
                >
                  {showCompletedScorecard
                    ? "Hide Full Scorecard"
                    : "View Full Scorecard"}
                </Button>
              </>
            ) : innings ? (
              <LiveScorePanel
                innings={innings}
                overs={overs}
                target={target}
                runsToWin={runsToWin}
                striker={striker}
                nonStriker={nonStriker}
                currentBowler={currentBowler}
                endInnings={endInnings}
              />
            ) : (
              <StartInningsPanel
                match={match}
                battingTeam={battingTeam}
                striker={striker}
                nonStriker={nonStriker}
                currentBowler={currentBowler}
                battingPlayers={battingPlayers}
                bowlingPlayers={bowlingPlayers}
                inningsList={inningsList}
                nextBattingTeam={nextBattingTeam}
                handleBattingTeamChange={handleBattingTeamChange}
                setStriker={setStriker}
                setNonStriker={setNonStriker}
                setCurrentBowler={setCurrentBowler}
                getPlayerId={getPlayerId}
                getPlayerName={getPlayerName}
                startInnings={startInnings}
              />
            )}
          </CardContent>
        </Card>

        {showCompletedScorecard && (
          <Box sx={{ px: 2 }}>
            <CompletedScorecard
              firstInnings={firstInnings}
              secondInnings={secondInnings}
              scoreLine={scoreLine}
              getOvers={getOvers}
              getEconomy={getEconomy}
            />
          </Box>
        )}

        {innings && (
          <Box sx={{ px: 2 }}>
            <ScoringPanel
              innings={innings}
              ball={ball}
              setRunButton={setRunButton}
              setExtraButton={setExtraButton}
              setWicketButton={setWicketButton}
              setBall={setBall}
              striker={striker}
              setStriker={setStriker}
              nonStriker={nonStriker}
              setNonStriker={setNonStriker}
              currentBowler={currentBowler}
              setCurrentBowler={setCurrentBowler}
              liveBatsmen={liveBatsmen}
              bowlingPlayers={bowlingPlayers}
              nextBatsmen={nextBatsmen}
              getPlayerId={getPlayerId}
              getPlayerName={getPlayerName}
              isOverLastBall={isOverLastBall}
              addBall={addBall}
            />

            <ScoreTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              innings={innings}
              overs={overs}
              striker={striker}
              nonStriker={nonStriker}
              didNotBat={didNotBat}
              getStrikeRate={getStrikeRate}
              getOvers={getOvers}
              getEconomy={getEconomy}
            />
          </Box>
        )}

        <AdCard />
      </main>

      <Footer />
    </div>
  );
}

function ScoreBox({ team, score }: { team: string; score: string }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "18px",
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>
        {team}
      </Typography>

      <Typography
        sx={{ mt: 1, fontSize: 22, fontWeight: 950, color: "#0d6bde" }}
      >
        {score}
      </Typography>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        bgcolor: "#f8fafc",
        borderRadius: "14px",
        p: 1.2,
      }}
    >
      <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 800 }}>
        {label}
      </Typography>

      <Typography sx={{ fontSize: 13, color: "#0f172a", fontWeight: 900 }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

function LiveScorePanel({
  innings,
  overs,
  target,
  runsToWin,
  striker,
  nonStriker,
  currentBowler,
  endInnings,
}: any) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography sx={{ fontSize: 42, fontWeight: 950, color: "#0d6bde" }}>
        {innings.totalRuns}-{innings.wickets}
      </Typography>

      <Typography sx={{ fontWeight: 800, color: "#64748b" }}>
        Overs: {overs}
      </Typography>

      <Typography sx={{ mt: 1, fontWeight: 900 }}>
        {innings.battingTeam} vs {innings.bowlingTeam}
      </Typography>

      {innings?.inningNumber === 2 && target && (
        <Chip
          label={`Target: ${target} | Need ${runsToWin} runs`}
          sx={{
            mt: 1.5,
            bgcolor: "#fef3c7",
            color: "#92400e",
            fontWeight: 900,
          }}
        />
      )}

      <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
        <InfoRow label="Striker" value={striker} />
        <InfoRow label="Non-Striker" value={nonStriker} />
        <InfoRow label="Bowler" value={currentBowler} />
      </Box>

      <Button
        onClick={endInnings}
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#dc2626",
          borderRadius: "999px",
          fontWeight: 900,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "#b91c1c", boxShadow: "none" },
        }}
      >
        End Innings
      </Button>
    </Box>
  );
}

function StartInningsPanel(props: any) {
  const {
    match,
    battingTeam,
    striker,
    nonStriker,
    currentBowler,
    battingPlayers,
    bowlingPlayers,
    inningsList,
    nextBattingTeam,
    handleBattingTeamChange,
    setStriker,
    setNonStriker,
    setCurrentBowler,
    getPlayerId,
    getPlayerName,
    startInnings,
  } = props;

  if (!match.lineupUpdated) {
    return (
      <Typography sx={{ color: "#dc2626", fontWeight: 900 }}>
        Please update playing 11 before scoring.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 950 }}>
        Start Innings
      </Typography>

      <TextField
        select
        label="Batting Team"
        value={battingTeam}
        onChange={(e) => handleBattingTeamChange(e.target.value)}
        fullWidth
      >
        {inningsList.length === 1 ? (
          <MenuItem value={nextBattingTeam}>{nextBattingTeam}</MenuItem>
        ) : (
          [
            <MenuItem key={match.teamA} value={match.teamA}>
              {match.teamA}
            </MenuItem>,
            <MenuItem key={match.teamB} value={match.teamB}>
              {match.teamB}
            </MenuItem>,
          ]
        )}
      </TextField>

      <TextField
        select
        label="Striker"
        value={striker}
        onChange={(e) => setStriker(e.target.value)}
        fullWidth
      >
        {battingPlayers.map((p: any) => (
          <MenuItem key={getPlayerId(p)} value={getPlayerName(p)}>
            {getPlayerName(p)}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Non-Striker"
        value={nonStriker}
        onChange={(e) => setNonStriker(e.target.value)}
        fullWidth
      >
        {battingPlayers
          .filter((p: any) => getPlayerName(p) !== striker)
          .map((p: any) => (
            <MenuItem key={getPlayerId(p)} value={getPlayerName(p)}>
              {getPlayerName(p)}
            </MenuItem>
          ))}
      </TextField>

      <TextField
        select
        label="Bowler"
        value={currentBowler}
        onChange={(e) => setCurrentBowler(e.target.value)}
        fullWidth
      >
        {bowlingPlayers.map((p: any) => (
          <MenuItem key={getPlayerId(p)} value={getPlayerName(p)}>
            {getPlayerName(p)}
          </MenuItem>
        ))}
      </TextField>

      <Button
        onClick={startInnings}
        variant="contained"
        sx={{
          height: 48,
          bgcolor: "#0d6bde",
          borderRadius: "16px",
          fontWeight: 900,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
        }}
      >
        Start Innings
      </Button>
    </Box>
  );
}

function ScoringPanel(props: any) {
  const {
    innings,
    ball,
    setRunButton,
    setExtraButton,
    setWicketButton,
    setBall,
    striker,
    setStriker,
    nonStriker,
    setNonStriker,
    currentBowler,
    setCurrentBowler,
    liveBatsmen,
    bowlingPlayers,
    nextBatsmen,
    getPlayerId,
    getPlayerName,
    isOverLastBall,
    addBall,
  } = props;

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: "24px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 950, mb: 2 }}>
          Add Ball
        </Typography>

        <Box sx={{ display: "grid", gap: 2 }}>
          <TextField
            select
            label="Striker"
            value={striker}
            onChange={(e) => setStriker(e.target.value)}
            fullWidth
          >
            {liveBatsmen.map((b: any) => (
              <MenuItem key={b.name} value={b.name}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Non-Striker"
            value={nonStriker}
            onChange={(e) => setNonStriker(e.target.value)}
            fullWidth
          >
            {liveBatsmen
              .filter((b: any) => b.name !== striker)
              .map((b: any) => (
                <MenuItem key={b.name} value={b.name}>
                  {b.name}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            select
            label="Bowler"
            value={currentBowler}
            onChange={(e) => setCurrentBowler(e.target.value)}
            fullWidth
          >
            {bowlingPlayers.length > 0
              ? bowlingPlayers.map((p: any) => (
                  <MenuItem key={getPlayerId(p)} value={getPlayerName(p)}>
                    {getPlayerName(p)}
                  </MenuItem>
                ))
              : innings.bowlers.map((b: any) => (
                  <MenuItem key={b.name} value={b.name}>
                    {b.name}
                  </MenuItem>
                ))}
          </TextField>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
            {[0, 1, 2, 3, 4, 6].map((r) => (
              <ScoreButton
                key={r}
                label={String(r)}
                active={
                  ball.runs === r && ball.extraType === "none" && !ball.isWicket
                }
                onClick={() => setRunButton(r)}
              />
            ))}

            <ScoreButton label="W" active={ball.isWicket} danger onClick={setWicketButton} />
            <ScoreButton label="Wide" active={ball.extraType === "wide"} onClick={() => setExtraButton("wide")} />
            <ScoreButton label="No Ball" active={ball.extraType === "noBall"} onClick={() => setExtraButton("noBall")} />
            <ScoreButton label="Leg Bye" active={ball.extraType === "legBye"} onClick={() => setExtraButton("legBye")} />
          </Box>

          {ball.extraType !== "none" && (
            <TextField
              type="number"
              label={
                ball.extraType === "noBall"
                  ? "Batsman runs on no ball"
                  : "Extra runs"
              }
              value={ball.extraType === "noBall" ? ball.runs : ball.extraRuns}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (ball.extraType === "noBall") {
                  setBall({ ...ball, runs: value, extraRuns: 1 });
                } else {
                  setBall({ ...ball, runs: 0, extraRuns: value });
                }
              }}
              fullWidth
            />
          )}

          {ball.isWicket && (
            <>
              <TextField
                select
                label="Wicket Type"
                value={ball.wicketType}
                onChange={(e) =>
                  setBall({
                    ...ball,
                    wicketType: e.target.value,
                    outBatsman: "",
                    fielder: "",
                  })
                }
                fullWidth
              >
                <MenuItem value="catch">Catch</MenuItem>
                <MenuItem value="bowled">Bowled</MenuItem>
                <MenuItem value="lbw">LBW</MenuItem>
                <MenuItem value="runout">Run Out</MenuItem>
              </TextField>

              <TextField
                select
                label="Out Batsman"
                value={ball.outBatsman}
                onChange={(e) =>
                  setBall({ ...ball, outBatsman: e.target.value })
                }
                fullWidth
              >
                {[striker, nonStriker].map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>

              {(ball.wicketType === "catch" || ball.wicketType === "runout") && (
                <TextField
                  select
                  label="Fielder"
                  value={ball.fielder}
                  onChange={(e) =>
                    setBall({ ...ball, fielder: e.target.value })
                  }
                  fullWidth
                >
                  {bowlingPlayers.map((p: any) => (
                    <MenuItem key={getPlayerId(p)} value={getPlayerName(p)}>
                      {getPlayerName(p)}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField
                select
                label="Next Batsman"
                value={ball.nextBatsman}
                onChange={(e) =>
                  setBall({ ...ball, nextBatsman: e.target.value })
                }
                fullWidth
              >
                {nextBatsmen.map((b: any) => (
                  <MenuItem key={b.name} value={b.name}>
                    {b.name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}

          {isOverLastBall && (
            <TextField
              select
              label="Next Bowler"
              value={ball.nextBowler}
              onChange={(e) =>
                setBall({ ...ball, nextBowler: e.target.value })
              }
              fullWidth
            >
              {bowlingPlayers
                .filter((p: any) => getPlayerName(p) !== currentBowler)
                .map((p: any) => (
                  <MenuItem key={getPlayerId(p)} value={getPlayerName(p)}>
                    {getPlayerName(p)}
                  </MenuItem>
                ))}
            </TextField>
          )}

          <Button
            onClick={addBall}
            variant="contained"
            sx={{
              height: 48,
              bgcolor: "#0d6bde",
              borderRadius: "16px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#0a58b8", boxShadow: "none" },
            }}
          >
            Add Ball →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function ScoreButton({ label, active, onClick, danger }: any) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        minHeight: 44,
        borderRadius: "14px",
        bgcolor: active ? (danger ? "#dc2626" : "#0d6bde") : "#334155",
        fontWeight: 950,
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          bgcolor: active ? (danger ? "#b91c1c" : "#0a58b8") : "#475569",
          boxShadow: "none",
        },
      }}
    >
      {label}
    </Button>
  );
}

function ScoreTabs(props: any) {
  const {
    activeTab,
    setActiveTab,
    innings,
    overs,
    striker,
    nonStriker,
    didNotBat,
    getStrikeRate,
    getOvers,
    getEconomy,
  } = props;

  return (
    <Card sx={{ borderRadius: "24px", overflow: "hidden", mb: 2 }}>
      <Box sx={{ display: "flex", gap: 1, p: 1.5, bgcolor: "#f8fafc" }}>
        <Button
          fullWidth
          onClick={() => setActiveTab("commentary")}
          variant={activeTab === "commentary" ? "contained" : "outlined"}
          sx={{ borderRadius: "999px", fontWeight: 900, textTransform: "none" }}
        >
          Commentary
        </Button>

        <Button
          fullWidth
          onClick={() => setActiveTab("scorecard")}
          variant={activeTab === "scorecard" ? "contained" : "outlined"}
          sx={{ borderRadius: "999px", fontWeight: 900, textTransform: "none" }}
        >
          Scorecard
        </Button>
      </Box>

      <CardContent sx={{ p: 2 }}>
        {activeTab === "commentary" ? (
          <Box sx={{ display: "grid", gap: 1 }}>
            {[...(innings.balls || [])].reverse().map((b: any, index: number) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  borderRadius: "14px",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#334155",
                }}
              >
                {b.over}.{b.ball} - {b.text}
              </Box>
            ))}
          </Box>
        ) : (
          <CurrentScorecard
            innings={innings}
            overs={overs}
            striker={striker}
            nonStriker={nonStriker}
            didNotBat={didNotBat}
            getStrikeRate={getStrikeRate}
            getOvers={getOvers}
            getEconomy={getEconomy}
          />
        )}
      </CardContent>
    </Card>
  );
}

function CurrentScorecard({
  innings,
  overs,
  striker,
  nonStriker,
  didNotBat,
  getStrikeRate,
  getOvers,
  getEconomy,
}: any) {
  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <ScoreTableCard
        title={`${innings.battingTeam} ${innings.totalRuns}-${innings.wickets} (${overs} Ov)`}
        rows={innings.batsmen || []}
        type="batting"
        striker={striker}
        nonStriker={nonStriker}
        didNotBat={didNotBat}
        getStrikeRate={getStrikeRate}
      />

      <ScoreTableCard
        title={`Bowling - ${innings.bowlingTeam}`}
        rows={innings.bowlers || []}
        type="bowling"
        getOvers={getOvers}
        getEconomy={getEconomy}
      />
    </Box>
  );
}

function CompletedScorecard({
  firstInnings,
  secondInnings,
  scoreLine,
  getOvers,
  getEconomy,
}: any) {
  return (
    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" } }}>
      {[firstInnings, secondInnings].filter(Boolean).map((inn: any) => (
        <Box key={inn._id || inn.inningNumber} sx={{ display: "grid", gap: 2 }}>
          <ScoreTableCard
            title={`${inn.battingTeam} ${scoreLine(inn)}`}
            rows={inn.batsmen || []}
            type="batting"
            getStrikeRate={(r: number, b: number) =>
              b > 0 ? ((r / b) * 100).toFixed(2) : "0.00"
            }
            extras={inn.extras}
            total={scoreLine(inn)}
          />

          <ScoreTableCard
            title={`Bowling - ${inn.bowlingTeam}`}
            rows={inn.bowlers || []}
            type="bowling"
            getOvers={getOvers}
            getEconomy={getEconomy}
          />
        </Box>
      ))}
    </Box>
  );
}

function ScoreTableCard(props: any) {
  const {
    title,
    rows,
    type,
    getStrikeRate,
    getOvers,
    getEconomy,
    striker,
    nonStriker,
    didNotBat,
    extras,
    total,
  } = props;

  return (
    <Card
      sx={{
        borderRadius: "22px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
      }}
    >
      <Box sx={{ bgcolor: "#0d6bde", color: "#fff", px: 2, py: 1.5 }}>
        <Typography sx={{ fontWeight: 950 }}>{title}</Typography>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <table className="w-full min-w-[620px] text-sm">
          <thead className="bg-slate-100 text-slate-700">
            {type === "batting" ? (
              <tr>
                <th className="px-3 py-3 text-left">Batter</th>
                <th className="px-3 py-3 text-center">R</th>
                <th className="px-3 py-3 text-center">B</th>
                <th className="px-3 py-3 text-center">4s</th>
                <th className="px-3 py-3 text-center">6s</th>
                <th className="px-3 py-3 text-center">SR</th>
              </tr>
            ) : (
              <tr>
                <th className="px-3 py-3 text-left">Bowler</th>
                <th className="px-3 py-3 text-center">O</th>
                <th className="px-3 py-3 text-center">R</th>
                <th className="px-3 py-3 text-center">W</th>
                <th className="px-3 py-3 text-center">NB</th>
                <th className="px-3 py-3 text-center">WD</th>
                <th className="px-3 py-3 text-center">ECO</th>
              </tr>
            )}
          </thead>

          <tbody>
            {type === "batting"
              ? rows.map((b: any) => {
                  const played =
                    b.isOut ||
                    b.balls > 0 ||
                    b.name === striker ||
                    b.name === nonStriker;

                  if (!played) return null;

                  return (
                    <tr key={b.name} className="border-b border-slate-200">
                      <td className="px-3 py-3">
                        <div className="font-black text-[#0d6bde]">{b.name}</div>
                        <div className="text-xs text-slate-500">
                          {b.isOut ? b.outText : "not out"}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-black">{b.runs}</td>
                      <td className="px-3 py-3 text-center">{b.balls}</td>
                      <td className="px-3 py-3 text-center">{b.fours}</td>
                      <td className="px-3 py-3 text-center">{b.sixes}</td>
                      <td className="px-3 py-3 text-center">
                        {getStrikeRate(b.runs, b.balls)}
                      </td>
                    </tr>
                  );
                })
              : rows.map((b: any) => (
                  <tr key={b.name} className="border-b border-slate-200">
                    <td className="px-3 py-3 font-black text-[#0d6bde]">
                      {b.name}
                    </td>
                    <td className="px-3 py-3 text-center">{getOvers(b.balls || 0)}</td>
                    <td className="px-3 py-3 text-center">{b.runs}</td>
                    <td className="px-3 py-3 text-center font-black">{b.wickets}</td>
                    <td className="px-3 py-3 text-center">{b.noBalls || 0}</td>
                    <td className="px-3 py-3 text-center">{b.wides || 0}</td>
                    <td className="px-3 py-3 text-center">
                      {getEconomy(b.runs, b.balls)}
                    </td>
                  </tr>
                ))}

            {type === "batting" && extras !== undefined && (
              <>
                <tr className="border-b border-slate-200">
                  <td className="px-3 py-3 font-black">Extras</td>
                  <td colSpan={5} className="px-3 py-3 font-black">
                    {extras || 0}
                  </td>
                </tr>

                <tr>
                  <td className="px-3 py-3 font-black">Total</td>
                  <td colSpan={5} className="px-3 py-3 font-black">
                    {total}
                  </td>
                </tr>
              </>
            )}

            {type === "batting" && didNotBat && (
              <tr>
                <td className="px-3 py-3 font-black">Did not Bat</td>
                <td colSpan={5} className="px-3 py-3 text-[#0d6bde]">
                  {didNotBat.map((b: any) => b.name).join(", ") || "-"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Card>
  );
}