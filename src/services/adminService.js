/*
 * =========================================================
 * ADMIN SERVICE
 * User/account management + dashboard statistics.
 * All endpoints here require an Admin-role JWT; the backend
 * re-verifies this on every call regardless of what this file sends.
 * =========================================================
 */

import { authFetch, parseJsonResponse } from "./apiClient.js";

export async function getAdminStats() {
  const response = await authFetch("/admin/stats");
  return parseJsonResponse(response, "Failed to fetch admin statistics.");
}

export async function getManagedUsers() {
  const response = await authFetch("/admin/users");
  return parseJsonResponse(response, "Failed to fetch users.");
}

export async function updateUserRole(userId, role) {
  const response = await authFetch(`/admin/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });

  return parseJsonResponse(response, "Failed to update user role.");
}

export async function updateUserStatus(userId, isActive) {
  const response = await authFetch(`/admin/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({ is_active: isActive }),
  });

  return parseJsonResponse(response, "Failed to update account status.");
}

export async function inviteUser(inviteData) {
  const response = await authFetch("/admin/users/invite", {
    method: "POST",
    body: JSON.stringify(inviteData),
  });

  return parseJsonResponse(response, "Failed to invite user.");
}
