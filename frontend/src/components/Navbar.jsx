import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChartLine, FaBook, FaPaw, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ setIsAuth }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { to: "/journal", label: "Journal", icon: <FaBook /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-200 via-teal-200 to-blue-200 shadow-lg px-6 py-4 flex items-center rounded-b-3xl relative">
      {/* Logo / Title */}
      <h1 className="text-2xl font-extrabold text-green-700 tracking-wide flex items-center gap-2">
        🌱 Mindful
      </h1>

      {/* Desktop Nav Links */}
      <div className="ml-12 hidden md:flex gap-8">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.to}
            className="flex items-center gap-2 text-green-700 hover:text-teal-600 transition font-semibold"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      {/* Logout (desktop only) */}
      <button
        onClick={logout}
        className="ml-auto hidden md:flex items-center gap-2 bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 px-4 py-2 rounded-xl shadow-md transition text-white font-semibold"
      >
        <FaSignOutAlt />
        Logout
      </button>

      {/* Mobile Menu Button */}
      <button
        className="ml-auto md:hidden text-green-700 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-b from-teal-100 to-green-100 flex flex-col items-start px-6 py-4 gap-4 md:hidden z-50 shadow-lg rounded-b-3xl">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="flex items-center gap-3 text-green-700 hover:text-teal-600 transition font-semibold w-full"
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-teal-400 hover:opacity-90 px-4 py-2 rounded-xl shadow-md transition text-white font-semibold w-full justify-center"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
