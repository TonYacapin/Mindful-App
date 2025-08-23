import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Pet from "./pages/Pet";
import Navbar from "./components/Navbar";

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  // Update state if token changes in localStorage
  useEffect(() => {
    const handleStorage = () => setIsAuth(!!localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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
        <Route
          path="/pet"
          element={isAuth ? <Pet /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
