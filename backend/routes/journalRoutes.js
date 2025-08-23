import express from "express";
import Journal from "../models/Journal.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { content, mood } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    if (content.length > 500) {
      return res.status(400).json({ error: "Content must be 500 characters or less" });
    }

    const journal = new Journal({ userId: req.userId, content, mood });
    await journal.save();
    res.json(journal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all entries
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
