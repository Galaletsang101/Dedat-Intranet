import { apiRequest } from "./api.js";

export const getWellnessVideos = () => apiRequest("/wellness");

export const createWellnessVideo = (videoData) =>
  apiRequest("/wellness", {
    method: "POST",
    body: JSON.stringify(videoData),
  });

export const updateWellnessVideo = (id, videoData) =>
  apiRequest(`/admin/content/wellness/${id}`, {
    method: "PUT",
    body: JSON.stringify(videoData),
  });

export const deleteWellnessVideo = (id) =>
  apiRequest(`/admin/content/wellness/${id}`, { method: "DELETE" });
