import React, { useMemo, useState } from "react";
import "../styles/policies.css";

const docs = [
  {
    id: 1,
    title: "HISTORY P1",
    size: "1.2 MB",
    updated: "Jul 17, 2026",
    unit: "HR",
    summary: "Historical records and review procedures for the HR unit.",
    path: "/assets/test-pdfs/HISTORY P1.pdf",
  },
  {
    id: 2,
    title: "Employee Handbook 2024",
    size: "2.4 MB",
    updated: "Oct 12, 2023",
    unit: "HR",
    summary: "Core employee expectations, conduct, and benefits guidance.",
    path: "/assets/test-pdfs/Employee%20Handbook%202024.pdf",
  },
  {
    id: 3,
    title: "Remote Work Policy",
    size: "1.1 MB",
    updated: "Jan 05, 2024",
    unit: "General",
    summary: "Guidelines for remote work arrangements and availability.",
    path: "/assets/test-pdfs/Remote%20Work%20Policy.pdf",
  },
  {
    id: 4,
    title: "IT Security Standards",
    size: "1.8 MB",
    updated: "Mar 21, 2025",
    unit: "IT",
    summary: "Password, access control, and device security requirements.",
    path: "/assets/test-pdfs/Remote%20Work%20Policy.pdf",
  },
  {
    id: 5,
    title: "Procurement Guide",
    size: "1.5 MB",
    updated: "Apr 02, 2025",
    unit: "Finance",
    summary: "Purchase approvals, reimbursement methods, and vendor rules.",
    path: "/assets/test-pdfs/Remote%20Work%20Policy.pdf",
  },
  {
    id: 6,
    title: "Operations Continuity Plan",
    size: "1.3 MB",
    updated: "Jun 11, 2025",
    unit: "Operations",
    summary: "Business continuity steps for critical departmental services.",
    path: "/assets/test-pdfs/Remote%20Work%20Policy.pdf",
  },
];

const units = ["All", "HR", "IT", "Finance", "Operations", "General"];

function Policies() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return docs.filter((doc) => {
      const matchesUnit = activeFilter === "All" || doc.unit === activeFilter;
      const matchesSearch =
        query.length === 0 ||
        `${doc.title} ${doc.summary} ${doc.unit}`.toLowerCase().includes(query);

      return matchesUnit && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  function handleView(path) {
    window.open(path, "_blank");
  }

  function handleDownload(path, title) {
    const link = document.createElement("a");
    link.href = path;
    link.download = title + ".pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="policies-page">
      <div className="policies-search">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search documents, policies, handbooks..."
        />
      </div>

      <div className="policies-filters">
        {units.map((unit) => (
          <button
            key={unit}
            className={`chip ${activeFilter === unit ? "active" : ""}`}
            onClick={() => setActiveFilter(unit)}
          >
            {unit}
          </button>
        ))}
      </div>

      <div className="policies-list">
        <div className="list-header">
          <h3>Department Policies</h3>
          <span className="muted">{filteredDocs.length} Documents</span>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="empty-state">
            No policies match your current filters. Try another unit or search term.
          </div>
        ) : (
          filteredDocs.map((d) => (
            <div key={d.id} className="doc-card">
              <div className="doc-left">
                <div className="doc-icon">PDF</div>
              </div>
              <div className="doc-body">
                <div className="doc-title">{d.title}</div>
                <div className="doc-unit">{d.unit} Unit</div>
                <div className="doc-meta">{d.size} · Updated {d.updated}</div>
                <div className="doc-summary">{d.summary}</div>
              </div>
              <div className="doc-actions">
                <button className="view" onClick={() => handleView(d.path)}>View</button>
                <button className="download" onClick={() => handleDownload(d.path, d.title)}>Download</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Policies;
