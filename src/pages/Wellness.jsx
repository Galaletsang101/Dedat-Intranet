import { useEffect, useMemo, useState } from "react";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaPlay,
  FaCalendarAlt,
} from "react-icons/fa";

import { getWellnessVideos } from "../services/wellnessService";
import { formatDate } from "../utils/dateUtils";
import VideoPlayer from "../components/VideoPlayer";

import "../styles/wellness.css";

function Wellness() {
  // ===========================
  // STATE
  // ===========================

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "All",
    "Mental Health",
    "Productivity",
    "Physical Care",
  ];

  // ===========================
  // FILTER VIDEOS
  // ===========================

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesCategory =
        selectedCategory === "All" ||
        video.category === selectedCategory;

      const matchesSearch =
        (video.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (video.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchTerm]);

  // ===========================
  // VIDEO MODAL
  // ===========================

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  useEffect(() => {
    if (!selectedVideo) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeVideo();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedVideo]);

  // ===========================
  // LOAD VIDEOS
  // ===========================

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError("");

    getWellnessVideos()
      .then((data) => {
        if (isMounted) setVideos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load wellness videos:", err);
        if (isMounted) setError("Unable to load wellness videos right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="wellness-page">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">


  <h1>
  <span style={{ color: "#5C5B5B" }}>
    Find your balance,
  </span>
  <span> anytime, anywhere.</span>
</h1>

<p style={{ color: "#666666" }}>
  Welcome to your dedicated Employee Health and Wellness
  space where you can discover wellness resources,
  webinars and support whenever you need them.
</p>

        </div>

      </section>

      {/* ================= TOP SECTION ================= */}

      <section className="top-section">

        {/* CONTACT CARD */}

        <div className="contact-card hover-shadow transition">

          <h2 style={{ color: "#5C5B5B" }}>
            Lyra Contact Details
          </h2>

          <div className="contact-item">

            <div className="contact-icon">
              <FaPhoneAlt />
            </div>

            <div>

              <small>Phone Support</small>

              <h3 style={{ color: "#5C5B5B" }}>
                1-800-LYRA-HELP
              </h3>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              <FaEnvelope />
            </div>

            <div>

              <small>Email</small>

              <h3 style={{ color: "#5C5B5B" }}>
                support@lyrahealth.com
              </h3>

            </div>

          </div>

          <div className="contact-item">

            <div className="contact-icon">
              <FaGlobe />
            </div>

            <div>

              <small>Website</small>

              <a
                href="https://www.lyrahealth.com"
                target="_blank"
                rel="noreferrer"
              >
                www.lyrahealth.com
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* ================= WEBINAR LIBRARY ================= */}

      <section className="library">

        <div className="library-top">

          <div>

            <h2 style={{ color: "#5C5B5B" }}>
              Webinar Library
            </h2>

            <p style= {{color: "#666666"}}
>              Browse all employee wellness webinars.
            </p>

          </div>

          <div className="library-actions">

            <input
              type="text"
              className="search-input transition"
              placeholder="Search webinars..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />

          </div>

        </div>

        <div className="category-buttons">

          {categories.map((category) => (

            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active transition"
                  : "category-btn transition"
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>

        {loading ? (
          <div className="video-grid">
            {[1, 2, 3].map((key) => (
              <div className="video-card wellness-skeleton-card" key={key} />
            ))}
          </div>
        ) : error ? (
          <div className="empty-state">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </div>
        ) : (
                <div className="video-grid">

          {filteredVideos.length > 0 ? (

            filteredVideos.map((video) => (

              <div
                className="video-card hover-shadow transition"
                key={video.id}
              >

                {/* Thumbnail */}

                <div className="thumbnail">

                  <img
                    src={
                      video.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
                    }
                    alt={video.title}
                  />

                  {video.featured && (
                    <span className="featured">
                      NEW
                    </span>
                  )}

                  <button
                    className="play-button"
                    onClick={() => openVideo(video)}
                    aria-label={`Play ${video.title || "video"}`}
                  >
                    <FaPlay />
                  </button>

                </div>

                {/* Content */}

                <div className="video-content">

                  <h3>
                    {video.title || "Untitled Webinar"}
                  </h3>

                  <p>
                    {video.description ||
                      "No description available."}
                  </p>

                  <div className="video-footer">

                    <span className="duration">
                      {video.duration || "--"}
                    </span>

                    <span className="wellness-video-date">
                      <FaCalendarAlt /> {formatDate(video.created_date)}
                    </span>

                    <button
                      className="watch-btn"
                      onClick={() => openVideo(video)}
                    >
                      Watch Now
                    </button>

                  </div>

                </div>

              </div>

            ))

          ) : (

            <div className="empty-state">

              <h2>No webinars found</h2>

              <p>
                Try another search or check back later for new content.
              </p>

            </div>

          )}

        </div>
        )}

      </section>

            {/* ================= VIDEO MODAL ================= */}

      {selectedVideo && (
        <div
          className="video-modal"
          onClick={closeVideo}
          role="presentation"
        >

          <div
            className="video-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedVideo.title || "Wellness video"}
          >

            <button
              className="close-btn2"
              onClick={closeVideo}
              aria-label="Close video"
            >
              ✕
            </button>

            <VideoPlayer
              src={selectedVideo.video_url}
              title={selectedVideo.title}
              poster={selectedVideo.thumbnail}
            />

            <div className="video-details">

              <h2>
                {selectedVideo.title}
              </h2>

              <p>
                {selectedVideo.description}
              </p>

              <div className="video-info">

                <span>
                  Duration: {selectedVideo.duration || "--"}
                </span>

                <span className="category">
                  {selectedVideo.category}
                </span>

                <span>
                  {formatDate(selectedVideo.created_date)}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Wellness;
