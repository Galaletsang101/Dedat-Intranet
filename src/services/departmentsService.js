/*
 * =========================================================
 * DEPARTMENTS SERVICE
 * PostgreSQL table: departments
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";
import { getToken } from "./authService.js";

export async function getDepartments() {
  const token = getToken();

  const response = await fetch(`${API_BASE}/departments`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return parseJsonResponse(response, "Failed to fetch departments.");
}

export async function createDepartment(departmentData) {
  const response = await authFetch("/departments", {
    method: "POST",
    body: JSON.stringify(departmentData),
  });

  return parseJsonResponse(response, "Failed to create department.");
}

export async function updateDepartment(id, departmentData) {
  const response = await authFetch(`/departments/${id}`, {
    method: "PUT",
    body: JSON.stringify(departmentData),
  });

  return parseJsonResponse(response, "Failed to update department.");
}

export async function deactivateDepartment(id) {
  const response = await authFetch(`/departments/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to deactivate department.");
}
