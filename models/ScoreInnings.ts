import mongoose, { Schema, models } from "mongoose";

const BatsmanSchema = new Schema({
  playerId: { type: Schema.Types.ObjectId, ref: "Player" },
  name: String,
  runs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false },
  outText: { type: String, default: "" },
});

const BowlerSchema = new Schema({
  playerId: { type: Schema.Types.ObjectId, ref: "Player" },
  name: String,
  balls: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  wides: { type: Number, default: 0 },
  noBalls: { type: Number, default: 0 },
});

const BallSchema = new Schema(
  {
    over: Number,
    ball: Number,
    batsman: String,
    bowler: String,
    runs: Number,
    batsmanRuns: Number,
    extraType: String,
    extraRuns: Number,
    isWicket: Boolean,
    wicketType: String,
    fielder: String,
    outBatsman: String,
    scoreAtWicket: String,
    text: String,
  },
  { timestamps: true }
);

const ScoreInningsSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    inningNumber: {
      type: Number,
      required: true,
      enum: [1, 2],
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    battingTeam: String,
    bowlingTeam: String,

    striker: String,
    nonStriker: String,
    currentBowler: String,

    totalRuns: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    legalBalls: { type: Number, default: 0 },
    extras: { type: Number, default: 0 },

    batsmen: [BatsmanSchema],
    bowlers: [BowlerSchema],
    balls: [BallSchema],
  },
  { timestamps: true }
);

export default models.ScoreInnings ||
  mongoose.model("ScoreInnings", ScoreInningsSchema);