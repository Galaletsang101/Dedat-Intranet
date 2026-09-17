import { useEffect, useMemo, useState } from "react";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaPlay,
} from "react-icons/fa";

import { getWellnessVideos } from "../firebase/wellnessService";

import "../styles/Wellness.css";

export default function Wellness() {
  /* =========================================================
     STATE
  ========================================================= */

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = [
    "All",
    "Mental Health",
    "Productivity",
    "Physical Care",
  ];

  /* =========================================================
     LOAD ADMIN WELLNESS CONTENT
  ========================================================= */

  const loadAdminWellnessContent = () => {
    try {
      const publishedContent = JSON.parse(
        localStorage.getItem("dedatPublishedContent") || "[]"
      );

      const adminVideos = publishedContent
        .filter(
          (item) =>
            item.page === "wellness" &&
            item.video &&
            item.video.url
        )
        .map((item) => ({
          id: item.id,

          title:
            item.title || "Untitled Wellness Video",

          description:
            item.description ||
            "No description available.",

          category:
            item.category || "Mental Health",

          video: item.video.url,

          videoType:
            item.video.type || "video/mp4",

          thumbnail:
            item.thumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",

          duration:
            item.duration || "--",

          featured: true,

          publishedDate:
            item.publishedDate || "",

          source: "admin",

          fileName:
            item.video.name || "",
        }));

      return adminVideos;
    } catch (error) {
      console.error(
        "Failed to load admin wellness content:",
        error
      );

      return [];
    }
  };

  /* =========================================================
     LOAD ALL WELLNESS VIDEOS
  ========================================================= */

  const loadVideos = async () => {
    try {
      /* Admin videos */
      const adminVideos = loadAdminWellnessContent();

      /* Firebase videos */
      let firebaseVideos = [];

      try {
        firebaseVideos = await getWellnessVideos();

        if (!Array.isArray(firebaseVideos)) {
          firebaseVideos = [];
        }
      } catch (firebaseError) {
        console.error(
          "Failed to load Firebase wellness videos:",
          firebaseError
        );

        firebaseVideos = [];
      }

      /*
        Admin content appears first,
        followed by Firebase content.
      */

      setVideos([
        ...adminVideos,
        ...firebaseVideos,
      ]);
    } catch (error) {
      console.error(
        "Failed to load wellness videos:",
        error
      );

      setVideos([]);
    }
  };

  /* =========================================================
     LOAD WHEN PAGE OPENS
  ========================================================= */

  useEffect(() => {
    loadVideos();

    /*
      AddContent dispatches this event after publishing.

      This allows the Wellness page to update immediately
      without requiring a page refresh.
    */

    const handleContentUpdate = () => {
      loadVideos();
    };

    window.addEventListener(
      "dedatContentUpdated",
      handleContentUpdate
    );

    /*
      Handles updates made in another browser tab.
    */

    const handleStorage = (event) => {
      if (
        event.key === "dedatPublishedContent"
      ) {
        loadVideos();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "dedatContentUpdated",
        handleContentUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =========================================================
     FILTER VIDEOS
  ========================================================= */

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

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    videos,
    selectedCategory,
    searchTerm,
  ]);

  /* =========================================================
     VIDEO MODAL
  ========================================================= */

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="wellness-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">
        <div className="hero-content">

          <h1>
            Find your balance,
            <span> anytime, anywhere.</span>
          </h1>

          <p className="herop">
            Explore wellness resources, helpful videos and
            practical guidance to support your wellbeing.
          </p>

        </div>
      </section>

      {/* =====================================================
          TOP SECTION
      ===================================================== */}

      <section className="top-section">

        <div className="contact-card">

          <h2>
            Need someone to talk to?
          </h2>

          <div className="contact-item">
            <span>
              <FaPhoneAlt />
            </span>

            <div>
              <small>
                Phone
              </small>

              <a href="tel:0800123456">
                0800 123 456
              </a>
            </div>
          </div>

          <div className="contact-item">
            <span>
              <FaEnvelope />
            </span>

            <div>
              <small>
                Email
              </small>

              <a href="mailto:support@lyrahealth.com">
                support@lyrahealth.com
              </a>
            </div>
          </div>

          <div className="contact-item">
            <span>
              <FaGlobe />
            </span>

            <div>
              <small>
                Support
              </small>

              <a href="#">
                Online Wellness Support
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* =====================================================
          WEBINAR LIBRARY
      ===================================================== */}

      <section className="library">

        <div className="library-top">

          <div>
            <h2>
              Webinar Library
            </h2>

            <p>
              Watch wellness videos and learn practical ways
              to look after yourself.
            </p>
          </div>

          <div className="library-actions">

            <input
              type="text"
              className="search-input"
              placeholder="Search wellness videos..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ===================================================
            CATEGORY BUTTONS
        =================================================== */}

        <div className="category-buttons">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-btn ${
                selectedCategory === category
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

        {/* ===================================================
            VIDEO GRID
        =================================================== */}

        <div className="video-grid">

          {filteredVideos.length > 0 ? (

            filteredVideos.map((video) => (

              <article
                key={video.id}
                className="video-card"
              >

                {/* THUMBNAIL */}

                <div className="thumbnail">

                  <img
                    src={video.thumbnail}
                    alt={video.title}
                  />

                  {video.featured && (
                    <span className="featured">
                      NEW
                    </span>
                  )}

                  <button
                    type="button"
                    className="play-button"
                    onClick={() =>
                      openVideo(video)
                    }
                    aria-label={`Play ${video.title}`}
                  >
                    <span>
                      <FaPlay />
                    </span>
                  </button>

                </div>

                {/* CARD CONTENT */}

                <div className="video-content">

                  <h3>
                    {video.title}
                  </h3>

                  <p>
                    {video.description}
                  </p>

                  <div className="video-footer">

                    <span>
                      {video.duration}
                    </span>

                    <button
                      type="button"
                      className="watch-btn"
                      onClick={() =>
                        openVideo(video)
                      }
                    >
                      Watch Now
                    </button>

                  </div>

                </div>

              </article>

            ))

          ) : (

            <div className="empty-state">

              <h2>
                No wellness videos found
              </h2>

              <p>
                Try another search term or
                category.
              </p>

            </div>

          )}

        </div>

      </section>

      {/* =====================================================
          VIDEO MODAL
      ===================================================== */}

      {selectedVideo && (

        <div
          className="video-modal"
          onClick={closeVideo}
        >

          <div
            className="video-container"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="close-btn2"
              onClick={closeVideo}
              aria-label="Close video"
            >
              ×
            </button>

            {/* VIDEO */}

            <video
              className="video-player"
              controls
              autoPlay
            >

              <source
                src={selectedVideo.video}
                type={
                  selectedVideo.videoType ||
                  "video/mp4"
                }
              />

              Your browser does not support
              the video element.

            </video>

            {/* DETAILS */}

            <div className="video-details">

              <h2>
                {selectedVideo.title}
              </h2>

              <p>
                {selectedVideo.description}
              </p>

              <div className="video-info">

                <span>
                  {selectedVideo.duration}
                </span>

                <span className="category">
                  {selectedVideo.category}
                </span>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}