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
    { to: "/pet", label: "Pet", icon: <FaPaw /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-pink-200 via-sky-200 to-emerald-200 shadow-md px-6 py-4 flex items-center rounded-b-xl relative">
      {/* Logo / Title */}
      <h1 className="text-xl font-bold text-sky-700 tracking-wide">
        🌱 Mindful
      </h1>

      {/* Desktop Nav Links */}
      <div className="ml-10 hidden md:flex gap-6">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.to}
            className="flex items-center gap-2 text-sky-700 hover:text-pink-600 transition font-medium"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      {/* Logout (desktop only) */}
      <button
        onClick={logout}
        className="ml-auto hidden md:flex items-center gap-2 bg-gradient-to-r from-pink-400 to-sky-400 hover:opacity-90 px-4 py-2 rounded-lg shadow-md transition text-white font-semibold"
      >
        <FaSignOutAlt />
        Logout
      </button>

      {/* Mobile Menu Button */}
      <button
        className="ml-auto md:hidden text-sky-700 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-b from-sky-100 to-pink-100 flex flex-col items-start px-6 py-4 gap-4 md:hidden z-50 shadow-lg rounded-b-xl">
          {links.map((link, idx) => (
            <Link
              key={idx}
              to={link.to}
              className="flex items-center gap-2 text-sky-700 hover:text-pink-600 transition font-medium"
              onClick={() => setIsOpen(false)} // close menu after click
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
            className="flex items-center gap-2 bg-gradient-to-r from-pink-400 to-sky-400 hover:opacity-90 px-4 py-2 rounded-lg shadow-md transition text-white font-semibold w-full justify-center"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
