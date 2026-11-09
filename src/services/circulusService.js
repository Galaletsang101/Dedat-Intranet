/*
 * =========================================================
 * CIRCULUS SERVICE
 * PostgreSQL table: circulus
 * Object shape mirrors the existing circulus table.
 * =========================================================
 */

import {
  STORAGE_KEYS,
  defaultCirculus,
  readCollection,
} from "./contentStorage.js";
import { authFetch, parseJsonResponse } from "./apiClient.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
 * =========================================================
 * GET ALL CIRCULUS
 * =========================================================
 */

export async function getCirculus() {
  try {
    const response = await fetch(`${API_BASE}/circulus`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }

    const errorText = await response.text();

    console.error(
      `Circulus API error (${response.status}): ${errorText}`
    );
  } catch (error) {
    console.error("Failed to fetch circulus from API:", error);
  }

  return readCollection(STORAGE_KEYS.circulus, defaultCirculus);
}

/*
 * =========================================================
 * GET SINGLE CIRCULUS
 * =========================================================
 */

export async function getCirculusById(id) {
  const items = readCollection(
    STORAGE_KEYS.circulus,
    defaultCirculus
  );

  return (
    items.find((item) => String(item.id) === String(id)) ||
    null
  );
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