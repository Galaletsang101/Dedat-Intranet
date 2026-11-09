// src/services/staffService.js
//
// Previously read from the hardcoded src/components/staff/staffData.js
// array. Now backed by PostgreSQL via GET /api/employees - the 159
// records that used to live only in that file were migrated into the
// `employees` table (see backend/scripts/migrateEmployeeProfiles.js).
// Function signatures and return shapes are unchanged so StaffDirectory.jsx
// and staffCard.jsx keep working without modification.

import {
  getEmployees,
  getEmployeeDepartmentOptions,
  getEmployeeSkillOptions,
  getEmployeeById as fetchEmployeeById,
} from "./employeesService";

function toStaffShape(employee) {
  return {
    id: employee.id,
    initials: employee.initials,
    firstName: employee.first_name,
    lastName: employee.surname,
    fullName: employee.full_name,
    jobTitle: employee.position,
    componentDescription: employee.programme,
    programme: employee.programme,
    email: employee.email,
    phone: employee.phone,
    location: employee.location,
    isMentor: employee.is_mentor,
    skills: employee.skills || [],
    experience: employee.experience,
  };
}

// Get all staff with pagination and filters
export const getStaff = async (filters = {}, page = 1, itemsPerPage = 10) => {
  const result = await getEmployees(filters, page, itemsPerPage);

  return {
    data: result.data.map(toStaffShape),
    pagination: result.pagination,
  };
};

// Get all unique departments
export const getDepartments = async () => {
  return getEmployeeDepartmentOptions();
};

// Get all unique skills
export const getSkills = async () => {
  return getEmployeeSkillOptions();
};

// Get recent skills for sidebar
export const getRecentSkills = async () => {
  const skills = await getEmployeeSkillOptions();
  const shuffled = [...skills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
};

// Get single staff member by ID
export const getStaffById = async (id) => {
  const employee = await fetchEmployeeById(id);
  return toStaffShape(employee);
};
