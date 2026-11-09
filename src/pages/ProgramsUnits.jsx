import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../services/departmentsService";
import "../styles/programs.css";

/*
 * Previously rendered from a hardcoded 6-entry array (icon paths, fake
 * document/notice counts). Now reads the real `departments` table, which
 * Admins manage via Admin Center -> Departments - the icon/color per card
 * is purely decorative and assigned deterministically by name, matching
 * the same approach already used for staff avatars in staffCard.jsx.
 */

const ICON_PALETTE = [
  {
    path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8",
    bg: "bg-blue",
  },
  {
    path: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    bg: "bg-orange",
  },
  {
    path: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
    bg: "bg-green",
  },
  {
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    bg: "bg-blue",
  },
  {
    path: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
    bg: "bg-orange",
  },
  {
    path: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
    bg: "bg-green",
  },
];

function iconFor(name, index) {
  return ICON_PALETTE[index % ICON_PALETTE.length];
}

const ProgramsUnits = () => {
  const navigate = useNavigate();

  const [showContact, setShowContact] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getDepartments()
      .then((data) => {
        if (isMounted) setDepartments(data.filter((d) => d.status !== "Inactive"));
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalEmployees = departments.reduce(
    (sum, dept) => sum + (parseInt(dept.employee_count, 10) || 0),
    0
  );

  return (
    <section className="programmes-section">
      <div className="header-controls">
        <div className="header-content">
          <h1 className="page-title">Programmes & Units</h1>

          <p className="page-description">
            Central hub for the Northern Cape Department of Economic
            Development and Tourism. Access departmental resources,
            specialized toolkits, and collaboration workspaces.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="units-grid">
          {[1, 2, 3].map((key) => (
            <div key={key} className="unit-card" aria-hidden="true">
              <div className="unit-header">
                <div className="unit-icon bg-blue" style={{ opacity: 0.4 }} />
              </div>
              <div
                style={{
                  height: 18,
                  width: "60%",
                  background: "var(--border-light)",
                  borderRadius: 4,
                  margin: "12px 0",
                }}
              />
              <div
                style={{
                  height: 40,
                  background: "var(--border-light)",
                  borderRadius: 4,
                }}
              />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="page-description">
          Unable to load programmes and units right now: {error}
        </p>
      ) : departments.length === 0 ? (
        <p className="page-description">
          No departments have been added yet. An Admin can add departments
          from Admin Center → Departments.
        </p>
      ) : (
        <div className="units-grid">
          {departments.map((dept, index) => (
            <UnitCard
              key={dept.id}
              icon={iconFor(dept.name, index).path}
              iconBg={iconFor(dept.name, index).bg}
              status={dept.status === "Active" ? "Active Unit" : "Inactive"}
              statusType={dept.status === "Active" ? "green" : "gray"}
              title={dept.name}
              description={
                dept.description ||
                "No description has been added for this programme yet."
              }
              tags={[`${dept.employee_count} ${dept.employee_count === "1" ? "Employee" : "Employees"}`]}
              navigate={navigate}
              setShowContact={setShowContact}
            />
          ))}
        </div>
      )}

      <div className="bottom-section">
        <div className="knowledge-portal">
          <h2 className="portal-title">Departmental Overview</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <p>Total Programmes</p>
              <h2>{departments.length}</h2>
            </div>

            <div className="stat-card">
              <p>Active Units</p>
              <h2>
                {departments.filter((d) => d.status === "Active").length}
              </h2>
            </div>

            <div className="stat-card">
              <p>Total Staff</p>
              <h2>{totalEmployees}</h2>
            </div>
          </div>
        </div>

        <div className="support-card">
          <h2>Need Workspace Support?</h2>

          <p>Contact IT Support unit for portal assistance.</p>

          <button type="button" onClick={() => navigate("/support")}>
            Get Help Now
          </button>
        </div>
      </div>

      {showContact && (
        <div className="contact-overlay">
          <div className="contact-popup">
            <button
              className="close-popup"
              onClick={() => setShowContact(false)}
              aria-label="Close contact support dialog"
            >
              ×
            </button>

            <h2>Contact Support</h2>

            <p>
              Need assistance with this programme workspace? Contact the
              relevant departmental unit.
            </p>

            <div className="contact-details">
              <p>Email: support@nc-dedat.gov.za</p>
              <p>Phone: +27 53 839 4000</p>
              <p>
                Office: Northern Cape Department of Economic Development and
                Tourism
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
      <div className="unit-header">
        <div className={`unit-icon ${iconBg}`}>
          <svg className="icon-large" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d={icon} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        <span className={`status-badge ${statusType}`}>{status}</span>
      </div>

      <h3 className="unit-title">{title}</h3>

      <p className="unit-description">{description}</p>

      <div className="unit-tags">
        {tags.map((tag) => (
          <span key={tag} className="unit-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="unit-card-actions">
        <button
          type="button"
          className="workspace-btn"
          onClick={() =>
            navigate(`/programmes/${title.toLowerCase().replace(/\s+/g, "-")}`)
          }
        >
          Enter Workspace
        </button>

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
  );
}

export default ProgramsUnits;
