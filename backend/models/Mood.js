import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  moodValue: {
    type: String,
    required: true,
    enum: ["happy", "sad", "neutral", "excited", "stressed"], // only allow valid moods
  },
}, { timestamps: true });

export default mongoose.model("Mood", moodSchema);
