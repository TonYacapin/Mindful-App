import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import API from "../utils/api";
import MoodCheckin from "../components/MoodCheckin";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [moods, setMoods] = useState([]);
  const [streak, setStreak] = useState(0);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchMoods = async () => {
    const res = await API.get("/moods");
    setMoods(res.data);
    calculateStreak(res.data);
  };

  const calculateStreak = (data) => {
    let sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
    let today = new Date().toDateString();
    let streakCount = 0;

    for (let i = 0; i < sorted.length; i++) {
      let currentDate = new Date(sorted[i].date).toDateString();
      if (i === 0 && currentDate !== today) break;
      streakCount++;
      let nextDate = new Date(sorted[i + 1]?.date).toDateString();
      let expectedPrevDay = new Date(sorted[i].date);
      expectedPrevDay.setDate(expectedPrevDay.getDate() - 1);
      if (nextDate !== expectedPrevDay.toDateString()) break;
    }
    setStreak(streakCount);

    if (streakCount > 0 && (streakCount === 3 || streakCount === 7 || streakCount % 10 === 0)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const latestMood = moods.length > 0 ? moods[moods.length - 1] : null;

  const moodEmojis = {
    sad: "😢",
    stressed: "😖",
    neutral: "😐",
    happy: "😊",
    excited: "🤩",
  };

  const moodScale = {
    sad: 1,
    stressed: 2,
    neutral: 3,
    happy: 4,
    excited: 5,
  };

  const moodLabels = Object.entries(moodScale).reduce((acc, [k, v]) => {
    acc[v] = `${moodEmojis[k]} ${k}`;
    return acc;
  }, {});

  // Motivational quotes
  const quotes = [
    "🌟 Every check-in is a step towards self-awareness.",
    "💪 Small progress each day adds up to big results.",
    "🌈 Your feelings matter — honor them today.",
    "🔥 Consistency builds strength. Keep going!",
    "💖 Be kind to yourself, you’re doing amazing.",
    "🌻 You are growing beautifully, keep shining!",
  ];
  const quoteOfTheDay = quotes[new Date().getDate() % quotes.length];

  // Weekly reflection
  const last7Days = moods.filter(
    (m) => new Date(m.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const weeklySummary = Object.keys(moodEmojis).map((mood) => ({
    mood,
    count: last7Days.filter((m) => m.moodValue === mood).length,
  }));

  // Distribution for pie chart
  const pieData = Object.keys(moodEmojis).map((mood) => ({
    name: mood,
    value: moods.filter((m) => m.moodValue === mood).length,
  }));

  const pieColors = ["#FDE68A", "#FCA5A5", "#93C5FD", "#6EE7B7", "#C4B5FD"];

  // Badge system
  const badges = [
    { streak: 3, label: "🌱 Getting Started" },
    { streak: 7, label: "🔥 One Week Warrior" },
    { streak: 14, label: "🌟 Two Weeks Strong" },
    { streak: 30, label: "🏆 One Month Milestone" },
  ];
  const earnedBadges = badges.filter((b) => streak >= b.streak);

  // Mood history limited
  const moodsToShow = showAllHistory ? moods : moods.slice(0, 5);

  return (
    <div className="p-6 space-y-6 relative">
      {showConfetti && <Confetti />}

      <h2 className="text-3xl font-extrabold text-pink-500 text-center">
        🌈 Mindful Journey Dashboard 🌻
      </h2>

      {/* Quote of the Day */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-gradient-to-r from-yellow-200 via-pink-200 to-sky-200 rounded-xl text-slate-900 text-center shadow-lg font-bold text-lg"
      >
        {quoteOfTheDay}
      </motion.div>

      {/* Check-in Section */}
      <MoodCheckin onCheckin={fetchMoods} />

      {/* Latest Mood */}
      {latestMood && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-pink-100 rounded-xl shadow-md border border-pink-300"
        >
          <h3 className="text-xl font-semibold mb-2 text-pink-600">
            💖 Latest Mood: {moodEmojis[latestMood.moodValue] || "🌸"}
          </h3>
          <p className="text-slate-700">
            You checked in on{" "}
            <b>{new Date(latestMood.date).toLocaleDateString()}</b>. Keep it up
            — every check-in makes your journey brighter! 🌞
          </p>
        </motion.div>
      )}

      {/* Streak Tracker */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="p-4 bg-gradient-to-r from-emerald-300 to-sky-300 rounded-xl shadow-lg text-slate-900 text-center font-extrabold text-xl"
      >
        🔥 Current Streak: <b>{streak} days</b> 🎉
      </motion.div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="p-4 bg-yellow-100 rounded-xl shadow-md border border-yellow-300">
          <h3 className="text-lg mb-4 text-yellow-600 font-bold">
            🏅 Achievements
          </h3>
          <div className="flex gap-3 flex-wrap">
            {earnedBadges.map((b, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-1 bg-pink-400 text-white rounded-full text-sm shadow"
              >
                {b.label}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Mood Chart */}
{moods.length > 0 && (
  <div className="p-4 bg-sky-100 rounded-xl shadow-md border border-sky-300">
    <h3 className="text-lg mb-4 text-sky-600 font-bold">📊 Mood Progress</h3>
    <div className="w-full h-[300px]"> {/* ✅ ensures parent has height */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={moods.map((m) => ({
            date: new Date(m.date).toLocaleDateString(),
            mood: moodScale[m.moodValue] || 0,
          }))}
        >
          <XAxis dataKey="date" />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(val) => moodLabels[val] || val}
          />
          <Tooltip formatter={(val) => moodLabels[val] || val} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#EC4899"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)}

      {/* Mood Distribution */}
      {moods.length > 0 && (
        <div className="p-4 bg-emerald-100 rounded-xl shadow-md border border-emerald-300">
          <h3 className="text-lg mb-4 text-emerald-600 font-bold">
            🍰 Mood Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={(entry) =>
                  `${moodEmojis[entry.name]} ${entry.value || 0}`
                }
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weekly Reflection */}
      {weeklySummary.some((w) => w.count > 0) && (
        <div className="p-4 bg-violet-100 rounded-xl shadow-md border border-violet-300">
          <h3 className="text-lg mb-4 text-violet-600 font-bold">
            🗓 Weekly Reflection
          </h3>
          <ul className="space-y-2 text-slate-700">
            {weeklySummary.map((w, idx) =>
              w.count > 0 ? (
                <li key={idx}>
                  {moodEmojis[w.mood]} {w.mood}: <b>{w.count}</b> times
                </li>
              ) : null
            )}
          </ul>
        </div>
      )}

      {/* Mood History */}
      <div>
        <h3 className="text-xl mt-6 mb-4 text-pink-500 font-bold">
          📖 Your Mood History
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {moodsToShow.map((m) => (
            <motion.div
              key={m._id}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white rounded-xl shadow-md flex justify-between items-center border border-slate-200"
            >
              <span className="text-lg">
                {moodEmojis[m.moodValue] || "🌸"} {m.moodValue}
              </span>
              <span className="text-slate-500 text-sm">
                {new Date(m.date).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
        </div>

        {moods.length > 5 && (
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-all shadow"
          >
            {showAllHistory ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
