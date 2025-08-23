import { useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";

export default function MoodCheckin({ onCheckin }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [saving, setSaving] = useState(false);

  const moods = [
    { value: "happy", emoji: "😊", label: "Happy" },
    { value: "sad", emoji: "😢", label: "Sad" },
    { value: "neutral", emoji: "😐", label: "Neutral" },
    { value: "excited", emoji: "🤩", label: "Excited" },
    { value: "stressed", emoji: "😖", label: "Stressed" },
  ];

  const handleCheckin = async () => {
    if (!selectedMood) return;
    try {
      setSaving(true);
      await API.post("/moods", { moodValue: selectedMood });
      onCheckin();
      setSelectedMood(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center">
      <motion.div
        className="p-6 bg-sky-100 rounded-xl shadow-md border border-sky-300 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold mb-4 text-sky-600">
          🌸 How are you feeling today?
        </h3>

        {/* Mood options */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {moods.map((m) => (
            <motion.button
              key={m.value}
              onClick={() => setSelectedMood(m.value)}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`text-3xl p-3 rounded-full transition shadow-md ${
                selectedMood === m.value
                  ? "bg-pink-200 border-2 border-pink-400"
                  : "bg-white hover:bg-sky-50"
              }`}
            >
              {m.emoji}
            </motion.button>
          ))}
        </div>

        {/* Save button */}
        <motion.button
          onClick={handleCheckin}
          disabled={saving || !selectedMood}
          whileHover={{ scale: !saving && selectedMood ? 1.05 : 1 }}
          className={`px-6 py-3 rounded-lg font-semibold transition shadow-md ${
            saving
              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
              : selectedMood
              ? "bg-gradient-to-r from-pink-400 to-sky-400 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : "Save Mood"}
        </motion.button>
      </motion.div>
    </div>
  );
}
