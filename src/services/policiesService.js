/*
 * =========================================================
 * POLICIES SERVICE
 * PostgreSQL table: policies
 * =========================================================
 */

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/*
 * GET ALL POLICIES
 */
export async function getPolicies() {
  const response = await fetch(`${API_BASE}/policies`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error || "Failed to fetch policies."
    );
  }

  return await response.json();
}


/*
 * GET POLICY BY ID
 */
export async function getPolicyById(id) {
  const response = await fetch(
    `${API_BASE}/policies/${id}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error || "Failed to fetch policy."
    );
  }

  return await response.json();
}


/*
 * CREATE POLICY
 */
export async function createPolicy(policyData) {
  const response = await fetch(
    `${API_BASE}/policies`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: policyData.title || "",
        policy_number:
          policyData.policy_number || "",
        description:
          policyData.description || "",
        category:
          policyData.category || "Policy",
        author:
          policyData.author || "",
        publication_date:
          policyData.publication_date || null,
        review_date:
          policyData.review_date || null,
        status:
          policyData.status || "draft",
        file_url:
          policyData.file_url || "",
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to publish policy."
    );
  }

  return data;
}


/*
 * UPDATE POLICY
 */
export async function updatePolicy(id, policyData) {
  const response = await fetch(
    `${API_BASE}/policies/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: policyData.title || "",
        policy_number:
          policyData.policy_number || "",
        description:
          policyData.description || "",
        category:
          policyData.category || "Policy",
        author:
          policyData.author || "",
        publication_date:
          policyData.publication_date || null,
        review_date:
          policyData.review_date || null,
        status:
          policyData.status || "draft",
        file_url:
          policyData.file_url || "",
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to update policy."
    );
  }

  return data;
}


/*
 * DELETE POLICY
 */
export async function deletePolicy(id) {
  const response = await fetch(
    `${API_BASE}/policies/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to delete policy."
    );
  }

  return data;
}