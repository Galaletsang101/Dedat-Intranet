import { apiRequest } from "./api.js";

const loadStaff = async () => {
  const employees = await apiRequest("/staff");
  return employees.map((employee) => ({
    ...employee,
    firstName: employee.first_name,
    lastName: employee.surname,
    fullName: [employee.first_name, employee.surname].filter(Boolean).join(" "),
    jobTitle: employee.position || "",
    componentDescription: employee.subprogramme || employee.programme || "",
    skills: [],
    isMentor: false,
  }));
};

export const getStaff = async (filters = {}, page = 1, itemsPerPage = 10) => {
  let results = await loadStaff();
  const search = filters.search?.trim().toLowerCase();

  if (search) {
    results = results.filter((employee) =>
      [
        employee.fullName,
        employee.jobTitle,
        employee.programme,
        employee.subprogramme,
        employee.email,
      ].some((value) => value?.toLowerCase().includes(search))
    );
  }
  if (filters.department && filters.department !== "all") {
    results = results.filter((employee) => employee.programme === filters.department);
  }
  if (filters.skill && filters.skill !== "all") {
    results = [];
  }
  if (filters.mentorOnly) {
    results = [];
  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (safePage - 1) * itemsPerPage;

  return {
    data: results.slice(startIndex, startIndex + itemsPerPage),
    pagination: {
      currentPage: safePage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
};

export const getDepartments = async () => {
  const employees = await loadStaff();
  return [...new Set(employees.map((employee) => employee.programme).filter(Boolean))].sort();
};

export const getSkills = async () => [];
export const getRecentSkills = async () => [];

export const getStaffById = async (id) => {
  const employees = await loadStaff();
  return employees.find((employee) => String(employee.id) === String(id));
};
