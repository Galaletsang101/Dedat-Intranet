import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

import "../styles/topnav.css";

import logo from "../assets/DEDAT-HD-small.jpg";

import { FaBars, FaTimes } from "react-icons/fa";

function TopNav({ toggleMenu, menuOpen }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [showMenu, setShowMenu] = useState(false);

  async function handleLogout() {
    await signOut(auth);

    setShowMenu(false);

    navigate("/");
  }

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        const unsubscribeProfile = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
        });

        return unsubscribeProfile;
      }
    });

    return unsubscribeAuth;
  }, []);

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

        <NavLink to="/news-circulus">News and Circulus</NavLink>

        <NavLink to="/programs-units">Programs and Units</NavLink>

        <NavLink to="/staff-directory">Staff Directory</NavLink>

        <NavLink to="/knowledge-center">Knowledge Center</NavLink>

        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>

      {/* Profile */}

      <div className="profile" onClick={() => setShowMenu(!showMenu)}>
        <div className="topnav-avatar">
          {profile
            ? `${profile.firstName.charAt(0)}${profile.surname.charAt(0)}`
            : "U"}
        </div>

        <div className="profile-details">
          <span>
            {profile ? `${profile.firstName} ${profile.surname}` : "User"}
          </span>

          <small>{profile ? profile.position : ""}</small>
        </div>

        {showMenu && (
          <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navigate("/profile")}>View Profile</button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopNav;
