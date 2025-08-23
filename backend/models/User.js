import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  streak: { type: Number, default: 0 },
  unlockedEnvironments: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
