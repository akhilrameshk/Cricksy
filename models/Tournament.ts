import mongoose, { Schema, models } from "mongoose";

const TournamentSchema = new Schema(
  {
    name: { type: String, required: true },
    sport: { type: String, default: "Cricket" },
    format: { type: String, required: true },
    venue: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    teams: [{ type: String }],
    status: {
      type: String,
      enum: ["Upcoming", "Live", "Completed"],
      default: "Upcoming",
    },
  },
  { timestamps: true }
);

export default models.Tournament ||
  mongoose.model("Tournament", TournamentSchema);