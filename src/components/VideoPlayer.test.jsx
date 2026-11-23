import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VideoPlayer from "./VideoPlayer";
import { getVideoSourceType } from "../utils/videoUtils";

describe("getVideoSourceType", () => {
  it("detects standard YouTube watch URLs", () => {
    expect(getVideoSourceType("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "youtube"
    );
  });

  it("detects youtu.be short links", () => {
    expect(getVideoSourceType("https://youtu.be/dQw4w9WgXcQ")).toBe("youtube");
  });

  it("detects YouTube Shorts links", () => {
    expect(getVideoSourceType("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "youtube"
    );
  });

  it("detects Vimeo links", () => {
    expect(getVideoSourceType("https://vimeo.com/123456789")).toBe("vimeo");
  });

  it("treats a direct file URL as 'file'", () => {
    expect(getVideoSourceType("https://example.com/uploads/videos/clip.mp4")).toBe(
      "file"
    );
  });

  it("returns 'none' for an empty/missing source", () => {
    expect(getVideoSourceType("")).toBe("none");
    expect(getVideoSourceType(null)).toBe("none");
  });
});

describe("VideoPlayer", () => {
  it("renders a fallback message when no source is given", () => {
    render(<VideoPlayer src="" title="test" />);
    expect(screen.getByText(/no video source/i)).toBeInTheDocument();
  });

  it("renders a YouTube embed iframe for a YouTube URL", () => {
    const { container } = render(
      <VideoPlayer src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="My video" />
    );
    const iframe = container.querySelector("iframe");
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    // Never force sound-on autoplay via the embed URL.
    expect(iframe.src).not.toContain("autoplay=1");
  });

  it("renders a native <video> with controls (no autoplay) for a direct file URL", () => {
    const { container } = render(
      <VideoPlayer src="https://example.com/clip.mp4" title="My video" />
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video).toHaveAttribute("controls");
    expect(video).not.toHaveAttribute("autoplay");
  });
});
