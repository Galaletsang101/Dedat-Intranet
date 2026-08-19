import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/programs.css";

const ProgramsUnits = () => {
  const navigate = useNavigate();

  const [showContact, setShowContact] = useState(false);

  const units = [
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8",
      iconBg: "bg-blue",
      status: "Active Unit",
      statusType: "green",
      title: "Administration",
      description:
        "Ensuring strategic leadership, sound financial management, and corporate support services for the department.",
      tags: ["128 Docs", "3 Notices"],
    },

    {
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      iconBg: "bg-orange",
      status: "Stable",
      statusType: "gray",
      title: "Integrated Economic Development",
      description:
        "Promoting and facilitating economic development through enterprise support and regional industry growth initiatives.",
      tags: ["84 Docs", "Updated"],
    },

    {
      icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
      iconBg: "bg-green",
      status: "Urgent Review",
      statusType: "red",
      title: "Trade & Sector Development",
      description:
        "Enhancing trade competitiveness and developing key economic sectors including mining, energy, and agriculture.",
      tags: ["15 Regions", "5 New"],
    },

    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      iconBg: "bg-blue",
      status: "Regulated",
      statusType: "green",
      title: "Consumer Protection & Regulation",
      description:
        "Ensuring fair trade practices and protecting consumer rights while streamlining business regulation frameworks.",
      tags: ["Compliance", "45 Forms"],
    },

    {
      icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
      iconBg: "bg-orange",
      status: "Planning",
      statusType: "gray",
      title: "Economic Planning",
      description:
        "Providing economic intelligence, research, and strategic planning to inform provincial policy decisions.",
      tags: ["Data Sets", "Quarterly Reports"],
    },

    {
      icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
      iconBg: "bg-green",
      status: "High Growth",
      statusType: "green",
      title: "Tourism",
      description:
        "Developing and promoting Northern Cape as a premier tourism destination through sustainable marketing.",
      tags: ["Tourism Routes", "Media Kit"],
    },
  ];

  return (
    <section className="programmes-section">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="header-controls">

        <div className="header-content">

          <h1 className="page-title">
            Programmes & Units
          </h1>

          <p className="page-description">
            Central hub for the Northern Cape Department of Economic
            Development and Tourism. Access departmental resources,
            specialized toolkits, and collaboration workspaces.
          </p>

        </div>

      </div>


      {/* ==========================================
          UNITS
      ========================================== */}

      <div className="units-grid">

        {units.map((unit) => (
          <UnitCard
            key={unit.title}
            {...unit}
            navigate={navigate}
            setShowContact={setShowContact}
          />
        ))}

      </div>


      {/* ==========================================
          BOTTOM SECTION
      ========================================== */}

      <div className="bottom-section">

        <div className="knowledge-portal">

          <h2 className="portal-title">
            Departmental Knowledge Portal
          </h2>

          <div className="stats-grid">

            <div className="stat-card">

              <p>
                Total Assets
              </p>

              <h2>
                {units.length * 238}
              </h2>

            </div>


            <div className="stat-card">

              <p>
                Active Units
              </p>

              <h2>
                {
                  units.filter(
                    (unit) => unit.status === "Active Unit"
                  ).length
                }
              </h2>

            </div>


            <div className="stat-card">

              <p>
                Knowledge Shares
              </p>

              <h2>
                {units.length * 52}
              </h2>

            </div>

          </div>

        </div>


        {/* ==========================================
            SUPPORT CARD
        ========================================== */}

        <div className="support-card">

          <h2>
            Need Workspace Support?
          </h2>

          <p>
            Contact IT Support unit for portal assistance.
          </p>

          <button
            type="button"
            onClick={() => navigate("/support")}
          >
            Get Help Now
          </button>

        </div>

      </div>


      {/* ==========================================
          CONTACT POPUP
      ========================================== */}

      {showContact && (

        <div className="contact-overlay">

          <div className="contact-popup">

            <button
              className="close-popup"
              onClick={() => setShowContact(false)}
            >
              ×
            </button>


            <h2>
              Contact Support
            </h2>


            <p>
              Need assistance with this programme workspace?
              Contact the relevant departmental unit.
            </p>


            <div className="contact-details">

              <p>
                📧 Email: support@nc-dedat.gov.za
              </p>

              <p>
                ☎ Phone: +27 53 839 4000
              </p>

              <p>
                🏢 Office: Northern Cape Department of Economic
                Development and Tourism
              </p>

            </div>


            <button
              className="workspace-btn"
              onClick={() => setShowContact(false)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </section>
  );
};


/* =========================================================
   UNIT CARD
========================================================= */

function UnitCard({
  icon,
  iconBg,
  status,
  statusType,
  title,
  description,
  tags,
  navigate,
  setShowContact,
}) {

  return (

    <div className="unit-card">


      {/* ==========================================
          UNIT HEADER
      ========================================== */}

      <div className="unit-header">

        <div className={`unit-icon ${iconBg}`}>

          <svg
            className="icon-large"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >

            <path
              d={icon}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />

          </svg>

        </div>


        <span className={`status-badge ${statusType}`}>
          {status}
        </span>

      </div>


      {/* ==========================================
          UNIT CONTENT
      ========================================== */}

      <h3 className="unit-title">
        {title}
      </h3>


      <p className="unit-description">
        {description}
      </p>


      {/* ==========================================
          TAGS
      ========================================== */}

      <div className="unit-tags">

        {tags.map((tag) => (

          <span
            key={tag}
            className="unit-tag"
          >
            {tag}
          </span>

        ))}

      </div>


      {/* ==========================================
          CARD ACTIONS
      ========================================== */}

      <div className="unit-card-actions">

        {/* ENTER WORKSPACE - TOP */}

        <button
          type="button"
          className="workspace-btn workspace-main-btn"
          onClick={() =>
            navigate(
              `/programmes/${title
                .toLowerCase()
                .replace(/\s+/g, "-")}`
            )
          }
        >
          Enter Workspace
        </button>


        {/* POLICIES + CONTACTS - BELOW */}

        <div className="secondary-actions">

          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/policies")}
          >
            Policies
          </button>


          <button
            type="button"
            className="secondary-btn"
            onClick={() => setShowContact(true)}
          >
            Contacts
          </button>

        </div>

      </div>

    </div>

  );
}


export default ProgramsUnits;