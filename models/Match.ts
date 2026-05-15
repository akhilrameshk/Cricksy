import mongoose, { Schema, models } from "mongoose";

const MatchSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    teamA: { type: String, required: true },
    teamB: { type: String, required: true },

    venue: String,
    matchDate: Date,

    status: {
      type: String,
      enum: ["Upcoming", "Live", "Completed"],
      default: "Upcoming",
    },

    score: { type: String, default: "0/0" },
    overs: { type: String, default: "0.0" },
    result: String,

    teamAPlayingXI: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    teamBPlayingXI: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    lineupUpdated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Match || mongoose.model("Match", MatchSchema);