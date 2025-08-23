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

// ✅ Middleware (must come before routes)
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,               // allow cookies/auth headers if needed
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

// ✅ Database + Server Start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
