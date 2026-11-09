import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaRocket,
  FaHeart,
  FaUserShield,
  FaBalanceScale,
  FaUsers,
  FaBriefcase,
  FaStore,
  FaMapMarkedAlt,
  FaCoins,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaFilePdf,
  FaChartLine,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "../styles/about.css";
import { getSiteContent } from "../services/siteContentService";

const iconMap = {
  heart: <FaHeart />,
  integrity: <FaUserShield />,
  accountability: <FaBalanceScale />,
  transparency: <FaEye />,
  briefcase: <FaBriefcase />,
  store: <FaStore />,
  tourism: <FaMapMarkedAlt />,
  investment: <FaCoins />,
  report: <FaFilePdf />,
  chart: <FaChartLine />,
};

function About() {
  const [page, setPage] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteContent("about")
      .then(setPage)
      .catch((error) => {
        console.error("Failed to load About content:", error);
        setLoadError(error.message || "Unable to load department information.");
      })
      .finally(() => setLoading(false));
  }, []);

  const content = page?.content || {};
  const values = content.values || [];
  const goals = content.goals || [];
  const executives = content.executives || [];
  const programmes = content.programmes || [];
  const milestones = content.milestones || [];
  const reports = content.reports || [];

  return (
    <div className="about-page">
      {loading && <p role="status">Loading department information...</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {/* Hero */}
      <section className="about-hero">
        {page?.image_url && <img className="about-hero-image" src={page.image_url} alt={page.title || "Department"} />}

        <div className="about-hero-overlay" />

        <div className="about-container about-hero-content">
          <span className="about-badge">
            Government of the Northern Cape
          </span>

          <h1>{page?.title || "About the Department"}</h1>

          <p className="about-hero-description">
            {page?.description || "Department information will appear here when published."}
          </p>

          <div className="vision-mission">
            <div className="vision-mission-card">
              <div className="vision-mission-heading">
                <FaEye />
                <h3>Vision</h3>
              </div>

              <p>
                {content.vision || ""}
              </p>
            </div>

            <div className="vision-mission-card">
              <div className="vision-mission-heading">
                <FaRocket />
                <h3>Mission</h3>
              </div>

              <p>
                {content.mission || ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-section values-section">
        <div className="about-container">
          <div className="section-heading">
            <div>
              <h2>{content.values_heading || "Values & Culture"}</h2>
              <p>
                {content.values_description || ""}
              </p>
            </div>

            <span className="section-divider" />
          </div>

          <div className="values-list">
            {values.map((value) => (
              <div className="value-card" key={value.title}>
                <div className="value-icon">{iconMap[value.icon] || <FaHeart />}</div>
                <h4>{value.title}</h4>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Goals */}
      <section className="strategic-section">
        <div className="about-container">
          <div className="center-heading">
            <h2>{content.goals_heading || "Strategic Goals"}</h2>
            <p>
              {content.goals_description || ""}
            </p>
          </div>

          <div className="goals-list">
            {goals.map((goal) => (
              <div className="goal-card" key={goal.title}>
                <div className="goal-icon">{iconMap[goal.icon] || <FaBriefcase />}</div>

                <h3>{goal.title}</h3>

                <p>{goal.text}</p>

                <button type="button" className="goal-link">
                  {goal.link}
                  <FaArrowRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Management */}
      <section className="about-section executive-section">
        <div className="about-container">
          <h2 className="section-title-center">Executive Management</h2>

          <div className="executive-list">
            {executives.map((person) => (
              <div className="executive-card" key={person.role}>
                <div className="executive-image-wrapper">
                  <img src={person.image} alt={person.name} />

                  <span className="executive-role">{person.role}</span>
                </div>

                <div className="executive-info">
                  <h3>{person.name}</h3>
                  <p>{person.position}</p>

                  <div className="executive-actions">
                    {person.email && <a className="primary-button" href={`mailto:${person.email}`}>
                      <FaEnvelope />
                      Email
                    </a>}

                    {person.phone && <a className="outline-button" href={`tel:${person.phone}`}>
                      <FaPhone />
                      Phone
                    </a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organisational Structure */}
      <section className="organisation-section">
        <div className="about-container">
          <div className="center-heading organisation-heading">
            <h2>Organisational Structure</h2>
            <p>{content.organisation_description || ""}</p>
          </div>

          <div className="organisation-tree">
            {content.hod && <div className="hod-box">{content.hod}</div>}

            <div className="tree-line" />

            <div className="programme-list">
              {programmes.map((programme) => (
                <div className="programme-wrapper" key={programme.number}>
                  <div className="programme-line" />

                  <div className="programme-card">
                    <span>{programme.number}</span>
                    <h3>{programme.title}</h3>

                    <ul>
                      {(programme.items || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-section timeline-section">
        <div className="timeline-container">
          <h2 className="section-title-center">Departmental Milestones</h2>

          <div className="timeline">
            {milestones.map((milestone) => (
              <div className="timeline-item" key={milestone.year}>
                <span className="timeline-dot" />

                <span className="timeline-year">{milestone.year}</span>

                <h3>{milestone.title}</h3>

                <p>{milestone.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance & Reports */}
      <section className="reports-section">
        <div className="about-container">
          <div className="reports-heading">
            <h2>{content.reports_heading || "Governance & Reports"}</h2>

            <button type="button" className="archive-button">
              View Archive
              <FaExternalLinkAlt />
            </button>
          </div>

          <div className="reports-list">
            {reports.map((report) => (
              <div className="report-card" key={report.title}>
                <div className="report-icon">{iconMap[report.icon] || <FaFilePdf />}</div>

                <div>
                  <h3>{report.title}</h3>
                  <p>{report.text}</p>

                  {report.file_url && <a className="download-button" href={report.file_url} target="_blank" rel="noreferrer">
                    <FaDownload />
                    Download PDF
                  </a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;