
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logoutUser
} from "../services/authService";

import "../styles/topnav.css";

import logo from "../assets/DEDAT-HD-small.jpg";

import { FaBars, FaTimes } from "react-icons/fa";

function TopNav({ toggleMenu, menuOpen }) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  // Get the currently logged-in PostgreSQL user
  const user = getCurrentUser();

  // Get initials
  const initials = user
    ? `${user.first_name?.charAt(0) || ""}${user.surname?.charAt(0) || ""}`
    : "U";

  // Get full name
  const fullName = user
    ? `${user.first_name || ""} ${user.surname || ""}`.trim()
    : "User";

  async function handleLogout() {
    logoutUser();

    setShowMenu(false);

    navigate("/");
  }

  return (
    <header className="topnav">

      {/* Hamburger */}
      <button className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="DeDAaT Logo" />
      </div>

      {/* Main Navigation */}
      <nav className="nav-links">
        <NavLink to="/home">Home</NavLink>

        <NavLink to="/about">About</NavLink>

        <NavLink to="/calendar">Calendar</NavLink>

        <NavLink to="/news-circulus">News and Circulars</NavLink>

        <NavLink to="/programs-units">Programs and Units</NavLink>

        <NavLink to="/staff-directory">Staff Directory</NavLink>

        <NavLink to="/knowledge-center">Knowledge Center</NavLink>

        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>

      {/* Profile */}
      <div
        className="profile"
        onClick={() => setShowMenu(!showMenu)}
      >

        {/* Initials */}
        <div className="topnav-avatar">
          {initials}
        </div>

        {/* Name and Position */}
        <div className="profile-details">
          <span>{fullName}</span>

          <small>
            {user?.position || ""}
          </small>
        </div>

        {/* Profile Menu */}
        {showMenu && (
          <div
            className="profile-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => navigate("/profile")}>
              View Profile
            </button>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

      </div>

    </header>
  );
}

export default TopNav;
