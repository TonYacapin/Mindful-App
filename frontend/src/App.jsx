import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Navbar from "./components/Navbar";

export default function App() {
  // Function to check if token exists and is valid
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now(); // expiration in ms
    } catch (e) {
      console.log("Invalid token:", e);
      return false;
    }
  };

  const [isAuth, setIsAuth] = useState(isTokenValid());

  // Update auth state if localStorage changes or token expires
  useEffect(() => {
    const handleStorage = () => setIsAuth(isTokenValid());
    window.addEventListener("storage", handleStorage);

    // Check token validity every 30 seconds
    const interval = setInterval(() => setIsAuth(isTokenValid()), 30000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Remove invalid token
  useEffect(() => {
    if (!isAuth) {
      localStorage.removeItem("token");
    }
  }, [isAuth]);

  return (
    <Router>
      {isAuth && <Navbar setIsAuth={setIsAuth} />}
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} />}
        />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/journal"
          element={isAuth ? <Journal /> : <Navigate to="/login" />}
        />
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}
