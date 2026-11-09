/*
 * =========================================================
 * WELLNESS SERVICE
 * PostgreSQL table: wellness_videos
 * =========================================================
 */

import { authFetch, parseJsonResponse, API_BASE } from "./apiClient.js";
import { getToken } from "./authService.js";

export async function getWellnessVideos() {
  const response = await fetch(`${API_BASE}/wellness`);
  return parseJsonResponse(response, "Failed to fetch wellness videos.");
}

export async function getWellnessVideoById(id) {
  const token = getToken();

  const response = await fetch(`${API_BASE}/wellness/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return parseJsonResponse(response, "Failed to fetch wellness video.");
}

export async function createWellnessVideo(videoData) {
  const response = await authFetch("/wellness", {
    method: "POST",
    body: JSON.stringify({
      title: videoData.title || "",
      description: videoData.description || "",
      category: videoData.category || "Mental Health",
      duration: videoData.duration || "",
      thumbnail: videoData.thumbnail || "",
      video_url: videoData.video_url || "",
      featured: videoData.featured ?? false,
      status: videoData.status || "Published",
    }),
  });

  return parseJsonResponse(response, "Failed to create wellness video.");
}

export async function updateWellnessVideo(id, videoData) {
  const response = await authFetch(`/wellness/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: videoData.title || "",
      description: videoData.description || "",
      category: videoData.category || "Mental Health",
      duration: videoData.duration || "",
      thumbnail: videoData.thumbnail || "",
      video_url: videoData.video_url || "",
      featured: videoData.featured ?? false,
      status: videoData.status || "Published",
    }),
  });

  return parseJsonResponse(response, "Failed to update wellness video.");
}

export async function deleteWellnessVideo(id) {
  const response = await authFetch(`/wellness/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response, "Failed to delete wellness video.");
}

/*
 * Uploads an actual video file to the backend's local disk storage and
 * returns a real, permanently playable URL. Replaces the previous
 * behavior of saving a blob: object URL (only ever valid in the
 * uploading browser's own tab) straight into the database.
 */
export async function uploadWellnessVideoFile(file, onProgress) {
  const token = getToken();
  const formData = new FormData();
  formData.append("video", file);

  // Use XHR instead of fetch so upload progress can be reported for
  // large video files.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/wellness/upload`);

    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // fall through to generic error below
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.error || "Failed to upload video."));
      }
    };

    xhr.onerror = () => reject(new Error("Failed to upload video."));

    xhr.send(formData);
  });
}

// Also available via the admin content-management list, which needs to
// see Draft videos too.
export async function getAdminWellnessVideos() {
  const response = await authFetch("/admin/wellness");
  return parseJsonResponse(response, "Failed to fetch wellness videos.");
}
