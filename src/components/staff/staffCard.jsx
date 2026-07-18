// src/components/staff/StaffCard.jsx
import React from 'react';
import { FaBriefcase, FaFileAlt, FaStar, FaEnvelope, FaCopy } from 'react-icons/fa';

const getAvatarClass = (programme) => {
  const prog = (programme || '').toUpperCase().trim();
  
  if (prog.includes('ADMINISTRATION')) return 'avatar-admin';
  if (prog.includes('INTEGRATED') || prog.includes('IEDS')) return 'avatar-ieds';
  if (prog.includes('TRADE') || prog.includes('SECTOR')) return 'avatar-trade';
  if (prog.includes('CONSUMER') || prog.includes('BUSINESS REGULATION')) return 'avatar-consumer';
  if (prog.includes('ECONOMIC PLANNING')) return 'avatar-planning';
  if (prog.includes('TOURISM')) return 'avatar-tourism';
  if (prog.includes('FINANCE')) return 'avatar-finance';
  if (prog.includes('LEGAL')) return 'avatar-legal';
  if (prog.includes('HR') || prog.includes('HUMAN')) return 'avatar-hr';
  if (prog.includes('IT') || prog.includes('TECHNOLOGY')) return 'avatar-it';
  
  return 'avatar-default';
};

const getSkillClass = (skill) => {
  const s = (skill || '').toLowerCase();
  
  if (s.includes('finance') || s.includes('account') || s.includes('budget') || s.includes('audit')) return 'skill-finance';
  if (s.includes('hr') || s.includes('human resource') || s.includes('labour') || s.includes('wellness')) return 'skill-hr';
  if (s.includes('it') || s.includes('tech') || s.includes('software') || s.includes('hardware') || s.includes('support')) return 'skill-it';
  if (s.includes('policy') || s.includes('planning') || s.includes('strategy') || s.includes('research') || s.includes('economic')) return 'skill-policy';
  if (s.includes('operation') || s.includes('project') || s.includes('coordination') || s.includes('management')) return 'skill-operations';
  if (s.includes('legal') || s.includes('compliance') || s.includes('governance') || s.includes('risk')) return 'skill-legal';
  if (s.includes('tourism') || s.includes('destination') || s.includes('hospitality')) return 'skill-tourism';
  if (s.includes('market') || s.includes('comms') || s.includes('communication') || s.includes('public relations')) return 'skill-marketing';
  if (s.includes('procurement') || s.includes('supply') || s.includes('logistics') || s.includes('inventory')) return 'skill-supply-chain';
  if (s.includes('data') || s.includes('analytics') || s.includes('statistics') || s.includes('reporting')) return 'skill-data';
  
  return 'skill-default';
};

const StaffCard = ({ staff }) => {
  const displaySkills = staff.skills?.slice(0, 5) || [];
  const remainingSkills = (staff.skills?.length || 0) - 5;

  const getInitials = () => {
    if (staff.initials) return staff.initials.toUpperCase();
    if (staff.fullName) {
      return staff.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    if (staff.firstName && staff.lastName) {
      return (staff.firstName[0] + staff.lastName[0]).toUpperCase();
    }
    return 'NA';
  };

  const fullName = staff.fullName || 
    (staff.firstName && staff.lastName ? `${staff.firstName} ${staff.lastName}` : 'Name not specified');

  const department = staff.componentDescription || staff.programme || 'Department not specified';
  const jobTitle = staff.jobTitle || 'Position not specified';

  return (
    <div className="staff-card" role="article" aria-label={`Profile for ${fullName}`}>
      <div className="staff-card-grid">
        {/* Avatar */}
        <div className="staff-avatar-wrapper">
          <div className={`staff-avatar ${getAvatarClass(staff.programme)}`}>
            {getInitials()}
          </div>
        </div>

        {/* Info */}
        <div className="staff-info">
          <div className="staff-name-row">
            <h3 className="staff-name">{fullName}</h3>
            {staff.isMentor && (
              <span className="staff-mentor-badge">
                <FaStar className="staff-mentor-icon" /> Mentor
              </span>
            )}
          </div>
          <p className="staff-title">{jobTitle}</p>
          <p className="staff-department">{department}</p>
          <div className="staff-skills" role="list" aria-label="Skills">
            {displaySkills.map((skill, index) => (
              <span key={index} className={`staff-skill ${getSkillClass(skill)}`} role="listitem">
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="staff-skill-more" role="listitem">+{remainingSkills} more</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="staff-card-actions">
          <div className="staff-meta">
            <span className="staff-experience">
              <FaBriefcase className="staff-meta-icon" /> {staff.experience || 'N/A'}
            </span>
            <a href="#" className="staff-docs-link">
              <FaFileAlt className="staff-meta-icon" /> View Documents
            </a>
          </div>
          <div className="staff-contact-buttons">
            <a href={`mailto:${staff.email}`} className="staff-btn staff-btn-primary">
              <FaEnvelope className="staff-btn-icon" /> Contact
            </a>
            <button className="staff-btn staff-btn-outline">
              <FaCopy className="staff-btn-icon" /> Copy Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffCard;