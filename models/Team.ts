import mongoose, { Schema, models } from "mongoose";

const TeamSchema = new Schema(
  {
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    teamName: { type: String, required: true },
    captain: String,
  },
  { timestamps: true }
);

export default models.Team || mongoose.model("Team", TeamSchema);