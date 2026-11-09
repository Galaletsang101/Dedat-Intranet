import { authFetch } from "./apiClient.js";

export async function createWellnessVideo(videoData) {
  try {
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
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Wellness API error (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create wellness video:", error);
    throw error;
  }
}