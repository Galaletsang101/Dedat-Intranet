/*
 * =========================================================
 * SUB-PROGRAMMES SERVICE
 * PostgreSQL table: sub_programmes (nested under departments)
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";
import { getToken } from "./authService.js";

export async function getSubProgrammes(departmentId) {
  const token = getToken();

  const response = await fetch(`${API_BASE}/departments/${departmentId}/sub-programmes`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return parseJsonResponse(response, "Failed to fetch sub-programmes.");
}

export async function createSubProgramme(departmentId, subProgrammeData) {
  const response = await authFetch(`/departments/${departmentId}/sub-programmes`, {
    method: "POST",
    body: JSON.stringify(subProgrammeData),
  });

  return parseJsonResponse(response, "Failed to create sub-programme.");
}

export async function updateSubProgramme(id, subProgrammeData) {
  const response = await authFetch(`/sub-programmes/${id}`, {
    method: "PUT",
    body: JSON.stringify(subProgrammeData),
  });

  return parseJsonResponse(response, "Failed to update sub-programme.");
}

export async function deactivateSubProgramme(id) {
  const response = await authFetch(`/sub-programmes/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to deactivate sub-programme.");
}
