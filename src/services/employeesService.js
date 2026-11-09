/*
 * =========================================================
 * EMPLOYEES SERVICE
 * PostgreSQL table: employees
 *
 * Backing the Staff Directory (read-only for all staff) and the Admin
 * Employee Management screens (create/update/deactivate).
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";
import { getToken } from "./authService.js";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEmployees(filters = {}, page = 1, itemsPerPage = 10) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.department) params.set("department", filters.department);
  if (filters.skill) params.set("skill", filters.skill);
  if (filters.mentorOnly) params.set("mentorOnly", "true");
  if (filters.status) params.set("status", filters.status);

  params.set("page", page);
  params.set("limit", itemsPerPage);

  const response = await fetch(`${API_BASE}/employees?${params.toString()}`, {
    headers: authHeaders(),
  });

  return parseJsonResponse(response, "Failed to fetch employees.");
}

export async function getEmployeeById(id) {
  const response = await fetch(`${API_BASE}/employees/${id}`, {
    headers: authHeaders(),
  });

  return parseJsonResponse(response, "Failed to fetch employee.");
}

export async function getEmployeeDepartmentOptions() {
  const response = await fetch(`${API_BASE}/employees/departments-list`, {
    headers: authHeaders(),
  });

  return parseJsonResponse(response, "Failed to fetch departments.");
}

export async function getEmployeeSkillOptions() {
  const response = await fetch(`${API_BASE}/employees/skills-list`, {
    headers: authHeaders(),
  });

  return parseJsonResponse(response, "Failed to fetch skills.");
}

export async function createEmployee(employeeData) {
  const response = await authFetch("/employees", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });

  return parseJsonResponse(response, "Failed to create employee.");
}

export async function updateEmployee(id, employeeData) {
  const response = await authFetch(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(employeeData),
  });

  return parseJsonResponse(response, "Failed to update employee.");
}

export async function deactivateEmployee(id) {
  const response = await authFetch(`/employees/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to deactivate employee.");
}
