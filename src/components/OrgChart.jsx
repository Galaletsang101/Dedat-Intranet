import React from 'react';

export default function OrgChart() {
  return (
    <section className="org-section">
      <div className="org-inner">
        <h2 className="org-title">Organisational structure</h2>
        <p className="org-sub">hierarchical overview of departmental programmes and reporting lines</p>

        <div className="hod-wrap">
          <div className="hod-badge">Head of Department (HOD)</div>
        </div>

        <div className="hr-line" />

        <div className="org-row">
          <div className="org-box">
            <h4>PROGRAMME 1</h4>
            <p className="muted-list">Administration<br/>Financial Management<br/>Corporate Service<br/>Strategy & Planning</p>
          </div>

          <div className="org-box">
            <h4>PROGRAMME 2</h4>
            <p className="muted-list">Economic Dev.<br/>Business Regulation<br/>Trade & Investment<br/>SMME Support</p>
          </div>

          <div className="org-box">
            <h4>PROGRAMME 3</h4>
            <p className="muted-list">Tourism<br/>Tourism Planning<br/>Tourism Marketing<br/>Research & Statistics</p>
          </div>
        </div>
      </div>
    </section>
  );
}
