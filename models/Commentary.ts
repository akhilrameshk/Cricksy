import mongoose, { Schema, models } from "mongoose";

const CommentarySchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    over: String,
    ball: String,
    batsman: String,
    bowler: String,
    runs: { type: Number, default: 0 },
    event: {
      type: String,
      enum: ["run", "four", "six", "wicket", "wide", "no-ball", "bye", "dot"],
      default: "dot",
    },
    text: String,
  },
  { timestamps: true }
);

export default models.Commentary ||
  mongoose.model("Commentary", CommentarySchema);