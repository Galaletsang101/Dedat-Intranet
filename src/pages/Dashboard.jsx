import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getNews } from "../services/newsService";
import { getCirculus } from "../services/circulusService";
import { getCalendarEvents } from "../services/calendarService";
import { getWellnessVideos } from "../services/wellnessService";
import { getDocuments } from "../services/documentsService";
import { getSiteContent } from "../services/siteContentService";
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

function Dashboard() {
  const navigate = useNavigate();
  const [showArchive, setShowArchive] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [grievance, setGrievance] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [grievanceMessage, setGrievanceMessage] = useState("");
  const [user] = useState(getCurrentUser);
  const [notices, setNotices] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [wellnessResources, setWellnessResources] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [dashboardContent, setDashboardContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      const results = await Promise.allSettled([
        getNews(),
        getCirculus(),
        getCalendarEvents(),
        getWellnessVideos(),
        getDocuments(),
        getSiteContent("dashboard"),
      ]);
      const [news, circulus, events, videos, documents, page] = results;
      if (news.status === "fulfilled") {
        setCommunications(news.value.map((item) => ({
          tag: item.category || "News",
          title: item.title,
          desc: item.excerpt || "",
          time: item.publication_date
            ? new Date(item.publication_date).toLocaleDateString()
            : "",
        })));
      } else {
        console.error("Failed to load dashboard news:", news.reason);
      }
      if (circulus.status === "fulfilled") {
        setNotices(circulus.value.map((item) => ({
          tag: item.category || "Circular",
          title: item.title,
          desc: item.description || "",
        })));
      } else {
        console.error("Failed to load dashboard circulars:", circulus.reason);
      }
      if (events.status === "fulfilled") {
        setCalendarEvents(events.value);
      } else {
        console.error("Failed to load dashboard events:", events.reason);
      }
      if (videos.status === "fulfilled") {
        setWellnessResources(videos.value.map((item) => ({
          title: item.title,
          desc: item.description || "",
          icon: <HiHeart />,
        })));
      } else {
        console.error("Failed to load dashboard wellness content:", videos.reason);
      }
      if (documents.status === "fulfilled") {
        setLearningResources(documents.value.map((item) => ({
          title: item.title,
          desc: item.description || "",
          icon: <HiBookOpen />,
        })));
      } else {
        console.error("Failed to load dashboard documents:", documents.reason);
      }
      if (page.status === "fulfilled") setDashboardContent(page.value);
      else console.error("Failed to load dashboard section:", page.reason);
      setLoadingContent(false);
    };
    loadContent();
  }, []);

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

  const content = dashboardContent?.content || {};
  const quickActions = content.quick_actions || [];
  const hrServices = content.hr_services || [];
  const allNotices = [
    ...notices,
    ...(content.announcements || []),
  ];
  const archivedNotices = content.archive || [];
  const iconMap = {
    calendar: <HiCalendar />,
    document: <HiDocumentText />,
    template: <HiTemplate />,
    users: <HiUsers />,
    chart: <HiChartBar />,
    shield: <HiShieldCheck />,
    heart: <HiHeart />,
    video: <HiVideoCamera />,
    book: <HiBookOpen />,
  };

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <h1>Welcome back, {user?.first_name || "colleague"}</h1>
        <p>{dashboardContent?.description || "Dashboard information will appear here when published."}</p>
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
            <span className="dashboard-action-icon">{iconMap[item.icon]}</span>
          </button>
        ))}
        {!quickActions.length && <p>{loadingContent ? "Loading dashboard links..." : "No dashboard links have been published."}</p>}
      </section>

      {/* ROW 1: HR Services & Payroll (Left) | Employee Notices (Right) */}
      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-large">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiOfficeBuilding className="dashboard-icon-accent" />
              <h2>HR Services & Payroll</h2>
            </div>
          </div>

          <div className="dashboard-service-grid">
            {hrServices.map((item, index) => (
              <div key={index} className="dashboard-service-card">
                <div className="dashboard-service-icon">{iconMap[item.icon]}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
            {!hrServices.length && <p>{loadingContent ? "Loading HR services..." : "No HR service information has been published."}</p>}
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
              {allNotices.map((item, index) => (
                <div key={index} className="dashboard-notice-item">
                  <span className="dashboard-notice-tag">{item.tag}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc || item.description || ""}</p>
                </div>
              ))}
              {notices.length === 0 && !loadingContent && <p>No employee notices are available.</p>}
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
        </div>
      </div>

      {/* ROW 2: Wellness Center (Left) | Staff Spotlight (Right) */}
      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-wellness">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiHeart className="dashboard-icon-accent" />
              <h2>Wellness Center</h2>
            </div>
          </div>
          <p className="dashboard-section-copy">
          {content.wellness_description || "Wellness resources will appear here when published."}
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

        {content.staff_spotlight && (
          <section className="dashboard-card dashboard-card-spotlight">
            <div className="dashboard-spotlight-banner">
              <div className="dashboard-spotlight-badge"><HiStar />{content.staff_spotlight.heading || "Staff Spotlight"}</div>
            </div>
            <div className="dashboard-spotlight-body">
              {content.staff_spotlight.image && <img src={content.staff_spotlight.image} alt={content.staff_spotlight.name || "Staff spotlight"} className="dashboard-avatar" />}
              <h3>{content.staff_spotlight.name}</h3>
              <p className="dashboard-spotlight-role">{content.staff_spotlight.position}</p>
              <blockquote>{content.staff_spotlight.description}</blockquote>
            </div>
          </section>
        )}
      </div>

      {/* ROW 3: Department Notices (Left) | Learning Centre (Right) */}
      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-department">
          <div className="dashboard-card-header">
            <div className="dashboard-title-group">
              <HiShieldCheck className="dashboard-icon-accent" />
              <h2>Department Notices</h2>
            </div>
          </div>
          <div className="dashboard-department-list">
            {calendarEvents.map((event) => {
              const date = new Date(event.start_time);
              return (
                <div className="dashboard-department-item" key={event.id}>
                  <div className="dashboard-date-pill">
                    <span>{date.toLocaleDateString("en-ZA", { month: "short" }).toUpperCase()}</span>
                    <strong>{date.toLocaleDateString("en-ZA", { day: "2-digit" })}</strong>
                  </div>
                  <div>
                    <span className="dashboard-status info">{event.category}</span>
                    <h4>{event.title}</h4>
                    <p>{event.description || ""}</p>
                  </div>
                </div>
              );
            })}
            {!loadingContent && calendarEvents.length === 0 && <p>No department events are available.</p>}
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
        </section>
      </div>

      {/* ROW 4: Internal Communications (Full Width) */}
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
          {!loadingContent && communications.length === 0 && <p>No communications have been published.</p>}
        </div>
      </section>

      {/* ROW 5: Anonymous Boxes (Left & Right) */}
      <div className="dashboard-grid dashboard-grid-equal">
        <section className="dashboard-card dashboard-card-anonymous">
          <div className="dashboard-anonymous-header">
            <h3>Anonymous Suggestion Box</h3>
            {showSuggestionForm && (
              <button 
                type="button" 
                className="dashboard-close-button"
                onClick={() => {
                  setShowSuggestionForm(false);
                  setSuggestion("");
                  setSuggestionMessage("");
                }}
              >
                ✕
              </button>
            )}
          </div>
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

        <section className="dashboard-card dashboard-card-anonymous">
          <div className="dashboard-anonymous-header">
            <h3>Anonymous Grievance Box</h3>
            {showGrievanceForm && (
              <button 
                type="button" 
                className="dashboard-close-button"
                onClick={() => {
                  setShowGrievanceForm(false);
                  setGrievance("");
                  setGrievanceMessage("");
                }}
              >
                ✕
              </button>
            )}
          </div>
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
  );
}

export default Dashboard;