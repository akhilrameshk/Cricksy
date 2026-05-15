import mongoose, { Schema, models } from "mongoose";

const ScorecardSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    teamName: String,
    innings: { type: Number, default: 1 },

    batting: [
      {
        playerName: String,
        runs: Number,
        balls: Number,
        fours: Number,
        sixes: Number,
        strikeRate: Number,
        status: String,
      },
    ],

    bowling: [
      {
        playerName: String,
        overs: String,
        maidens: Number,
        runs: Number,
        wickets: Number,
        economy: Number,
      },
    ],

    totalRuns: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: String, default: "0.0" },
    extras: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Scorecard ||
  mongoose.model("Scorecard", ScorecardSchema);