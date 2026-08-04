import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import {
  HiCalendar,
  HiDocumentText,
  HiTemplate,
  HiUserGroup,
  HiOfficeBuilding,
  HiChartBar,
  HiCreditCard,
  HiUsers,
  HiShieldCheck,
  HiPlus,
  HiHeart,
  HiBell,
  HiStar,
  HiBookOpen,
  HiVideoCamera,
  HiDesktopComputer,
  HiNewspaper,
  HiClock,
} from "react-icons/hi";

const quickActions = [
  {
    title: "Apply for Leave",
    desc: "Track and request time off",
    icon: <HiCalendar />,
    accent: "light",
    action: "mailto:hr@dedat.gov.za?subject=Leave%20Request",
  },
  {
    title: "Submit Forms",
    desc: "Claims, travel & procurement",
    icon: <HiDocumentText />,
    accent: "light",
    action: "/knowledge-center",
  },
  {
    title: "HR Templates",
    desc: "Letters, logs & checklists",
    icon: <HiTemplate />,
    accent: "light",
    action: "/knowledge-center",
  },
  {
    title: "Contact HR",
    desc: "Support & inquiries",
    icon: <HiUserGroup />,
    accent: "secondary",
    action: "mailto:hr@dedat.gov.za?subject=HR%20Support",
  },
];

const hrServices = [
  { title: "Leave Management", desc: "View balances and historical applications.", icon: <HiCalendar /> },
  { title: "PMDS", desc: "Performance management and assessments.", icon: <HiChartBar /> },
  { title: "Payroll Links", desc: "Access e-payslips and tax certificates.", icon: <HiCreditCard /> },
  { title: "Labour Relations", desc: "Policies, grievance forms, and support.", icon: <HiUsers /> },
  { title: "Ethics Management", desc: "Disclosure of interest and code of conduct.", icon: <HiShieldCheck /> },
];

const wellnessResources = [
  { title: "FAMSA Partnership", desc: "Confidential counseling & support.", icon: <HiHeart /> },
  { title: "Health Circulars", desc: "Stay updated on health protocols.", icon: <HiDocumentText /> },
  { title: "First Aid", desc: "Emergency support and basic first aid guidance.", icon: <HiHeart /> },
];

const notices = [
  {
    tag: "Acting Appointment",
    title: "Ms. Nomvula Dube",
    desc: "Acting Director: Tourism Development effective 01 Nov.",
  },
  {
    tag: "New Appointment",
    title: "Mr. Kevin Smith",
    desc: "Welcome our new IT Security Specialist.",
  },
  {
    tag: "Bereavement",
    title: "Memorial Service: L. Mofokeng",
    desc: "Thursday, 14:00 at Main Hall.",
  },
];

const learningResources = [
  { title: "Zoom/Teams Guides", desc: "Troubleshooting & basics.", icon: <HiVideoCamera /> },
  { title: "Training Resources", desc: "Departmental manuals & SOPs.", icon: <HiBookOpen /> },
  { title: "E-learning Modules", desc: "Mandatory compliance courses.", icon: <HiDesktopComputer /> },
];

const communications = [
  {
    tag: "Communiqué",
    title: "Quarterly Performance Review: Q3 Outcomes",
    desc: "Detailed report on departmental targets and achievements across all districts.",
    time: "2 hours ago",
  },
  {
    tag: "Workshop",
    title: "Mandatory Ethics & Anti-Corruption Training",
    desc: "All staff members are required to attend the upcoming compliance session via Zoom.",
    time: "5 hours ago",
  },
  {
    tag: "IT Announcement",
    title: "Server Maintenance: Scheduled Downtime",
    desc: "The e-Leave system will be unavailable this Friday from 18:00 for critical updates.",
    time: "Yesterday",
  },
  {
    tag: "Statistics",
    title: "Provincial Economic Snapshot - October",
    desc: "Key indicators on tourism growth and SMME support across the Northern Cape.",
    time: "2 days ago",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [showArchive, setShowArchive] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [grievance, setGrievance] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [grievanceMessage, setGrievanceMessage] = useState("");

  const handleAction = (action) => {
    if (!action) return;
    if (action.startsWith("mailto:")) {
      window.location.href = action;
      return;
    }
    navigate(action);
  };

  const handleSuggestionSubmit = (event) => {
    event.preventDefault();
    if (!suggestion.trim()) {
      setSuggestionMessage("Please enter an anonymous suggestion before sending.");
      return;
    }
    setSuggestionMessage("Your anonymous suggestion has been sent to HR for review.");
    setSuggestion("");
    setShowSuggestionForm(false);
  };

  const handleGrievanceSubmit = (event) => {
    event.preventDefault();
    if (!grievance.trim()) {
      setGrievanceMessage("Please describe your concern before sending anonymously.");
      return;
    }
    setGrievanceMessage("Your anonymous complaint has been sent to the HR ethics team.");
    setGrievance("");
    setShowGrievanceForm(false);
  };

  const archivedNotices = [
    {
      tag: "Archived",
      title: "Policy Update: Leave Guidelines",
      desc: "Review the updated leave procedures published last month.",
    },
    {
      tag: "Archived",
      title: "HR Workshop Reminder",
      desc: "Attendance is required for the annual wellness and compliance workshop.",
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <h1>Welcome back, Thabo</h1>
        <p>Your central hub for NCDEDAT departmental services and professional resources.</p>
      </section>

      <section className="dashboard-quick-actions">
        {quickActions.map((item, index) => (
          <button
            key={index}
            type="button"
            className={`dashboard-action-card ${item.accent}`}
            onClick={() => handleAction(item.action)}
          >
            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
            <span className="dashboard-action-icon">{item.icon}</span>
          </button>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-large">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiOfficeBuilding className="dashboard-icon-accent" />
              <h2>HR Services & Payroll</h2>
            </div>
            <button type="button" className="dashboard-link-button">View All</button>
          </div>

          <div className="dashboard-service-grid">
            {hrServices.map((item, index) => (
              <div key={index} className="dashboard-service-card">
                <div className="dashboard-service-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
           
          </div>
        </section>

        <div className="dashboard-stack">
          <section className="dashboard-card dashboard-card-notices">
            <div className="dashboard-card-header">
              <div className="dashboard-title-group">
                <HiBell className="dashboard-icon-accent" />
                <h2>Employee Notices</h2>
              </div>
            </div>
            <div className="dashboard-notice-list">
              {notices.map((item, index) => (
                <div key={index} className="dashboard-notice-item">
                  <span className="dashboard-notice-tag">{item.tag}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
              {showArchive && archivedNotices.map((item, index) => (
                <div key={`archive-${index}`} className="dashboard-notice-item dashboard-archive-item">
                  <span className="dashboard-notice-tag">{item.tag}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <button type="button" className="dashboard-outline-button" onClick={() => setShowArchive((value) => !value)}>
              {showArchive ? "Hide Archive" : "See Archive"}
            </button>
          </section>

          <section className="dashboard-card dashboard-card-spotlight">
            <div className="dashboard-spotlight-banner">
              <div className="dashboard-spotlight-badge">
                <HiStar />
                Staff Spotlight
              </div>
            </div>
            <div className="dashboard-spotlight-body">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Sarah Johnson"
                className="dashboard-avatar"
              />
              <h3>Sarah Johnson</h3>
              <p className="dashboard-spotlight-role">Excellence in Service Delivery</p>
              <blockquote>“Sarah consistently goes above and beyond to support the SMME development project.”</blockquote>
              <div className="dashboard-tags">
                <span>Long Service</span>
                <span>Innovation Award</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-bottom">
        <section className="dashboard-card dashboard-card-wellness">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiHeart className="dashboard-icon-accent" />
              <h2>Wellness Center</h2>
            </div>
          </div>
          <p className="dashboard-section-copy">
            Prioritizing the health and mental well-being of our dedicated staff across the province.
          </p>
          <div className="dashboard-resource-list">
            {wellnessResources.map((item, index) => (
              <div key={index} className="dashboard-resource-item">
                <div className="dashboard-resource-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card dashboard-card-learning">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiBookOpen className="dashboard-icon-accent" />
              <h2>Learning Centre</h2>
            </div>
          </div>
          <div className="dashboard-resource-list">
            {learningResources.map((item, index) => (
              <div key={index} className="dashboard-resource-item dashboard-learning-item">
                <div className="dashboard-resource-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-progress-card">
            <h4>My Progress</h4>
            <div className="dashboard-progress-bar">
              <div></div>
            </div>
            <p>75% of Digital Literacy complete</p>
          </div>
        </section>
      </div>

      <section className="dashboard-card dashboard-card-news">
        <div className="dashboard-card-header">
          <div className="dashboard-title-group">
            <HiNewspaper className="dashboard-icon-accent" />
            <h2>Internal Communications</h2>
          </div>
        </div>
        <div className="dashboard-news-grid">
          {communications.map((item, index) => (
            <article key={index} className="dashboard-news-card">
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <small>
                <HiClock /> {item.time}
              </small>
            </article>
          ))}
        </div>
      </section>

      <div className="dashboard-grid dashboard-grid-bottom">
        <section className="dashboard-card dashboard-card-department">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiShieldCheck className="dashboard-icon-accent" />
              <h2>Department Notices</h2>
            </div>
          </div>
          <div className="dashboard-department-list">
            <div className="dashboard-department-item">
              <div className="dashboard-date-pill">
                <span>OCT</span>
                <strong>28</strong>
              </div>
              <div>
                <span className="dashboard-status urgent">Urgent</span>
                <h4>System Migration Downtime</h4>
                <p>Internal database will be offline for 4 hours starting at 18:00.</p>
              </div>
            </div>
            <div className="dashboard-department-item">
              <div className="dashboard-date-pill">
                <span>OCT</span>
                <strong>30</strong>
              </div>
              <div>
                <span className="dashboard-status info">Information</span>
                <h4>New Parking Policy</h4>
                <p>Please review updated parking allocations for Head Office.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-stack">
          <section className="dashboard-card dashboard-card-widget">
            <h3>Anonymous Suggestion Box</h3>
            <p>Share an idea to improve our workplace anonymously.</p>
            {!showSuggestionForm ? (
              <button type="button" className="dashboard-outline-button" onClick={() => setShowSuggestionForm(true)}>Submit Anonymous Suggestion</button>
            ) : (
              <form className="dashboard-form" onSubmit={handleSuggestionSubmit}>
                <textarea
                  value={suggestion}
                  onChange={(event) => setSuggestion(event.target.value)}
                  placeholder="Share your anonymous suggestion here..."
                  rows="4"
                />
                <button type="submit" className="dashboard-outline-button">Send Anonymously</button>
              </form>
            )}
            {suggestionMessage ? <p className="dashboard-form-message">{suggestionMessage}</p> : null}
          </section>

          <section className="dashboard-card dashboard-card-widget">
            <h3>Anonymous Grievance Box</h3>
            <p>Submit a formal complaint or report an issue anonymously.</p>
            {!showGrievanceForm ? (
              <button type="button" className="dashboard-outline-button" onClick={() => setShowGrievanceForm(true)}>File an Anonymous Complaint</button>
            ) : (
              <form className="dashboard-form" onSubmit={handleGrievanceSubmit}>
                <textarea
                  value={grievance}
                  onChange={(event) => setGrievance(event.target.value)}
                  placeholder="Describe your concern anonymously here..."
                  rows="4"
                />
                <button type="submit" className="dashboard-outline-button">Send Anonymously</button>
              </form>
            )}
            {grievanceMessage ? <p className="dashboard-form-message">{grievanceMessage}</p> : null}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;