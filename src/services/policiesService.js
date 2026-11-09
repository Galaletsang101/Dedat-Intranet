import { apiRequest } from "./api.js";

export const getPolicies = () => apiRequest("/policies");

export async function getPolicyById(id) {
  const records = await apiRequest("/admin/content/policies");
  return records.find((item) => String(item.id) === String(id)) || null;
}

export const createPolicy = (policyData) =>
  apiRequest("/policies", {
    method: "POST",
    body: JSON.stringify(policyData),
  });

export const updatePolicy = (id, policyData) =>
  apiRequest(`/admin/content/policies/${id}`, {
    method: "PUT",
    body: JSON.stringify(policyData),
  });

export const deletePolicy = (id) =>
  apiRequest(`/admin/content/policies/${id}`, { method: "DELETE" });
