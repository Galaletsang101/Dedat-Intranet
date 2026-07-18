import React from "react";
import "../styles/footer.css";
import logo from "../assets/DEDAT-HD-small.jpg";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Contact Us */}
        <div className="footer-column">
          <h3 className="footer-heading">Contact Us</h3>
          <p className="address">
            <strong>Physical Address</strong>
            <br />
            Northern Cape Department of Economic Development and Tourism
            <br />
            MetLife Towers, 20 – 22 Villiers Street
            <br />
            Kimberley, Northern Cape, 8301
            <br />
            South Africa
          </p>
          <p>
            <strong>Email:</strong> info@ncdedat.gov.za
          </p>
          <p>
            <strong>Tel:</strong> +27 53 110 0289
          </p>
        </div>

        {/* Column 2: Quick Links (Intranet) */}
        <div className="footer-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/homepage">Home</Link></li>
            <li><Link to="/programmes">Programmes & Units</Link></li>
            <li><Link to="/knowledge-hub">Knowledge Hub</Link></li>
            <li><Link to="/expertise">Expertise Locator</Link></li>
            <li><Link to="/communications">News & Communications</Link></li>
            <li><Link to="/services">Employee Services</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/help">Help & Support</Link></li>
          </ul>
        </div>

        {/* Column 3: Internal Resources */}
        <div className="footer-column">
          <h3 className="footer-heading">Resources</h3>
          <ul className="footer-links">
            <li><Link to="/policies">Policies & Procedures</Link></li>
            <li><Link to="/forms">Forms & Templates</Link></li>
            <li><Link to="/it-support">IT Support</Link></li>
            <li><Link to="/hr">Human Resources</Link></li>
            <li><Link to="/feedback">Feedback / Suggestions</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Column 4: About NCDEDAT */}
        <div className="footer-column">
          <h3 className="footer-heading">About NCDEDAT</h3>
          <p className="about-text">
            The Northern Cape Department of Economic Development and Tourism is
            committed to accelerating inclusive economic growth through modernisation,
            diversification, and empowerment. We drive sustainable development,
            job creation, and tourism growth across the province.
          </p>
          <p className="about-text">
            <Link to="/about" className="footer-link">Learn more about us →</Link>
          </p>
        </div>

        {/* Column 5: Brand & Logo */}
        <div className="footer-column brand-column">
          <img src={logo} alt="NCDEDAT Logo" className="footer-logo" />
          <p className="brand-tagline">Digital Workplace</p>
          {/* Optionally add social media if needed – keep minimal */}
          {/* <div className="social-media-links"> ... </div> */}
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Northern Cape Department of Economic
          Development and Tourism. All rights reserved.
        </p>
        <div className="bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <a href="https://www.northern-cape.gov.za" target="_blank" rel="noopener noreferrer">
            Official Website
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;