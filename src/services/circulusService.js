import { apiRequest } from "./api.js";

export const getCirculus = () => apiRequest("/circulus");

export async function getCirculusById(id) {
  const records = await apiRequest("/admin/content/circulus");
  return records.find((item) => String(item.id) === String(id)) || null;
}

export const createCirculus = (recordData) =>
  apiRequest("/circulus", {
    method: "POST",
    body: JSON.stringify(recordData),
  });

export const updateCirculus = (id, recordData) =>
  apiRequest(`/admin/content/circulus/${id}`, {
    method: "PUT",
    body: JSON.stringify(recordData),
  });

export const deleteCirculus = (id) =>
  apiRequest(`/admin/content/circulus/${id}`, { method: "DELETE" });
