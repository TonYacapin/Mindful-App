import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, default: "cat" }, // cat, fox, dragon
  name: { type: String, default: "Fluffy" },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  hunger: { type: Number, default: 100 }, // 0-100
  happiness: { type: Number, default: 100 }, // 0-100
  energy: { type: Number, default: 100 }, // 0-100
  evolutionStage: { type: Number, default: 1 }, // 1 = baby, 2 = evolved
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);
