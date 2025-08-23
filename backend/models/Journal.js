import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  content: { 
    type: String, 
    required: true, 
    maxlength: 500 
  },
  mood: { type: String, default: "📝" }
}, { timestamps: true });

export default mongoose.model("Journal", journalSchema);
