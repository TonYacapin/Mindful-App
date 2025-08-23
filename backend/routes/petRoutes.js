import express from "express";
import Pet from "../models/Pet.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get pet info
router.get("/", authMiddleware, async (req, res) => {
  try {
    let pet = await Pet.findOne({ userId: req.userId });
    if (!pet) {
      pet = new Pet({ userId: req.userId });
      await pet.save();
    }
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pet XP
router.post("/xp", authMiddleware, async (req, res) => {
  try {
    const { xp } = req.body;
    let pet = await Pet.findOne({ userId: req.userId });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    pet.xp += xp;
    if (pet.xp >= 100) {
      pet.level += 1;
      pet.xp = 0;
    }
    await pet.save();

    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Play (gain XP + happiness, lose energy)
router.post("/play", authMiddleware, async (req, res) => {
  try {
    let pet = await Pet.findOne({ userId: req.userId });
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    pet.xp += 10;
    pet.happiness = Math.min(100, pet.happiness + 10);
    pet.energy = Math.max(0, pet.energy - 15);

    // Level up logic
    if (pet.xp >= 100) {
      pet.level += 1;
      pet.xp = 0;
      if (pet.level % 5 === 0) pet.evolutionStage += 1; // evolve every 5 levels
    }

    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feed
router.post("/feed", authMiddleware, async (req, res) => {
  try {
    let pet = await Pet.findOne({ userId: req.userId });
    pet.hunger = Math.min(100, pet.hunger + 20);
    pet.happiness = Math.min(100, pet.happiness + 5);
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sleep
router.post("/sleep", authMiddleware, async (req, res) => {
  try {
    let pet = await Pet.findOne({ userId: req.userId });
    pet.energy = 100;
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
