import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../utils/api";

export default function Login({ setIsAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setIsAuth(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-sky-100 to-emerald-100 p-6">
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 w-full max-w-md border border-sky-200">
        {/* Title */}
        <h2 className="text-3xl font-bold text-sky-600 text-center mb-6 flex items-center justify-center gap-2">
          <FaLeaf className="text-pink-500" />
          Welcome Back 🌱
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex items-center bg-white rounded-lg border border-sky-300 shadow-sm px-3">
            <FaEnvelope className="text-sky-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              className="p-2 w-full bg-transparent outline-none text-sky-700"
            />
          </div>

          {/* Password with toggle */}
          <div className="flex items-center bg-white rounded-lg border border-sky-300 shadow-sm px-3 relative">
            <FaLock className="text-sky-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              className="p-2 w-full bg-transparent outline-none text-sky-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-sky-500 hover:text-sky-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="text-pink-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-gradient-to-r from-pink-400 to-sky-400 hover:opacity-90 text-white font-semibold py-2 rounded-lg shadow-md transition"
          >
            Login
          </button>
        </form>

        {/* Switch to Register */}
        <button
          onClick={() => navigate("/register")}
          className="mt-4 flex items-center justify-center gap-2 w-full bg-sky-200 hover:bg-sky-300 text-sky-700 font-medium py-2 rounded-lg shadow-sm transition"
        >
          <FaUserPlus /> Need an account? Register
        </button>
      </div>
    </div>
  );
}
