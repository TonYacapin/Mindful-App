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
    try {
      const res = await API.get("/moods");
      // Sort moods by date in descending order (newest first)
      const sortedMoods = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMoods(sortedMoods);
      calculateStreak(sortedMoods);
    } catch (error) {
      console.error("Error fetching moods:", error);
    }
  };

  // Helper function to normalize dates to the same day (ignoring time)
  const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const calculateStreak = (moodData) => {
    if (moodData.length === 0) {
      setStreak(0);
      return;
    }

    // Get today's date (normalized)
    const today = normalizeDate(new Date());
    
    // Sort by date in descending order (newest first)
    const sorted = [...moodData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let streakCount = 0;
    let currentDate = today;
    
    // Check if the most recent entry is today
    const mostRecentDate = normalizeDate(sorted[0].date);
    if (mostRecentDate.getTime() !== today.getTime()) {
      // No entry for today, streak is 0
      setStreak(0);
      return;
    }
    
    streakCount = 1; // Count today
    
    // Check previous days
    for (let i = 1; i < sorted.length; i++) {
      const entryDate = normalizeDate(sorted[i].date);
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streakCount++;
        currentDate = expectedDate;
      } else if (entryDate < expectedDate) {
        // There's a gap in the entries, break the streak
        break;
      }
      // If entryDate is more recent than expectedDate, continue (shouldn't happen with sorted data)
    }
    
    setStreak(streakCount);

    // Trigger confetti for milestone streaks
    if (streakCount > 0 && (streakCount === 3 || streakCount === 7 || streakCount % 10 === 0)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const latestMood = moods.length > 0 ? moods[0] : null; // Now using the first item since we sorted newest first

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
    "💖 Be kind to yourself, you're doing amazing.",
    "🌻 You are growing beautifully, keep shining!",
  ];
  const quoteOfTheDay = quotes[new Date().getDate() % quotes.length];

  // Get last 7 days of moods
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
  
  // Show either all moods or just the first 5 (newest ones)
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
      {latestMood ? (
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
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-4 bg-white rounded-xl shadow-md border border-slate-300"
        >
          <h3 className="text-xl font-semibold mb-2 text-slate-700">
            📝 No check-ins yet
          </h3>
          <p className="text-slate-600">
            Complete your first mood check-in to see your progress here!
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
      {earnedBadges.length > 0 ? (
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
      ) : moods.length > 0 && (
        <div className="p-4 bg-white rounded-xl shadow-md border border-slate-300">
          <h3 className="text-lg mb-3 text-slate-700 font-bold">🏅 Achievements</h3>
          <p className="text-slate-600">Keep up your streak to earn badges!</p>
        </div>
      )}

      {/* Mood Charts */}
      {moods.length > 0 ? (
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
      ) : (
        <div className="p-4 bg-white rounded-xl shadow-md border border-slate-300">
          <h3 className="text-lg mb-3 font-semibold text-slate-700">📊 Mood Charts</h3>
          <p className="text-slate-600">Complete a few check-ins to see your mood charts here!</p>
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
        {moods.length > 0 ? (
          <>
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
          </>
        ) : (
          <p className="text-slate-600">No mood history yet. Complete your first check-in!</p>
        )}
      </div>
    </div>
  );
}