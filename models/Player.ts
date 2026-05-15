import mongoose, { Schema, models } from "mongoose";

const PlayerSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    name: { type: String, required: true },
    team: String,

    role: String,
    battingStyle: String,
    bowlingStyle: String,

    status: {
      type: String,
      enum: ["Playing XI", "Bench", "Batting", "Bowling", "Out", "Injured"],
      default: "Bench",
    },

    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Player || mongoose.model("Player", PlayerSchema);