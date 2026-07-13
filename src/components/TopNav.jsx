import { NavLink } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import "../styles/topnav.css";
import logo from "../assets/DEDAT-HD-small.jpg";  

function TopNav() {
  return (
    <header className="topnav">

      {/* Logo */}
      <div className="logo">
          <img src={logo} alt="DeDAaT Logo" />
      </div>


      {/* Main Navigation */}
      <nav className="main-links">

        <NavLink to="/home">
          Home
        </NavLink>

        <NavLink to="/about">
          About
        </NavLink>

        <NavLink to="/calendar">
          Calendar
        </NavLink>

        <NavLink to="/news-circulus">
          News and Circulus
        </NavLink>

        <NavLink to="/programs-units">
          Programs and Units
        </NavLink>

        <NavLink to="/staff-directory">
          Staff Directory
        </NavLink>

        <NavLink to="/knowledge-center">
          Knowledge Center
        </NavLink>

      </nav>


   {/* Profile */}
      <div className="profile">


        <FaUserCircle className="profile-icon"/>


        <div className="profile-details">

          <span>
            G.Morokonyana
          </span>


        </div>


      </div>


    </header>
  );
}

export default TopNav;