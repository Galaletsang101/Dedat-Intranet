/*
 * =========================================================
 * POLICIES SERVICE
 * PostgreSQL table: policies
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";

/*
 * GET ALL POLICIES
 */
export async function getPolicies() {
  const response = await fetch(`${API_BASE}/policies`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch policies.");
  }

  return await response.json();
}

/*
 * GET POLICY BY ID
 */
export async function getPolicyById(id) {
  const response = await fetch(`${API_BASE}/policies/${id}`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch policy.");
  }

  return await response.json();
}

/*
 * CREATE POLICY
 */
export async function createPolicy(policyData) {
  const response = await authFetch("/policies", {
    method: "POST",
    body: JSON.stringify({
      title: policyData.title || "",
      policy_number: policyData.policy_number || "",
      description: policyData.description || "",
      category: policyData.category || "Policy",
      author: policyData.author || "",
      publication_date: policyData.publication_date || null,
      review_date: policyData.review_date || null,
      status: policyData.status || "draft",
      file_url: policyData.file_url || "",
    }),
  });

  return parseJsonResponse(response, "Failed to publish policy.");
}

/*
 * UPDATE POLICY
 */
export async function updatePolicy(id, policyData) {
  const response = await authFetch(`/policies/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: policyData.title || "",
      policy_number: policyData.policy_number || "",
      description: policyData.description || "",
      category: policyData.category || "Policy",
      author: policyData.author || "",
      publication_date: policyData.publication_date || null,
      review_date: policyData.review_date || null,
      status: policyData.status || "draft",
      file_url: policyData.file_url || "",
    }),
  });

  return parseJsonResponse(response, "Failed to update policy.");
}

/*
 * DELETE POLICY
 */
export async function deletePolicy(id) {
  const response = await authFetch(`/policies/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to delete policy.");
}
