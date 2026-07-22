import React from 'react';

const reports = [
  { title: 'Annual Report 2023/24', desc: 'Financial and performance overview for the year.', icon: '📄', href: '#' },
  { title: 'APP 2024/25', desc: 'Annual Performance Plan and targets for 2024/25.', icon: '📑', href: '#' },
  { title: 'Strategic Plan 2020-2025', desc: 'Long-term vision and strategic objectives.', icon: '🗂️', href: '#' },
];

export default function Reports() {
  return (
    <div className="reports-grid">
      {reports.map((r) => (
        <a className="report-card" key={r.title} href={r.href}>
          <div className="file-icon">{r.icon}</div>
          <div className="report-body">
            <h4>{r.title}</h4>
            <p>{r.desc}</p>
            <span className="download">Download PDF</span>
          </div>
        </a>
      ))}
    </div>
  );
}
