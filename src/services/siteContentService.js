import { apiRequest } from "./api.js";

export const getSiteContent = (slug) =>
  apiRequest(`/site-content/${encodeURIComponent(slug)}`);

export const saveSiteContent = (record) =>
  apiRequest("/admin/content/site", {
    method: "POST",
    body: JSON.stringify(record),
  });
