import React from 'react';

export default function Reports({ reports = [] }) {
  return (
    <div className="reports-grid">
      {reports.map((r) => (
        <a className="report-card" key={r.title} href={r.file_url || '#'} onClick={(event) => {
          if (!r.file_url) event.preventDefault();
        }}>
          <div className="file-icon">{r.icon}</div>
          <div className="report-body">
            <h4>{r.title}</h4>
            <p>{r.text || r.desc}</p>
            {r.file_url && <span className="download">Download PDF</span>}
          </div>
        </a>
      ))}
    </div>
  );
}
