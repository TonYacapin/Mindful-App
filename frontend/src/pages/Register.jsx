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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check password confirmation
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-pink-100 to-emerald-100 p-6">
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 w-full max-w-md border border-pink-200">
        <h2 className="text-3xl font-bold text-pink-500 text-center mb-6 flex items-center justify-center gap-2">
          <FaLeaf className="text-sky-500" />
          Join Mindful 🌸
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex items-center bg-white rounded-lg border border-pink-300 shadow-sm px-3">
            <FaUser className="text-pink-500 mr-2" />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-pink-700"
            />
          </div>

          {/* Email */}
          <div className="flex items-center bg-white rounded-lg border border-pink-300 shadow-sm px-3">
            <FaEnvelope className="text-pink-500 mr-2" />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-pink-700"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white rounded-lg border border-pink-300 shadow-sm px-3 relative">
            <FaLock className="text-pink-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-pink-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-pink-500 hover:text-pink-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center bg-white rounded-lg border border-pink-300 shadow-sm px-3 relative">
            <FaLock className="text-pink-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="p-2 w-full bg-transparent outline-none text-pink-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-pink-500 hover:text-pink-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-pink-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-sky-400 to-pink-400 hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-md transition flex items-center justify-center gap-2 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? <><FaSpinner className="animate-spin" /> Registering...</> : "Register"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full bg-sky-200 hover:bg-sky-300 text-sky-700 font-medium py-2 rounded-lg shadow-sm transition"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
