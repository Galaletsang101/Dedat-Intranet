/*
 * Video-source detection helpers shared by VideoPlayer.jsx and any admin
 * form that needs to know what kind of source an Admin pasted in.
 */

export function getYouTubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function getVimeoId(url) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function getVideoSourceType(url) {
  if (!url) return "none";
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url)) return "vimeo";
  return "file";
}
