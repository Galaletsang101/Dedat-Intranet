import { useState } from "react";
import { getYouTubeId, getVimeoId, getVideoSourceType } from "../utils/videoUtils";
import "../styles/videoPlayer.css";

/*
 * Plays whatever video source an Admin provided: a YouTube/Vimeo link
 * (rendered as a responsive iframe embed) or a direct file URL - either a
 * link the Admin pasted, or one returned by our own
 * POST /api/wellness/upload (served from backend/uploads/videos).
 *
 * Never autoplays with sound: direct files get a plain <video controls>
 * with no autoplay attribute, and embeds never pass autoplay=1.
 */
function VideoPlayer({ src, title, poster }) {
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div className="video-player-fallback">
        <p>No video source is available for this item.</p>
      </div>
    );
  }

  const sourceType = getVideoSourceType(src);

  if (hasError) {
    return (
      <div className="video-player-fallback">
        <p>This video couldn't be played. The link may be broken or unsupported.</p>
      </div>
    );
  }

  if (sourceType === "youtube") {
    const id = getYouTubeId(src);
    return (
      <div className="video-embed-wrapper">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title || "YouTube video"}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  if (sourceType === "vimeo") {
    const id = getVimeoId(src);
    return (
      <div className="video-embed-wrapper">
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          title={title || "Vimeo video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <video
      controls
      className="video-player-element"
      poster={poster || undefined}
      onError={() => setHasError(true)}
    >
      <source src={src} />
      Your browser does not support the video tag.
    </video>
  );
}

export default VideoPlayer;
