import React from "react";
import "../styles/policies.css";

const docs = [
  {
    id: 1,
    title: "HISTORY P1",
    size: "1.2 MB",
    updated: "Jul 17, 2026",
    // Local tester file path — in production these will be served by the app/server
    path: "/assets/test-pdfs/HISTORY P1.pdf",
  },
  {
    id: 2,
    title: "Employee Handbook 2024",
    size: "2.4 MB",
    updated: "Oct 12, 2023",
    path: "/assets/test-pdfs/Employee%20Handbook%202024.pdf",
  },
  {
    id: 3,
    title: "Remote Work Policy",
    size: "1.1 MB",
    updated: "Jan 05, 2024",
    path: "/assets/test-pdfs/Remote%20Work%20Policy.pdf",
  },
];

function Policies() {
  function handleView(path) {
    // open pdf in new tab
    window.open(path, "_blank");
  }

  function handleDownload(path, title) {
    // create temporary link to trigger download
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
        <input placeholder="Search documents, policies, handbooks..." />
      </div>

      <div className="policies-filters">
        <button className="chip active">All</button>
        <button className="chip">HR</button>
        <button className="chip">IT</button>
        <button className="chip">Finance</button>
        <button className="chip">General</button>
      </div>

      <div className="policies-list">
        <div className="list-header">
          <h3>Recent Documents</h3>
          <span className="muted">{docs.length} Documents</span>
        </div>

        {docs.map((d) => (
          <div key={d.id} className="doc-card">
            <div className="doc-left">
              <div className="doc-icon">PDF</div>
            </div>
            <div className="doc-body">
              <div className="doc-title">{d.title}</div>
              <div className="doc-meta">{d.size} · Updated {d.updated}</div>
            </div>
            <div className="doc-actions">
              <button className="view" onClick={() => handleView(d.path)}>View</button>
              <button className="download" onClick={() => handleDownload(d.path, d.title)}>Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Policies;
