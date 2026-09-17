/*
 * =========================================================
 * CIRCULUS SERVICE
 * PostgreSQL table: circulus
 * Object shape mirrors the existing circulus table.
 * Temporary mock: localStorage.
 * Future API route: GET/POST/PUT/DELETE /circulus
 * =========================================================
 */

import {
  STORAGE_KEYS,
  defaultCirculus,
  readCollection,
  writeCollection,
  makeTimestamp,
  nextId,
} from "./contentStorage.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getCirculus() {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/circulus`);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for circulus, using localStorage mock.", error);
  }

  return readCollection(STORAGE_KEYS.circulus, defaultCirculus);
}

export async function getCirculusById(id) {
  const items = readCollection(STORAGE_KEYS.circulus, defaultCirculus);
  return items.find((item) => String(item.id) === String(id)) || null;
}

export async function createCirculus(recordData) {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/circulus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for circulus, using localStorage mock.", error);
  }

  const items = readCollection(STORAGE_KEYS.circulus, defaultCirculus);
  const record = {
    id: nextId(),
    title: recordData.title || "",
    description: recordData.description || "",
    category: recordData.category || "Circulars",
    author: recordData.author || "",
    publication_date: recordData.publication_date || null,
    file_url: recordData.file_url || "",
    status: recordData.status || "draft",
    created_at: makeTimestamp(),
    updated_at: null,
  };

  items.push(record);
  writeCollection(STORAGE_KEYS.circulus, items);

  return record;
}

export async function updateCirculus(id, recordData) {
  const items = readCollection(STORAGE_KEYS.circulus, defaultCirculus);
  const index = items.findIndex((item) => String(item.id) === String(id));

  if (index === -1) {
    return null;
  }

  items[index] = {
    ...items[index],
    ...recordData,
    updated_at: makeTimestamp(),
  };

  writeCollection(STORAGE_KEYS.circulus, items);
  return items[index];
}

export async function deleteCirculus(id) {
  const items = readCollection(STORAGE_KEYS.circulus, defaultCirculus);
  const filtered = items.filter((item) => String(item.id) !== String(id));
  writeCollection(STORAGE_KEYS.circulus, filtered);
  return filtered;
}
