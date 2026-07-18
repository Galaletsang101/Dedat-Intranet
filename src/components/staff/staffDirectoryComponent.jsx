// src/components/staff/StaffDirectory.jsx
import React, { useState, useEffect } from 'react';
import { getStaff, getDepartments, getSkills, getRecentSkills } from '../../services/staffServices';
import StaffCard from '../staff/staffCard';
import StaffSidebar from '../staff/StaffSidebar';
import '../../styles/StaffDirectory.css';

const ITEMS_PER_PAGE = 10;

const StaffDirectory = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    skill: 'all',
    mentorOnly: false
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [recentSkills, setRecentSkills] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [depts, skillList, recent] = await Promise.all([
          getDepartments(),
          getSkills(),
          getRecentSkills()
        ]);
        setDepartments(depts);
        setSkills(skillList);
        setRecentSkills(recent);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };
    loadData();
  }, []);

  const fetchStaff = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getStaff({
        search: searchTerm,
        department: filters.department,
        skill: filters.skill,
        mentorOnly: filters.mentorOnly
      }, page, ITEMS_PER_PAGE);
      
      setStaff(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff(1);
  }, [searchTerm, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      department: 'all',
      skill: 'all',
      mentorOnly: false
    });
  };

  const handlePageChange = (page) => {
    if (page !== pagination.currentPage && page >= 1 && page <= pagination.totalPages) {
      fetchStaff(page);
    }
  };

  const totalStaff = pagination.totalItems;
  const totalMentors = staff.filter(s => s.isMentor).length;
  const totalDepartments = departments.length;

  return (
    <div className="staff-directory-page">
      <div className="staff-directory-container">
        {/* Page Header */}
        <div className="staff-page-header">
          <h1 className="staff-page-title">Find an Expert</h1>
          <p className="staff-page-subtitle">Search by name, skill, or programme to find the right person for the job.</p>
        </div>

        {/* Statistics Cards */}
        <div className="staff-stats">
          <div className="staff-stat-card">
            <span className="staff-stat-number">{totalStaff}</span>
            <span className="staff-stat-label">Total Staff</span>
          </div>
          <div className="staff-stat-card">
            <span className="staff-stat-number">{totalMentors}</span>
            <span className="staff-stat-label">Mentors Available</span>
          </div>
          <div className="staff-stat-card">
            <span className="staff-stat-number">{totalDepartments}</span>
            <span className="staff-stat-label">Departments</span>
          </div>
          <div className="staff-stat-card">
            <span className="staff-stat-number">{recentSkills.length}</span>
            <span className="staff-stat-label">Skills Tracked</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="staff-search-section">
          <div className="staff-search-row">
            <div className="staff-search-wrapper">
              <span className="staff-search-icon"></span>
              <input
                type="text"
                className="staff-search-input"
                placeholder="Search by name, skill, or programme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search staff"
              />
            </div>
            <button className="staff-btn-search" onClick={() => fetchStaff(1)}>
              Search Expert
            </button>
          </div>

          <div className="staff-filters">
            <div className="staff-filter-group">
              <label className="staff-filter-label">Programme</label>
              <select
                className="staff-filter-select"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="all">All Programmes</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="staff-filter-group">
              <label className="staff-filter-label">Skill Category</label>
              <select
                className="staff-filter-select"
                value={filters.skill}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
              >
                <option value="all">All Skills</option>
                {skills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div className="staff-filter-mentor">
              <label className="staff-switch">
                <input
                  type="checkbox"
                  checked={filters.mentorOnly}
                  onChange={(e) => handleFilterChange('mentorOnly', e.target.checked)}
                />
                <span className="staff-switch-slider"></span>
                <span className="staff-switch-label">Mentor Only</span>
              </label>
            </div>

            <button className="staff-clear-filters" onClick={clearFilters}>
              ✕ Clear Filters
            </button>
          </div>
        </div>

        {/* Results Row: Cards + Sidebar */}
        {loading ? (
          <div className="staff-loading">
            <div className="staff-loading-spinner"></div>
            <p>Loading staff directory...</p>
          </div>
        ) : staff.length === 0 ? (
          <div className="staff-no-results">
            <h4>No results found</h4>
            <p>Try adjusting your search or filters.</p>
            <button className="staff-btn staff-btn-outline" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="staff-results-row">
            {/* Cards Column */}
            <div className="staff-cards-column">
              <div className="staff-results-header">
                <span className="staff-results-count">
                  Showing {((pagination.currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(pagination.currentPage * ITEMS_PER_PAGE, pagination.totalItems)} of {pagination.totalItems} results
                </span>
                <div className="staff-sort">
                  <label htmlFor="sort-by">Sort by:</label>
                  <select id="sort-by" className="staff-sort-select">
                    <option value="name">Name</option>
                    <option value="department">Department</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>
              </div>

              {staff.map(person => (
                <StaffCard key={person.id} staff={person} />
              ))}

              {pagination.totalPages > 1 && (
                <div className="staff-pagination">
                  <button
                    className="staff-pagination-btn"
                    disabled={!pagination.hasPrev}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    aria-label="Previous page"
                  >
                    ‹ Previous
                  </button>
                  <span className="staff-pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    className="staff-pagination-btn"
                    disabled={!pagination.hasNext}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    aria-label="Next page"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="staff-sidebar-column">
              <StaffSidebar recentSkills={recentSkills} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDirectory;