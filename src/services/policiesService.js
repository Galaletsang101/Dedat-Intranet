/*
 * =========================================================
 * POLICIES SERVICE
 * PostgreSQL table: policies
 * Object shape mirrors the existing policies table.
 * Temporary mock: localStorage.
 * Future API route: GET/POST/PUT/DELETE /policies
 * =========================================================
 */

import {
  STORAGE_KEYS,
  defaultPolicies,
  readCollection,
  writeCollection,
  makeTimestamp,
  nextId,
} from "./contentStorage.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getPolicies() {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/policies`);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for policies, using localStorage mock.", error);
  }

  return readCollection(STORAGE_KEYS.policies, defaultPolicies);
}

export async function getPolicyById(id) {
  const policies = readCollection(STORAGE_KEYS.policies, defaultPolicies);
  return policies.find((item) => String(item.id) === String(id)) || null;
}

export async function createPolicy(policyData) {
  try {
    if (import.meta.env.VITE_API_URL) {
      const response = await fetch(`${API_BASE}/policies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: policyData.title || "",
          policy_number: policyData.policy_number || "",
          description: policyData.description || "",
          category: policyData.category || "Policy",
          author: policyData.author || "",
          publication_date: policyData.publication_date || null,
          review_date: policyData.review_date || null,
          version_number: policyData.version_number || "1.0",
          status: policyData.status || "draft",
          file_url: policyData.file_url || "",
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.warn("API unavailable for policies, using localStorage mock.", error);
  }

  const policies = readCollection(STORAGE_KEYS.policies, defaultPolicies);
  const record = {
    id: nextId(),
    title: policyData.title || "",
    policy_number: policyData.policy_number || "",
    description: policyData.description || "",
    category: policyData.category || "Policy",
    author: policyData.author || "",
    publication_date: policyData.publication_date || null,
    review_date: policyData.review_date || null,
    version_number: policyData.version_number || "1.0",
    status: policyData.status || "draft",
    file_url: policyData.file_url || "",
    created_at: makeTimestamp(),
  };

  policies.push(record);
  writeCollection(STORAGE_KEYS.policies, policies);

  return record;
}

export async function updatePolicy(id, policyData) {
  const policies = readCollection(STORAGE_KEYS.policies, defaultPolicies);
  const index = policies.findIndex((policy) => String(policy.id) === String(id));

  if (index === -1) {
    return null;
  }

  policies[index] = {
    ...policies[index],
    ...policyData,
    updated_at: makeTimestamp(),
  };

  writeCollection(STORAGE_KEYS.policies, policies);
  return policies[index];
}

export async function deletePolicy(id) {
  const policies = readCollection(STORAGE_KEYS.policies, defaultPolicies);
  const filtered = policies.filter((policy) => String(policy.id) !== String(id));
  writeCollection(STORAGE_KEYS.policies, filtered);
  return filtered;
}
