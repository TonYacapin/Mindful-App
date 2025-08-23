import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import petRoutes from "./routes/petRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/pet", petRoutes);

// ✅ Basic health route
app.get("/", (req, res) => {
  res.send("Mindful Journey API is running 🚀");
});

// ✅ Remove deprecated MongoDB options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Export the Express app for Vercel
export default app;