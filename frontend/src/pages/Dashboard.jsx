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

  const moodEmojis = { sad: "😢", stressed: "😖", neutral: "😐", happy: "😊", excited: "🤩" };
  const moodScale = { sad: 1, stressed: 2, neutral: 3, happy: 4, excited: 5 };
  const moodLabels = Object.entries(moodScale).reduce((acc, [k, v]) => {
    acc[v] = `${moodEmojis[k]} ${k}`;
    return acc;
  }, {});

  const quotes = [
    "🌟 Every check-in is a step towards self-awareness.",
    "💪 Small progress each day adds up to big results.",
    "🌈 Your feelings matter — honor them today.",
    "🔥 Consistency builds strength. Keep going!",
    "💖 Be kind to yourself, you’re doing amazing.",
    "🌻 You are growing beautifully, keep shining!",
  ];
  const quoteOfTheDay = quotes[new Date().getDate() % quotes.length];

  const last7Days = moods.filter(
    (m) => new Date(m.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const weeklySummary = Object.keys(moodEmojis).map((mood) => ({
    mood,
    count: last7Days.filter((m) => m.moodValue === mood).length,
  }));

  const pieData = Object.keys(moodEmojis).map((mood) => ({
    name: mood,
    value: moods.filter((m) => m.moodValue === mood).length,
  }));
  const pieColors = ["#34D399", "#FBBF24", "#60A5FA", "#F87171", "#A78BFA"];

  const badges = [
    { streak: 3, label: "🌱 Getting Started" },
    { streak: 7, label: "🔥 One Week Warrior" },
    { streak: 14, label: "🌟 Two Weeks Strong" },
    { streak: 30, label: "🏆 One Month Milestone" },
  ];
  const earnedBadges = badges.filter((b) => streak >= b.streak);
  const moodsToShow = showAllHistory ? moods : moods.slice(0, 5);

  return (
    <div className="p-6 space-y-6 relative bg-slate-50 min-h-screen">
      {showConfetti && <Confetti />}

      <h2 className="text-3xl font-extrabold text-center text-slate-800">
        🌈 Mindful Dashboard
      </h2>

      {/* Quote of the Day */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-gradient-to-r from-green-200 to-teal-200 rounded-xl text-slate-900 text-center shadow-md font-semibold text-lg"
      >
        {quoteOfTheDay}
      </motion.div>

      {/* Check-in Section */}
      <MoodCheckin onCheckin={fetchMoods} />

      {/* Latest Mood */}
      {latestMood && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-white rounded-xl shadow-md border border-slate-300"
        >
          <h3 className="text-xl font-semibold mb-2 text-slate-700">
            💖 Latest Mood: {moodEmojis[latestMood.moodValue] || "🌸"}
          </h3>
          <p className="text-slate-600">
            Checked in on <b>{new Date(latestMood.date).toLocaleDateString()}</b>. Keep going!
          </p>
        </motion.div>
      )}

      {/* Streak Tracker */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="p-4 bg-gradient-to-r from-teal-300 to-green-300 rounded-xl shadow-md text-slate-900 text-center font-bold text-xl"
      >
        🔥 Current Streak: <b>{streak} days</b>
      </motion.div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="p-4 bg-white rounded-xl shadow-md border border-slate-300">
          <h3 className="text-lg mb-3 text-slate-700 font-bold">🏅 Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((b, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-1 bg-teal-400 text-white rounded-full text-sm shadow"
              >
                {b.label}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Mood Charts */}
      {moods.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Line Chart */}
          <div className="p-4 bg-white rounded-xl shadow-md border border-slate-300">
            <h3 className="text-lg mb-3 font-semibold text-slate-700">📈 Mood Progress</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={moods.map((m) => ({
                    date: new Date(m.date).toLocaleDateString(),
                    mood: moodScale[m.moodValue] || 0,
                  }))}
                >
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickFormatter={(val) => moodLabels[val]} />
                  <Tooltip formatter={(val) => moodLabels[val]} />
                  <Line type="monotone" dataKey="mood" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="p-4 bg-white rounded-xl shadow-md border border-slate-300">
            <h3 className="text-lg mb-3 font-semibold text-slate-700">🍰 Mood Distribution</h3>
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label={(entry) => `${moodEmojis[entry.name]} ${entry.value || 0}`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Reflection */}
      {weeklySummary.some((w) => w.count > 0) && (
        <div className="p-4 bg-white rounded-xl shadow-md border border-slate-300">
          <h3 className="text-lg mb-3 font-semibold text-slate-700">🗓 Weekly Reflection</h3>
          <ul className="space-y-1 text-slate-600">
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
        <h3 className="text-xl mt-4 mb-3 font-bold text-slate-800">📖 Your Mood History</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {moodsToShow.map((m) => (
            <motion.div
              key={m._id}
              whileHover={{ scale: 1.03 }}
              className="p-3 bg-white rounded-xl shadow-md flex justify-between items-center border border-slate-200"
            >
              <span className="text-lg">{moodEmojis[m.moodValue]} {m.moodValue}</span>
              <span className="text-slate-500 text-sm">{new Date(m.date).toLocaleDateString()}</span>
            </motion.div>
          ))}
        </div>
        {moods.length > 5 && (
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="mt-3 px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-lg shadow transition"
          >
            {showAllHistory ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
}
