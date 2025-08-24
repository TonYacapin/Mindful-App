import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import API from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-slate-300">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-6 flex items-center justify-center gap-2">
          <FaLeaf className="text-green-500" /> Join Mindful
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-300 shadow-sm px-3">
            <FaUser className="text-slate-400 mr-2" />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-300 shadow-sm px-3">
            <FaEnvelope className="text-slate-400 mr-2" />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-300 shadow-sm px-3 relative">
            <FaLock className="text-slate-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center bg-slate-50 rounded-xl border border-slate-300 shadow-sm px-3 relative">
            <FaLock className="text-slate-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-slate-700 placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? <><FaSpinner className="animate-spin" /> Registering...</> : "Register"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl shadow-sm transition"
        >
          Already have an account? Login
        </button>

        <p className="text-center text-slate-400 mt-4">Created by Abakus</p>
      </div>
    </div>
  );
}
