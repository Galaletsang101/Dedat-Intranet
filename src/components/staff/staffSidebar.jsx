// src/components/staff/StaffSidebar.jsx
import React from 'react';
import { FaStar, FaQuestionCircle, FaUser, FaRocket, FaEnvelope } from 'react-icons/fa';
import { MdVerified, MdNewReleases } from 'react-icons/md';

const getNewSkillClass = (skill) => {
  const s = (skill || '').toLowerCase();
  
  if (s.includes('finance') || s.includes('account') || s.includes('budget')) return 'new-skill-finance';
  if (s.includes('hr') || s.includes('human resource') || s.includes('labour') || s.includes('wellness')) return 'new-skill-hr';
  if (s.includes('it') || s.includes('tech') || s.includes('software') || s.includes('hardware') || s.includes('support')) return 'new-skill-it';
  if (s.includes('policy') || s.includes('planning') || s.includes('strategy') || s.includes('research') || s.includes('economic')) return 'new-skill-policy';
  if (s.includes('operation') || s.includes('project') || s.includes('coordination') || s.includes('management')) return 'new-skill-operations';
  if (s.includes('legal') || s.includes('compliance') || s.includes('governance') || s.includes('risk')) return 'new-skill-legal';
  if (s.includes('tourism') || s.includes('destination')) return 'new-skill-tourism';
  if (s.includes('market') || s.includes('comms') || s.includes('communication')) return 'new-skill-marketing';
  if (s.includes('data') || s.includes('analytics')) return 'new-skill-data';
  
  return 'new-skill-default';
};

const StaffSidebar = ({ recentSkills = [] }) => {
  const expertOfWeek = {
    name: "Dr. Nomsa Dlamini",
    title: "Chief Director: Economic Planning",
    quote: "Specializing in provincial economic research, policy development, and the knowledge economy agenda.",
    avatar: "https://ui-avatars.com/api/?name=Nomsa+Dlamini&background=d85f06&color=fff&size=88&font-size=0.5"
  };

  return (
    <div className="staff-sidebar">
      {/* Expert of the Week */}
      <div className="staff-sidebar-card expert-week">
        <div className="expert-week-header">
          <FaStar className="expert-week-icon" />
          <h4 className="expert-week-title">Expert of the Week</h4>
        </div>
        <div className="expert-week-body">
          <img src={expertOfWeek.avatar} alt={expertOfWeek.name} className="expert-week-avatar" />
          <h5 className="expert-week-name">{expertOfWeek.name}</h5>
          <p className="expert-week-title-text">{expertOfWeek.title}</p>
          <p className="expert-week-quote">"{expertOfWeek.quote}"</p>
          <button className="staff-btn staff-btn-primary staff-btn-block">
            <FaUser className="staff-btn-icon" /> View Full Profile
          </button>
        </div>
      </div>

      {/* Recently Added Skills */}
      <div className="staff-sidebar-card">
        <div className="staff-sidebar-header">
          <MdNewReleases className="staff-sidebar-icon" />
          <h4 className="staff-sidebar-title">New Skills</h4>
        </div>
        <div className="staff-sidebar-body">
          <div className="new-skills-grid">
            {recentSkills.length > 0 ? (
              recentSkills.slice(0, 10).map((skill, index) => (
                <span key={index} className={`new-skill ${getNewSkillClass(skill)}`}>
                  {skill}
                </span>
              ))
            ) : (
              <span className="new-skills-empty">No skills added recently</span>
            )}
          </div>
        </div>
      </div>

      {/* Expert Needed Request Form */}
      <div className="staff-sidebar-card">
        <div className="staff-sidebar-header">
          <FaQuestionCircle className="staff-sidebar-icon" />
          <h4 className="staff-sidebar-title">Expert Needed?</h4>
        </div>
        <div className="staff-sidebar-body">
          <p className="expert-request-text">Can't find the skill you're looking for? Submit a request.</p>
          <form className="expert-request-form">
            <div className="form-group">
              <label htmlFor="expertise-required" className="form-label">Required Expertise</label>
              <input type="text" id="expertise-required" className="form-input" placeholder="e.g. Environmental Law" />
            </div>
            <div className="form-group">
              <label htmlFor="project-context" className="form-label">Project Context</label>
              <textarea id="project-context" className="form-textarea" rows="2" placeholder="Briefly explain what you need help with..."></textarea>
            </div>
            <button type="submit" className="staff-btn staff-btn-outline staff-btn-block ">
              <FaRocket className="staff-btn-icon" /> Post Request
            </button>
          </form>
        </div>
      </div>

      {/* DPSA Compliance Badge */}
      <div className="dpsa-compliance">
        <div className="dpsa-compliance-header">
          <MdVerified className="dpsa-compliance-icon" />
          <span className="dpsa-compliance-title">DPSA Compliant</span>
        </div>
        <p className="dpsa-compliance-text">
          This Expertise Locator supports the <strong>Integrated Human Resources Management</strong> framework by facilitating inter-departmental collaboration and knowledge sharing.
        </p>
      </div>
    </div>
  );
};

export default StaffSidebar;