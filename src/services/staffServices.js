// src/services/staffService.js
import { staffData } from '../components/staff/staffData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all staff with pagination and filters
export const getStaff = async (filters = {}, page = 1, itemsPerPage = 10) => {
  await delay(300);
  
  let results = [...staffData];
  
  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(staff =>
      staff.fullName?.toLowerCase().includes(searchLower) ||
      staff.firstName?.toLowerCase().includes(searchLower) ||
      staff.lastName?.toLowerCase().includes(searchLower) ||
      staff.jobTitle?.toLowerCase().includes(searchLower) ||
      staff.componentDescription?.toLowerCase().includes(searchLower) ||
      staff.programme?.toLowerCase().includes(searchLower) ||
      staff.skills?.some(skill => skill.toLowerCase().includes(searchLower))
    );
  }
  
  // Department filter
  if (filters.department && filters.department !== 'all') {
    results = results.filter(staff => staff.programme === filters.department);
  }
  
  // Skill filter
  if (filters.skill && filters.skill !== 'all') {
    results = results.filter(staff =>
      staff.skills?.some(skill => skill === filters.skill)
    );
  }
  
  // Mentor only filter
  if (filters.mentorOnly) {
    results = results.filter(staff => staff.isMentor === true);
  }
  
  // Calculate pagination
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
  
  return {
    data: paginatedResults,
    pagination: {
      currentPage: safePage,
      itemsPerPage: itemsPerPage,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1
    }
  };
};

// Get all unique departments
export const getDepartments = async () => {
  await delay(100);
  const depts = [...new Set(staffData.map(staff => staff.programme))];
  return depts.filter(d => d).sort();
};

// Get all unique skills
export const getSkills = async () => {
  await delay(100);
  const allSkills = staffData.flatMap(staff => staff.skills || []);
  const uniqueSkills = [...new Set(allSkills)];
  return uniqueSkills.filter(s => s).sort();
};

// Get recent skills for sidebar
export const getRecentSkills = async () => {
  await delay(150);
  const allSkills = staffData.flatMap(staff => staff.skills || []);
  const uniqueSkills = [...new Set(allSkills)];
  const shuffled = [...uniqueSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
};

// Get single staff member by ID
export const getStaffById = async (id) => {
  await delay(200);
  return staffData.find(staff => staff.id === id);
};