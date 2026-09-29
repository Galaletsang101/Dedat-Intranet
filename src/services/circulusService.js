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
  writeCollection,
  makeTimestamp,
  nextId,
} from "./contentStorage.js";

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
  try {
    const response = await fetch(`${API_BASE}/circulus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Circulus API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create circulus:", error);
    throw error;
  }
}

/*
 * =========================================================
 * UPDATE CIRCULUS
 * =========================================================
 */

export async function updateCirculus(id, recordData) {
  const items = readCollection(
    STORAGE_KEYS.circulus,
    defaultCirculus
  );

  const index = items.findIndex(
    (item) => String(item.id) === String(id)
  );

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

/*
 * =========================================================
 * DELETE CIRCULUS
 * =========================================================
 */

export async function deleteCirculus(id) {
  const items = readCollection(
    STORAGE_KEYS.circulus,
    defaultCirculus
  );

  const filtered = items.filter(
    (item) => String(item.id) !== String(id)
  );

  writeCollection(STORAGE_KEYS.circulus, filtered);

  return filtered;
}