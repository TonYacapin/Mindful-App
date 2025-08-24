// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Navbar from "./components/Navbar";

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

export default function App() {
  const [isAuth, setIsAuth] = useState(isTokenValid());

  // Update auth state if localStorage changes or token expires
  useEffect(() => {
    const handleStorage = () => setIsAuth(isTokenValid());
    window.addEventListener("storage", handleStorage);

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
        {/* Home redirects */}
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Login setIsAuth={setIsAuth} />}
        />
        <Route
          path="/register"
          element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/journal"
          element={isAuth ? <Journal /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}
