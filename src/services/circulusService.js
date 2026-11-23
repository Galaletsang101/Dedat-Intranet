/*
 * =========================================================
 * CIRCULUS SERVICE
 * PostgreSQL table: circulus
 * Object shape mirrors the existing circulus table.
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";

/*
 * =========================================================
 * GET ALL CIRCULUS
 * =========================================================
 */

export async function getCirculus() {
  const response = await fetch(`${API_BASE}/circulus`);
  return parseJsonResponse(response, "Failed to fetch circulars.");
}

/*
 * =========================================================
 * CREATE CIRCULUS
 * =========================================================
 */

export async function createCirculus(recordData) {
  const response = await authFetch("/circulus", {
    method: "POST",
    body: JSON.stringify({
      title: recordData.title || "",
      description: recordData.description || "",
      category: recordData.category || "Circulars",
      author: recordData.author || "",
      publication_date: recordData.publication_date || null,
      file_url: recordData.file_url || "",
      status: recordData.status || "draft",
    }),
  });

  return parseJsonResponse(response, "Failed to create circulus.");
}

/*
 * =========================================================
 * UPDATE CIRCULUS
 * =========================================================
 */

export async function updateCirculus(id, recordData) {
  const response = await authFetch(`/circulus/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: recordData.title || "",
      description: recordData.description || "",
      category: recordData.category || "Circulars",
      author: recordData.author || "",
      publication_date: recordData.publication_date || null,
      file_url: recordData.file_url || "",
      status: recordData.status || "Published",
    }),
  });

  return parseJsonResponse(response, "Failed to update circulus.");
}

/*
 * =========================================================
 * DELETE CIRCULUS
 * =========================================================
 */

export async function deleteCirculus(id) {
  const response = await authFetch(`/circulus/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to delete circulus.");
}