import { useState, useEffect } from "react";
import API from "../utils/api";
import { FaSearch } from "react-icons/fa";

export default function Journal() {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState("😊");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState("");

  const moods = [
    { icon: "😊", label: "Happy" },
    { icon: "😔", label: "Sad" },
    { icon: "😡", label: "Angry" },
    { icon: "😴", label: "Tired" },
    { icon: "😌", label: "Calm" },
  ];

  const fetchEntries = async () => {
    const res = await API.get("/journals");
    setEntries(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (content.length > 500) {
      setError("Your entry must be 500 characters or less.");
      return;
    }

    try {
      await API.post("/journals", { content, mood });
      setContent("");
      setMood("😊");
      setError("");
      fetchEntries();
    } catch (err) {
      setError("Failed to save entry. Please try again.");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filteredEntries = entries.filter(
    (j) =>
      j.content.toLowerCase().includes(search.toLowerCase()) ||
      j.mood?.includes(search)
  );

  const entriesToShow = showAll ? filteredEntries : filteredEntries.slice(0, 3);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-sky-600">
        ✍️ Mindful Journal
      </h2>

      {/* Journal Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gradient-to-r from-pink-100 via-sky-100 to-emerald-100 p-4 sm:p-6 rounded-xl shadow-md border border-sky-200"
      >
        {/* Mood Selector */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sky-700 font-medium">Mood:</span>
          <div className="flex gap-2 flex-wrap">
            {moods.map((m) => (
              <button
                type="button"
                key={m.icon}
                onClick={() => setMood(m.icon)}
                className={`text-2xl transition-transform rounded-full p-2 ${
                  mood === m.icon
                    ? "bg-pink-200 scale-110 shadow-md"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              >
                {m.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= 500) {
              setContent(e.target.value);
              setError("");
            } else {
              setError("You have reached the 500 character limit.");
            }
          }}
          placeholder="How are you feeling today? Write your thoughts..."
          className="p-3 rounded-lg border border-sky-300 bg-white/70 text-sky-800 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm sm:text-base"
        />

        {/* Character count + error */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p
            className={`text-xs sm:text-sm ${
              content.length > 500 ? "text-pink-600" : "text-sky-500"
            }`}
          >
            {content.length}/500
          </p>
          {error && <p className="text-xs sm:text-sm text-pink-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={content.length > 500}
          className={`self-end px-4 sm:px-5 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105 ${
            content.length > 500
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-400 to-sky-400 text-white"
          }`}
        >
          Save Entry
        </button>
      </form>

      {/* Search + Stats */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center bg-white/60 px-3 py-2 rounded-lg w-full md:w-2/3 border border-sky-200 shadow-sm">
          <FaSearch className="text-sky-500 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sky-700 w-full text-sm sm:text-base"
          />
        </div>
        <div className="text-sky-600 text-sm text-center md:text-right">
          Total Entries:{" "}
          <span className="text-pink-600 font-semibold">{entries.length}</span>
        </div>
      </div>

      {/* Entries */}
      <h3 className="text-xl sm:text-2xl font-semibold mt-10 mb-4 text-sky-700">
        Previous Entries
      </h3>

      {filteredEntries.length === 0 ? (
        <p className="text-sky-500 italic text-center sm:text-left">
          No matching entries. Try writing your first thoughts 🌱
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {entriesToShow.map((j) => (
              <li
                key={j._id}
                className="bg-gradient-to-r from-sky-100 to-pink-100 p-4 rounded-lg shadow-md border-l-4 border-pink-400"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                  <p className="text-xs sm:text-sm text-sky-600">
                    {new Date(j.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <span className="text-xl sm:text-2xl">{j.mood || "📝"}</span>
                </div>
                <p className="text-sky-800 whitespace-pre-line break-words text-sm sm:text-base">
                  {j.content}
                </p>
              </li>
            ))}
          </ul>

          {/* Show More / Less button */}
          {filteredEntries.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 mx-auto block bg-gradient-to-r from-sky-400 to-pink-400 hover:opacity-90 px-4 py-2 rounded-lg text-white font-medium transition text-sm sm:text-base shadow-md"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
