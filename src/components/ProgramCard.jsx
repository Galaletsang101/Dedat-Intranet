import React from 'react';

function ProgramCard({ program }) {
  return (
    <div className="program-card">
      <div className="program-card-top">
        <div className="program-icon">{program.icon}</div>
        {program.badge && <span className={`program-badge ${program.badgeClass}`}>{program.badge}</span>}
      </div>

      <h3 className="program-title-card">{program.title}</h3>
      <p className="program-desc">{program.description}</p>

      <div className="program-tags">
        {program.tags &&
          program.tags.map((t, i) => (
            <span className="tag" key={i}>
              {t}
            </span>
          ))}
      </div>

      <div className="program-card-actions">
        <button className="enter-btn">Enter Workspace</button>
        <div className="small-actions">
          <button className="ghost">Policies</button>
          <button className="ghost">Contacts</button>
        </div>
      </div>
    </div>
  );
}

export default ProgramCard;
