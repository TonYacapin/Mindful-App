import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import API from "../utils/api";

export default function Login({ setIsAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setIsAuth(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-slate-300">
        {/* App Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Mindful <span className="text-green-500">🌱</span>
          </h1>
          <p className="text-slate-500 mt-2">Track your mood & journal your thoughts</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-300 shadow-sm px-4">
            <FaEnvelope className="text-slate-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              className="p-3 w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-300 shadow-sm px-4 relative">
            <FaLock className="text-slate-400 mr-3" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="p-3 w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? <><FaSpinner className="animate-spin" /> Logging in...</> : "Login"}
          </button>
        </form>

        {/* Register */}
        <button
          onClick={() => navigate("/register")}
          className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl shadow-sm transition"
        >
          <FaUserPlus /> Need an account? Register
        </button>

        <p className="text-center text-slate-400 mt-4">Created by Abakus</p>
      </div>
    </div>
  );
}
