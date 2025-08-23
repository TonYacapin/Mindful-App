import express from "express";
import Mood from "../models/Mood.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add mood check-in
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { moodValue } = req.body;

    // Validate moodValue
    const allowedMoods = ["happy", "sad", "neutral", "excited", "stressed"];
    if (!allowedMoods.includes(moodValue)) {
      return res.status(400).json({ error: "Invalid mood value" });
    }

    const mood = new Mood({ userId: req.userId, moodValue });
    await mood.save();
    res.json(mood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get moods for user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.userId }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
